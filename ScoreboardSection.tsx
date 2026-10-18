import React from 'react';
import { UserStats } from './types.ts';
import { ClickableText } from './ClickableText.tsx';
import { getPerformanceTier, calculatePercentage } from './pureLogic.ts';
import {
  Trophy,
  Award,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  BrainCircuit,
  PenTool,
  CheckSquare,
  Sparkle,
  Mic,
  Headphones,
  ArrowRight,
} from 'lucide-react';
import { TabKey } from './Navbar.tsx';

interface ScoreboardSectionProps {
  stats: UserStats;
  onNavigateTab: (tab: TabKey) => void;
  onResetAll: () => void;
}

export const ScoreboardSection: React.FC<ScoreboardSectionProps> = ({
  stats,
  onNavigateTab,
  onResetAll,
}) => {
  const totalScore =
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

  const percent = calculatePercentage(totalScore, totalMax);
  const tier = getPerformanceTier(totalScore, totalMax);

  const activities = [
    {
      id: 'quiz' as TabKey,
      title: 'Quiz del vídeo',
      score: stats.quizScore,
      total: stats.quizTotal,
      icon: BrainCircuit,
    },
    {
      id: 'fill' as TabKey,
      title: 'Completa la frase',
      score: stats.fillScore,
      total: stats.fillTotal,
      icon: PenTool,
    },
    {
      id: 'truefalse' as TabKey,
      title: 'Verdadero o falso',
      score: stats.tfScore,
      total: stats.tfTotal,
      icon: CheckSquare,
    },
    {
      id: 'wordorder' as TabKey,
      title: 'Ordena las palabras',
      score: stats.orderScore,
      total: stats.orderTotal,
      icon: Sparkle,
    },
    {
      id: 'interview' as TabKey,
      title: 'Entrevista al futbolista',
      score: stats.interviewScore,
      total: stats.interviewTotal,
      icon: Mic,
    },
    {
      id: 'listening' as TabKey,
      title: 'Escucha y responde',
      score: stats.listeningScore,
      total: stats.listeningTotal,
      icon: Headphones,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Trophy Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 border-2 border-amber-400 shadow-2xl text-center space-y-5">
        <div className="relative inline-block">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 text-emerald-950 flex items-center justify-center text-5xl shadow-2xl shadow-amber-400/30 ring-4 ring-amber-300">
            {tier.badge}
          </div>
          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-950 border border-amber-400 text-amber-300 text-xs font-bold font-mono">
            {percent}%
          </div>
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-amber-400 text-emerald-950">
            Trofeo Oficial de la Academia
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {tier.titleEs}
          </h2>
          <div className="mt-1">
            <ClickableText
              es={tier.titleEs}
              hy={tier.titleHy}
              inline={true}
              textClassName="text-sm font-semibold text-amber-300"
            />
          </div>
        </div>

        {/* Big Score Display */}
        <div className="p-5 rounded-2xl bg-emerald-900/60 border border-emerald-700/80 inline-block min-w-[260px]">
          <div className="text-5xl font-black text-amber-300 font-mono">
            {totalScore} / {totalMax}
          </div>
          <div className="text-xs text-emerald-300 mt-1 font-semibold uppercase tracking-wider">
            Puntuación total acumulada
          </div>
        </div>

        {/* Description quote */}
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
          «Es un honor y orgullo para mí para jugar en este club y ojalá para muchos más años.»
          ¡Has trabajado las habilidades comunicativas y auditivas en español de fútbol!
        </p>
      </div>

      {/* Breakdown per Game Activity */}
      <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="text-amber-400" size={18} />
          <span>Desglose por secciones de entrenamiento</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activities.map((act) => {
            const Icon = act.icon;
            const actPercent = calculatePercentage(act.score, act.total);
            const isCompleted = act.score > 0;

            return (
              <div
                key={act.id}
                onClick={() => onNavigateTab(act.id)}
                className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700 hover:border-amber-400/80 hover:bg-emerald-900/60 transition-all cursor-pointer flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-800 text-amber-300">
                      <Icon size={16} />
                    </div>
                    <span className="text-xs font-bold text-white">{act.title}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {act.score}/{act.total}
                  </span>
                </div>

                <div>
                  <div className="w-full bg-emerald-950 rounded-full h-1.5 overflow-hidden border border-emerald-800">
                    <div
                      className="bg-amber-400 h-full"
                      style={{ width: `${actPercent}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-emerald-400">
                    <span>{actPercent}% completado</span>
                    <span className="flex items-center gap-0.5 text-amber-300 hover:underline">
                      <span>Ir</span>
                      <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Reset */}
        <div className="pt-4 border-t border-emerald-800/80 flex items-center justify-between">
          <span className="text-xs text-emerald-300">
            ¿Quieres reiniciar todos los marcadores para otra sesión de práctica?
          </span>
          <button
            onClick={onResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-xs font-semibold text-emerald-200 border border-emerald-700 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reiniciar marcadores</span>
          </button>
        </div>
      </div>
    </div>
  );
};
