import React from 'react';
import {
  Video,
  FileText,
  BrainCircuit,
  PenTool,
  CheckCircle2,
  Sparkles,
  Mic,
  Headphones,
  BookOpen,
  Award,
  GraduationCap,
  Volume2,
  VolumeX,
  Type,
} from 'lucide-react';
import { UserStats } from './types.ts';

export type TabKey =
  | 'video'
  | 'subtitles'
  | 'quiz'
  | 'fill'
  | 'truefalse'
  | 'wordorder'
  | 'interview'
  | 'listening'
  | 'vocab'
  | 'grammar'
  | 'scoreboard';

interface NavbarProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  stats: UserStats;
  isMuted: boolean;
  onToggleMute: () => void;
  fontSize: 'md' | 'lg' | 'xl';
  onToggleFontSize: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  isMuted,
  onToggleMute,
  fontSize,
  onToggleFontSize,
}) => {
  const tabs = [
    { id: 'video' as TabKey, label: '1. Ver el vídeo', icon: Video },
    { id: 'subtitles' as TabKey, label: '2. Subtítulos', icon: FileText },
    { id: 'quiz' as TabKey, label: '3. Quiz (15)', icon: BrainCircuit, badge: `${stats.quizScore}/${stats.quizTotal}` },
    { id: 'fill' as TabKey, label: '4. Completa la frase', icon: PenTool, badge: `${stats.fillScore}/${stats.fillTotal}` },
    { id: 'truefalse' as TabKey, label: '5. Verdadero o falso', icon: CheckCircle2, badge: `${stats.tfScore}/${stats.tfTotal}` },
    { id: 'wordorder' as TabKey, label: '6. Ordena palabras', icon: Sparkles, badge: `${stats.orderScore}/${stats.orderTotal}` },
    { id: 'interview' as TabKey, label: '7. Entrevista', icon: Mic, badge: `${stats.interviewScore}/${stats.interviewTotal}` },
    { id: 'listening' as TabKey, label: '8. Escucha y responde', icon: Headphones, badge: `${stats.listeningScore}/${stats.listeningTotal}` },
    { id: 'vocab' as TabKey, label: '9. Vocabulario', icon: BookOpen },
    { id: 'grammar' as TabKey, label: '10. Gramática', icon: GraduationCap },
    { id: 'scoreboard' as TabKey, label: '11. Resultado final', icon: Award },
  ];

  const totalPoints =
    stats.quizScore +
    stats.fillScore +
    stats.tfScore +
    stats.orderScore +
    stats.interviewScore +
    stats.listeningScore;

  const totalMax =
    stats.quizTotal +
    stats.fillTotal +
    stats.tfTotal +
    stats.orderTotal +
    stats.interviewTotal +
    stats.listeningTotal;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 border-b border-emerald-700/60 shadow-xl backdrop-blur-md">
      {/* Stadium Pitch Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 border-b border-emerald-800/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-2 ring-amber-300">
              <span className="text-xl">⚽</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950">
                  REAL MADRID
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Nivel A2–B1
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                Aprende Español con el Fútbol
              </h1>
            </div>
          </div>

          {/* Quick Score HUD, Mute Button & Font Zoom */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Sound Mute Button */}
            <button
              onClick={onToggleMute}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border shadow-sm active:scale-95 ${
                isMuted
                  ? 'bg-red-950 hover:bg-red-900 text-red-200 border-red-500 ring-1 ring-red-400'
                  : 'bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 border-emerald-600'
              }`}
              title={isMuted ? 'Activar sonido (включить звук)' : 'Desactivar sonido (отключить звук)'}
            >
              {isMuted ? (
                <VolumeX size={15} className="text-red-400 shrink-0" />
              ) : (
                <Volume2 size={15} className="text-amber-400 shrink-0" />
              )}
              <span className="font-semibold">
                {isMuted ? 'Sonido: OFF' : 'Sonido: ON'}
              </span>
            </button>

            {/* Font Size Zoom Controller */}
            <button
              onClick={onToggleFontSize}
              className="hidden xs:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-amber-300 border border-emerald-700 text-xs font-bold transition-colors cursor-pointer"
              title="Ajustar tamaño de letra (más grande / normal)"
            >
              <Type size={14} />
              <span>
                {fontSize === 'xl' ? 'Aa +++' : fontSize === 'lg' ? 'Aa ++' : 'Aa +'}
              </span>
            </button>

            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-600/60 shadow-inner">
              <span className="text-xs text-emerald-300 font-medium">Marcador:</span>
              <span className="text-sm font-bold text-amber-300 font-mono">
                {totalPoints} / {totalMax}
              </span>
            </div>

            <button
              onClick={() => setActiveTab('scoreboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              <Award size={15} />
              <span>Trofeo</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2.5 scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-transparent">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-emerald-950 shadow-md font-bold shadow-amber-400/20'
                    : 'text-emerald-200/90 hover:text-white hover:bg-emerald-800/60'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-emerald-950' : 'text-emerald-400'} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive
                        ? 'bg-emerald-950/20 text-emerald-950 font-extrabold'
                        : 'bg-emerald-800/90 text-amber-300 font-mono'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
