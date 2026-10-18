import React, { useState } from 'react';
import { QuizQuestion } from './types.ts';
import { ClickableText } from './ClickableText.tsx';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Volume2,
  Trophy,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { formatTime } from './pureLogic.ts';

interface QuizSectionProps {
  questions: QuizQuestion[];
  onPlayTimestamp: (seconds: number) => void;
  onUpdateScore: (score: number, total: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  onPlayTimestamp,
  onUpdateScore,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (isAnswerChecked) return;
    setSelectedOptionId(optId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId) return;
    const newAnswers = { ...userAnswers, [currentQ.id]: selectedOptionId };
    setUserAnswers(newAnswers);
    setIsAnswerChecked(true);

    // Calculate running score
    const correctCount = questions.reduce((acc, q) => {
      const ans = newAnswers[q.id];
      return ans === q.correctOptionId ? acc + 1 : acc;
    }, 0);
    onUpdateScore(correctCount, questions.length);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(userAnswers[questions[currentIndex + 1]?.id] || null);
      setIsAnswerChecked(!!userAnswers[questions[currentIndex + 1]?.id]);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setUserAnswers({});
    setIsAnswerChecked(false);
    setIsFinished(false);
    onUpdateScore(0, questions.length);
  };

  // Compute final score
  const totalScore = questions.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctOptionId ? acc + 1 : acc;
  }, 0);

  if (isFinished) {
    const percent = Math.round((totalScore / questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 border-2 border-amber-400/80 rounded-3xl shadow-2xl text-center space-y-6 animate-in zoom-in-95">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-emerald-950 flex items-center justify-center text-4xl shadow-xl shadow-amber-400/20">
          🏆
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400 text-emerald-950">
            ¡Quiz Completado!
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            Resultado del Quiz del Real Madrid
          </h2>
          <p className="text-emerald-200 text-sm mt-1">
            Has respondido a las 15 preguntas basadas en la entrevista oficial.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-emerald-900/60 border border-emerald-700/80 inline-block min-w-[280px]">
          <div className="text-5xl font-extrabold text-amber-300 font-mono">
            {totalScore} / {questions.length}
          </div>
          <div className="text-sm font-semibold text-emerald-300 mt-1">
            Porcentaje de acierto: {percent}%
          </div>
          <div className="mt-3 text-xs text-slate-200">
            {percent >= 80
              ? '🌟 ¡Excelente comprensión del español futbolístico!'
              : percent >= 50
              ? '⚽ ¡Buen trabajo! Con un poco más de práctica dominarás el vocabulario.'
              : '📋 ¡Sigue practicando! Vuelve a ver el vídeo y prueba otra vez.'}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Repetir la prueba</span>
          </button>
        </div>
      </div>
    );
  }

  const isCurrentCorrect = selectedOptionId === currentQ.correctOptionId;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Quiz Header & Progress */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-green-900/90 border border-emerald-600/60 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-emerald-950 uppercase tracking-wider">
                3. Quiz de comprensión
              </span>
              <span className="text-xs text-emerald-200">
                15 preguntas sobre el vídeo
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Pregunta {currentIndex + 1} de {questions.length}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs font-bold text-amber-300 font-mono">
              Puntos: {totalScore} / {questions.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-emerald-950 rounded-full h-2.5 overflow-hidden border border-emerald-700/60">
          <div
            className="bg-gradient-to-r from-amber-400 to-amber-300 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-emerald-200">
          💡 Haz clic en la pregunta o en cualquier opción A, B, C para ver su traducción al armenio.
        </p>
      </div>

      {/* Question Card */}
      <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-1.5 block">
            Pregunta #{currentQ.id}
          </span>
          <div className="text-lg sm:text-xl font-bold text-white">
            <ClickableText
              es={currentQ.questionEs}
              hy={currentQ.questionHy}
              block={true}
              textClassName="text-white hover:text-amber-200"
            />
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrect = opt.id === currentQ.correctOptionId;

            let cardStyle =
              'bg-emerald-900/40 border-emerald-700/80 hover:bg-emerald-800/50 hover:border-emerald-500';

            if (isAnswerChecked) {
              if (isCorrect) {
                cardStyle = 'bg-emerald-800/90 border-emerald-400 ring-2 ring-emerald-400/80 text-white';
              } else if (isSelected && !isCorrect) {
                cardStyle = 'bg-red-950/80 border-red-500 ring-2 ring-red-500/80 text-white';
              } else {
                cardStyle = 'bg-emerald-950/40 border-emerald-800/50 opacity-60';
              }
            } else if (isSelected) {
              cardStyle = 'bg-emerald-800/80 border-amber-400 ring-2 ring-amber-400/80 shadow-lg';
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${cardStyle}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                      isSelected
                        ? 'bg-amber-400 text-emerald-950'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    }`}
                  >
                    {opt.id}
                  </div>

                  <div className="flex-1">
                    <ClickableText
                      es={opt.es}
                      hy={opt.hy}
                      block={true}
                      onSelect={() => handleSelectOption(opt.id)}
                      textClassName="text-sm sm:text-base font-semibold"
                    />
                  </div>
                </div>

                {isAnswerChecked && (
                  <div className="shrink-0">
                    {isCorrect && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-950/90 px-2 py-1 rounded-md border border-emerald-500">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        Correcta
                      </span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-300 bg-red-950 px-2 py-1 rounded-md border border-red-500">
                        <XCircle size={14} className="text-red-400" />
                        Incorrecta
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {!isAnswerChecked ? (
          <div className="pt-2">
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedOptionId}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all duration-150 cursor-pointer ${
                selectedOptionId
                  ? 'bg-amber-400 hover:bg-amber-300 text-emerald-950 active:scale-98'
                  : 'bg-emerald-900/50 text-emerald-600 border border-emerald-800 cursor-not-allowed'
              }`}
            >
              Comprobar respuesta
            </button>
          </div>
        ) : (
          /* Post-answer feedback block */
          <div className="space-y-4 pt-2 animate-in fade-in">
            <div
              className={`p-4 sm:p-5 rounded-2xl border ${
                isCurrentCorrect
                  ? 'bg-emerald-900/70 border-emerald-500'
                  : 'bg-red-950/60 border-red-500/80'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-base">
                {isCurrentCorrect ? (
                  <>
                    <CheckCircle2 className="text-emerald-400" size={20} />
                    <span className="text-emerald-300">¡Respuesta correcta!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-400" size={20} />
                    <span className="text-red-300">Respuesta incorrecta</span>
                  </>
                )}
              </div>

              {/* Spanish Explanation with Armenian Click Reveal */}
              <div className="text-xs sm:text-sm text-slate-100">
                <span className="font-semibold text-amber-300 block mb-1">
                  Explicación (Haz clic para traducir):
                </span>
                <ClickableText
                  es={currentQ.explanationEs}
                  hy={currentQ.explanationHy}
                  block={true}
                  textClassName="text-slate-100 font-medium"
                />
              </div>

              {/* Phrase from video justifying answer */}
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/70 text-xs">
                <span className="font-bold text-emerald-300 block mb-1">
                  Frase original del vídeo que justifica la respuesta:
                </span>
                <ClickableText
                  es={`«${currentQ.videoQuoteEs}»`}
                  hy={`«${currentQ.videoQuoteHy}»`}
                  block={true}
                  textClassName="italic text-amber-200"
                />
                <button
                  onClick={() => onPlayTimestamp(currentQ.videoTimestamp)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-lg text-xs cursor-pointer shadow-sm transition-transform active:scale-95"
                >
                  <Volume2 size={13} />
                  <span>Escuchar fragmento ({formatTime(currentQ.videoTimestamp)})</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm shadow-lg cursor-pointer transition-transform active:scale-95"
              >
                <span>
                  {currentIndex < questions.length - 1
                    ? 'Siguiente pregunta'
                    : 'Ver resultado final'}
                </span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
