import React, { useState } from 'react';
import {
  Microscope,
  BookOpen,
  Sun,
  Flame,
  Droplets,
  GitBranch,
  ShieldAlert,
  Layers,
  HelpCircle,
  Info,
  ChevronRight,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { CellMicroscope } from './components/CellMicroscope';
import { EducationalScenarios } from './components/EducationalScenarios';
import { PhotosynthesisSim } from './components/PhotosynthesisSim';
import { RespirationSim } from './components/RespirationSim';
import { MembraneTransportSim } from './components/MembraneTransportSim';
import { CellDivisionSim } from './components/CellDivisionSim';
import { CellInjurySim } from './components/CellInjurySim';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { QuizLab } from './components/QuizLab';
import { CellKingdom } from './data/cellData';
import { ScenarioStep } from './data/scenariosData';

type ActiveTab =
  | 'microscope'
  | 'scenarios'
  | 'photosynthesis'
  | 'respiration'
  | 'osmosis'
  | 'division'
  | 'injury'
  | 'compare'
  | 'quiz';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('microscope');
  const [currentKingdom, setCurrentKingdom] = useState<CellKingdom>('animal');
  const [selectedOrganismId, setSelectedOrganismId] = useState<string | null>(null);
  const [selectedOrganelleId, setSelectedOrganelleId] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [activeScenarioBanner, setActiveScenarioBanner] = useState<{
    scenarioTitle: string;
    targetTab: string;
  } | null>(null);

  // Jump from Educational Scenario with auto-applied presets
  const handleApplyPresetAndJump = (
    targetTab: string,
    preset: ScenarioStep['presetAction'],
    scenarioTitle?: string
  ) => {
    if (preset.kingdom) {
      setCurrentKingdom(preset.kingdom as CellKingdom);
    }
    if (preset.specificCellId) {
      setSelectedOrganismId(preset.specificCellId);
    }
    if (preset.organelleHighlight) {
      setSelectedOrganelleId(preset.organelleHighlight);
    }

    if (scenarioTitle) {
      setActiveScenarioBanner({ scenarioTitle, targetTab });
    }

    setActiveTab(targetTab as ActiveTab);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 3-Zone Top Bar Contract */}
      <header className="flex items-center justify-between gap-6 px-6 py-3.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
            <Microscope className="w-5 h-5" />
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            BioCell Lab
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single line, concise labels) */}
        <nav className="hidden 2xl:flex items-center gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('microscope')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'microscope'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>Kính hiển vi</span>
          </button>

          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'scenarios'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kịch bản Học tập</span>
          </button>

          <button
            onClick={() => setActiveTab('photosynthesis')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'photosynthesis'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Quang hợp</span>
          </button>

          <button
            onClick={() => setActiveTab('respiration')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'respiration'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Hô hấp</span>
          </button>

          <button
            onClick={() => setActiveTab('osmosis')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'osmosis'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Thẩm thấu</span>
          </button>

          <button
            onClick={() => setActiveTab('division')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'division'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Phân bào</span>
          </button>

          <button
            onClick={() => setActiveTab('injury')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'injury'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Tổn thương tế bào</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>So sánh 5 Giới</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Thử thách</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('scenarios')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/70 rounded-lg transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Khám phá Kịch bản</span>
          </button>

          <button
            onClick={() => setShowGuideModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Hướng dẫn</span>
          </button>
        </div>
      </header>

      {/* Mobile/Tablet Sub-Navigation bar */}
      <div className="2xl:hidden flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 border-b border-slate-800 overflow-x-auto text-xs">
        {[
          { id: 'microscope', label: 'Kính hiển vi', icon: Microscope },
          { id: 'scenarios', label: 'Kịch bản học tập', icon: BookOpen },
          { id: 'photosynthesis', label: 'Quang hợp', icon: Sun },
          { id: 'respiration', label: 'Hô hấp', icon: Flame },
          { id: 'osmosis', label: 'Thẩm thấu', icon: Droplets },
          { id: 'division', label: 'Phân bào', icon: GitBranch },
          { id: 'injury', label: 'Tổn thương', icon: ShieldAlert },
          { id: 'compare', label: 'So sánh 5 giới', icon: Layers },
          { id: 'quiz', label: 'Thử thách', icon: HelpCircle },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`px-2.5 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1 font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Prompt Banner (when user arrived via scenario jump) */}
      {activeScenarioBanner && activeTab !== 'scenarios' && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-b border-blue-800/60 px-6 py-2.5 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Đang thực hành theo Kịch bản:</span>
              <strong className="text-white">{activeScenarioBanner.scenarioTitle}</strong>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('scenarios')}
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
              >
                <span>Quay lại Kịch bản</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveScenarioBanner(null)}
                className="text-slate-400 hover:text-slate-300 text-[11px]"
              >
                Tắt thông báo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb / Context Subheader */}
      <div className="bg-slate-900/40 border-b border-slate-800/80 px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Sinh học Tế bào</span>
            <span aria-hidden="true">·</span>
            <span>5 Giới Tế bào</span>
            <span aria-hidden="true">·</span>
            <span className="text-blue-400 font-medium">
              {activeTab === 'microscope'
                ? `Kính hiển vi: ${currentKingdom === 'animal' ? 'Động vật' : currentKingdom === 'plant' ? 'Thực vật' : currentKingdom === 'fungi' ? 'Nấm' : currentKingdom === 'protist' ? 'Nguyên sinh' : 'Vi khuẩn'}${selectedOrganismId ? ` (${selectedOrganismId})` : ''}`
                : activeTab === 'scenarios'
                ? 'Kịch bản Giáo dục Sinh học & Hướng dẫn Từng bước'
                : activeTab === 'photosynthesis'
                ? 'Mô phỏng Quang hợp Lục lạp (Pha sáng & Chu trình Calvin)'
                : activeTab === 'respiration'
                ? 'Mô phỏng Hô hấp Ty thể & Lên men kị khí (36 vs 2 ATP)'
                : activeTab === 'osmosis'
                ? 'Mô phỏng Màng sinh chất & Áp suất Thẩm thấu'
                : activeTab === 'division'
                ? 'Mô phỏng Nguyên phân & Trực phân vi khuẩn'
                : activeTab === 'injury'
                ? 'Mô phỏng Tổn thương tế bào (Apoptosis vs Hoại tử vs Kháng sinh)'
                : activeTab === 'compare'
                ? 'Bảng Ma Trận So Sánh 5 Giới Sinh Vật'
                : 'Thử Thách Phòng Lab'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span>Khoa học: Chuẩn Campbell Biology & Đại học</span>
            <span aria-hidden="true">·</span>
            <span>Mô phỏng tương tác động học</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'microscope' && (
          <CellMicroscope
            currentKingdom={currentKingdom}
            onSelectKingdom={setCurrentKingdom}
            selectedOrganismId={selectedOrganismId}
            onSelectOrganismId={setSelectedOrganismId}
            selectedOrganelleId={selectedOrganelleId}
            onSelectOrganelle={setSelectedOrganelleId}
          />
        )}

        {activeTab === 'scenarios' && (
          <EducationalScenarios
            onApplyPresetAndJump={handleApplyPresetAndJump}
          />
        )}

        {activeTab === 'photosynthesis' && <PhotosynthesisSim />}

        {activeTab === 'respiration' && <RespirationSim />}

        {activeTab === 'osmosis' && <MembraneTransportSim />}

        {activeTab === 'division' && <CellDivisionSim />}

        {activeTab === 'injury' && <CellInjurySim />}

        {activeTab === 'compare' && (
          <ComparisonMatrix
            onSelectKingdomForMicroscope={(k) => {
              setCurrentKingdom(k);
              setSelectedOrganismId(null);
              setActiveTab('microscope');
            }}
          />
        )}

        {activeTab === 'quiz' && <QuizLab />}
      </main>

      {/* Guide & Help Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Microscope className="w-4 h-4 text-blue-400" />
                Hướng Dẫn Sử Dụng BioCell Lab
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-3 text-slate-300 leading-relaxed overflow-y-auto max-h-[60vh] pr-1">
              <div>
                <strong className="text-white block mb-0.5">1. Kính hiển vi & Thư viện 18 loài sinh vật:</strong>
                <p className="text-slate-400">
                  Khám phá 5 giới sinh vật cùng 18 mẫu loài chuyên hóa (Neuron thần kinh có bao myelin, Tế bào cơ vân, Tế bào khí khổng đóng mở, Trùng đế giày bơi lông, Trùng biến hình Amip, Trùng roi Euglena, Vi khuẩn lam, Vi khuẩn sinh nội bào tử...). Điều chỉnh tốc độ dòng tế bào chất với thanh điều khiển thời gian (0.25x - 10x, tua lùi, dừng).
                </p>
              </div>

              <div>
                <strong className="text-white block mb-0.5">2. Kịch bản Giáo dục Sinh học (Educational Scenarios):</strong>
                <p className="text-slate-400">
                  5 kịch bản định hướng mục tiêu học tập (Quang hợp, Hô hấp, Thẩm thấu, Phân bào, Tổn thương tế bào). Mỗi bước có giải thích cơ chế, nhiệm vụ thực hành với nút "Áp dụng thiết lập & Mở thí nghiệm" và câu hỏi checkpoint tương tác kèm lời giải chi tiết.
                </p>
              </div>

              <div>
                <strong className="text-white block mb-0.5">3. Thanh điều khiển thời gian mô phỏng (Time Control):</strong>
                <p className="text-slate-400">
                  Tăng tốc (0.25x, 0.5x, 1x, 2x, 5x, 10x), tua ngược, bước từng khung hình, hoặc tạm dừng để phân tích các pha chuyển tiếp trong phân bào hoặc cơ chế ly giải màng tế bào.
                </p>
              </div>

              <div>
                <strong className="text-white block mb-0.5">4. Giả lập Tổn thương tế bào (Cell Injury):</strong>
                <p className="text-slate-400">
                  So sánh trực quan giữa Chết theo chương trình (Apoptosis - màng phồng tạo thể apoptosis, không viêm nhiễm) với Chết hoại tử (Necrosis - cạn kiệt ATP, phình to vỡ toác màng kích hoạt phản ứng viêm) và cơ chế kháng sinh phá hủy thành peptidoglycan vi khuẩn.
                </p>
              </div>

              <div>
                <strong className="text-white block mb-0.5">5. Quang hợp, Hô hấp, Thẩm thấu & Phân bào:</strong>
                <p className="text-slate-400">
                  Các mô hình toán học chuẩn (Định luật Blackman, tỷ số ATP/O, định luật Van 't Hoff về áp suất thẩm thấu) cho phép bạn thay đổi nồng độ, bước sóng ánh sáng, nhiệt độ và quan sát động học phân tử trực tiếp.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition cursor-pointer"
              >
                Đã hiểu & Bắt đầu thí nghiệm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto px-6 py-4 bg-slate-950 border-t border-slate-900 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>BioCell Lab · Phần Mềm Giáo Dục & Mô Phỏng Sinh Học Tế Bào 5 Giới</span>
          </div>
          <div className="flex items-center gap-3">
            <span>18 Mẫu Tế Bào Chuyên Hóa · 5 Kịch Bản Tương Tác · Điều Khiển Thời Gian Đa Tốc Độ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
