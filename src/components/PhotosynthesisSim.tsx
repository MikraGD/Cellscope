import React, { useState, useEffect } from 'react';
import {
  Sun,
  Flame,
  Wind,
  Gauge,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Droplets,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import {
  calculatePhotosynthesis,
  PhotosynthesisParams,
  PhotosynthesisResult
} from '../utils/bioCalculations';

export const PhotosynthesisSim: React.FC = () => {
  const [params, setParams] = useState<PhotosynthesisParams>({
    lightIntensity: 65, // kLux
    co2Ppm: 600, // ppm
    temperature: 28, // Celsius
    spectrum: 'white',
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [tick, setTick] = useState<number>(0);

  // Animation ticker for bubbles and photons
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 1000);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const result: PhotosynthesisResult = calculatePhotosynthesis(params);

  const setPreset = (preset: 'optimal' | 'low_light' | 'green_light' | 'heat_stress' | 'low_co2') => {
    switch (preset) {
      case 'optimal':
        setParams({ lightIntensity: 75, co2Ppm: 900, temperature: 28, spectrum: 'white' });
        break;
      case 'low_light':
        setParams({ lightIntensity: 8, co2Ppm: 600, temperature: 25, spectrum: 'white' });
        break;
      case 'green_light':
        setParams({ lightIntensity: 70, co2Ppm: 800, temperature: 28, spectrum: 'green' });
        break;
      case 'heat_stress':
        setParams({ lightIntensity: 85, co2Ppm: 600, temperature: 46, spectrum: 'white' });
        break;
      case 'low_co2':
        setParams({ lightIntensity: 70, co2Ppm: 80, temperature: 28, spectrum: 'white' });
        break;
    }
  };

  const getSpectrumHex = (s: PhotosynthesisParams['spectrum']) => {
    switch (s) {
      case 'red': return '#EF4444';
      case 'blue': return '#3B82F6';
      case 'green': return '#22C55E';
      default: return '#FDE047';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Top Header & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs text-emerald-400 font-mono font-semibold tracking-wide">
            LỤC LẠP (CHLOROPLAST) · PHA SÁNG & CHU TRÌNH CALVIN
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-0.5">
            Phòng Thí Nghiệm Giả Lập Quang Hợp Tương Tác
          </h2>
        </div>

        {/* Preset Experiments */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Thí nghiệm mẫu:
          </span>
          <button
            onClick={() => setPreset('optimal')}
            className="px-2.5 py-1 text-xs rounded-md bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/60 transition cursor-pointer"
          >
            Tối ưu nhà kính
          </button>
          <button
            onClick={() => setPreset('green_light')}
            className="px-2.5 py-1 text-xs rounded-md bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            Thí nghiệm Engelmann (Ánh sáng lục)
          </button>
          <button
            onClick={() => setPreset('heat_stress')}
            className="px-2.5 py-1 text-xs rounded-md bg-rose-950/60 border border-rose-800/80 text-rose-300 hover:bg-rose-900/60 transition cursor-pointer"
          >
            Nắng nóng 46°C (Biến tính)
          </button>
          <button
            onClick={() => setPreset('low_co2')}
            className="px-2.5 py-1 text-xs rounded-md bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            Thiếu CO₂ (Đóng khí khổng)
          </button>
        </div>
      </div>

      {/* Main Simulation Grid: Stage + Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Interactive Visual Stage: Chloroplast Cross-Section (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-5 shadow-xl relative min-h-[480px]">
          {/* Stage Controls Overlay */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300 font-medium">Lát cắt siêu vi Lục Lạp (Chloroplast)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Tạm dừng' : 'Chạy tiếp'}</span>
              </button>
              <button
                onClick={() => setPreset('optimal')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition cursor-pointer"
                title="Khôi phục mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Chloroplast Graphic with active animation */}
          <div className="flex-1 flex items-center justify-center relative my-2">
            <svg viewBox="0 0 700 420" className="w-full h-full max-h-[420px]">
              <defs>
                <radialGradient id="chloroGrad" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="#064E3B" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#022C22" stopOpacity="0.85" />
                </radialGradient>
                <linearGradient id="lightBeamGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getSpectrumHex(params.spectrum)} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={getSpectrumHex(params.spectrum)} stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Light rays shining from above */}
              <polygon
                points="120,0 260,0 320,180 80,180"
                fill="url(#lightBeamGrad)"
                opacity={params.lightIntensity / 100}
              />

              {/* Chloroplast Outer & Inner Membrane */}
              <ellipse
                cx="350"
                cy="210"
                rx="320"
                ry="180"
                fill="url(#chloroGrad)"
                stroke="#059669"
                strokeWidth="5"
              />
              <ellipse
                cx="350"
                cy="210"
                rx="308"
                ry="170"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeDasharray="8 3"
              />

              {/* STROMA (Pha tối background label) */}
              <text x="520" y="80" fill="#34D399" fontSize="13" fontWeight="bold" opacity="0.6">
                CHẤT NỀN STROMA (Pha tối)
              </text>

              {/* ================= THYLAKOID & LIGHT REACTION (LEFT ZONE) ================= */}
              <g transform="translate(180, 210)">
                {/* Granum stack 1 */}
                <ellipse cx="-40" cy="-45" rx="55" ry="16" fill="#047857" stroke="#34D399" strokeWidth="2" />
                <ellipse cx="-40" cy="-25" rx="55" ry="16" fill="#047857" stroke="#34D399" strokeWidth="2" />
                <ellipse cx="-40" cy="-5" rx="55" ry="16" fill="#047857" stroke="#34D399" strokeWidth="2" />
                <ellipse cx="-40" cy="15" rx="55" ry="16" fill="#047857" stroke="#34D399" strokeWidth="2" />
                <ellipse cx="-40" cy="35" rx="55" ry="16" fill="#047857" stroke="#34D399" strokeWidth="2" />

                {/* Stroma lamellae bridge */}
                <path d="M 10 -5 Q 50 10 90 -20" fill="none" stroke="#059669" strokeWidth="6" />

                {/* Granum stack 2 */}
                <ellipse cx="90" cy="-20" rx="45" ry="14" fill="#047857" stroke="#34D399" strokeWidth="2" />
                <ellipse cx="90" cy="0" rx="45" ry="14" fill="#047857" stroke="#34D399" strokeWidth="2" />
                <ellipse cx="90" cy="20" rx="45" ry="14" fill="#047857" stroke="#34D399" strokeWidth="2" />

                {/* Label */}
                <text x="-40" y="-70" fill="#A7F3D0" fontSize="12" fontWeight="bold" textAnchor="middle">
                  HẠT GRANA (Thylakoid)
                </text>
                <text x="-40" y="70" fill="#6EE7B7" fontSize="11" textAnchor="middle">
                  Pha sáng: Hấp thụ photon
                </text>

                {/* H2O Entering photolysis */}
                <g transform="translate(-110, 20)">
                  <rect x="-35" y="-14" width="70" height="28" rx="6" fill="#0369A1" stroke="#38BDF8" strokeWidth="1.5" />
                  <text x="0" y="5" fill="#E0F2FE" fontSize="12" fontWeight="bold" textAnchor="middle">
                    H₂O vào
                  </text>
                </g>

                {/* O2 Bubbles emitting upwards */}
                {result.relativeRate > 0 && isPlaying && (
                  <g>
                    {[0, 1, 2, 3].map((i) => {
                      const bubbleY = -50 - ((tick * (result.relativeRate / 30) + i * 35) % 120);
                      const bubbleX = -40 + Math.sin(tick * 0.1 + i) * 15;
                      return (
                        <g key={i} transform={`translate(${bubbleX}, ${bubbleY})`}>
                          <circle cx="0" cy="0" r="8" fill="#38BDF8" opacity="0.8" />
                          <text x="0" y="3" fill="#0F172A" fontSize="8" fontWeight="bold" textAnchor="middle">
                            O₂
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
              </g>

              {/* Shuttling ATP & NADPH molecules from Light to Dark reaction */}
              <g>
                {/* Arrow from left to right */}
                <path
                  d="M 270 150 Q 360 120 440 160"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
                <g transform="translate(350, 120)">
                  <rect x="-45" y="-12" width="90" height="24" rx="12" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
                  <text x="0" y="4" fill="#FEF08A" fontSize="10" fontWeight="bold" textAnchor="middle">
                    ATP & NADPH ➔
                  </text>
                </g>

                {/* Return arrow of ADP + Pi and NADP+ */}
                <path
                  d="M 440 260 Q 360 290 270 250"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                />
                <g transform="translate(350, 290)">
                  <text x="0" y="0" fill="#94A3B8" fontSize="10" textAnchor="middle">
                    ⇠ ADP + Pi & NADP⁺
                  </text>
                </g>
              </g>

              {/* ================= CALVIN CYCLE (RIGHT ZONE) ================= */}
              <g transform="translate(500, 210)">
                {/* Rotating Calvin Cycle Wheel */}
                <circle
                  cx="0"
                  cy="0"
                  r="65"
                  fill="#065F46"
                  stroke="#10B981"
                  strokeWidth="4"
                  strokeDasharray="16 6"
                  className={result.relativeRate > 0 && isPlaying ? 'animate-spin' : ''}
                  style={{ animationDuration: `${Math.max(1.5, 8 - (result.relativeRate / 100) * 6)}s` }}
                />
                <circle cx="0" cy="0" r="38" fill="#022C22" />
                <text x="0" y="-5" fill="#6EE7B7" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Chu trình
                </text>
                <text x="0" y="10" fill="#A7F3D0" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                  CALVIN
                </text>
                <text x="0" y="24" fill="#34D399" fontSize="9" textAnchor="middle">
                  Enzyme Rubisco
                </text>

                {/* CO2 Entering Calvin Cycle */}
                <g transform="translate(0, -95)">
                  <rect x="-35" y="-14" width="70" height="26" rx="6" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
                  <text x="0" y="4" fill="#F8FAFC" fontSize="11" fontWeight="bold" textAnchor="middle">
                    CO₂ vào ⇣
                  </text>
                </g>

                {/* Glucose Product Emitted */}
                <g transform="translate(0, 105)">
                  <rect
                    x="-65"
                    y="-16"
                    width="130"
                    height="32"
                    rx="8"
                    fill={result.relativeRate > 0 ? '#854D0E' : '#334155'}
                    stroke={result.relativeRate > 0 ? '#FBBF24' : '#64748B'}
                    strokeWidth="2"
                  />
                  <text x="0" y="5" fill="#FEF08A" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Glucose (C₆H₁₂O₆) ⇡
                  </text>
                </g>
              </g>

              {/* Denatured Enzyme alert overlay if temperature too high */}
              {params.temperature > 40 && (
                <g transform="translate(350, 210)">
                  <rect x="-140" y="-30" width="280" height="60" rx="8" fill="#450A0A" stroke="#EF4444" strokeWidth="2" opacity="0.95" />
                  <text x="0" y="-8" fill="#FCA5A5" fontSize="12" fontWeight="bold" textAnchor="middle">
                    ⚠️ QUÁ NHIỆT ({params.temperature}°C)
                  </text>
                  <text x="0" y="14" fill="#FEE2E2" fontSize="11" textAnchor="middle">
                    Enzyme Rubisco biến tính mất hoạt tính xúc tác
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Live Metric HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Tốc độ quang hợp</span>
              <div className="text-lg font-bold font-mono text-emerald-400 flex items-baseline gap-1 mt-0.5">
                {result.relativeRate}%
                <span className="text-[10px] text-slate-500 font-sans">cực đại</span>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Sản lượng Oxy (O₂)</span>
              <div className="text-lg font-bold font-mono text-cyan-400 flex items-baseline gap-1 mt-0.5">
                {result.o2OutputMlPerHour}
                <span className="text-[10px] text-slate-500 font-sans">ml/h</span>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Đường Glucose tạo ra</span>
              <div className="text-lg font-bold font-mono text-amber-400 flex items-baseline gap-1 mt-0.5">
                {result.glucoseOutputMgPerHour}
                <span className="text-[10px] text-slate-500 font-sans">mg/h</span>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Vòng quay ATP</span>
              <div className="text-lg font-bold font-mono text-purple-400 flex items-baseline gap-1 mt-0.5">
                {result.atpTurnoverPerSec.toLocaleString()}
                <span className="text-[10px] text-slate-500 font-sans">ptử/s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Control Deck & Parameter Sliders (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Sliders Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5 text-xs">
            <h3 className="text-sm font-bold text-slate-200 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Điều Chỉnh Tham Số Môi Trường</span>
              <Gauge className="w-4 h-4 text-emerald-400" />
            </h3>

            {/* Light Intensity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  Cường độ ánh sáng
                </label>
                <span className="font-mono text-amber-300 font-semibold">{params.lightIntensity} kLux</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.lightIntensity}
                onChange={(e) => setParams({ ...params, lightIntensity: Number(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 kLux (Bóng tối)</span>
                <span>50 kLux</span>
                <span>100 kLux (Nắng gắt)</span>
              </div>
            </div>

            {/* Light Spectrum Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Bước sóng ánh sáng (Quang phổ)
                </label>
                <span className="text-slate-400 text-[11px]">Hấp thụ diệp lục</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'white', label: 'Trắng', hex: '#F8FAFC', note: 'Toàn phổ' },
                  { id: 'red', label: 'Đỏ', hex: '#EF4444', note: '660 nm' },
                  { id: 'blue', label: 'Xanh lam', hex: '#3B82F6', note: '440 nm' },
                  { id: 'green', label: 'Lục', hex: '#22C55E', note: '530 nm' },
                ].map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setParams({ ...params, spectrum: spec.id as any })}
                    className={`p-2 rounded-lg border text-center transition cursor-pointer ${
                      params.spectrum === spec.id
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: spec.hex }} />
                      <span className="font-semibold text-xs">{spec.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">{spec.note}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CO2 Concentration Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  Nồng độ CO₂ (Khí quyển & phòng)
                </label>
                <span className="font-mono text-cyan-300 font-semibold">{params.co2Ppm} ppm</span>
              </div>
              <input
                type="range"
                min="0"
                max="1500"
                step="50"
                value={params.co2Ppm}
                onChange={(e) => setParams({ ...params, co2Ppm: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 ppm</span>
                <span>420 ppm (Không khí chuẩn)</span>
                <span>1500 ppm (Lý tưởng)</span>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-400" />
                  Nhiệt độ môi trường
                </label>
                <span className="font-mono text-rose-300 font-semibold">{params.temperature}°C</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={params.temperature}
                onChange={(e) => setParams({ ...params, temperature: Number(e.target.value) })}
                className="w-full accent-rose-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0°C (Đóng băng)</span>
                <span>28°C (Tối ưu)</span>
                <span>50°C (Biến tính nhiệt)</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Limiting Factor Card (Blackman's Law) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Định luật Liebig & Blackman (Yếu tố giới hạn):
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  result.chloroplastState === 'optimal'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                {result.chloroplastState === 'optimal' ? 'CÂN BẰNG TỐI ƯU' : 'BỊ GIỚI HẠN'}
              </span>
            </div>

            <p className="p-2.5 rounded bg-slate-950 text-slate-300 leading-relaxed border border-slate-800 font-medium">
              {result.limitingFactor}
            </p>

            <div className="text-[11px] text-slate-400 leading-relaxed pt-1">
              💡 <span className="text-slate-300 font-medium">Nguyên lý quang hợp:</span> Tốc độ quang hợp bị chi phối bởi yếu tố nằm ở mức bất lợi nhất. Nếu tăng ánh sáng mà thiếu CO₂ hoặc nhiệt độ quá cao thì tốc độ vẫn không thể tăng.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
