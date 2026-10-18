import React, { useState } from 'react';
import { TrueFalseItem } from './types.ts';
import { ClickableText } from './ClickableText.tsx';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';
import { formatTime } from './pureLogic.ts';

interface TrueFalseSectionProps {
  items: TrueFalseItem[];
  onPlayTimestamp: (seconds: number) => void;
  onUpdateScore: (score: number, total: number) => void;
}

export const TrueFalseSection: React.FC<TrueFalseSectionProps> = ({
  items,
  onPlayTimestamp,
  onUpdateScore,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentItem = items[currentIndex];

  const handleSelect = (choice: boolean) => {
    if (isChecked) return;
    setUserChoice(choice);
  };

  const handleCheck = () => {
    if (userChoice === null) return;
    const newAnswers = { ...answers, [currentItem.id]: userChoice };
    setAnswers(newAnswers);
    setIsChecked(true);

    const score = items.reduce(
      (acc, it) => (newAnswers[it.id] === it.isTrue ? acc + 1 : acc),
      0
    );
    onUpdateScore(score, items.length);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserChoice(answers[items[currentIndex + 1]?.id] ?? null);
      setIsChecked(answers[items[currentIndex + 1]?.id] !== undefined);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setUserChoice(null);
    setIsChecked(false);
    setAnswers({});
    setIsCompleted(false);
    onUpdateScore(0, items.length);
  };

  const score = items.reduce(
    (acc, it) => (answers[it.id] === it.isTrue ? acc + 1 : acc),
    0
  );

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 border border-emerald-600 rounded-3xl text-center space-y-6 shadow-2xl animate-in zoom-in-95">
        <div className="text-5xl">✅</div>
        <h2 className="text-2xl font-bold text-white">¡Juego 2 completado!</h2>
        <p className="text-emerald-200 text-sm">
          Has verificado todas las afirmaciones sobre la entrevista.
        </p>
        <div className="p-4 rounded-xl bg-emerald-900/60 border border-emerald-700 inline-block min-w-[220px]">
          <span className="text-4xl font-extrabold text-amber-300 font-mono">
            {score} / {items.length}
          </span>
          <span className="block text-xs text-emerald-300 mt-1">Afirmaciones acertadas</span>
        </div>
        <div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs cursor-pointer shadow-lg"
          >
            <RotateCcw size={14} />
            <span>Repetir juego</span>
          </button>
        </div>
      </div>
    );
  }

  const isCurrentCorrect = userChoice === currentItem.isTrue;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-green-900/90 border border-emerald-600/60 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-emerald-950 uppercase tracking-wider">
                Juego 2: Verdadero o Falso
              </span>
              <span className="text-xs text-emerald-200">10 afirmaciones</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Afirmación {currentIndex + 1} de {items.length}
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
          💡 Haz clic en la afirmación en español para ver la traducción al armenio.
        </p>
      </div>

      {/* Statement Card */}
      <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="p-5 rounded-2xl bg-emerald-900/40 border border-emerald-700/70">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block mb-2">
            Afirmación a evaluar:
          </span>
          <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
            <ClickableText
              es={currentItem.statementEs}
              hy={currentItem.statementHy}
              block={true}
              textClassName="text-white hover:text-amber-200"
            />
          </div>
        </div>

        {/* Choice Buttons: Verdadero / Falso */}
        <div className="grid grid-cols-2 gap-4">
          {/* Verdadero */}
          <button
            onClick={() => handleSelect(true)}
            className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-base transition-all cursor-pointer ${
              userChoice === true
                ? 'bg-emerald-700 border-amber-400 ring-2 ring-amber-400 text-white shadow-lg'
                : 'bg-emerald-900/40 border-emerald-700 text-emerald-200 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <Check size={18} className="text-emerald-400" />
            <span>Verdadero</span>
          </button>

          {/* Falso */}
          <button
            onClick={() => handleSelect(false)}
            className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-base transition-all cursor-pointer ${
              userChoice === false
                ? 'bg-emerald-700 border-amber-400 ring-2 ring-amber-400 text-white shadow-lg'
                : 'bg-emerald-900/40 border-emerald-700 text-emerald-200 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <X size={18} className="text-red-400" />
            <span>Falso</span>
          </button>
        </div>

        {/* Check button / Feedback */}
        {!isChecked ? (
          <div>
            <button
              onClick={handleCheck}
              disabled={userChoice === null}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                userChoice !== null
                  ? 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
                  : 'bg-emerald-900/50 text-emerald-700 cursor-not-allowed'
              }`}
            >
              Comprobar respuesta
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
              <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
                {isCurrentCorrect ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span className="text-emerald-300">¡Correcto!</span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="text-red-400" />
                    <span className="text-red-300">
                      Incorrecto. Era {currentItem.isTrue ? 'Verdadero' : 'Falso'}.
                    </span>
                  </>
                )}
              </div>

              <div className="text-xs text-slate-100">
                <span className="font-semibold text-amber-300 block mb-1">
                  Explicación (haz clic para traducir):
                </span>
                <ClickableText
                  es={currentItem.explanationEs}
                  hy={currentItem.explanationHy}
                  block={true}
                  textClassName="text-slate-100 font-medium"
                />
              </div>

              {currentItem.videoTimestamp !== undefined && (
                <div className="mt-3">
                  <button
                    onClick={() => onPlayTimestamp(currentItem.videoTimestamp!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-lg text-xs cursor-pointer shadow-sm transition-transform active:scale-95"
                  >
                    <Volume2 size={13} />
                    <span>Escuchar en el vídeo ({formatTime(currentItem.videoTimestamp)})</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md cursor-pointer"
              >
                <span>
                  {currentIndex < items.length - 1 ? 'Siguiente afirmación' : 'Ver resultado'}
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
