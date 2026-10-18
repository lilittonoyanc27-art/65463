import React, { useState } from 'react';
import { SubtitleItem } from './types.ts';
import { ClickableText } from './ClickableText.tsx';
import { Play, Sparkles, Volume2, BookOpen, CheckCircle, Search } from 'lucide-react';
import { formatTime } from './pureLogic.ts';

interface SubtitlesViewProps {
  subtitles: SubtitleItem[];
  onPlayTimestamp: (time: number) => void;
}

export const SubtitlesView: React.FC<SubtitlesViewProps> = ({
  subtitles,
  onPlayTimestamp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewedIds, setReviewedIds] = useState<number[]>([]);

  const toggleReviewed = (id: number) => {
    setReviewedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filtered = subtitles.filter(
    (s) =>
      s.es.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.hy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-green-900/90 border border-emerald-600/60 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-emerald-950 uppercase tracking-wider">
                2. Subtítulos interactivos
              </span>
              <span className="text-xs text-emerald-200">
                Transcripción fiel del audio original
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Guion oficial de la entrevista (A2–B1)
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-emerald-200">
              Estudia cada réplica de la entrevista. Por defecto solo se muestra el español. Haz clic en cualquier frase para descubrir la traducción al armenio.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs font-bold text-amber-300">
              Repasadas: {reviewedIds.length} / {subtitles.length}
            </span>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-4 relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
          <input
            type="text"
            placeholder="Buscar palabras en el guion (ej. 'experiencia', 'Mourinho')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-emerald-950/90 border border-emerald-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-emerald-400/70 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Subtitles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((sub) => {
          const isReviewed = reviewedIds.includes(sub.id);
          return (
            <div
              key={sub.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isReviewed
                  ? 'bg-emerald-900/30 border-emerald-700/60 shadow-md'
                  : 'bg-emerald-900/50 border-emerald-600/60 hover:border-amber-400/80 shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPlayTimestamp(sub.start)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-mono text-xs font-bold shadow cursor-pointer transition-transform active:scale-95"
                      title="Escuchar este fragmento en el vídeo"
                    >
                      <Play size={11} fill="currentColor" />
                      <span>{formatTime(sub.start)}</span>
                    </button>
                    <span className="text-xs text-emerald-300 font-medium">
                      Frase #{sub.id}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleReviewed(sub.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      isReviewed
                        ? 'bg-emerald-800 text-emerald-200'
                        : 'bg-emerald-950/70 text-slate-300 hover:text-white border border-emerald-700'
                    }`}
                  >
                    <CheckCircle
                      size={13}
                      className={isReviewed ? 'text-amber-400' : 'text-emerald-500'}
                    />
                    <span>{isReviewed ? 'Repasada' : 'Marcar como repasada'}</span>
                  </button>
                </div>

                {/* Spanish Subtitle with Clickable Armenian Reveal */}
                <div className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  <ClickableText
                    es={sub.es}
                    hy={sub.hy}
                    block={true}
                    textClassName="text-white hover:text-amber-200"
                  />
                </div>

                {/* Natural Speech Note */}
                {sub.naturalForm && (
                  <div className="mt-4 p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                      <Sparkles size={13} />
                      <span>Forma más natural en español:</span>
                    </div>
                    <div className="text-slate-200">
                      <span className="line-through text-red-300 mr-2">
                        {sub.naturalForm.original}
                      </span>
                      <span className="font-bold text-emerald-300">
                        → {sub.naturalForm.suggested}
                      </span>
                    </div>
                    <ClickableText
                      es={sub.naturalForm.explanationEs}
                      hy={sub.naturalForm.explanationHy}
                      className="mt-1"
                      textClassName="text-[11px] text-emerald-200"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-400">
                <span>Duración: ~{sub.end - sub.start} segundos</span>
                <button
                  onClick={() => onPlayTimestamp(sub.start)}
                  className="hover:text-amber-300 flex items-center gap-1"
                >
                  <Volume2 size={13} />
                  <span>Escuchar en el reproductor</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
