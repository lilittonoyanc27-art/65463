import React, { useState } from 'react';
import { GrammarRule } from './types.ts';
import { ClickableText } from './ClickableText.tsx';
import {
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';

interface GrammarSectionProps {
  rules: GrammarRule[];
}

export const GrammarSection: React.FC<GrammarSectionProps> = ({ rules }) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(rules.map((r) => r.id));

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-green-900/90 border border-emerald-600/60 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-emerald-950 uppercase tracking-wider">
                10. Gramática del vídeo
              </span>
              <span className="text-xs text-emerald-200">Nivel A2–B1</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Estructuras gramaticales y habla natural
            </h2>
            <p className="text-xs text-emerald-200 mt-1">
              Explicaciones claras en español. Haz clic en cualquier regla, explicación o frase para ver su traducción al armenio.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpandedIds(rules.map((r) => r.id))}
              className="text-xs text-emerald-300 hover:text-white underline cursor-pointer"
            >
              Expandir todo
            </button>
            <span className="text-emerald-700">•</span>
            <button
              onClick={() => setExpandedIds([])}
              className="text-xs text-emerald-300 hover:text-white underline cursor-pointer"
            >
              Colapsar
            </button>
          </div>
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-4">
        {rules.map((rule) => {
          const isExpanded = expandedIds.includes(rule.id);
          const isNaturalSpeech = rule.id === 'forma_natural';

          return (
            <div
              key={rule.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isNaturalSpeech
                  ? 'bg-gradient-to-br from-amber-500/10 via-emerald-950/80 to-emerald-950/90 border-amber-400/60 shadow-lg'
                  : 'bg-emerald-950/80 border-emerald-700/80 shadow-md'
              }`}
            >
              {/* Card Header Accordion Toggle */}
              <div
                onClick={() => toggleExpand(rule.id)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-emerald-900/40 select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isNaturalSpeech
                        ? 'bg-amber-400 text-emerald-950 shadow-md'
                        : 'bg-emerald-800 text-amber-300 border border-emerald-600'
                    }`}
                  >
                    {isNaturalSpeech ? <Sparkles size={18} /> : <GraduationCap size={18} />}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <ClickableText
                        es={rule.titleEs}
                        hy={rule.titleHy}
                        inline={true}
                        textClassName="text-white hover:text-amber-200 font-bold"
                      />
                    </h3>
                  </div>
                </div>

                <div className="text-emerald-400 p-1">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-5 pt-1 space-y-4 border-t border-emerald-800/60 animate-in fade-in">
                  {/* Explanation with Armenian toggle */}
                  <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-700/60">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                      Explicación teórica (haz clic para traducir):
                    </span>
                    <ClickableText
                      es={rule.explanationEs}
                      hy={rule.explanationHy}
                      block={true}
                      textClassName="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed"
                    />
                  </div>

                  {/* Examples */}
                  <div>
                    <span className="text-xs font-bold text-emerald-300 block mb-2">
                      Ejemplos ilustrativos:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rule.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-emerald-900/50 border border-emerald-700/80 hover:border-amber-400/60 transition-colors"
                        >
                          <div className="text-sm font-bold text-white">
                            <ClickableText
                              es={ex.es}
                              hy={ex.hy}
                              block={true}
                              textClassName="text-white hover:text-amber-200"
                            />
                          </div>

                          {ex.noteEs && ex.noteHy && (
                            <div className="mt-2 pt-2 border-t border-emerald-800/60 text-[11px]">
                              <span className="text-amber-300 font-semibold block mb-0.5">
                                Nota lingüística:
                              </span>
                              <ClickableText
                                es={ex.noteEs}
                                hy={ex.noteHy}
                                block={true}
                                textClassName="text-slate-200"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
