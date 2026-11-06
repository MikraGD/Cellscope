/**
 * BioCell Lab - Biological Process Calculations & Quantitative Models
 */

export interface PhotosynthesisParams {
  lightIntensity: number; // 0 to 100 kLux
  co2Ppm: number; // 0 to 1500 ppm
  temperature: number; // 0 to 50 Celsius
  spectrum: 'white' | 'red' | 'blue' | 'green';
}

export interface PhotosynthesisResult {
  relativeRate: number; // 0 to 100%
  o2OutputMlPerHour: number;
  glucoseOutputMgPerHour: number;
  atpTurnoverPerSec: number;
  limitingFactor: string;
  chloroplastState: 'dormant' | 'optimal' | 'light_limited' | 'co2_limited' | 'heat_stressed' | 'cold_inhibited';
}

export function calculatePhotosynthesis(params: PhotosynthesisParams): PhotosynthesisResult {
  const { lightIntensity, co2Ppm, temperature, spectrum } = params;

  // Spectrum absorption coefficient (Chlorophyll absorption peaks)
  const spectrumEfficiency: Record<string, number> = {
    white: 0.88,
    blue: 0.96, // 430-450 nm peak
    red: 0.92, // 650-670 nm peak
    green: 0.18, // Mostly reflected/transmitted
  };
  const specEff = spectrumEfficiency[spectrum] ?? 0.85;

  // Light factor with saturation (Michaelis-Menten kinetics, Km = 20 kLux)
  const effectiveLight = lightIntensity * specEff;
  const lightFactor = effectiveLight <= 0 ? 0 : effectiveLight / (effectiveLight + 18);

  // CO2 factor (Compensation point around 60 ppm, saturation around 1000 ppm)
  const co2Factor = co2Ppm <= 60 ? 0 : Math.min(1.0, (co2Ppm - 60) / (co2Ppm - 60 + 260));

  // Temperature factor (Enzymatic activity: Rubisco optima around 28-32°C, denaturation > 42°C)
  let tempFactor = 0;
  if (temperature <= 4) {
    tempFactor = 0.05;
  } else if (temperature < 30) {
    tempFactor = (temperature - 4) / 26; // linear ramp up to 1.0 at 30°C
  } else if (temperature <= 36) {
    tempFactor = 1.0;
  } else if (temperature <= 45) {
    // Sharp enzyme denaturation drop
    tempFactor = Math.max(0, 1.0 - Math.pow((temperature - 36) / 9, 1.8));
  } else {
    tempFactor = 0; // complete denaturation
  }

  // Blackman's Law of Limiting Factors
  const rawRate = Math.min(lightFactor, co2Factor, tempFactor);
  const relativeRate = Math.round(rawRate * 100);

  // Quantitative outputs based on standard leaf area (100 cm²)
  const o2OutputMlPerHour = Number((relativeRate * 0.45).toFixed(1));
  const glucoseOutputMgPerHour = Number((relativeRate * 0.32).toFixed(1));
  const atpTurnoverPerSec = Math.round(relativeRate * 1250);

  // Determine limiting factor
  let limitingFactor = 'Tối ưu (Điều kiện quang hợp lý tưởng)';
  let chloroplastState: PhotosynthesisResult['chloroplastState'] = 'optimal';

  if (temperature > 40) {
    limitingFactor = 'Nhiệt độ quá cao (Enzyme Rubisco bị biến tính nhiệt)';
    chloroplastState = 'heat_stressed';
  } else if (temperature < 12) {
    limitingFactor = 'Nhiệt độ quá thấp (Động học phân tử & enzyme giảm mạnh)';
    chloroplastState = 'cold_inhibited';
  } else if (relativeRate >= 65 && Math.abs(lightFactor - co2Factor) < 0.15 && tempFactor > 0.8) {
    limitingFactor = 'Tối ưu (Ánh sáng, CO2 và nhiệt độ cân bằng hoàn hảo)';
    chloroplastState = 'optimal';
  } else if (lightFactor <= co2Factor && lightFactor <= tempFactor) {
    limitingFactor = spectrum === 'green' 
      ? 'Bước sóng ánh sáng lục (Lục lạp phản xạ màu lục, ít hấp thụ)' 
      : 'Cường độ ánh sáng yếu (Pha sáng bị giới hạn photon)';
    chloroplastState = 'light_limited';
  } else if (co2Factor < lightFactor && co2Factor < tempFactor) {
    limitingFactor = 'Nồng độ CO2 thấp (Pha tối Chu trình Calvin thiếu cơ chất cố định)';
    chloroplastState = 'co2_limited';
  }

  if (relativeRate <= 2 && chloroplastState === 'optimal') {
    chloroplastState = 'dormant';
  }

  return {
    relativeRate,
    o2OutputMlPerHour,
    glucoseOutputMgPerHour,
    atpTurnoverPerSec,
    limitingFactor,
    chloroplastState,
  };
}

export interface RespirationParams {
  glucoseLevelMm: number; // 0 to 20 mM
  o2Percent: number; // 0 to 21%
  temperature: number; // 0 to 50 Celsius
  isFermentationForced?: boolean;
  kingdom: 'animal' | 'plant' | 'fungi' | 'protist' | 'bacteria';
}

export interface RespirationResult {
  pathway: 'aerobic' | 'lactic_fermentation' | 'alcoholic_fermentation' | 'dormant';
  atpPerGlucose: number;
  totalAtpRatePerSec: number;
  byproducts: string[];
  co2ProductionRate: number; // relative
  mitochondriaActivity: number; // 0 to 100%
  efficiencyDescription: string;
}

export function calculateRespiration(params: RespirationParams): RespirationResult {
  const { glucoseLevelMm, o2Percent, temperature, isFermentationForced, kingdom } = params;

  if (glucoseLevelMm <= 0.2) {
    return {
      pathway: 'dormant',
      atpPerGlucose: 0,
      totalAtpRatePerSec: 0,
      byproducts: ['Không có cơ chất'],
      co2ProductionRate: 0,
      mitochondriaActivity: 0,
      efficiencyDescription: 'Cạn kiệt glucose: tế bào ngừng sản sinh ATP',
    };
  }

  // Check if aerobic or fermentation
  const isHypoxic = o2Percent < 3 || isFermentationForced;

  // Temperature multiplier (Q10 rule ~ 2.0 between 15-37°C)
  const tempMod = Math.max(0.1, Math.min(1.2, (temperature - 5) / 32));

  if (!isHypoxic) {
    // Hiếu khí (Aerobic)
    const atpPerGlucose = kingdom === 'bacteria' ? 38 : 36; // Prokaryote không tốn ATP chuyển NADH vào ty thể
    const activity = Math.min(100, Math.round((glucoseLevelMm / 10) * (o2Percent / 20) * tempMod * 100));
    const totalAtpRatePerSec = Math.round(activity * 850);
    const co2ProductionRate = Number((activity * 0.6).toFixed(1));

    return {
      pathway: 'aerobic',
      atpPerGlucose,
      totalAtpRatePerSec,
      byproducts: ['CO₂ (Khí carbonic)', 'H₂O (Nước nội sinh)'],
      co2ProductionRate,
      mitochondriaActivity: kingdom === 'bacteria' ? 0 : Math.min(100, activity),
      efficiencyDescription: `Hô hấp hiếu khí triệt để: 1 Glucose tạo ra ~${atpPerGlucose} ATP (Hiệu suất ~40% năng lượng tự do)`,
    };
  } else {
    // Lên men (Fermentation)
    const atpPerGlucose = 2; // Chỉ từ Đường phân (Glycolysis)
    const isAlcoholic = kingdom === 'fungi' || kingdom === 'plant';
    const pathway = isAlcoholic ? 'alcoholic_fermentation' : 'lactic_fermentation';
    const byproducts = isAlcoholic 
      ? ['Ethanol (C₂H₅OH)', 'CO₂ (Khí carbonic)'] 
      : ['Axit Lactic (C₃H₆O₃)'];
    
    const activity = Math.min(100, Math.round((glucoseLevelMm / 8) * tempMod * 80));
    const totalAtpRatePerSec = Math.round(activity * 120); // Ít ATP hơn nhiều
    const co2ProductionRate = isAlcoholic ? Number((activity * 0.3).toFixed(1)) : 0;

    return {
      pathway,
      atpPerGlucose,
      totalAtpRatePerSec,
      byproducts,
      co2ProductionRate,
      mitochondriaActivity: 0, // Ty thể không nhận electron khi thiếu oxy
      efficiencyDescription: `Lên men kị khí: Chỉ thu được 2 ATP/Glucose (Hiệu suất ~2%, năng lượng còn tích trong ${isAlcoholic ? 'rượu' : 'axit lactic'})`,
    };
  }
}

export interface OsmosisParams {
  externalSoluteOsm: number; // mOsm/L (e.g., 100 to 600 mOsm/L, standard isotonic ~300)
  hasCellWall: boolean;
}

export interface OsmosisResult {
  solutionType: 'hypotonic' | 'isotonic' | 'hypertonic';
  waterMovement: 'inward' | 'equilibrium' | 'outward';
  cellMorphology: string;
  volumeChangePercent: number;
  dangerStatus: 'safe' | 'warning' | 'fatal';
}

export function calculateOsmosis(params: OsmosisParams): OsmosisResult {
  const { externalSoluteOsm, hasCellWall } = params;
  const internalOsm = 300; // Internal baseline standard cell

  const delta = internalOsm - externalSoluteOsm;

  if (Math.abs(delta) <= 25) {
    return {
      solutionType: 'isotonic',
      waterMovement: 'equilibrium',
      cellMorphology: hasCellWall 
        ? 'Trạng thái bình thường (Cân bằng động lượng nước ra vào)'
        : 'Hình đĩa lõm hai mặt / Cầu mềm cân bằng (Hồng cầu/Động vật nguyên vẹn)',
      volumeChangePercent: 0,
      dangerStatus: 'safe',
    };
  } else if (delta > 25) {
    // External has less solute -> Hypotonic (Nhược trương), Water rushes IN
    const swellingFactor = Math.min(75, Math.round((delta / 300) * 60));
    
    if (hasCellWall) {
      return {
        solutionType: 'hypotonic',
        waterMovement: 'inward',
        cellMorphology: 'Trương nước tối đa (Turgid) - Không bào hút nước ép sát màng vào thành cellulose vững chắc, cây đứng vững',
        volumeChangePercent: Math.min(15, swellingFactor / 4), // Wall limits expansion
        dangerStatus: 'safe',
      };
    } else {
      const isLysis = swellingFactor > 35;
      return {
        solutionType: 'hypotonic',
        waterMovement: 'inward',
        cellMorphology: isLysis 
          ? 'Tan bào / Vỡ tế bào (Lysis) - Nước ồ ạt tràn vào làm rách màng sinh chất do không có thành bảo vệ'
          : 'Trương phồng căng tròn - Nguy cơ vỡ màng',
        volumeChangePercent: swellingFactor,
        dangerStatus: isLysis ? 'fatal' : 'warning',
      };
    }
  } else {
    // External has more solute -> Hypertonic (Ưu trương), Water rushes OUT
    const shrinkFactor = Math.min(50, Math.round((Math.abs(delta) / 300) * 45));

    if (hasCellWall) {
      return {
        solutionType: 'hypertonic',
        waterMovement: 'outward',
        cellMorphology: 'Co nguyên sinh (Plasmolysis) - Màng sinh chất co rúm, tách dần khỏi thành tế bào cứng',
        volumeChangePercent: -shrinkFactor,
        dangerStatus: shrinkFactor > 30 ? 'warning' : 'safe',
      };
    } else {
      return {
        solutionType: 'hypertonic',
        waterMovement: 'outward',
        cellMorphology: 'Teo bào / Nhăn nhúm hình gai (Crenation) - Tế bào mất nước nghiêm trọng',
        volumeChangePercent: -shrinkFactor,
        dangerStatus: shrinkFactor > 35 ? 'warning' : 'safe',
      };
    }
  }
}
