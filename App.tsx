import React, { useState, useEffect } from 'react';
import { Navbar, TabKey } from './Navbar.tsx';
import { VideoSection } from './VideoSection.tsx';
import { SubtitlesView } from './SubtitlesView.tsx';
import { QuizSection } from './QuizSection.tsx';
import { FillBlanksSection } from './FillBlanksSection.tsx';
import { TrueFalseSection } from './TrueFalseSection.tsx';
import { WordOrderSection } from './WordOrderSection.tsx';
import { InterviewSection } from './InterviewSection.tsx';
import { ListeningSection } from './ListeningSection.tsx';
import { VocabSection } from './VocabSection.tsx';
import { GrammarSection } from './GrammarSection.tsx';
import { ScoreboardSection } from './ScoreboardSection.tsx';

import { INITIAL_SUBTITLES } from './subtitlesData.ts';
import { QUIZ_QUESTIONS } from './quizData.ts';
import {
  FILL_BLANK_ITEMS,
  TRUE_FALSE_ITEMS,
  WORD_ORDER_ITEMS,
  INTERVIEW_ITEMS,
  LISTENING_ITEMS,
} from './gamesData.ts';
import { VOCABULARY_LIST } from './vocabData.ts';
import { GRAMMAR_RULES } from './grammarData.ts';
import { SubtitleItem, UserStats } from './types.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('video');
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>(() => {
    try {
      const saved = localStorage.getItem('rm_subtitles');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SUBTITLES;
  });

  const [targetTimestamp, setTargetTimestamp] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl'>('lg');

  // Sync font size with root HTML document
  useEffect(() => {
    document.documentElement.classList.remove('font-scale-lg', 'font-scale-xl');
    if (fontSize === 'lg') {
      document.documentElement.classList.add('font-scale-lg');
    } else if (fontSize === 'xl') {
      document.documentElement.classList.add('font-scale-xl');
    }
  }, [fontSize]);

  const handleToggleFontSize = () => {
    setFontSize((prev) => {
      if (prev === 'md') return 'lg';
      if (prev === 'lg') return 'xl';
      return 'md';
    });
  };

  const [stats, setStats] = useState<UserStats>({
    quizScore: 0,
    quizTotal: QUIZ_QUESTIONS.length,
    quizCompleted: false,

    fillScore: 0,
    fillTotal: FILL_BLANK_ITEMS.length,
    fillCompleted: false,

    tfScore: 0,
    tfTotal: TRUE_FALSE_ITEMS.length,
    tfCompleted: false,

    orderScore: 0,
    orderTotal: WORD_ORDER_ITEMS.length,
    orderCompleted: false,

    interviewScore: 0,
    interviewTotal: INTERVIEW_ITEMS.length,
    interviewCompleted: false,

    listeningScore: 0,
    listeningTotal: LISTENING_ITEMS.length,
    listeningCompleted: false,

    vocabMatchedCount: 0,
  });

  // Query parameter support for quick jump & automated testing (?tab=quiz, ?autostart=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabKey;
    if (
      tabParam &&
      [
        'video',
        'subtitles',
        'quiz',
        'fill',
        'truefalse',
        'wordorder',
        'interview',
        'listening',
        'vocab',
        'grammar',
        'scoreboard',
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleUpdateSubtitles = (updated: SubtitleItem[]) => {
    setSubtitles(updated);
    try {
      localStorage.setItem('rm_subtitles', JSON.stringify(updated));
    } catch {
      // fallback
    }
  };

  const handleResetSubtitles = () => {
    setSubtitles(INITIAL_SUBTITLES);
    try {
      localStorage.removeItem('rm_subtitles');
    } catch {
      // fallback
    }
  };

  const handlePlayTimestampFromSection = (seconds: number) => {
    setTargetTimestamp(seconds);
    setActiveTab('video');
  };

  const handleResetAllStats = () => {
    setStats({
      quizScore: 0,
      quizTotal: QUIZ_QUESTIONS.length,
      quizCompleted: false,

      fillScore: 0,
      fillTotal: FILL_BLANK_ITEMS.length,
      fillCompleted: false,

      tfScore: 0,
      tfTotal: TRUE_FALSE_ITEMS.length,
      tfCompleted: false,

      orderScore: 0,
      orderTotal: WORD_ORDER_ITEMS.length,
      orderCompleted: false,

      interviewScore: 0,
      interviewTotal: INTERVIEW_ITEMS.length,
      interviewCompleted: false,

      listeningScore: 0,
      listeningTotal: LISTENING_ITEMS.length,
      listeningCompleted: false,

      vocabMatchedCount: 0,
    });
  };

  return (
    <div className="min-h-screen bg-[#072415] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Pitch Grass Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 0%, #15803d 0%, transparent 70%), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(16, 185, 129, 0.05) 80px, rgba(16, 185, 129, 0.05) 160px)',
        }}
      />

      {/* Top Navbar with Sound Mute & Font Zoom controls */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        fontSize={fontSize}
        onToggleFontSize={handleToggleFontSize}
      />

      {/* Main Content Area */}
      <main className="relative flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'video' && (
          <VideoSection
            subtitles={subtitles}
            onUpdateSubtitles={handleUpdateSubtitles}
            onResetSubtitles={handleResetSubtitles}
            targetTimestamp={targetTimestamp}
            onClearTargetTimestamp={() => setTargetTimestamp(null)}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
          />
        )}

        {activeTab === 'subtitles' && (
          <SubtitlesView
            subtitles={subtitles}
            onPlayTimestamp={handlePlayTimestampFromSection}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizSection
            questions={QUIZ_QUESTIONS}
            onPlayTimestamp={handlePlayTimestampFromSection}
            onUpdateScore={(score, total) =>
              setStats((prev) => ({
                ...prev,
                quizScore: score,
                quizTotal: total,
                quizCompleted: true,
              }))
            }
          />
        )}

        {activeTab === 'fill' && (
          <FillBlanksSection
            items={FILL_BLANK_ITEMS}
            onUpdateScore={(score, total) =>
              setStats((prev) => ({
                ...prev,
                fillScore: score,
                fillTotal: total,
                fillCompleted: true,
              }))
            }
          />
        )}

        {activeTab === 'truefalse' && (
          <TrueFalseSection
            items={TRUE_FALSE_ITEMS}
            onPlayTimestamp={handlePlayTimestampFromSection}
            onUpdateScore={(score, total) =>
              setStats((prev) => ({
                ...prev,
                tfScore: score,
                tfTotal: total,
                tfCompleted: true,
              }))
            }
          />
        )}

        {activeTab === 'wordorder' && (
          <WordOrderSection
            items={WORD_ORDER_ITEMS}
            onUpdateScore={(score, total) =>
              setStats((prev) => ({
                ...prev,
                orderScore: score,
                orderTotal: total,
                orderCompleted: true,
              }))
            }
          />
        )}

        {activeTab === 'interview' && (
          <InterviewSection
            items={INTERVIEW_ITEMS}
            onUpdateScore={(score, total) =>
              setStats((prev) => ({
                ...prev,
                interviewScore: score,
                interviewTotal: total,
                interviewCompleted: true,
              }))
            }
          />
        )}

        {activeTab === 'listening' && (
          <ListeningSection
            items={LISTENING_ITEMS}
            onPlayTimestamp={handlePlayTimestampFromSection}
            onUpdateScore={(score, total) =>
              setStats((prev) => ({
                ...prev,
                listeningScore: score,
                listeningTotal: total,
                listeningCompleted: true,
              }))
            }
          />
        )}

        {activeTab === 'vocab' && (
          <VocabSection
            vocabulary={VOCABULARY_LIST}
            onMatchedAll={() =>
              setStats((prev) => ({
                ...prev,
                vocabMatchedCount: prev.vocabMatchedCount + 1,
              }))
            }
          />
        )}

        {activeTab === 'grammar' && <GrammarSection rules={GRAMMAR_RULES} />}

        {activeTab === 'scoreboard' && (
          <ScoreboardSection
            stats={stats}
            onNavigateTab={setActiveTab}
            onResetAll={handleResetAllStats}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative mt-auto border-t border-emerald-800/60 bg-emerald-950/90 py-5 text-center text-xs text-emerald-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-amber-400">REAL MADRID CF</span>
            <span>•</span>
            <span>Lección Interactiva de Español (A2–B1)</span>
          </div>

          <div className="text-[11px] text-emerald-400 font-['Noto_Sans_Armenian']">
            Սեղմեք իսպաներեն ցանկացած արտահայտության վրա՝ հայերեն թարգմանությունը տեսնելու համար։
          </div>

          <div className="font-mono text-emerald-500">
            ¡Hala Madrid y nada más!
          </div>
        </div>
      </footer>
    </div>
  );
}
