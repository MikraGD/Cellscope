import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  ChevronRight,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { CELL_QUIZ_QUESTIONS, QuizQuestion } from '../data/cellData';

export const QuizLab: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const question: QuizQuestion = CELL_QUIZ_QUESTIONS[currentQuestionIndex];
  const hasAnsweredCurrent = selectedAnswers[question.id] !== undefined;
  const currentSelectedOption = selectedAnswers[question.id];

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: index,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < CELL_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  // Calculate score
  const score = CELL_QUIZ_QUESTIONS.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const total = CELL_QUIZ_QUESTIONS.length;
  const percent = Math.round((score / total) * 100);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs text-amber-400 font-mono font-semibold tracking-wide">
            THỬ THÁCH KIẾN THỨC SINH HỌC TẾ BÀO · 8 CÂU HỎI
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-0.5">
            Thử Thách Phòng Thí Nghiệm Tế Bào Học
          </h2>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">
            Câu {currentQuestionIndex + 1}/{total}
          </span>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {!isSubmitted ? (
        /* Question Card */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between text-xs min-h-[440px]">
          <div>
            {/* Category tag */}
            <div className="text-[11px] font-mono font-semibold text-blue-400 uppercase tracking-wide mb-2">
              Chủ đề: {question.category === 'organelle' ? 'Cấu trúc Bào quan' : question.category === 'photosynthesis' ? 'Quang hợp' : question.category === 'respiration' ? 'Hô hấp Tế bào' : question.category === 'osmosis' ? 'Thẩm thấu & Màng' : 'Tiến hóa 5 Giới'}
            </div>

            {/* Question Text */}
            <h3 className="text-base font-bold text-slate-100 leading-snug mb-5">
              {question.questionVi}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5">
              {question.optionsVi.map((option, idx) => {
                const isSelected = currentSelectedOption === idx;
                const isCorrect = idx === question.correctIndex;
                const showValidation = hasAnsweredCurrent;

                let btnStyle = 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700';
                if (showValidation) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-600 bg-emerald-950/50 text-emerald-200 font-semibold';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-600 bg-rose-950/50 text-rose-200 font-semibold';
                  } else {
                    btnStyle = 'border-slate-800/50 bg-slate-950/30 text-slate-500 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-blue-500 bg-blue-950/40 text-blue-200 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center shrink-0 font-mono text-[11px] mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 text-xs leading-relaxed">{option}</span>
                    {showValidation && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {showValidation && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Real-time Scientific Explanation */}
            {hasAnsweredCurrent && (
              <div className="mt-4 p-3.5 rounded-lg bg-blue-950/30 border border-blue-900/50 text-blue-200 leading-relaxed text-xs animate-fadeIn">
                <span className="font-bold flex items-center gap-1.5 mb-1 text-blue-300">
                  <BookOpen className="w-3.5 h-3.5" />
                  Giải thích khoa học:
                </span>
                {question.explanationVi}
              </div>
            )}
          </div>

          {/* Navigation Bar */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-800 mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
            >
              Câu trước
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer flex items-center gap-1.5"
            >
              <span>{currentQuestionIndex === total - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-100">
              Kết Quả Bài Kiểm Tra Tế Bào Học
            </h3>
            <div className="text-3xl font-extrabold font-mono text-blue-400 mt-2">
              {score} / {total} câu đúng ({percent}%)
            </div>
            <p className="text-sm text-slate-300 mt-2 font-medium">
              {score >= 7 ? (
                '🏆 Danh hiệu: Chuyên Gia Tế Bào Học Xuất Sắc (Master Cytologist)'
              ) : score >= 5 ? (
                '🔬 Danh hiệu: Nhà Nghiên Cứu Sinh Học Tiềm Năng (Cell Biologist)'
              ) : (
                '📚 Danh hiệu: Thực Tập Sinh Phòng Lab (Lab Apprentice)'
              )}
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Bạn đã nắm vững các kiến thức cốt lõi về cấu trúc siêu vi của 5 giới sinh vật, cơ chế quang hợp ở thylakoid/calvin, hô hấp ty thể và phản ứng thẩm thấu màng sinh chất.
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Làm lại bài kiểm tra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
