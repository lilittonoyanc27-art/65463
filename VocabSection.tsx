import React, { useState, useMemo } from 'react';
import { VocabWord } from './types.ts';
import { ClickableText } from './ClickableText.tsx';
import {
  BookOpen,
  Search,
  Sparkles,
  Gamepad2,
  CheckCircle2,
  RotateCcw,
  Volume2,
} from 'lucide-react';

interface VocabSectionProps {
  vocabulary: VocabWord[];
  onMatchedAll?: () => void;
}

export const VocabSection: React.FC<VocabSectionProps> = ({
  vocabulary,
  onMatchedAll,
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'match'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');

  // Mini-game states
  const [selectedSpanish, setSelectedSpanish] = useState<string | null>(null);
  const [selectedArmenian, setSelectedArmenian] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // array of IDs
  const [wrongPair, setWrongPair] = useState<boolean>(false);

  // Take 6 random or first 6 words for a quick match game round
  const [gameRoundWords, setGameRoundWords] = useState<VocabWord[]>(() =>
    vocabulary.slice(0, 6)
  );

  // Shuffle Armenian items for matching
  const shuffledArmenian = useMemo(() => {
    return [...gameRoundWords].sort(() => Math.random() - 0.5);
  }, [gameRoundWords]);

  const handlePickSpanish = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedSpanish(id);
    setWrongPair(false);

    if (selectedArmenian) {
      checkMatch(id, selectedArmenian);
    }
  };

  const handlePickArmenian = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedArmenian(id);
    setWrongPair(false);

    if (selectedSpanish) {
      checkMatch(selectedSpanish, id);
    }
  };

  const checkMatch = (esId: string, hyId: string) => {
    if (esId === hyId) {
      const nextMatched = [...matchedPairs, esId];
      setMatchedPairs(nextMatched);
      setSelectedSpanish(null);
      setSelectedArmenian(null);
      if (nextMatched.length === gameRoundWords.length && onMatchedAll) {
        onMatchedAll();
      }
    } else {
      setWrongPair(true);
      setTimeout(() => {
        setSelectedSpanish(null);
        setSelectedArmenian(null);
        setWrongPair(false);
      }, 700);
    }
  };

  const restartMatchGame = () => {
    const nextOffset = (Math.random() * (vocabulary.length - 6)) | 0;
    setGameRoundWords(vocabulary.slice(nextOffset, nextOffset + 6));
    setMatchedPairs([]);
    setSelectedSpanish(null);
    setSelectedArmenian(null);
    setWrongPair(false);
  };

  const filtered = vocabulary.filter((w) => {
    const matchesSearch =
      w.es.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.hy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCat === 'all' || w.category === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-green-900/90 border border-emerald-600/60 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-emerald-950 uppercase tracking-wider">
                9. Vocabulario del fútbol
              </span>
              <span className="text-xs text-emerald-200">
                20 palabras clave de la entrevista
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Diccionario interactivo y juego de emparejar
            </h2>
            <p className="text-xs text-emerald-200 mt-1">
              Por defecto ves únicamente el español. Haz clic en cualquier término o frase para descubrir la traducción en armenio.
            </p>
          </div>

          {/* Toggle View Tabs */}
          <div className="flex items-center gap-2 bg-emerald-950/80 p-1 rounded-xl border border-emerald-700/80 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-amber-400 text-emerald-950 shadow'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <BookOpen size={14} />
              <span>Diccionario</span>
            </button>
            <button
              onClick={() => setActiveTab('match')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'match'
                  ? 'bg-amber-400 text-emerald-950 shadow'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Gamepad2 size={14} />
              <span>Juego de emparejar</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'cards' ? (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400"
              />
              <input
                type="text"
                placeholder="Buscar palabra en español o armenio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-emerald-950/80 border border-emerald-700 rounded-xl text-xs sm:text-sm text-white placeholder-emerald-400/60 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'persona', label: 'Personas' },
                { id: 'accion', label: 'Acciones' },
                { id: 'emocion', label: 'Emociones' },
                { id: 'competicion', label: 'Competición' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilterCat(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    filterCat === c.id
                      ? 'bg-emerald-700 text-white border border-amber-400/60'
                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((w) => (
              <div
                key={w.id}
                className="p-4 sm:p-5 rounded-2xl bg-emerald-950/70 border border-emerald-700/70 hover:border-amber-400/80 hover:bg-emerald-900/50 transition-all shadow-md flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900 border border-emerald-700 text-amber-300">
                      {w.category}
                    </span>
                    <span className="text-[11px] text-emerald-400">
                      Toca para traducir
                    </span>
                  </div>

                  {/* Word with Armenian popover */}
                  <div className="text-lg font-bold text-white mb-2">
                    <ClickableText
                      es={w.es}
                      hy={w.hy}
                      block={true}
                      textClassName="text-white hover:text-amber-200"
                    />
                  </div>

                  {/* Example sentence with translation */}
                  <div className="pt-2 border-t border-emerald-800/60 text-xs">
                    <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                      Ejemplo en contexto futbolístico:
                    </span>
                    <ClickableText
                      es={w.exampleEs}
                      hy={w.exampleHy}
                      block={true}
                      textClassName="text-slate-200 italic"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Matching Mini-game */
        <div className="max-w-3xl mx-auto p-6 sm:p-7 rounded-2xl bg-emerald-950/90 border border-emerald-700 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                Mini-juego de asociación
              </span>
              <h3 className="text-lg font-bold text-white">
                Empareja cada palabra en español con su traducción en armenio
              </h3>
            </div>
            <button
              onClick={restartMatchGame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-emerald-700 text-xs font-bold cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Nuevas palabras</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-800 text-xs text-emerald-200">
            Paso 1: Haz clic en una tarjeta de la columna izquierda (Español).
            <br />
            Paso 2: Haz clic en la traducción correspondiente de la columna derecha (<span className="font-['Noto_Sans_Armenian',sans-serif] font-bold text-amber-300">Հայերեն</span>).
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left Column: Spanish */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-emerald-300 block mb-1">
                🇪🇸 Español
              </span>
              {gameRoundWords.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = selectedSpanish === item.id;
                return (
                  <button
                    key={`es-${item.id}`}
                    onClick={() => handlePickSpanish(item.id)}
                    disabled={isMatched}
                    className={`w-full p-3 rounded-xl text-left font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                      isMatched
                        ? 'bg-emerald-900/20 text-emerald-700 border-emerald-900 line-through opacity-40 cursor-default'
                        : isSelected
                        ? wrongPair
                          ? 'bg-red-950 border-red-500 text-white'
                          : 'bg-amber-400 text-emerald-950 border-amber-300 ring-2 ring-amber-300'
                        : 'bg-emerald-900/60 hover:bg-emerald-800/80 border-emerald-700 text-white'
                    }`}
                  >
                    <span>{item.es}</span>
                    {isMatched && (
                      <CheckCircle2 size={14} className="inline ml-2 text-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Armenian */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-amber-300 block mb-1 font-['Noto_Sans_Armenian']">
                🇦🇲 Հայերեն
              </span>
              {shuffledArmenian.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = selectedArmenian === item.id;
                return (
                  <button
                    key={`hy-${item.id}`}
                    onClick={() => handlePickArmenian(item.id)}
                    disabled={isMatched}
                    className={`w-full p-3 rounded-xl text-left font-semibold text-xs sm:text-sm border font-['Noto_Sans_Armenian'] transition-all cursor-pointer ${
                      isMatched
                        ? 'bg-emerald-900/20 text-emerald-700 border-emerald-900 line-through opacity-40 cursor-default'
                        : isSelected
                        ? wrongPair
                          ? 'bg-red-950 border-red-500 text-white'
                          : 'bg-amber-400 text-emerald-950 border-amber-300 ring-2 ring-amber-300'
                        : 'bg-emerald-900/60 hover:bg-emerald-800/80 border-emerald-700 text-white'
                    }`}
                  >
                    <span>{item.hy}</span>
                    {isMatched && (
                      <CheckCircle2 size={14} className="inline ml-2 text-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {matchedPairs.length === gameRoundWords.length && (
            <div className="p-4 rounded-2xl bg-emerald-900/80 border border-emerald-400 text-center animate-in zoom-in-95">
              <span className="text-3xl">🎉</span>
              <h4 className="text-base font-bold text-white mt-1">
                ¡Felicidades! Has emparejado todos los términos.
              </h4>
              <p className="text-xs text-emerald-200 mt-1">
                Puedes jugar otra ronda con nuevas palabras del vocabulario.
              </p>
              <button
                onClick={restartMatchGame}
                className="mt-3 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md cursor-pointer"
              >
                Jugar otra ronda
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
