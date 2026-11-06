import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Layers,
  ArrowRight,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Info,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  calculateOsmosis,
  OsmosisParams,
  OsmosisResult
} from '../utils/bioCalculations';

export const MembraneTransportSim: React.FC = () => {
  const [soluteConcentration, setSoluteConcentration] = useState<number>(300); // mOsm/L, 300 is isotonic
  const [hasCellWall, setHasCellWall] = useState<boolean>(false); // false: Animal (RBC), true: Plant
  const [transportMode, setTransportMode] = useState<'osmosis' | 'pump' | 'diffusion' | 'bulk'>('osmosis');
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 1000);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const result: OsmosisResult = calculateOsmosis({
    externalSoluteOsm: soluteConcentration,
    hasCellWall,
  });

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs text-cyan-400 font-mono font-semibold tracking-wide">
            MÀNG SINH CHẤT & KÊNH PROTEIN · THẨM THẤU, KHUẾCH TÁN & BƠM CHỦ ĐỘNG
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-0.5">
            Giả Lập Thẩm Thấu & Vận Chuyển Qua Màng Sinh Chất
          </h2>
        </div>

        {/* Transport Mechanism Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setTransportMode('osmosis')}
            className={`px-3 py-1.5 font-medium rounded-md transition cursor-pointer ${
              transportMode === 'osmosis'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Thẩm thấu (Osmosis)
          </button>
          <button
            onClick={() => setTransportMode('pump')}
            className={`px-3 py-1.5 font-medium rounded-md transition cursor-pointer ${
              transportMode === 'pump'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bơm Na⁺/K⁺ (Chủ động)
          </button>
          <button
            onClick={() => setTransportMode('diffusion')}
            className={`px-3 py-1.5 font-medium rounded-md transition cursor-pointer ${
              transportMode === 'diffusion'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Khuếch tán (Kênh ion)
          </button>
          <button
            onClick={() => setTransportMode('bulk')}
            className={`px-3 py-1.5 font-medium rounded-md transition cursor-pointer ${
              transportMode === 'bulk'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Thực bào / Xuất bào
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Visual Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-5 shadow-xl relative min-h-[480px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="font-medium text-slate-300 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${result.dangerStatus === 'fatal' ? 'bg-rose-500 animate-ping' : result.dangerStatus === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              {transportMode === 'osmosis' ? (
                <>Hiện tượng: <strong className="text-white">{result.solutionType === 'hypotonic' ? 'Môi trường Nhược trương' : result.solutionType === 'hypertonic' ? 'Môi trường Ưu trương' : 'Môi trường Đẳng trương'}</strong></>
              ) : transportMode === 'pump' ? (
                'Bơm Na⁺/K⁺-ATPase tiêu thụ 1 ATP để tống 3 Na⁺ ra ngoài & đưa 2 K⁺ vào trong'
              ) : transportMode === 'diffusion' ? (
                'Khuếch tán thuận chiều gradient nồng độ (Không tốn năng lượng)'
              ) : (
                'Biến dạng màng sinh chất bọc hạt thức ăn tạo túi thực bào'
              )}
            </span>

            {/* Quick cell type switch */}
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
              <button
                onClick={() => setHasCellWall(false)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                  !hasCellWall ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                Tế bào Động vật (Không thành)
              </button>
              <button
                onClick={() => setHasCellWall(true)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                  hasCellWall ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Tế bào Thực vật (Có thành)
              </button>
            </div>
          </div>

          {/* Canvas Illustration */}
          <div className="flex-1 flex items-center justify-center relative my-2">
            <svg viewBox="0 0 700 420" className="w-full h-full max-h-[420px]">
              <defs>
                <linearGradient id="extSoluteGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
              </defs>

              {/* Background Solution */}
              <rect x="20" y="20" width="660" height="380" rx="16" fill="url(#extSoluteGrad)" stroke="#334155" strokeWidth="2" />

              {transportMode === 'osmosis' ? (
                /* ================= OSMOSIS CELL MORPHOLOGY ================= */
                <g transform="translate(350, 210)">
                  {/* Plant Cell Outer Cellulose Wall (if applicable) */}
                  {hasCellWall && (
                    <polygon
                      points="-160,-130 160,-130 200,0 160,130 -160,130 -200,0"
                      fill="#064E3B"
                      stroke="#059669"
                      strokeWidth="10"
                      opacity="0.9"
                    />
                  )}

                  {/* Cell Body & Plasma Membrane depending on swelling / shrinking */}
                  {hasCellWall ? (
                    /* Plant Plasmolysis vs Turgid */
                    result.solutionType === 'hypertonic' ? (
                      /* Plasmolyzed / Co nguyên sinh: Membrane shrinks and peels away from wall */
                      <g>
                        <ellipse cx="0" cy="0" rx="100" ry="70" fill="#047857" stroke="#34D399" strokeWidth="4" />
                        <ellipse cx="0" cy="0" rx="60" ry="40" fill="#0284C7" opacity="0.6" stroke="#38BDF8" strokeWidth="2" />
                        <text x="0" y="5" fill="#E0F2FE" fontSize="12" fontWeight="bold" textAnchor="middle">
                          Co nguyên sinh!
                        </text>
                        {/* Empty gap between wall and shrunken membrane */}
                        <text x="0" y="-90" fill="#FBBF24" fontSize="11" textAnchor="middle">
                          Khoang chứa dung dịch ưu trương tràn vào
                        </text>
                      </g>
                    ) : (
                      /* Turgid / Trương nước tối đa: Fills the entire wall */
                      <g>
                        <polygon
                          points="-150,-120 150,-120 190,0 150,120 -150,120 -190,0"
                          fill="#047857"
                          stroke="#34D399"
                          strokeWidth="3.5"
                        />
                        <ellipse cx="0" cy="0" rx="120" ry="80" fill="#0284C7" opacity="0.65" stroke="#38BDF8" strokeWidth="3" />
                        <text x="0" y="5" fill="#F0FDF4" fontSize="13" fontWeight="bold" textAnchor="middle">
                          Trương nước tối đa (Sức căng turgor)
                        </text>
                      </g>
                    )
                  ) : (
                    /* Animal RBC: Lysed vs Normal vs Crenated */
                    result.solutionType === 'hypotonic' ? (
                      /* Burst / Lysis or highly swollen */
                      result.dangerStatus === 'fatal' ? (
                        <g>
                          {/* Torn membrane remnants */}
                          <path d="M -80 -70 C -40 -120, 50 -100, 90 -60" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray="10 6" />
                          <path d="M 80 50 C 40 100, -50 90, -90 40" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray="10 6" />
                          <circle cx="0" cy="0" r="15" fill="#EF4444" opacity="0.4" />
                          {/* Leaking hemoglobin dots */}
                          {[-50, -20, 20, 60, -40, 40].map((x, i) => (
                            <circle key={i} cx={x} cy={(i % 2 === 0 ? 1 : -1) * 45} r="7" fill="#DC2626" />
                          ))}
                          <text x="0" y="5" fill="#FCA5A5" fontSize="14" fontWeight="extrabold" textAnchor="middle">
                            💥 TAN BÀO / VỠ TẾ BÀO (LYSIS)
                          </text>
                          <text x="0" y="24" fill="#FEE2E2" fontSize="11" textAnchor="middle">
                            Nước ùa vào vô hạn làm vỡ màng sinh chất
                          </text>
                        </g>
                      ) : (
                        <g>
                          <circle cx="0" cy="0" r="95" fill="#DC2626" stroke="#F87171" strokeWidth="4" />
                          <text x="0" y="5" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
                            Căng phồng nguy hiểm
                          </text>
                        </g>
                      )
                    ) : result.solutionType === 'hypertonic' ? (
                      /* Crenated / Shriveled star shape */
                      <g>
                        <path
                          d="M 0 -60 L 25 -30 L 60 -40 L 40 0 L 65 35 L 20 30 L 0 65 L -25 30 L -60 40 L -40 0 L -65 -35 L -20 -30 Z"
                          fill="#991B1B"
                          stroke="#EF4444"
                          strokeWidth="3.5"
                        />
                        <text x="0" y="5" fill="#FEE2E2" fontSize="12" fontWeight="bold" textAnchor="middle">
                          Teo bào (Crenation)
                        </text>
                      </g>
                    ) : (
                      /* Normal biconcave disc */
                      <g>
                        <ellipse cx="0" cy="0" rx="90" ry="60" fill="#DC2626" stroke="#F87171" strokeWidth="4" />
                        <ellipse cx="0" cy="0" rx="45" ry="25" fill="#991B1B" opacity="0.7" />
                        <text x="0" y="5" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                          Hồng cầu bình thường (300 mOsm)
                        </text>
                      </g>
                    )
                  )}

                  {/* Water Flux Arrows */}
                  {result.waterMovement === 'inward' && (
                    <g>
                      {[
                        { x: -180, y: 0, dx: 40, dy: 0 },
                        { x: 180, y: 0, dx: -40, dy: 0 },
                        { x: 0, y: -160, dx: 0, dy: 40 },
                        { x: 0, y: 160, dx: 0, dy: -40 },
                      ].map((arr, i) => (
                        <g key={i}>
                          <line x1={arr.x} y1={arr.y} x2={arr.x + arr.dx} y2={arr.y + arr.dy} stroke="#38BDF8" strokeWidth="3" markerEnd="url(#arrow)" />
                          <text x={arr.x} y={arr.y - 8} fill="#7DD3FC" fontSize="10" textAnchor="middle">H₂O vào ➔</text>
                        </g>
                      ))}
                    </g>
                  )}

                  {result.waterMovement === 'outward' && (
                    <g>
                      {[
                        { x: -70, y: 0, dx: -40, dy: 0 },
                        { x: 70, y: 0, dx: 40, dy: 0 },
                        { x: 0, y: -60, dx: 0, dy: -35 },
                        { x: 0, y: 60, dx: 0, dy: 35 },
                      ].map((arr, i) => (
                        <g key={i}>
                          <line x1={arr.x} y1={arr.y} x2={arr.x + arr.dx} y2={arr.y + arr.dy} stroke="#F97316" strokeWidth="3" />
                          <text x={arr.x + arr.dx} y={arr.y - 6} fill="#FDBA74" fontSize="10" textAnchor="middle">H₂O ra ➔</text>
                        </g>
                      ))}
                    </g>
                  )}
                </g>
              ) : (
                /* ================= MEMBRANE BILAYER & TRANSPORTER VIEW ================= */
                <g transform="translate(100, 120)">
                  <text x="250" y="-30" fill="#94A3B8" fontSize="12" fontWeight="bold" textAnchor="middle">
                    NGOẠI BÀO (Dịch gian bào)
                  </text>

                  {/* Phospholipid Bilayer Top Layer */}
                  {[...Array(24)].map((_, i) => (
                    <g key={`top-${i}`} transform={`translate(${i * 22}, 0)`}>
                      <circle cx="10" cy="10" r="7" fill="#38BDF8" />
                      <line x1="8" y1="17" x2="8" y2="35" stroke="#94A3B8" strokeWidth="2" />
                      <line x1="12" y1="17" x2="12" y2="35" stroke="#94A3B8" strokeWidth="2" />
                    </g>
                  ))}

                  {/* Phospholipid Bilayer Bottom Layer */}
                  {[...Array(24)].map((_, i) => (
                    <g key={`bot-${i}`} transform={`translate(${i * 22}, 90)`}>
                      <circle cx="10" cy="10" r="7" fill="#38BDF8" />
                      <line x1="8" y1="3" x2="8" y2="-15" stroke="#94A3B8" strokeWidth="2" />
                      <line x1="12" y1="3" x2="12" y2="-15" stroke="#94A3B8" strokeWidth="2" />
                    </g>
                  ))}

                  {/* Transmembrane Carrier Protein / Pump */}
                  <g transform="translate(210, 0)">
                    <rect x="0" y="-10" width="80" height="120" rx="16" fill="#8B5CF6" stroke="#C4B5FD" strokeWidth="3" />
                    <text x="40" y="45" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {transportMode === 'pump' ? 'BƠM Na⁺/K⁺' : 'KÊNH ION'}
                    </text>
                    <text x="40" y="62" fill="#E9D5FF" fontSize="9" textAnchor="middle">
                      {transportMode === 'pump' ? 'Cần ATP' : 'Thụ động'}
                    </text>
                  </g>

                  {/* Aquaporin Channel */}
                  <g transform="translate(360, 0)">
                    <rect x="0" y="-10" width="60" height="120" rx="14" fill="#0284C7" stroke="#7DD3FC" strokeWidth="3" />
                    <text x="30" y="52" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Aquaporin
                    </text>
                  </g>

                  <text x="250" y="150" fill="#94A3B8" fontSize="12" fontWeight="bold" textAnchor="middle">
                    NỘI BÀO (Tế bào chất)
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Diagnostic Box */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-200">Trạng thái hình thái tế bào:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                result.dangerStatus === 'fatal' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                result.dangerStatus === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {result.dangerStatus === 'fatal' ? 'NGUY HIỂM: TAN BÀO' : result.dangerStatus === 'warning' ? 'CẢNH BÁO MẤT NƯỚC' : 'AN TOÀN'}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">
              {result.cellMorphology}
            </p>
          </div>
        </div>

        {/* Solute & Solution Controls (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5 text-xs">
            <h3 className="text-sm font-bold text-slate-200 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Nồng Độ Chất Tan Ngoại Bào</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </h3>

            {/* Solute concentration slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">
                  Áp suất thẩm thấu dung dịch (Nồng độ muối / đường)
                </label>
                <span className="font-mono text-cyan-300 font-bold">{soluteConcentration} mOsm/L</span>
              </div>
              <input
                type="range"
                min="50"
                max="650"
                step="10"
                value={soluteConcentration}
                onChange={(e) => setSoluteConcentration(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50 mOsm (Nước cất)</span>
                <span className="text-emerald-400 font-semibold">300 mOsm (Đẳng trương)</span>
                <span>650 mOsm (Nước muối đặc)</span>
              </div>
            </div>

            {/* Quick Solution Presets */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">
                Thí nghiệm nhanh các loại dung dịch:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSoluteConcentration(80)}
                  className={`p-2.5 rounded-lg border text-center transition cursor-pointer ${
                    soluteConcentration < 260
                      ? 'border-blue-500 bg-blue-950/40 text-blue-200'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs">Nhược trương</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">80 mOsm (Nước cất)</div>
                </button>
                <button
                  onClick={() => setSoluteConcentration(300)}
                  className={`p-2.5 rounded-lg border text-center transition cursor-pointer ${
                    soluteConcentration >= 260 && soluteConcentration <= 340
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs">Đẳng trương</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">300 mOsm (Sinh lý)</div>
                </button>
                <button
                  onClick={() => setSoluteConcentration(580)}
                  className={`p-2.5 rounded-lg border text-center transition cursor-pointer ${
                    soluteConcentration > 340
                      ? 'border-amber-500 bg-amber-950/40 text-amber-200'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs">Ưu trương</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">580 mOsm (Muối đặc)</div>
                </button>
              </div>
            </div>

            {/* Comparison of Animal vs Plant Response */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="font-semibold text-slate-300 block">
                So sánh cơ chế bảo vệ của Thành tế bào:
              </span>
              <div className="text-slate-400 leading-relaxed space-y-1.5 text-[11px]">
                <div>
                  🔴 <strong className="text-slate-200">Động vật:</strong> Không có thành tế bào. Khi gặp nước cất nhược trương, nước ùa vào liên tục làm màng sinh chất căng quá giới hạn và vỡ tung (tan máu / hemolysis).
                </div>
                <div>
                  🟢 <strong className="text-slate-200">Thực vật / Nấm / Vi khuẩn:</strong> Có thành tế bào (cellulose / chitin / peptidoglycan) cực kỳ vững chắc. Nước vào không bào tạo áp suất trương ép màng vào thành, tạo lực đối áp ngăn nước vào thêm, giúp thân cây đứng vững.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
