import React, { useState } from 'react';
import { FillBlankItem } from './types.ts';
import { ClickableText } from './ClickableText.tsx';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Award } from 'lucide-react';

interface FillBlanksSectionProps {
  items: FillBlankItem[];
  onUpdateScore: (score: number, total: number) => void;
}

export const FillBlanksSection: React.FC<FillBlanksSectionProps> = ({
  items,
  onUpdateScore,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentItem = items[currentIndex];

  const handleSelect = (word: string) => {
    if (isChecked) return;
    setSelectedWord(word);
  };

  const handleCheck = () => {
    if (!selectedWord) return;
    const newAnswers = { ...answers, [currentItem.id]: selectedWord };
    setAnswers(newAnswers);
    setIsChecked(true);

    const score = items.reduce(
      (acc, it) => (newAnswers[it.id] === it.correctAnswer ? acc + 1 : acc),
      0
    );
    onUpdateScore(score, items.length);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedWord(answers[items[currentIndex + 1]?.id] || null);
      setIsChecked(!!answers[items[currentIndex + 1]?.id]);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedWord(null);
    setIsChecked(false);
    setAnswers({});
    setIsCompleted(false);
    onUpdateScore(0, items.length);
  };

  const score = items.reduce(
    (acc, it) => (answers[it.id] === it.correctAnswer ? acc + 1 : acc),
    0
  );

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 border border-emerald-600 rounded-3xl text-center space-y-6 shadow-2xl animate-in zoom-in-95">
        <div className="text-5xl">⚽</div>
        <h2 className="text-2xl font-bold text-white">¡Juego 1 completado!</h2>
        <p className="text-emerald-200 text-sm">
          Has completado todas las frases de la entrevista de pretemporada.
        </p>
        <div className="p-4 rounded-xl bg-emerald-900/60 border border-emerald-700 inline-block min-w-[220px]">
          <span className="text-4xl font-extrabold text-amber-300 font-mono">
            {score} / {items.length}
          </span>
          <span className="block text-xs text-emerald-300 mt-1">Aciertos conseguidos</span>
        </div>
        <div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs cursor-pointer shadow-lg"
          >
            <RotateCcw size={14} />
            <span>Jugar de nuevo</span>
          </button>
        </div>
      </div>
    );
  }

  const isCurrentCorrect = selectedWord === currentItem.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-green-900/90 border border-emerald-600/60 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-emerald-950 uppercase tracking-wider">
                Juego 1: Completa la frase
              </span>
              <span className="text-xs text-emerald-200">10 ejercicios</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Frase {currentIndex + 1} de {items.length}
            </h2>
          </div>

          <span className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs font-bold text-amber-300 font-mono self-start sm:self-auto">
            Aciertos: {score} / {items.length}
          </span>
        </div>

        <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden border border-emerald-700/60">
          <div
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
          />
        </div>
        <p className="mt-2.5 text-xs text-emerald-200">
          💡 Haz clic en la frase o en cualquier opción para ver su traducción al armenio.
        </p>
      </div>

      {/* Exercise Card */}
      <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        {/* Sentence with blank */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-900/40 border border-emerald-700/70 text-center">
          <div className="text-base sm:text-lg font-bold text-white flex flex-wrap items-center justify-center gap-2">
            <span>{currentItem.beforeBlank}</span>
            <span
              className={`px-3 py-1 rounded-lg border-2 font-mono text-amber-300 min-w-[90px] ${
                selectedWord
                  ? 'border-amber-400 bg-amber-400/20'
                  : 'border-dashed border-emerald-600 bg-emerald-950'
              }`}
            >
              {selectedWord || '______'}
            </span>
            <span>{currentItem.afterBlank}</span>
          </div>

          {/* Full sentence click translation */}
          <div className="mt-4 pt-3 border-t border-emerald-800/60 text-xs">
            <span className="text-emerald-300 block mb-1">
              Traducción de la frase completa (haz clic):
            </span>
            <ClickableText
              es={currentItem.fullSentenceEs}
              hy={currentItem.fullSentenceHy}
              block={true}
              textClassName="text-slate-200"
            />
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {currentItem.options.map((opt) => {
            const isSelected = selectedWord === opt.es;
            const isCorrect = opt.es === currentItem.correctAnswer;

            let style =
              'bg-emerald-900/40 border-emerald-700 hover:bg-emerald-800/60 hover:border-emerald-500';

            if (isChecked) {
              if (isCorrect) {
                style = 'bg-emerald-800 border-emerald-400 ring-2 ring-emerald-400 text-white';
              } else if (isSelected && !isCorrect) {
                style = 'bg-red-950 border-red-500 ring-2 ring-red-500 text-white';
              } else {
                style = 'bg-emerald-950/40 border-emerald-800 opacity-60';
              }
            } else if (isSelected) {
              style = 'bg-emerald-800 border-amber-400 ring-2 ring-amber-400 shadow-md';
            }

            return (
              <div
                key={opt.es}
                onClick={() => handleSelect(opt.es)}
                className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2 cursor-pointer transition-all ${style}`}
              >
                <div className="text-center font-bold text-base text-white">
                  {opt.es}
                </div>
                <div className="pt-2 border-t border-emerald-800/60">
                  <ClickableText
                    es={opt.es}
                    hy={opt.hy}
                    block={true}
                    onSelect={() => handleSelect(opt.es)}
                    textClassName="text-xs text-center text-emerald-200"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action / Next */}
        {!isChecked ? (
          <div>
            <button
              onClick={handleCheck}
              disabled={!selectedWord}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                selectedWord
                  ? 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
                  : 'bg-emerald-900/50 text-emerald-700 cursor-not-allowed'
              }`}
            >
              Comprobar palabra
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2 animate-in fade-in">
            <div
              className={`p-4 rounded-xl border ${
                isCurrentCorrect
                  ? 'bg-emerald-900/70 border-emerald-500'
                  : 'bg-red-950/60 border-red-500'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {isCurrentCorrect ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span className="text-emerald-300">¡Correcto!</span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="text-red-400" />
                    <span className="text-red-300">
                      Respuesta correcta: {currentItem.correctAnswer}
                    </span>
                  </>
                )}
              </div>
              <ClickableText
                es={currentItem.explanationEs}
                hy={currentItem.explanationHy}
                block={true}
                textClassName="text-xs text-slate-100"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md cursor-pointer"
              >
                <span>
                  {currentIndex < items.length - 1 ? 'Siguiente frase' : 'Ver resultado'}
                </span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
