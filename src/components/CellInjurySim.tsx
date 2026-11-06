import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  Pill,
  Clock,
  Layers
} from 'lucide-react';
import { TimeControlBar, TimeControlState } from './TimeControlBar';

export type InjuryMode = 'apoptosis' | 'necrosis' | 'antibiotic';

export const CellInjurySim: React.FC = () => {
  const [injuryMode, setInjuryMode] = useState<InjuryMode>('apoptosis');

  const [timeState, setTimeState] = useState<TimeControlState>({
    isPlaying: true,
    speed: 1,
    timeSec: 0,
    maxTimeSec: 60,
    direction: 'forward',
  });

  // Animation ticker linked to time state
  useEffect(() => {
    if (!timeState.isPlaying) return;
    const interval = setInterval(() => {
      setTimeState((prev) => {
        const delta = 0.05 * prev.speed * (prev.direction === 'forward' ? 1 : -1);
        let nextTime = prev.timeSec + delta;
        if (nextTime >= prev.maxTimeSec) {
          nextTime = 0; // loop
        } else if (nextTime < 0) {
          nextTime = prev.maxTimeSec;
        }
        return { ...prev, timeSec: Number(nextTime.toFixed(2)) };
      });
    }, 50);
    return () => clearInterval(interval);
  }, [timeState.isPlaying, timeState.speed, timeState.direction, timeState.maxTimeSec]);

  // Stage progress from 0% to 100%
  const progressPercent = Math.min(100, Math.max(0, (timeState.timeSec / timeState.maxTimeSec) * 100));

  // Biological metrics calculated dynamically
  const membraneIntegrity = injuryMode === 'apoptosis'
    ? Math.max(65, Math.round(100 - progressPercent * 0.35)) // Apoptosis preserves membrane in apoptotic bodies
    : injuryMode === 'necrosis'
    ? Math.max(0, Math.round(100 - progressPercent * 1.25)) // Necrosis ruptures membrane
    : Math.max(0, Math.round(100 - progressPercent * 1.4)); // Antibiotic destroys bacterial wall & membrane

  const atpLevel = injuryMode === 'apoptosis'
    ? Math.max(20, Math.round(100 - progressPercent * 0.75)) // Apoptosis consumes ATP actively to self-destruct
    : Math.max(0, Math.round(100 - progressPercent * 1.8)); // Necrosis has acute ATP depletion

  const inflammationRisk = injuryMode === 'apoptosis'
    ? '0% (Không gây viêm - Đại thực bào dọn sạch)'
    : injuryMode === 'necrosis'
    ? `${Math.min(100, Math.round(progressPercent * 1.1))}% (Viêm cấp dữ dội do giải phóng DAMPs)`
    : `${Math.min(100, Math.round(progressPercent * 0.9))}% (Giải phóng mảnh vách vi khuẩn)`;

  const caspaseActivity = injuryMode === 'apoptosis'
    ? Math.min(100, Math.round(progressPercent * 1.5))
    : 0;

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Header & Modes */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs text-rose-400 font-mono font-semibold tracking-wide">
            BỆNH HỌC TẾ BÀO · TỔN THƯƠNG, CHẾT LẬP TRÌNH (APOPTOSIS) VS HOẠI TỬ (NECROSIS)
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-0.5">
            Giả Lập Tổn Thương & Chết Tế Bào (Cell Injury & Death)
          </h2>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => { setInjuryMode('apoptosis'); setTimeState((s) => ({ ...s, timeSec: 0 })); }}
            className={`px-3 py-1.5 font-medium rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              injuryMode === 'apoptosis' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Chết lập trình (Apoptosis)</span>
          </button>

          <button
            onClick={() => { setInjuryMode('necrosis'); setTimeState((s) => ({ ...s, timeSec: 0 })); }}
            className={`px-3 py-1.5 font-medium rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              injuryMode === 'necrosis' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-300" />
            <span>Hoại tử màng (Necrosis)</span>
          </button>

          <button
            onClick={() => { setInjuryMode('antibiotic'); setTimeState((s) => ({ ...s, timeSec: 0 })); }}
            className={`px-3 py-1.5 font-medium rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              injuryMode === 'antibiotic' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-emerald-300" />
            <span>Kháng sinh phá vách vi khuẩn</span>
          </button>
        </div>
      </div>

      {/* Time Control Bar */}
      <TimeControlBar
        state={timeState}
        onTogglePlay={() => setTimeState((s) => ({ ...s, isPlaying: !s.isPlaying }))}
        onSetSpeed={(speed) => setTimeState((s) => ({ ...s, speed }))}
        onStep={(dir) => setTimeState((s) => ({
          ...s,
          timeSec: Math.max(0, Math.min(s.maxTimeSec, s.timeSec + (dir === 'forward' ? 2 : -2))),
        }))}
        onRewindToggle={() => setTimeState((s) => ({
          ...s,
          direction: s.direction === 'forward' ? 'backward' : 'forward',
        }))}
        onReset={() => setTimeState((s) => ({ ...s, timeSec: 0 }))}
        onSeek={(timeSec) => setTimeState((s) => ({ ...s, timeSec }))}
        label="Dòng thời gian phản ứng tổn thương"
      />

      {/* Main Grid: Visual Stage + Scientific Diagnostic Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Visual Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-5 shadow-xl relative min-h-[480px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                injuryMode === 'apoptosis' ? 'bg-purple-500 animate-pulse' : injuryMode === 'necrosis' ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
              }`} />
              {injuryMode === 'apoptosis' ? (
                'Con đường Apoptosis: Co cụm, nổi bóng màng & thể apoptotic'
              ) : injuryMode === 'necrosis' ? (
                'Hoại tử Necrosis: Mất ATP, trương phồng ti thể & vỡ toạc màng sinh chất'
              ) : (
                'Kháng sinh Beta-lactam: Ức chế Peptidoglycan làm nổ vỡ vi khuẩn'
              )}
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              Tiến trình: {Math.round(progressPercent)}%
            </span>
          </div>

          {/* SVG Animated Pathology Stage */}
          <div className="flex-1 flex items-center justify-center relative my-2">
            <svg viewBox="0 0 700 420" className="w-full h-full max-h-[420px]">
              <defs>
                <radialGradient id="healthyCellGrad" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </radialGradient>
                <radialGradient id="necrosisCellGrad" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="#7F1D1D" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#450A0A" stopOpacity="0.85" />
                </radialGradient>
              </defs>

              {injuryMode === 'apoptosis' ? (
                /* ================= 1. APOPTOSIS VISUALIZATION ================= */
                <g transform="translate(350, 210)">
                  {progressPercent < 40 ? (
                    /* Stage 1: Cell shrinkage and chromatin condensation */
                    <g>
                      <ellipse cx="0" cy="0" rx={140 - progressPercent * 0.8} ry={110 - progressPercent * 0.6} fill="url(#healthyCellGrad)" stroke="#A855F7" strokeWidth="3.5" />
                      {/* Condensed crescent-shaped chromatin in nucleus */}
                      <circle cx="0" cy="0" r="50" fill="#4C1D95" stroke="#C084FC" strokeWidth="2.5" />
                      <path d="M -30 -15 C -20 20, 20 20, 30 -15" fill="none" stroke="#E9D5FF" strokeWidth="4" strokeLinecap="round" />
                      <text x="0" y="80" fill="#D8B4FE" fontSize="12" fontWeight="bold" textAnchor="middle">
                        1. Co nhân & Ngưng kết chất nhiễm sắc
                      </text>
                    </g>
                  ) : progressPercent < 75 ? (
                    /* Stage 2: Membrane blebbing (nổi bóng màng) */
                    <g>
                      {/* Irregular bumpy perimeter */}
                      <path
                        d="M -90 -40 C -80 -80, -30 -90, 0 -70 C 40 -90, 80 -70, 70 -30 C 100 0, 80 50, 50 60 C 20 80, -40 80, -70 50 C -100 30, -100 -20, -90 -40 Z"
                        fill="#3B0764"
                        stroke="#C084FC"
                        strokeWidth="3.5"
                      />
                      {/* Fragmenting nucleus */}
                      <circle cx="-30" cy="-20" r="22" fill="#581C87" />
                      <circle cx="30" cy="15" r="18" fill="#581C87" />
                      <text x="0" y="100" fill="#E9D5FF" fontSize="12" fontWeight="bold" textAnchor="middle">
                        2. Màng sinh chất nổi bóng (Blebbing)
                      </text>
                    </g>
                  ) : (
                    /* Stage 3: Apoptotic bodies separation */
                    <g>
                      {/* Multiple sealed apoptotic vesicles */}
                      <g transform="translate(-70, -40)">
                        <circle cx="0" cy="0" r="32" fill="#3B0764" stroke="#C084FC" strokeWidth="3" />
                        <circle cx="0" cy="0" r="14" fill="#6B21A8" />
                        <text x="0" y="4" fill="#F5D0FE" fontSize="9" textAnchor="middle">Thể apoptotic</text>
                      </g>
                      <g transform="translate(60, -30)">
                        <circle cx="0" cy="0" r="28" fill="#3B0764" stroke="#C084FC" strokeWidth="3" />
                        <circle cx="0" cy="0" r="12" fill="#6B21A8" />
                      </g>
                      <g transform="translate(-30, 50)">
                        <circle cx="0" cy="0" r="26" fill="#3B0764" stroke="#C084FC" strokeWidth="2.5" />
                        <circle cx="0" cy="0" r="10" fill="#6B21A8" />
                      </g>
                      <g transform="translate(70, 40)">
                        <circle cx="0" cy="0" r="24" fill="#3B0764" stroke="#C084FC" strokeWidth="2.5" />
                      </g>
                      <text x="0" y="110" fill="#A855F7" fontSize="12" fontWeight="bold" textAnchor="middle">
                        3. Đại thực bào dọn sạch các thể apoptotic (Không viêm!)
                      </text>
                    </g>
                  )}
                </g>
              ) : injuryMode === 'necrosis' ? (
                /* ================= 2. NECROSIS VISUALIZATION ================= */
                <g transform="translate(350, 210)">
                  {progressPercent < 45 ? (
                    /* Stage 1: Cellular & Mitochondrial swelling due to ATP loss */
                    <g>
                      <ellipse cx="0" cy="0" rx={140 + progressPercent * 0.9} ry={110 + progressPercent * 0.7} fill="url(#necrosisCellGrad)" stroke="#EF4444" strokeWidth="3" />
                      {/* Swollen mitochondria with disrupted cristae */}
                      <circle cx="-50" cy="-25" r="24" fill="#EA580C" stroke="#FED7AA" strokeWidth="2" />
                      <circle cx="50" cy="20" r="22" fill="#EA580C" stroke="#FED7AA" strokeWidth="2" />
                      <text x="0" y="0" fill="#FECACA" fontSize="12" fontWeight="bold" textAnchor="middle">
                        Mất ATP ➔ Trương phồng tế bào & Ty thể
                      </text>
                    </g>
                  ) : (
                    /* Stage 2: Membrane rupture, lysis and spill of inflammatory content */
                    <g>
                      {/* Torn broken membrane */}
                      <path d="M -120 -80 C -80 -140, 20 -130, 80 -90" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="12 8" />
                      <path d="M 120 -40 C 160 30, 100 110, 40 120" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="12 8" />
                      <path d="M -20 130 C -80 120, -140 60, -130 -20" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="12 8" />

                      {/* Disintegrating lysed core */}
                      <circle cx="0" cy="0" r="60" fill="#7F1D1D" opacity="0.3" />

                      {/* Escaping acidic lysosomal enzymes & DAMPs */}
                      {[-70, 80, -40, 60, 0].map((x, i) => (
                        <g key={i} transform={`translate(${x}, ${i % 2 === 0 ? -70 : 80})`}>
                          <circle cx="0" cy="0" r="9" fill="#DC2626" />
                          <text x="0" y="4" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">DAMP</text>
                        </g>
                      ))}

                      <text x="0" y="-10" fill="#FCA5A5" fontSize="14" fontWeight="extrabold" textAnchor="middle">
                        💥 VỠ TOẠC MÀNG SINH CHẤT
                      </text>
                      <text x="0" y="16" fill="#FEE2E2" fontSize="11" textAnchor="middle">
                        Enzyme Lysosome tràn ra ngoài gây VIÊM CẤP TÍNH
                      </text>
                    </g>
                  )}
                </g>
              ) : (
                /* ================= 3. ANTIBIOTIC CELL WALL LYSIS ================= */
                <g transform="translate(350, 210)">
                  {/* Bacterial capsule & Peptidoglycan wall with punctures */}
                  <rect
                    x="-180"
                    y="-90"
                    width="360"
                    height="180"
                    rx="90"
                    fill="#064E3B"
                    stroke="#10B981"
                    strokeWidth={Math.max(1, 10 - progressPercent * 0.09)}
                    strokeDasharray={progressPercent > 35 ? '12 8' : undefined}
                  />

                  {/* Penicillin antibiotic molecules attacking transpeptidase */}
                  {[-120, -60, 0, 60, 120].map((x, i) => (
                    <g key={i} transform={`translate(${x}, ${-95 + (i % 2) * 190})`}>
                      <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
                      <text x="0" y="4" fill="#451A03" fontSize="8" fontWeight="bold" textAnchor="middle">Penicillin</text>
                    </g>
                  ))}

                  {/* Nucleoid inside bacterium */}
                  <path
                    d="M -80 0 Q -20 -30 20 0 T 80 0"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {progressPercent > 60 && (
                    <g transform="translate(0, 0)">
                      <text x="0" y="-15" fill="#FDE047" fontSize="13" fontWeight="bold" textAnchor="middle">
                        Vách Peptidoglycan thủng lỗ chỗ
                      </text>
                      <text x="0" y="15" fill="#A7F3D0" fontSize="12" fontWeight="bold" textAnchor="middle">
                        Vi khuẩn vỡ tung (Bacteriolysis)!
                      </text>
                    </g>
                  )}
                </g>
              )}
            </svg>
          </div>

          {/* Diagnostic Metrics HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Toàn vẹn màng</span>
              <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                {membraneIntegrity}%
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Năng lượng ATP</span>
              <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                {atpLevel}%
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Enzyme Caspase</span>
              <div className="text-lg font-bold font-mono text-purple-400 mt-0.5">
                {caspaseActivity}%
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Nguy cơ viêm mô</span>
              <div className="text-[11px] font-semibold text-slate-300 truncate mt-1">
                {inflammationRisk}
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Explanation Deck (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-200 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Cơ Chế Phân Tử & Bệnh Học</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </h3>

            {injuryMode === 'apoptosis' ? (
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-900/60 text-purple-200">
                  🧬 <strong className="text-white">Chết theo chương trình (Apoptosis):</strong> Là quá trình tự sát tế bào có tổ chức cao, tiêu tốn năng lượng ATP để dọn dẹp tế bào hư hại hoặc tế bào thừa mà không làm tổn thương các mô lân cận.
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Các giai đoạn tế bào học:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                    <li>Co cụm tế bào và ngưng kết chất nhiễm sắc (Pyknosis)</li>
                    <li>Phân mảnh nhân (Karyorrhexis) thành các đoạn oligomer 180-200 bp</li>
                    <li>Màng sinh chất nổi bóng (blebbing) tạo các túi thể apoptotic</li>
                    <li>Đại thực bào thực bào nhận diện Phosphatidylserine dọn dẹp sạch sẽ</li>
                  </ul>
                </div>
              </div>
            ) : injuryMode === 'necrosis' ? (
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-200">
                  ⚠️ <strong className="text-white">Hoại tử tế bào (Necrosis):</strong> Là cái chết bệnh lý thụ động do chấn thương nặng, nhiễm độc, bỏng nhiệt hoặc thiếu máu cục bộ (nhồi máu cơ tim/đột quỵ).
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Hậu quả bệnh học nghiêm trọng:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                    <li>Bơm Na+/K+ cạn kiệt ATP dẫn tới phù tế bào và phù ti thể</li>
                    <li>Màng sinh chất mất tính toàn vẹn và nứt vỡ toạc</li>
                    <li>Giải phóng các enzyme tiêu hóa lysosome và DAMPs vào mô kẽ</li>
                    <li>Gây phản ứng viêm cấp tính, sưng, nóng, đỏ, đau tại vị trí tổn thương</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-emerald-200">
                  💊 <strong className="text-white">Cơ chế Kháng sinh Beta-lactam (Penicillin):</strong> Đích tác động là enzyme Transpeptidase (PBP) chịu trách nhiệm đan chéo các cầu nối pentapeptide của thành peptidoglycan vi khuẩn.
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Độc tính chọn lọc cứu sống con người:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                    <li>Tế bào người là tế bào động vật không có thành peptidoglycan</li>
                    <li>Thuốc ức chế tổng hợp thành làm vách vi khuẩn yếu đi</li>
                    <li>Áp suất thẩm thấu nội bào vi khuẩn (5-20 atm) làm nước ùa vào làm vỡ tung vi khuẩn</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
