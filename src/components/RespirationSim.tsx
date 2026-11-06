import React, { useState, useEffect } from 'react';
import {
  Zap,
  Activity,
  Flame,
  Wind,
  Layers,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Sparkles
} from 'lucide-react';
import {
  calculateRespiration,
  RespirationParams,
  RespirationResult
} from '../utils/bioCalculations';

export const RespirationSim: React.FC = () => {
  const [params, setParams] = useState<RespirationParams>({
    glucoseLevelMm: 8.0, // 0 to 20 mM
    o2Percent: 21, // 0 to 21%
    temperature: 37, // Celsius
    isFermentationForced: false,
    kingdom: 'animal',
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 1000);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const result: RespirationResult = calculateRespiration(params);

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Header & Modes */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs text-orange-400 font-mono font-semibold tracking-wide">
            TY THỂ (MITOCHONDRIA) & TẾ BÀO CHẤT · ĐƯỜNG PHÂN, KREBS & CHUỖI TRUYỀN ELECTRON
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-0.5">
            Giả Lập Hô Hấp Tế Bào & Trao Đổi Năng Lượng (ATP)
          </h2>
        </div>

        {/* Quick Scenario Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setParams({ ...params, o2Percent: 21, isFermentationForced: false, kingdom: 'animal' })}
            className={`px-3 py-1 text-xs rounded-md font-medium transition cursor-pointer ${
              !params.isFermentationForced && params.o2Percent > 5
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Hô hấp Hiếu khí (36 ATP)
          </button>
          <button
            onClick={() => setParams({ ...params, o2Percent: 0, isFermentationForced: true, kingdom: 'fungi' })}
            className={`px-3 py-1 text-xs rounded-md font-medium transition cursor-pointer ${
              params.isFermentationForced && params.kingdom === 'fungi'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Lên men Rượu (Nấm men)
          </button>
          <button
            onClick={() => setParams({ ...params, o2Percent: 0, isFermentationForced: true, kingdom: 'animal' })}
            className={`px-3 py-1 text-xs rounded-md font-medium transition cursor-pointer ${
              params.isFermentationForced && params.kingdom === 'animal'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Lên men Axit Lactic (Cơ vân)
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Simulation Stage + Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Visual Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-5 shadow-xl relative min-h-[480px]">
          {/* Controls bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${result.pathway === 'aerobic' ? 'bg-orange-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-slate-300 font-medium">
                Con đường: {result.pathway === 'aerobic' ? 'Hô hấp Hiếu khí qua Ty thể' : result.pathway === 'alcoholic_fermentation' ? 'Lên men Rượu trong Tế bào chất' : 'Lên men Axit Lactic'}
              </span>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Tạm dừng' : 'Chạy tiếp'}</span>
            </button>
          </div>

          {/* SVG Metabolic Map */}
          <div className="flex-1 flex items-center justify-center relative my-2">
            <svg viewBox="0 0 720 420" className="w-full h-full max-h-[420px]">
              <defs>
                <radialGradient id="mitoGrad" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="#7C2D12" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#431407" stopOpacity="0.85" />
                </radialGradient>
              </defs>

              {/* TẾ BÀO CHẤT (CYTOPLASM) - OUTER BACKGROUND */}
              <rect x="20" y="20" width="680" height="380" rx="16" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
              <text x="40" y="50" fill="#64748B" fontSize="12" fontWeight="bold">
                TẾ BÀO CHẤT (CYTOSOL)
              </text>

              {/* 1. GLYCOLYSIS BOX (ĐƯỜNG PHÂN) */}
              <g transform="translate(60, 100)">
                <rect x="0" y="0" width="160" height="220" rx="12" fill="#1E293B" stroke="#3B82F6" strokeWidth="2" />
                <text x="80" y="30" fill="#93C5FD" fontSize="13" fontWeight="bold" textAnchor="middle">
                  1. ĐƯỜNG PHÂN
                </text>
                <text x="80" y="48" fill="#60A5FA" fontSize="10" textAnchor="middle">
                  (Glycolysis)
                </text>

                {/* Glucose input */}
                <rect x="15" y="70" width="130" height="28" rx="6" fill="#3B82F6" opacity="0.8" />
                <text x="80" y="88" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Glucose ({params.glucoseLevelMm} mM)
                </text>

                {/* Arrow down to Pyruvate */}
                <path d="M 80 102 L 80 135" stroke="#93C5FD" strokeWidth="2" markerEnd="url(#arrow)" />

                {/* Direct 2 ATP yield */}
                <rect x="25" y="112" width="110" height="22" rx="4" fill="#EAB308" />
                <text x="80" y="127" fill="#422006" fontSize="10" fontWeight="extrabold" textAnchor="middle">
                  ⚡ Thu: +2 ATP ròng
                </text>

                {/* Pyruvate product */}
                <rect x="15" y="150" width="130" height="28" rx="6" fill="#1D4ED8" />
                <text x="80" y="168" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                  2 Pyruvate (C₃H₄O₃)
                </text>
              </g>

              {/* Branch: If Aerobic vs Fermentation */}
              {result.pathway === 'aerobic' ? (
                /* ================= 2. MITOCHONDRION (AEROBIC DESTINATION) ================= */
                <g transform="translate(260, 60)">
                  {/* Outer & Inner Membrane of Mitochondria */}
                  <ellipse cx="220" cy="150" rx="200" ry="120" fill="url(#mitoGrad)" stroke="#EA580C" strokeWidth="4" />
                  <ellipse cx="220" cy="150" rx="186" ry="108" fill="none" stroke="#F97316" strokeWidth="2" strokeDasharray="10 4" />

                  <text x="220" y="55" fill="#FED7AA" fontSize="12" fontWeight="bold" textAnchor="middle">
                    TY THỂ (Mitochondria) · Màng kép & Mào cristae
                  </text>

                  {/* Pyruvate entering matrix */}
                  <path d="M -40 120 Q 20 120 70 140" fill="none" stroke="#F97316" strokeWidth="3" strokeDasharray="6 3" />
                  <text x="15" y="115" fill="#FDBA74" fontSize="10">Pyruvate vào</text>

                  {/* KREBS CYCLE (CITRIC ACID CYCLE) */}
                  <g transform="translate(140, 150)">
                    <circle
                      cx="0"
                      cy="0"
                      r="42"
                      fill="#7C2D12"
                      stroke="#F97316"
                      strokeWidth="3"
                      strokeDasharray="12 4"
                      className={isPlaying ? 'animate-spin' : ''}
                      style={{ animationDuration: '6s' }}
                    />
                    <text x="0" y="-4" fill="#FED7AA" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Chu trình
                    </text>
                    <text x="0" y="10" fill="#FFEDD5" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                      KREBS
                    </text>
                    <text x="0" y="24" fill="#FDBA74" fontSize="8" textAnchor="middle">
                      +2 ATP · 8 NADH
                    </text>
                  </g>

                  {/* ELECTRON TRANSPORT CHAIN (ETC) & ATP SYNTHASE */}
                  <g transform="translate(290, 150)">
                    {/* Inner membrane cristae wave */}
                    <path d="M 0 -70 Q 20 -35 0 0 Q 20 35 0 70" fill="none" stroke="#FED7AA" strokeWidth="5" />

                    {/* Rotating ATP Synthase Rotor */}
                    <g transform="translate(45, 0)">
                      <circle
                        cx="0"
                        cy="0"
                        r="24"
                        fill="#D97706"
                        stroke="#FBBF24"
                        strokeWidth="3"
                        strokeDasharray="8 4"
                        className={isPlaying ? 'animate-spin' : ''}
                        style={{ animationDuration: '2s' }}
                      />
                      <text x="0" y="4" fill="#451A03" fontSize="8" fontWeight="bold" textAnchor="middle">
                        ATP Synthase
                      </text>
                    </g>

                    <text x="45" y="-35" fill="#FDE047" fontSize="10" fontWeight="bold" textAnchor="middle">
                      +32 ATP
                    </text>
                    <text x="45" y="45" fill="#93C5FD" fontSize="9" textAnchor="middle">
                      O₂ nhận e⁻ ➔ H₂O
                    </text>
                  </g>

                  {/* CO2 exhaust emission */}
                  <g transform="translate(140, 240)">
                    <text x="0" y="0" fill="#CBD5E1" fontSize="10" fontWeight="bold" textAnchor="middle">
                      CO₂ thoát ra ⇣
                    </text>
                  </g>
                </g>
              ) : (
                /* ================= 3. FERMENTATION (ANAEROBIC NO OXYGEN) ================= */
                <g transform="translate(280, 100)">
                  <rect x="0" y="0" width="380" height="220" rx="12" fill="#2E1065" stroke="#A855F7" strokeWidth="2.5" />
                  <text x="190" y="32" fill="#E9D5FF" fontSize="14" fontWeight="bold" textAnchor="middle">
                    LÊN MEN KỊ KHÍ (THIẾU OXY)
                  </text>
                  <text x="190" y="50" fill="#C084FC" fontSize="11" textAnchor="middle">
                    Diễn ra hoàn toàn tại bào tương · Ty thể ngừng hoạt động
                  </text>

                  {/* Explanation card */}
                  <g transform="translate(30, 80)">
                    <rect x="0" y="0" width="320" height="110" rx="8" fill="#1E1B4B" stroke="#4C1D95" strokeWidth="1.5" />
                    <text x="16" y="28" fill="#F5D0FE" fontSize="11" fontWeight="bold">
                      Sản phẩm phụ: {result.byproducts.join(' + ')}
                    </text>
                    <text x="16" y="52" fill="#E2E8F0" fontSize="11">
                      Tổng năng lượng: <tspan fill="#FDE047" fontWeight="bold">CHỈ 2 ATP</tspan> (Từ đường phân)
                    </text>
                    <text x="16" y="76" fill="#CBD5E1" fontSize="10">
                      NADH chuyển H⁺ cho pyruvate để tái sinh NAD⁺ tiếp tục đường phân.
                    </text>
                    <text x="16" y="94" fill="#A855F7" fontSize="10" fontStyle="italic">
                      {params.kingdom === 'fungi' ? '🍺 Ứng dụng: Nấu rượu bia, ủ bột bánh mì nở xốp.' : '🏃 Gây mỏi cơ khi chạy nước rút do tích tụ axit lactic.'}
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Live Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Sản lượng ATP/Glucose</span>
              <div className="text-lg font-bold font-mono text-amber-400 flex items-baseline gap-1 mt-0.5">
                {result.atpPerGlucose}
                <span className="text-[10px] text-slate-500 font-sans">ATP</span>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Tốc độ sinh ATP</span>
              <div className="text-lg font-bold font-mono text-emerald-400 flex items-baseline gap-1 mt-0.5">
                {result.totalAtpRatePerSec.toLocaleString()}
                <span className="text-[10px] text-slate-500 font-sans">ptử/s</span>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Hoạt tính Ty thể</span>
              <div className="text-lg font-bold font-mono text-orange-400 flex items-baseline gap-1 mt-0.5">
                {result.mitochondriaActivity}%
                <span className="text-[10px] text-slate-500 font-sans">công suất</span>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Chất thải sinh học</span>
              <div className="text-[11px] font-semibold text-slate-300 truncate mt-1">
                {result.byproducts[0]}
              </div>
            </div>
          </div>
        </div>

        {/* Control Deck (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5 text-xs">
            <h3 className="text-sm font-bold text-slate-200 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Điều Khiển Cơ Chất & Môi Trường Hô Hấp</span>
              <Activity className="w-4 h-4 text-orange-400" />
            </h3>

            {/* Glucose Level */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-blue-400" />
                  Nồng độ Glucose nội dịch
                </label>
                <span className="font-mono text-blue-300 font-semibold">{params.glucoseLevelMm} mM</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={params.glucoseLevelMm}
                onChange={(e) => setParams({ ...params, glucoseLevelMm: Number(e.target.value) })}
                className="w-full accent-blue-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 mM (Cạn kiệt)</span>
                <span>5-8 mM (Chuẩn cơ thể)</span>
                <span>20 mM (Dồi dào)</span>
              </div>
            </div>

            {/* O2 Level */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  Hàm lượng Oxy (O₂) hòa tan
                </label>
                <span className="font-mono text-cyan-300 font-semibold">{params.o2Percent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="21"
                value={params.o2Percent}
                onChange={(e) => setParams({ ...params, o2Percent: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0% (Thiếu oxy tuyệt đối)</span>
                <span>10%</span>
                <span>21% (Khí quyển chuẩn)</span>
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-400" />
                  Thân nhiệt / Nhiệt độ tế bào
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
            </div>

            {/* Kingdom selector for fermentation comparison */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">
                Đối tượng tế bào chuyển hóa:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setParams({ ...params, kingdom: 'animal' })}
                  className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                    params.kingdom === 'animal'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-200'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs">Động vật (Cơ vân)</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Lên men Axit Lactic khi thiếu O₂</div>
                </button>
                <button
                  onClick={() => setParams({ ...params, kingdom: 'fungi' })}
                  className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                    params.kingdom === 'fungi'
                      ? 'border-amber-500 bg-amber-950/40 text-amber-200'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs">Nấm men (Yeast)</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Lên men Rượu (Ethanol + CO₂)</div>
                </button>
              </div>
            </div>
          </div>

          {/* Bio Energetics Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl text-xs space-y-2.5">
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Đánh giá hiệu suất nhiệt động học:
            </h4>
            <p className="p-2.5 rounded bg-slate-950 text-slate-300 border border-slate-800 leading-relaxed">
              {result.efficiencyDescription}
            </p>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              💡 <span className="text-slate-300 font-medium">Bản chất hóa học:</span> Hô hấp tế bào là một chuỗi phản ứng oxy hóa khử chậm rãi, giải phóng năng lượng từng bước nhỏ để tế bào bẫy lại thành liên kết cao năng trong ATP, tránh làm cháy tế bào như đốt lửa!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
