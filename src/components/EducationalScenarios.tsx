import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Sun,
  Flame,
  Droplet,
  Split,
  ShieldAlert,
  GraduationCap,
  Award,
  PlayCircle,
  ExternalLink,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { EDUCATIONAL_SCENARIOS, EducationalScenario, ScenarioStep } from '../data/scenariosData';

interface EducationalScenariosProps {
  onApplyPresetAndJump: (targetTab: string, preset: ScenarioStep['presetAction'], scenarioTitle?: string) => void;
  activeScenarioId?: string | null;
  onSelectScenarioId?: (id: string | null) => void;
}

export const EducationalScenarios: React.FC<EducationalScenariosProps> = ({
  onApplyPresetAndJump,
  activeScenarioId,
  onSelectScenarioId
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    activeScenarioId || EDUCATIONAL_SCENARIOS[0].id
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const activeScenario: EducationalScenario =
    EDUCATIONAL_SCENARIOS.find((s) => s.id === selectedScenarioId) || EDUCATIONAL_SCENARIOS[0];

  const currentStep: ScenarioStep = activeScenario.steps[currentStepIndex] || activeScenario.steps[0];
  const stepKey = `${selectedScenarioId}_step_${currentStep.stepNumber}`;

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setCurrentStepIndex(0);
    if (onSelectScenarioId) onSelectScenarioId(id);
  };

  const handleOptionSelect = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [stepKey]: optionIdx }));
    setShowExplanation((prev) => ({ ...prev, [stepKey]: true }));
    if (optionIdx === currentStep.checkpointQuestion.correctIndex) {
      setCompletedSteps((prev) => ({ ...prev, [stepKey]: true }));
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < activeScenario.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleApplyPreset = () => {
    onApplyPresetAndJump(currentStep.targetTab, currentStep.presetAction, activeScenario.titleVi);
  };

  const getCategoryIcon = (cat: EducationalScenario['category']) => {
    switch (cat) {
      case 'photosynthesis':
        return <Sun className="w-5 h-5 text-emerald-400" />;
      case 'respiration':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'osmosis':
        return <Droplet className="w-5 h-5 text-blue-400" />;
      case 'mitosis':
        return <Split className="w-5 h-5 text-purple-400" />;
      case 'cell_injury':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
    }
  };

  const getTargetTabLabel = (tab: ScenarioStep['targetTab']) => {
    switch (tab) {
      case 'photosynthesis':
        return 'Mô phỏng Quang hợp';
      case 'respiration':
        return 'Mô phỏng Hô hấp tế bào';
      case 'osmosis':
        return 'Vận chuyển qua màng & Thẩm thấu';
      case 'division':
        return 'Phân bào (Nguyên phân / Phân đôi)';
      case 'injury':
        return 'Tổn thương tế bào (Apoptosis / Hoại tử)';
      case 'microscope':
        return 'Kính hiển vi Tế bào học';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4" /> Kịch bản Giáo dục Sinh học
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Hành Trình Khám Phá & Thí Nghiệm Theo Từng Hiện Tượng
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Các kịch bản bài học tương tác dẫn dắt bạn qua từng cơ chế phân tử: Quang hợp, Hô hấp, Thẩm thấu, Phân bào và Tổn thương tế bào với câu hỏi trắc nghiệm kiểm tra và liên kết mô phỏng trực tiếp.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-center">
              <div className="text-xs text-slate-400">Tổng kịch bản</div>
              <div className="text-lg font-bold text-white">{EDUCATIONAL_SCENARIOS.length} chủ đề</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-center">
              <div className="text-xs text-slate-400">Tiến độ hoàn thành</div>
              <div className="text-lg font-bold text-emerald-400">
                {Object.keys(completedSteps).length} / {EDUCATIONAL_SCENARIOS.reduce((acc, s) => acc + s.steps.length, 0)} bước
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Scenario Selector, Right Scenario Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Scenario Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            <span>Danh sách Kịch bản</span>
            <span>{EDUCATIONAL_SCENARIOS.length} bài học</span>
          </div>

          <div className="space-y-2.5">
            {EDUCATIONAL_SCENARIOS.map((scenario) => {
              const isSelected = scenario.id === selectedScenarioId;
              const completedCountInScenario = scenario.steps.filter(
                (step) => completedSteps[`${scenario.id}_step_${step.stepNumber}`]
              ).length;
              const isAllDone = completedCountInScenario === scenario.steps.length;

              return (
                <button
                  key={scenario.id}
                  onClick={() => handleSelectScenario(scenario.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/40 text-white'
                      : 'bg-slate-900/60 hover:bg-slate-800/50 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                        {getCategoryIcon(scenario.category)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm line-clamp-1 leading-snug">
                          {scenario.titleVi}
                        </div>
                        <div className="text-xs text-slate-400 italic">
                          {scenario.titleEn}
                        </div>
                      </div>
                    </div>
                    {isAllDone && (
                      <span className="p-1 text-emerald-400 bg-emerald-500/10 rounded-full" title="Đã hoàn thành">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {scenario.summaryVi}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-slate-300">
                      {scenario.difficulty}
                    </span>
                    <span>~{scenario.estimatedMinutes} phút</span>
                    <span>{completedCountInScenario}/{scenario.steps.length} bước</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Scenario Runner (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Scenario Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                  {getCategoryIcon(activeScenario.category)}
                  <span>Kịch bản: {activeScenario.titleEn}</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {activeScenario.titleVi}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {activeScenario.contextVi}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300">
                  {activeScenario.difficulty}
                </span>
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300">
                  Thời lượng: ~{activeScenario.estimatedMinutes} phút
                </span>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Mục tiêu bài học (Learning Objectives)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                {activeScenario.learningObjectivesVi.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-200">
                  Bước {currentStepIndex + 1} / {activeScenario.steps.length}: {currentStep.titleVi}
                </span>
                <span>
                  {Math.round(((currentStepIndex + 1) / activeScenario.steps.length) * 100)}%
                </span>
              </div>
              <div className="flex gap-1.5">
                {activeScenario.steps.map((st, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  const isDone = !!completedSteps[`${activeScenario.id}_step_${st.stepNumber}`];
                  return (
                    <button
                      key={st.stepNumber}
                      onClick={() => setCurrentStepIndex(idx)}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        isCurrent
                          ? 'bg-blue-500 ring-2 ring-blue-400/40'
                          : isDone
                          ? 'bg-emerald-500'
                          : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                      title={`Bước ${idx + 1}: ${st.titleVi}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Current Step Content Box */}
            <div className="space-y-4 bg-slate-950/50 border border-slate-800/90 rounded-xl p-5">
              {/* Step Instruction & Concept */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-xs text-blue-300">
                    {currentStep.stepNumber}
                  </span>
                  <span>{currentStep.instructionVi}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-8">
                  {currentStep.conceptExplanationVi}
                </p>
              </div>

              {/* Interactive Task & Preset Application Action */}
              <div className="pl-8 pt-2">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Nhiệm vụ thực hành mô phỏng:
                    </div>
                    <div className="text-xs text-slate-300">
                      {currentStep.interactiveTaskVi}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Chuyển sang module: <span className="font-semibold text-blue-300">{getTargetTabLabel(currentStep.targetTab)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleApplyPreset}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-900/30 transition-all hover:scale-[1.02]"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Áp dụng & Mở Thí nghiệm</span>
                  </button>
                </div>
              </div>

              {/* Checkpoint Question */}
              <div className="pl-8 pt-2 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Câu hỏi kiểm tra nhanh (Checkpoint):</span>
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {currentStep.checkpointQuestion.questionVi}
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {currentStep.checkpointQuestion.optionsVi.map((option, optIdx) => {
                    const isSelected = selectedAnswers[stepKey] === optIdx;
                    const isCorrect = optIdx === currentStep.checkpointQuestion.correctIndex;
                    const hasAnswered = selectedAnswers[stepKey] !== undefined;

                    let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700';
                    if (hasAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleOptionSelect(optIdx)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start gap-2.5 ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {hasAnswered && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {showExplanation[stepKey] && (
                  <div
                    className={`p-3.5 rounded-lg border text-xs leading-relaxed transition-all ${
                      selectedAnswers[stepKey] === currentStep.checkpointQuestion.correctIndex
                        ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                        : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                    }`}
                  >
                    <div className="font-semibold mb-1 flex items-center gap-1.5">
                      {selectedAnswers[stepKey] === currentStep.checkpointQuestion.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Chính xác! Giải thích chi tiết:</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4 text-amber-400" />
                          <span>Chưa chính xác, hãy quan sát lại:</span>
                        </>
                      )}
                    </div>
                    <div>{currentStep.checkpointQuestion.explanationVi}</div>
                  </div>
                )}
              </div>

              {/* Takeaway */}
              <div className="pl-8 pt-2">
                <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-2">
                  <div className="text-amber-400 font-bold shrink-0">Ghi nhớ:</div>
                  <div className="text-slate-300 italic">{currentStep.takeawayVi}</div>
                </div>
              </div>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Bước trước</span>
              </button>

              <div className="text-xs text-slate-400">
                Bước {currentStepIndex + 1} / {activeScenario.steps.length}
              </div>

              {currentStepIndex < activeScenario.steps.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 transition-all"
                >
                  <span>Bước tiếp theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    const nextScenarioIdx =
                      (EDUCATIONAL_SCENARIOS.findIndex((s) => s.id === activeScenario.id) + 1) %
                      EDUCATIONAL_SCENARIOS.length;
                    handleSelectScenario(EDUCATIONAL_SCENARIOS[nextScenarioIdx].id);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>Kịch bản tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
