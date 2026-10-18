import React, { useState } from 'react';
import { WordOrderItem } from './types.ts';
import { ClickableText } from './ClickableText.tsx';
import { checkWordOrder } from './pureLogic.ts';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface WordOrderSectionProps {
  items: WordOrderItem[];
  onUpdateScore: (score: number, total: number) => void;
}

export const WordOrderSection: React.FC<WordOrderSectionProps> = ({
  items,
  onUpdateScore,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = items[currentIndex];

  // Track words selected in order by the user
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  // Track remaining word pool (indices)
  const [availableWordIndices, setAvailableWordIndices] = useState<number[]>(() =>
    currentItem.scrambledWords.map((_, i) => i)
  );
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completedScores, setCompletedScores] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  // When switching questions, reset active word slots
  const loadQuestion = (index: number) => {
    setCurrentIndex(index);
    setSelectedWords([]);
    setAvailableWordIndices(items[index].scrambledWords.map((_, i) => i));
    setIsChecked(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  const handlePickWord = (wordIndex: number) => {
    if (isChecked) return;
    const word = currentItem.scrambledWords[wordIndex];
    setSelectedWords((prev) => [...prev, word]);
    setAvailableWordIndices((prev) => prev.filter((i) => i !== wordIndex));
  };

  const handleRemoveWord = (positionInSelected: number) => {
    if (isChecked) return;
    const removedWord = selectedWords[positionInSelected];
    setSelectedWords((prev) => prev.filter((_, idx) => idx !== positionInSelected));

    // Find first matching word index in scrambledWords that is not in availableWordIndices
    const origIndex = currentItem.scrambledWords.findIndex(
      (w, idx) => w === removedWord && !availableWordIndices.includes(idx)
    );
    if (origIndex !== -1) {
      setAvailableWordIndices((prev) => [...prev, origIndex]);
    }
  };

  const handleCheck = () => {
    const passed = checkWordOrder(selectedWords, currentItem.correctWords);
    setIsCorrect(passed);
    setIsChecked(true);

    const newScores = { ...completedScores, [currentItem.id]: passed };
    setCompletedScores(newScores);

    const score = items.reduce((acc, it) => (newScores[it.id] ? acc + 1 : acc), 0);
    onUpdateScore(score, items.length);
  };

  const handleClearCurrent = () => {
    setSelectedWords([]);
    setAvailableWordIndices(currentItem.scrambledWords.map((_, i) => i));
    setIsChecked(false);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      loadQuestion(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleResetAll = () => {
    setCompletedScores({});
    setIsFinished(false);
    loadQuestion(0);
    onUpdateScore(0, items.length);
  };

  const totalPassed = items.reduce(
    (acc, it) => (completedScores[it.id] ? acc + 1 : acc),
    0
  );

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 border border-emerald-600 rounded-3xl text-center space-y-6 shadow-2xl animate-in zoom-in-95">
        <div className="text-5xl">🧩</div>
        <h2 className="text-2xl font-bold text-white">¡Juego 3 completado!</h2>
        <p className="text-emerald-200 text-sm">
          Has ordenado las 8 frases futbolísticas del Real Madrid.
        </p>
        <div className="p-4 rounded-xl bg-emerald-900/60 border border-emerald-700 inline-block min-w-[220px]">
          <span className="text-4xl font-extrabold text-amber-300 font-mono">
            {totalPassed} / {items.length}
          </span>
          <span className="block text-xs text-emerald-300 mt-1">Frases correctas</span>
        </div>
        <div>
          <button
            onClick={handleResetAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs cursor-pointer shadow-lg"
          >
            <RotateCcw size={14} />
            <span>Jugar otra vez</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-green-900/90 border border-emerald-600/60 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-emerald-950 uppercase tracking-wider">
                Juego 3: Ordena las palabras
              </span>
              <span className="text-xs text-emerald-200">8 ejercicios</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Ejercicio {currentIndex + 1} de {items.length}
            </h2>
          </div>

          <span className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs font-bold text-amber-300 font-mono self-start sm:self-auto">
            Aciertos: {totalPassed} / {items.length}
          </span>
        </div>

        <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden border border-emerald-700/60">
          <div
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
          />
        </div>
        <p className="mt-2.5 text-xs text-emerald-200">
          Toca cada palabra para construir la frase en el orden correcto. Haz clic en la traducción para verla en armenio.
        </p>
      </div>

      {/* Main Assembly Box */}
      <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        {/* Assembly Area (Where selected words appear) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-300">
              Tu frase construida (haz clic en una palabra para quitarla):
            </span>
            {selectedWords.length > 0 && !isChecked && (
              <button
                onClick={handleClearCurrent}
                className="text-[11px] text-emerald-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Vaciar</span>
              </button>
            )}
          </div>

          <div
            className={`min-h-[70px] p-4 rounded-2xl border-2 flex flex-wrap items-center gap-2 transition-all ${
              isChecked
                ? isCorrect
                  ? 'bg-emerald-900/60 border-emerald-400'
                  : 'bg-red-950/50 border-red-500'
                : selectedWords.length > 0
                ? 'bg-emerald-900/40 border-amber-400/80 shadow-inner'
                : 'bg-emerald-950 border-dashed border-emerald-700/80'
            }`}
          >
            {selectedWords.length === 0 ? (
              <span className="text-xs text-emerald-500 italic">
                Selecciona las fichas de abajo para colocarlas aquí...
              </span>
            ) : (
              selectedWords.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  onClick={() => handleRemoveWord(idx)}
                  disabled={isChecked}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-emerald-950 font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  title="Haz clic para quitar"
                >
                  {word}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Word Pool (Available words) */}
        <div>
          <span className="text-xs font-bold text-emerald-300 block mb-2">
            Palabras disponibles:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {currentItem.scrambledWords.map((word, idx) => {
              const isUsed = !availableWordIndices.includes(idx);
              return (
                <button
                  key={`word-pool-${idx}`}
                  onClick={() => handlePickWord(idx)}
                  disabled={isUsed || isChecked}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isUsed
                      ? 'bg-emerald-950/50 text-emerald-800 border border-emerald-900 cursor-not-allowed opacity-30 scale-95'
                      : 'bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 hover:text-white border border-emerald-600 shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>

        {/* Target sentence hint / translation toggle */}
        <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle size={14} />
            <span>{showHint ? 'Ocultar pista' : 'Ver pista gramatical'}</span>
          </button>

          <div className="text-xs">
            <span className="text-emerald-400 mr-1.5">Significado:</span>
            <ClickableText
              es="Ver traducción de la frase completa"
              hy={currentItem.fullSentenceHy}
              inline={true}
              textClassName="text-emerald-200 hover:text-amber-200 text-xs"
            />
          </div>
        </div>

        {showHint && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/40 text-xs text-amber-200 animate-in fade-in">
            <span className="font-bold text-amber-300 block mb-0.5">Pista:</span>
            <ClickableText
              es={currentItem.hintEs}
              hy={currentItem.hintHy}
              block={true}
              textClassName="text-amber-100"
            />
          </div>
        )}

        {/* Action Controls */}
        {!isChecked ? (
          <div>
            <button
              onClick={handleCheck}
              disabled={selectedWords.length !== currentItem.correctWords.length}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                selectedWords.length === currentItem.correctWords.length
                  ? 'bg-amber-400 hover:bg-amber-300 text-emerald-950 active:scale-98'
                  : 'bg-emerald-900/50 text-emerald-700 cursor-not-allowed'
              }`}
            >
              Comprobar orden
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2 animate-in fade-in">
            <div
              className={`p-4 rounded-xl border ${
                isCorrect ? 'bg-emerald-900/70 border-emerald-500' : 'bg-red-950/60 border-red-500'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
                {isCorrect ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span className="text-emerald-300">¡Excelente! Orden perfecto.</span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="text-red-400" />
                    <span className="text-red-300">
                      Orden incorrecto. La frase correcta es:
                    </span>
                  </>
                )}
              </div>

              <div className="text-sm font-bold text-white mt-1">
                {currentItem.fullSentenceEs}
              </div>

              <div className="mt-2 text-xs">
                <span className="text-amber-300 font-semibold block mb-0.5">
                  Traducción (haz clic):
                </span>
                <ClickableText
                  es={currentItem.fullSentenceEs}
                  hy={currentItem.fullSentenceHy}
                  block={true}
                  textClassName="text-slate-100"
                />
              </div>
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
