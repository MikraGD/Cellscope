import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  ChevronRight,
  Info,
  CheckCircle2,
  Sparkles,
  GitBranch
} from 'lucide-react';

export const CellDivisionSim: React.FC = () => {
  const [progress, setProgress] = useState<number>(0); // 0 to 100%
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [divisionType, setDivisionType] = useState<'mitosis' | 'binary_fission'>('mitosis');

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 0;
        return p + 0.75;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Determine stage based on progress
  const getMitosisStage = (p: number) => {
    if (p < 20) return { name: 'Kỳ trung gian (Interphase)', desc: 'ADN nhân đôi ở pha S, tế bào sinh trưởng tích lũy ATP và protein thoi vô sắc.' };
    if (p < 40) return { name: 'Kỳ đầu (Prophase)', desc: 'Nhiễm sắc thể co xoắn ngắn lại, màng nhân và hạch nhân tiêu biến, thoi phân bào hình thành từ trung thể.' };
    if (p < 60) return { name: 'Kỳ giữa (Metaphase)', desc: 'NST kép co xoắn cực đại và xếp thành một hàng trên mặt phẳng xích đạo của thoi phân bào.' };
    if (p < 80) return { name: 'Kỳ sau (Anaphase)', desc: 'Các nhiễm sắc tử chị em tách nhau tại tâm động, thoi phân bào co rút kéo 2 bộ NST đơn về 2 cực tế bào.' };
    return { name: 'Kỳ cuối & Phân chia tế bào chất (Telophase & Cytokinesis)', desc: 'Màng nhân tái lập bao bọc 2 bộ NST, tế bào thắt eo phân tách tạo 2 tế bào con có bộ NST 2n giống hệt mẹ.' };
  };

  const getFissionStage = (p: number) => {
    if (p < 25) return { name: 'Nhân đôi ADN trần', desc: 'Phân tử ADN vòng của vi khuẩn tự nhân đôi bắt đầu từ điểm khởi đầu sao chép OriC.' };
    if (p < 50) return { name: 'Kéo dài tế bào', desc: 'Thành tế bào và màng sinh chất kéo dài, 2 phân tử ADN dạt dần về hai cực đối diện.' };
    if (p < 75) return { name: 'Hình thành vách ngăn (Vòng FtsZ)', desc: 'Protein FtsZ tập hợp ở giữa tạo vòng thắt, tổng hợp lớp vách peptidoglycan ngăn đôi.' };
    return { name: 'Phân cắt thành 2 vi khuẩn con', desc: 'Vách ngăn hoàn tất, 2 tế bào vi khuẩn độc lập tách rời với tốc độ cực nhanh (20 phút/lần).' };
  };

  const currentStage = divisionType === 'mitosis' ? getMitosisStage(progress) : getFissionStage(progress);

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs text-purple-400 font-mono font-semibold tracking-wide">
            CHU KỲ TẾ BÀO · NGUYÊN PHÂN (MITOSIS) VS PHÂN ĐÔI TRỰC PHÂN (BINARY FISSION)
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-0.5">
            Giả Lập Quá Trình Phân Chia Tế Bào
          </h2>
        </div>

        {/* Division Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setDivisionType('mitosis'); setProgress(0); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
              divisionType === 'mitosis'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Nguyên phân Eukaryote (Mitosis)
          </button>
          <button
            onClick={() => { setDivisionType('binary_fission'); setProgress(0); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
              divisionType === 'binary_fission'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Phân đôi Vi khuẩn (Binary Fission)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Visual Stage */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-5 shadow-xl relative min-h-[480px]">
          {/* Controls Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-slate-300 font-semibold">{currentStage.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Dừng' : 'Chạy'}</span>
              </button>
              <button
                onClick={() => setProgress(0)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition cursor-pointer"
                title="Về đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Animated Stage */}
          <div className="flex-1 flex items-center justify-center relative my-2">
            <svg viewBox="0 0 720 400" className="w-full h-full max-h-[400px]">
              <defs>
                <radialGradient id="divCellGrad" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </radialGradient>
              </defs>

              {divisionType === 'mitosis' ? (
                /* ================= EUKARYOTIC MITOSIS RENDER ================= */
                <g transform="translate(360, 200)">
                  {/* Cell membrane undergoing pinch/cleavage furrow */}
                  {progress < 80 ? (
                    /* Single cell stretching slightly */
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={160 + (progress / 80) * 40}
                      ry={140 - (progress / 80) * 15}
                      fill="url(#divCellGrad)"
                      stroke="#38BDF8"
                      strokeWidth="4"
                    />
                  ) : (
                    /* Cleavage furrow pinching in the center */
                    <path
                      d={`M 0 ${-125 + (progress - 80) * 4} 
                          C 80 -120, 180 -100, 190 0 
                          C 180 100, 80 120, 0 ${125 - (progress - 80) * 4}
                          C -80 120, -180 100, -190 0
                          C -180 -100, -80 -120, 0 ${-125 + (progress - 80) * 4} Z`}
                      fill="url(#divCellGrad)"
                      stroke="#38BDF8"
                      strokeWidth="4"
                    />
                  )}

                  {/* Centrosomes and Spindle Fibers (Thoi phân bào) */}
                  {progress >= 20 && progress < 90 && (
                    <g>
                      {/* Left centrosome */}
                      <circle cx={-120 - (progress / 100) * 30} cy="0" r="10" fill="#F43F5E" />
                      {/* Right centrosome */}
                      <circle cx={120 + (progress / 100) * 30} cy="0" r="10" fill="#F43F5E" />

                      {/* Spindle fibers radiating */}
                      {[-40, -20, 0, 20, 40].map((y, idx) => (
                        <line
                          key={idx}
                          x1={-120 - (progress / 100) * 30}
                          y1="0"
                          x2={120 + (progress / 100) * 30}
                          y2={y}
                          stroke="#EC4899"
                          strokeWidth="1.2"
                          strokeDasharray="4 3"
                          opacity="0.6"
                        />
                      ))}
                    </g>
                  )}

                  {/* Chromosomes (NST) according to stage */}
                  {progress < 20 ? (
                    /* Interphase: Uncoiled Chromatin threads inside intact nucleus */
                    <g>
                      <circle cx="0" cy="0" r="65" fill="#4338CA" opacity="0.6" stroke="#818CF8" strokeWidth="2.5" />
                      <circle cx="10" cy="-5" r="18" fill="#312E81" />
                      <path d="M -30 -20 Q 0 30 30 -20 Q -10 10 -20 30" fill="none" stroke="#C7D2FE" strokeWidth="2.5" />
                      <text x="0" y="85" fill="#94A3B8" fontSize="11" textAnchor="middle">Nhân tế bào nguyên vẹn</text>
                    </g>
                  ) : progress < 40 ? (
                    /* Prophase: Chromosomes condensed, nuclear envelope dissolving */
                    <g>
                      <circle cx="0" cy="0" r="65" fill="#4338CA" opacity="0.25" stroke="#818CF8" strokeWidth="2" strokeDasharray="6 4" />
                      {/* Condensed X-shaped chromosomes scattered */}
                      {[-25, 0, 25].map((x, i) => (
                        <g key={i} transform={`translate(${x}, ${i % 2 === 0 ? -15 : 15}) rotate(${i * 30})`}>
                          <line x1="-12" y1="-12" x2="12" y2="12" stroke="#A855F7" strokeWidth="4" strokeLinecap="round" />
                          <line x1="-12" y1="12" x2="12" y2="-12" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" />
                          <circle cx="0" cy="0" r="3" fill="#FDE047" />
                        </g>
                      ))}
                      <text x="0" y="85" fill="#94A3B8" fontSize="11" textAnchor="middle">Màng nhân tiêu biến · NST kép co xoắn</text>
                    </g>
                  ) : progress < 60 ? (
                    /* Metaphase: Aligned at equatorial plate (vertical center line) */
                    <g>
                      <line x1="0" y1="-80" x2="0" y2="80" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
                      {[-45, -15, 15, 45].map((y, i) => (
                        <g key={i} transform={`translate(0, ${y})`}>
                          <line x1="-14" y1="-10" x2="14" y2="10" stroke="#A855F7" strokeWidth="4.5" strokeLinecap="round" />
                          <line x1="-14" y1="10" x2="14" y2="-10" stroke="#EC4899" strokeWidth="4.5" strokeLinecap="round" />
                          <circle cx="0" cy="0" r="3.5" fill="#FDE047" />
                        </g>
                      ))}
                      <text x="0" y="100" fill="#FBBF24" fontSize="11" fontWeight="bold" textAnchor="middle">Mặt phẳng xích đạo</text>
                    </g>
                  ) : progress < 80 ? (
                    /* Anaphase: Sister chromatids separated and pulling to opposite poles */
                    <g>
                      {/* Pulling Left */}
                      {[-40, -15, 15, 40].map((y, i) => (
                        <g key={`l-${i}`} transform={`translate(${-40 - (progress - 60) * 2.5}, ${y})`}>
                          <path d="M 10 -10 L 0 0 L 10 10" fill="none" stroke="#A855F7" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="0" cy="0" r="3" fill="#FDE047" />
                        </g>
                      ))}
                      {/* Pulling Right */}
                      {[-40, -15, 15, 40].map((y, i) => (
                        <g key={`r-${i}`} transform={`translate(${40 + (progress - 60) * 2.5}, ${y})`}>
                          <path d="M -10 -10 L 0 0 L -10 10" fill="none" stroke="#EC4899" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="0" cy="0" r="3" fill="#FDE047" />
                        </g>
                      ))}
                      <text x="0" y="100" fill="#E2E8F0" fontSize="11" textAnchor="middle">Phân ly về 2 cực tế bào</text>
                    </g>
                  ) : (
                    /* Telophase & Cytokinesis: Two new nuclei formed */
                    <g>
                      {/* Left daughter nucleus */}
                      <g transform="translate(-95, 0)">
                        <circle cx="0" cy="0" r="48" fill="#4338CA" opacity="0.6" stroke="#818CF8" strokeWidth="2.5" />
                        <text x="0" y="4" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">Tế bào con 1 (2n)</text>
                      </g>
                      {/* Right daughter nucleus */}
                      <g transform="translate(95, 0)">
                        <circle cx="0" cy="0" r="48" fill="#4338CA" opacity="0.6" stroke="#818CF8" strokeWidth="2.5" />
                        <text x="0" y="4" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">Tế bào con 2 (2n)</text>
                      </g>
                    </g>
                  )}
                </g>
              ) : (
                /* ================= BACTERIAL BINARY FISSION RENDER ================= */
                <g transform="translate(360, 200)">
                  {/* Bacterial Capsule & Peptidoglycan Wall elongation */}
                  {progress < 70 ? (
                    <rect
                      x={-120 - (progress / 70) * 60}
                      y="-70"
                      width={240 + (progress / 70) * 120}
                      height="140"
                      rx="70"
                      fill="#064E3B"
                      stroke="#10B981"
                      strokeWidth="5"
                    />
                  ) : (
                    /* Furrow in center */
                    <g>
                      {/* Left half */}
                      <rect x="-170" y="-70" width="165" height="140" rx="70" fill="#064E3B" stroke="#10B981" strokeWidth="4" />
                      {/* Right half */}
                      <rect x="5" y="-70" width="165" height="140" rx="70" fill="#064E3B" stroke="#10B981" strokeWidth="4" />
                      {/* FtsZ ring division line */}
                      <line x1="0" y1="-70" x2="0" y2="70" stroke="#FBBF24" strokeWidth="4" strokeDasharray="4 2" />
                      <text x="0" y="-85" fill="#FDE047" fontSize="10" textAnchor="middle">Vách ngăn FtsZ</text>
                    </g>
                  )}

                  {/* Circular DNA replication */}
                  {progress < 30 ? (
                    <g>
                      <circle cx="0" cy="0" r="28" fill="none" stroke="#60A5FA" strokeWidth="4" />
                      <text x="0" y="45" fill="#93C5FD" fontSize="10" textAnchor="middle">Nhân đôi ADN vòng tại OriC</text>
                    </g>
                  ) : progress < 70 ? (
                    <g>
                      <circle cx={-50 - (progress - 30) * 1.5} cy="0" r="26" fill="none" stroke="#60A5FA" strokeWidth="4" />
                      <circle cx={50 + (progress - 30) * 1.5} cy="0" r="26" fill="none" stroke="#60A5FA" strokeWidth="4" />
                      <text x="0" y="45" fill="#93C5FD" fontSize="10" textAnchor="middle">2 bản sao ADN bám màng dạt về 2 cực</text>
                    </g>
                  ) : (
                    <g>
                      <circle cx="-90" cy="0" r="26" fill="none" stroke="#60A5FA" strokeWidth="4" />
                      <circle cx="90" cy="0" r="26" fill="none" stroke="#60A5FA" strokeWidth="4" />
                      <text x="0" y="45" fill="#A7F3D0" fontSize="11" fontWeight="bold" textAnchor="middle">Hoàn tất tách 2 vi khuẩn</text>
                    </g>
                  )}
                </g>
              )}
            </svg>
          </div>

          {/* Timeline Scrubbing Slider */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Tiến trình chu kỳ phân bào:</span>
              <span className="font-mono text-purple-400 font-bold">{Math.round(progress)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Stage Explanation & Biological Significance (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-200 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Hồ Sơ Giai Đoạn Phân Bào</span>
              <GitBranch className="w-4 h-4 text-purple-400" />
            </h3>

            <div>
              <span className="text-[11px] text-purple-400 font-mono font-semibold uppercase tracking-wider block mb-1">
                Giai đoạn đang quan sát
              </span>
              <h4 className="text-base font-bold text-slate-100">
                {currentStage.name}
              </h4>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 leading-relaxed font-medium">
              {currentStage.desc}
            </div>

            {/* Comparison of Mitosis vs Binary Fission */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="font-semibold text-slate-300 block">
                So sánh Nguyên phân vs Phân đôi:
              </span>
              <div className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  🧬 <strong className="text-slate-200">Nguyên phân (Nhân thực):</strong> Phức tạp do có nhiều nhiễm sắc thể thẳng bọc trong màng nhân. Bắt buộc cần thoi phân bào để kéo tách đồng đều.
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  ⚡ <strong className="text-slate-200">Phân đôi (Vi khuẩn):</strong> Cực kỳ đơn giản và nhanh chóng. Chỉ có 1 phân tử ADN vòng duy nhất tự bám vào màng sinh chất kéo dài ra mà không cần thoi phân bào.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
