import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { SubtitleItem } from './types.ts';
import { ClickableText } from './ClickableText.tsx';
import { TimingEditorModal } from './TimingEditorModal.tsx';
import { formatTime } from './pureLogic.ts';

interface VideoSectionProps {
  subtitles: SubtitleItem[];
  onUpdateSubtitles: (subs: SubtitleItem[]) => void;
  onResetSubtitles: () => void;
  targetTimestamp?: number | null;
  onClearTargetTimestamp?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  subtitles,
  onUpdateSubtitles,
  onResetSubtitles,
  targetTimestamp,
  onClearTargetTimestamp,
  isMuted = false,
  onToggleMute,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(120);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(1);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<any>(null);

  const videoId = '3unss_0fWaY';

  // Initialize YouTube Iframe Player
  useEffect(() => {
    let checkCount = 0;
    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        if (checkCount < 40) {
          checkCount++;
          setTimeout(initPlayer, 200);
        }
        return;
      }

      try {
        if (playerRef.current) {
          playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player('youtube-player-frame', {
          videoId: videoId,
          playerVars: {
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              setPlayerReady(true);
              setDuration(event.target.getDuration() || 120);
              if (isMuted && typeof event.target.mute === 'function') {
                event.target.mute();
              }
            },
            onStateChange: (event: any) => {
              // 1: PLAYING, 2: PAUSED
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
              }
            },
            onError: () => {
              setLoadError(true);
            },
          },
        });
      } catch (err) {
        console.warn('Error loading YT player:', err);
        setLoadError(true);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [videoId]);

  // Sync current time via polling or fallback
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const time = playerRef.current.getCurrentTime();
          if (typeof time === 'number') {
            setCurrentTime(time);
          }
        } catch {
          // ignore
        }
      } else if (isPlaying) {
        setCurrentTime((prev) => (prev >= duration ? 0 : prev + 0.5));
      }
    }, 400);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying, duration]);

  // Jump to targeted timestamp when requested from outside (e.g. from quiz or listening)
  useEffect(() => {
    if (typeof targetTimestamp === 'number') {
      jumpToTime(targetTimestamp);
      if (onClearTargetTimestamp) onClearTargetTimestamp();
    }
  }, [targetTimestamp]);

  // Sync isMuted state with YouTube player instance
  useEffect(() => {
    if (playerRef.current) {
      try {
        if (isMuted && typeof playerRef.current.mute === 'function') {
          playerRef.current.mute();
        } else if (!isMuted && typeof playerRef.current.unMute === 'function') {
          playerRef.current.unMute();
        }
      } catch {
        // fallback
      }
    }
  }, [isMuted]);

  const jumpToTime = (seconds: number) => {
    setCurrentTime(seconds);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(seconds, true);
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch {
        // fallback
      }
    } else {
      setIsPlaying(true);
    }

    // find matching subtitle
    const matched = subtitles.find((s) => seconds >= s.start && seconds <= s.end);
    if (matched) {
      setSelectedSubId(matched.id);
    }
  };

  const togglePlay = () => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        if (isPlaying) {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
        return;
      } catch {
        // fallback
      }
    }
    setIsPlaying(!isPlaying);
  };

  const repeatCurrentFragment = () => {
    const activeSub =
      subtitles.find((s) => currentTime >= s.start && currentTime <= s.end) ||
      subtitles.find((s) => s.id === selectedSubId) ||
      subtitles[0];

    if (activeSub) {
      jumpToTime(activeSub.start);
    }
  };

  // Find active subtitle
  const activeSubtitle =
    subtitles.find((s) => currentTime >= s.start && currentTime <= s.end) ||
    subtitles.find((s) => s.id === selectedSubId);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Instructions Banner */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-green-900/90 border border-emerald-600/60 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-emerald-950 uppercase tracking-wider">
                1. Ver el vídeo y escuchar
              </span>
              <span className="text-xs text-emerald-200">
                Real Madrid TV • Entrevista oficial
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Entrevista con el jugador del Real Madrid
            </h2>
            <div className="mt-2 text-sm text-emerald-100 flex flex-wrap items-center gap-2">
              <span>Tema:</span>
              <span className="font-semibold text-amber-300">
                Real Madrid, Mourinho, fútbol, entrenamiento, Mundial, emociones y objetivos.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showSubtitles
                  ? 'bg-emerald-950 text-emerald-200 border border-emerald-700'
                  : 'bg-emerald-700 text-white'
              }`}
            >
              {showSubtitles ? <Eye size={15} /> : <EyeOff size={15} />}
              <span>{showSubtitles ? 'Ocultar subtítulos' : 'Mostrar subtítulos'}</span>
            </button>

            <button
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border border-amber-400/40 cursor-pointer shadow-sm"
            >
              <Sliders size={15} />
              <span>Ajustar tiempos</span>
            </button>
          </div>
        </div>

        {/* Translation Guidance Note */}
        <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/50 flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div className="text-xs text-emerald-200 leading-relaxed">
            <strong className="text-amber-300">Regla de oro:</strong> Haz clic en cualquier frase en español para ver la traducción al armenio. Vuelve a hacer clic para ocultarla. Los subtítulos se destacan automáticamente según avanza el vídeo.
          </div>
        </div>
      </div>

      {/* Video & Synchronized Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Player & Active Subtitle Display */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border-2 border-emerald-700/80 shadow-2xl">
            {/* Embedded YouTube Container */}
            <div id="youtube-player-frame" className="w-full h-full" />

            {/* Fallback Overlay if YouTube blocks embed */}
            {loadError && (
              <div className="absolute inset-0 bg-emerald-950/95 flex flex-col items-center justify-center p-6 text-center z-20">
                <p className="text-base font-bold text-white mb-2">
                  Reproductor de YouTube en modo seguro
                </p>
                <p className="text-xs text-emerald-200 max-w-md mb-4">
                  Si YouTube restringe la reproducción embebida en tu navegador, puedes abrir el vídeo en YouTube y usar este panel sincronizado interactivo.
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg"
                >
                  <ExternalLink size={14} />
                  <span>Ver en YouTube original</span>
                </a>
              </div>
            )}
          </div>

          {/* Player Controls Bar */}
          <div className="bg-emerald-900/80 border border-emerald-700/60 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 flex items-center justify-center font-bold shadow-md cursor-pointer transition-transform active:scale-95"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>

              <button
                onClick={repeatCurrentFragment}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-950 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700 cursor-pointer"
                title="Repetir fragmento actual"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">Repetir fragmento</span>
              </button>

              {/* Mute / Unmute Button */}
              {onToggleMute && (
                <button
                  onClick={onToggleMute}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    isMuted
                      ? 'bg-red-950/90 text-red-300 border-red-500'
                      : 'bg-emerald-950 hover:bg-emerald-800 text-emerald-200 border-emerald-700'
                  }`}
                  title={isMuted ? 'Activar sonido' : 'Desactivar sonido'}
                >
                  {isMuted ? (
                    <VolumeX size={15} className="text-red-400" />
                  ) : (
                    <Volume2 size={15} className="text-amber-400" />
                  )}
                  <span className="hidden xs:inline">
                    {isMuted ? 'Mudo' : 'Sonido'}
                  </span>
                </button>
              )}
            </div>

            {/* Time progress bar */}
            <div className="flex-1 min-w-[140px] flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-300">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 120}
                step={0.5}
                value={currentTime}
                onChange={(e) => jumpToTime(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-emerald-950 rounded-lg"
              />
              <span className="text-xs font-mono text-emerald-400">
                {formatTime(duration)}
              </span>
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-emerald-300 hover:text-white flex items-center gap-1"
            >
              <ExternalLink size={12} />
              <span>YouTube</span>
            </a>
          </div>

          {/* Synchronized Active Subtitle Card Directly Below Player */}
          {showSubtitles && activeSubtitle && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-900/90 via-emerald-950/90 to-green-950/90 border-2 border-amber-400/70 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded text-xs font-extrabold bg-amber-400 text-emerald-950 font-mono">
                    {formatTime(activeSubtitle.start)} – {formatTime(activeSubtitle.end)}
                  </span>
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles size={14} />
                    Subtítulo en vivo (Haz clic en el texto para traducir)
                  </span>
                </div>
                <button
                  onClick={() => jumpToTime(activeSubtitle.start)}
                  className="text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-1 px-2.5 py-1 bg-emerald-800/70 rounded-lg"
                >
                  <RotateCcw size={13} />
                  <span>Repetir</span>
                </button>
              </div>

              {/* Clickable Subtitle Text with Bigger Font */}
              <div className="mt-2 text-lg sm:text-2xl font-bold text-white leading-relaxed">
                <ClickableText
                  es={activeSubtitle.es}
                  hy={activeSubtitle.hy}
                  block={true}
                  textClassName="text-lg sm:text-2xl font-bold text-white hover:text-amber-200"
                />
              </div>

              {/* Natural speech note if present */}
              {activeSubtitle.naturalForm && (
                <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/40 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                    <span>💡 Forma más natural en español:</span>
                  </div>
                  <p className="text-slate-200">
                    <span className="line-through text-red-300 mr-2">
                      {activeSubtitle.naturalForm.original}
                    </span>
                    <span className="font-bold text-emerald-300">
                      → {activeSubtitle.naturalForm.suggested}
                    </span>
                  </p>
                  <ClickableText
                    es={activeSubtitle.naturalForm.explanationEs}
                    hy={activeSubtitle.naturalForm.explanationHy}
                    className="mt-1"
                    textClassName="text-emerald-200 text-[11px]"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Full Interactive Transcript List */}
        <div className="lg:col-span-5 flex flex-col h-[520px] bg-emerald-950/70 border border-emerald-700/60 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-3.5 border-b border-emerald-800 bg-emerald-900/40 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>📋 Lista completa de réplicas ({subtitles.length})</span>
              </h3>
              <p className="text-[11px] text-emerald-300">
                Haz clic en la marca de tiempo para saltar o en el texto para traducir.
              </p>
            </div>
          </div>

          <div className="p-3 overflow-y-auto space-y-2.5 flex-1 scrollbar-thin scrollbar-thumb-emerald-700">
            {subtitles.map((sub) => {
              const isActive = currentTime >= sub.start && currentTime <= sub.end;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubId(sub.id)}
                  className={`p-3 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-900/80 border-amber-400 ring-1 ring-amber-400/50 shadow-md'
                      : 'bg-emerald-900/30 border-emerald-800/80 hover:bg-emerald-900/50 hover:border-emerald-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        jumpToTime(sub.start);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-amber-300 font-mono text-xs font-bold hover:bg-amber-400 hover:text-emerald-950 transition-colors cursor-pointer"
                      title="Saltar a este punto del vídeo"
                    >
                      <Play size={10} fill="currentColor" />
                      <span>{formatTime(sub.start)}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {isActive && (
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-400 text-emerald-950 animate-pulse">
                          En vivo
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          jumpToTime(sub.start);
                        }}
                        className="text-[10px] text-emerald-300 hover:text-white flex items-center gap-0.5 ml-1"
                      >
                        <span>Escuchar</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Spanish clickable text with Armenian translation popup */}
                  <ClickableText
                    es={sub.es}
                    hy={sub.hy}
                    block={true}
                    textClassName={`text-xs sm:text-sm font-medium leading-relaxed ${
                      isActive ? 'text-white font-semibold' : 'text-slate-200'
                    }`}
                  />

                  {/* Natural form badge if any */}
                  {sub.naturalForm && (
                    <div className="mt-2 pt-2 border-t border-emerald-800/60">
                      <span className="text-[10px] font-bold text-amber-300 block mb-0.5">
                        Forma más natural:
                      </span>
                      <p className="text-[11px] text-slate-300">
                        {sub.naturalForm.suggested}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timing Editor Modal */}
      <TimingEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        subtitles={subtitles}
        onSave={onUpdateSubtitles}
        onReset={onResetSubtitles}
      />
    </div>
  );
};
