import React, { useState } from 'react';
import { InterviewItem } from './types.ts';
import { ClickableText } from './ClickableText.tsx';
import {
  Mic,
  MessageSquare,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Radio,
} from 'lucide-react';

interface InterviewSectionProps {
  items: InterviewItem[];
  onUpdateScore: (score: number, total: number) => void;
}

export const InterviewSection: React.FC<InterviewSectionProps> = ({
  items,
  onUpdateScore,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = items[currentIndex];

  const handleSelect = (optId: string) => {
    if (isChecked) return;
    setSelectedOptId(optId);
  };

  const handleCheck = () => {
    if (!selectedOptId) return;
    const newAnswers = { ...answers, [currentItem.id]: selectedOptId };
    setAnswers(newAnswers);
    setIsChecked(true);

    const score = items.reduce((acc, it) => {
      const chosen = it.options.find((o) => o.id === newAnswers[it.id]);
      return chosen?.isAppropriate ? acc + 1 : acc;
    }, 0);
    onUpdateScore(score, items.length);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptId(answers[items[currentIndex + 1]?.id] || null);
      setIsChecked(!!answers[items[currentIndex + 1]?.id]);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOptId(null);
    setIsChecked(false);
    setAnswers({});
    setIsFinished(false);
    onUpdateScore(0, items.length);
  };

  const totalScore = items.reduce((acc, it) => {
    const chosen = it.options.find((o) => o.id === answers[it.id]);
    return chosen?.isAppropriate ? acc + 1 : acc;
  }, 0);

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 border border-emerald-600 rounded-3xl text-center space-y-6 shadow-2xl animate-in zoom-in-95">
        <div className="text-5xl">🎤</div>
        <h2 className="text-2xl font-bold text-white">¡Rueda de Prensa Finalizada!</h2>
        <p className="text-emerald-200 text-sm">
          Has completado las 10 preguntas de los periodistas en la sala de prensa del Real Madrid.
        </p>
        <div className="p-4 rounded-xl bg-emerald-900/60 border border-emerald-700 inline-block min-w-[220px]">
          <span className="text-4xl font-extrabold text-amber-300 font-mono">
            {totalScore} / {items.length}
          </span>
          <span className="block text-xs text-emerald-300 mt-1">
            Respuestas profesionales acertadas
          </span>
        </div>
        <div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs cursor-pointer shadow-lg"
          >
            <RotateCcw size={14} />
            <span>Repetir la entrevista</span>
          </button>
        </div>
      </div>
    );
  }

  const selectedOpt = currentItem.options.find((o) => o.id === selectedOptId);
  const isCurrentCorrect = selectedOpt?.isAppropriate || false;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-green-900/90 border border-emerald-600/60 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-emerald-950 uppercase tracking-wider">
                Juego 4: Entrevista al futbolista
              </span>
              <span className="text-xs text-emerald-200">Sala de prensa Bernabéu</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Pregunta de prensa {currentIndex + 1} de {items.length}
            </h2>
          </div>

          <span className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs font-bold text-amber-300 font-mono self-start sm:self-auto">
            Aciertos: {totalScore} / {items.length}
          </span>
        </div>

        <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden border border-emerald-700/60">
          <div
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
          />
        </div>
        <p className="mt-2.5 text-xs text-emerald-200">
          Actúa como el jugador del Real Madrid. Haz clic en cada pregunta y respuesta para ver la traducción al armenio.
        </p>
      </div>

      {/* Journalist Question Box */}
      <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-900/60 to-emerald-950/80 border border-emerald-600/60 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-md">
            <Mic size={20} />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block mb-1">
              Periodista acreditado:
            </span>
            <div className="text-base sm:text-lg font-bold text-white">
              <ClickableText
                es={currentItem.journalistQuestionEs}
                hy={currentItem.journalistQuestionHy}
                block={true}
                textClassName="text-white hover:text-amber-200"
              />
            </div>
          </div>
        </div>

        {/* Player Options */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-emerald-300 block">
            Elige tu respuesta como futbolista profesional:
          </span>

          {currentItem.options.map((opt) => {
            const isSelected = selectedOptId === opt.id;
            let cardStyle =
              'bg-emerald-900/40 border-emerald-700 hover:bg-emerald-800/50 hover:border-emerald-500';

            if (isChecked) {
              if (opt.isAppropriate) {
                cardStyle = 'bg-emerald-800 border-emerald-400 ring-2 ring-emerald-400 text-white';
              } else if (isSelected && !opt.isAppropriate) {
                cardStyle = 'bg-red-950 border-red-500 ring-2 ring-red-500 text-white';
              } else {
                cardStyle = 'bg-emerald-950/40 border-emerald-800 opacity-60';
              }
            } else if (isSelected) {
              cardStyle = 'bg-emerald-800 border-amber-400 ring-2 ring-amber-400 shadow-md';
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${cardStyle}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
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
                    onSelect={() => handleSelect(opt.id)}
                    textClassName="text-sm sm:text-base font-semibold"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Check Button / Feedback */}
        {!isChecked ? (
          <div>
            <button
              onClick={handleCheck}
              disabled={!selectedOptId}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                selectedOptId
                  ? 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
                  : 'bg-emerald-900/50 text-emerald-700 cursor-not-allowed'
              }`}
            >
              Responder a la prensa
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
                    <span className="text-emerald-300">
                      ¡Excelente respuesta profesional!
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="text-red-400" />
                    <span className="text-red-300">
                      Respuesta no adecuada para el Real Madrid.
                    </span>
                  </>
                )}
              </div>

              {selectedOpt && (
                <div className="text-xs text-slate-100">
                  <span className="font-semibold text-amber-300 block mb-0.5">
                    Comentario de prensa (haz clic para traducir):
                  </span>
                  <ClickableText
                    es={selectedOpt.feedbackEs}
                    hy={selectedOpt.feedbackHy}
                    block={true}
                    textClassName="text-slate-100 font-medium"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md cursor-pointer"
              >
                <span>
                  {currentIndex < items.length - 1 ? 'Siguiente pregunta' : 'Ver resultado'}
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
