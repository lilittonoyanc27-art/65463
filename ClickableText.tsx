import React, { useState } from 'react';
import { X } from 'lucide-react';

export const ArmenianFlagIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-2.5',
}) => (
  <svg
    className={`${className} inline-block rounded-xs shadow-xs overflow-hidden shrink-0 align-middle`}
    viewBox="0 0 600 300"
    aria-hidden="true"
  >
    <rect width="600" height="100" y="0" fill="#d90012" />
    <rect width="600" height="100" y="100" fill="#0033a0" />
    <rect width="600" height="100" y="200" fill="#f2a800" />
  </svg>
);

interface ClickableTextProps {
  es: string;
  hy: string;
  className?: string;
  textClassName?: string;
  badgeClassName?: string;
  inline?: boolean;
  showIcon?: boolean;
  block?: boolean;
  badgePosition?: 'below' | 'inline';
  onSelect?: () => void;
}

export const ClickableText: React.FC<ClickableTextProps> = ({
  es,
  hy,
  className = '',
  textClassName = '',
  badgeClassName = '',
  inline = false,
  showIcon = true,
  block = false,
  badgePosition = 'below',
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTranslation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    if (onSelect) {
      onSelect();
    }
  };

  if (inline) {
    return (
      <span className={`relative inline-flex flex-wrap items-center gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={toggleTranslation}
          title="Click para ver traducción al armenio (Հայերեն թարգմանություն)"
          className={`cursor-pointer group text-left rounded px-1 -mx-1 transition-all duration-200 hover:bg-emerald-800/40 focus:outline-none focus:ring-1 focus:ring-amber-400 ${
            isOpen ? 'bg-emerald-900/60 ring-1 ring-amber-400/70 text-amber-200' : ''
          } ${textClassName}`}
          aria-expanded={isOpen}
        >
          <span className="underline decoration-emerald-500/50 decoration-dotted decoration-2 underline-offset-4 group-hover:decoration-amber-400">
            {es}
          </span>
          {showIcon && (
            <span className="inline-flex items-center gap-1 ml-1.5 align-middle">
              <ArmenianFlagIcon className="w-3.5 h-2.5" />
              <span className="text-[10px] font-bold text-amber-300 font-['Noto_Sans_Armenian',sans-serif]">
                {isOpen ? '✕' : 'ՀԱՅ'}
              </span>
            </span>
          )}
        </button>

        {isOpen && (
          <span
            onClick={toggleTranslation}
            className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 via-emerald-800/90 to-emerald-950 border border-amber-400/60 text-amber-200 text-xs font-['Noto_Sans_Armenian',sans-serif] shadow-lg backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150 ${badgeClassName}`}
            title="Haz clic para cerrar"
          >
            <ArmenianFlagIcon className="w-3.5 h-2.5" />
            <span className="font-semibold text-slate-100">{hy}</span>
            <X size={12} className="opacity-70 hover:opacity-100 ml-1 text-amber-400" />
          </span>
        )}
      </span>
    );
  }

  return (
    <div className={`relative ${block ? 'w-full' : 'inline-block'} ${className}`}>
      <button
        type="button"
        onClick={toggleTranslation}
        title="Haz clic para ver u ocultar la traducción al armenio"
        className={`group text-left cursor-pointer transition-all duration-200 rounded-lg p-1.5 -m-1.5 hover:bg-emerald-800/40 focus:outline-none focus:ring-2 focus:ring-amber-400/70 ${
          isOpen ? 'bg-emerald-900/70 ring-1 ring-amber-400/80 text-amber-100' : ''
        } ${textClassName}`}
        aria-expanded={isOpen}
      >
        <span className="underline decoration-emerald-500/50 decoration-dotted decoration-2 underline-offset-4 group-hover:decoration-amber-300">
          {es}
        </span>
        {showIcon && (
          <span className="inline-flex items-center ml-2 align-middle">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-all duration-200 border ${
                isOpen
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-sm'
                  : 'bg-emerald-900/80 text-emerald-300 border-emerald-700/80 group-hover:border-amber-400/60 group-hover:text-amber-200'
              }`}
            >
              <ArmenianFlagIcon className="w-3.5 h-2.5" />
              <span className="font-['Noto_Sans_Armenian',sans-serif]">
                {isOpen ? 'Փակել ✕' : 'ՀԱՅ'}
              </span>
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div
          onClick={toggleTranslation}
          className={`cursor-pointer mt-2 p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-emerald-900/95 via-emerald-950/95 to-slate-950/95 border-2 border-amber-400/70 text-amber-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150 ${
            badgePosition === 'below' ? 'block' : ''
          } ${badgeClassName}`}
          title="Haz clic para cerrar la traducción"
        >
          <div className="flex items-center justify-between gap-2 border-b border-emerald-800/80 pb-1.5">
            <div className="flex items-center gap-1.5">
              <ArmenianFlagIcon className="w-4 h-3" />
              <span className="text-xs font-bold text-amber-300 font-['Noto_Sans_Armenian',sans-serif]">
                Հայերեն թարգմանություն
              </span>
            </div>
            <button
              type="button"
              onClick={toggleTranslation}
              className="text-amber-300/80 hover:text-white p-0.5 rounded hover:bg-emerald-800/50 cursor-pointer"
              aria-label="Cerrar traducción"
            >
              <X size={14} />
            </button>
          </div>
          <p className="mt-2 text-sm sm:text-base font-semibold font-['Noto_Sans_Armenian',sans-serif] text-white leading-relaxed">
            {hy}
          </p>
          <span className="text-[10px] text-emerald-400/90 mt-1.5 block">
            (Սեղմեք կրկին՝ փակելու համար / Haz clic de nuevo para cerrar)
          </span>
        </div>
      )}
    </div>
  );
};
