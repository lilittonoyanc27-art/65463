import React, { useState } from 'react';
import { X, Clock, Save, RotateCcw } from 'lucide-react';
import { SubtitleItem } from './types.ts';
import { formatTime } from './pureLogic.ts';

interface TimingEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtitles: SubtitleItem[];
  onSave: (updated: SubtitleItem[]) => void;
  onReset: () => void;
}

export const TimingEditorModal: React.FC<TimingEditorModalProps> = ({
  isOpen,
  onClose,
  subtitles,
  onSave,
  onReset,
}) => {
  const [draft, setDraft] = useState<SubtitleItem[]>(subtitles);

  if (!isOpen) return null;

  const handleTimeChange = (id: number, field: 'start' | 'end', val: number) => {
    setDraft((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, [field]: Math.max(0, val) } : sub))
    );
  };

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-emerald-950 border border-emerald-600 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-800 flex items-center justify-between bg-emerald-900/40">
          <div className="flex items-center gap-2">
            <Clock className="text-amber-400" size={20} />
            <h2 className="text-lg font-bold text-white">
              Ajuste de tiempos de subtítulos (Temporizador)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <p className="text-xs text-emerald-200">
            Ajusta los segundos exactos de inicio (Inicio) y fin (Fin) para cada frase del vídeo.
            Los cambios se guardarán para tu sesión.
          </p>

          <div className="space-y-3">
            {draft.map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <span className="text-[11px] font-bold text-amber-400 block mb-0.5">
                    Frase #{sub.id}
                  </span>
                  <p className="text-xs text-slate-200 line-clamp-2">{sub.es}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] text-emerald-300">Inicio (s):</label>
                    <input
                      type="number"
                      min={0}
                      max={300}
                      value={sub.start}
                      onChange={(e) => handleTimeChange(sub.id, 'start', parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-xs bg-emerald-950 border border-emerald-700 rounded text-center text-amber-300 font-mono focus:border-amber-400 focus:outline-none"
                    />
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ({formatTime(sub.start)})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] text-emerald-300">Fin (s):</label>
                    <input
                      type="number"
                      min={0}
                      max={300}
                      value={sub.end}
                      onChange={(e) => handleTimeChange(sub.id, 'end', parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-xs bg-emerald-950 border border-emerald-700 rounded text-center text-amber-300 font-mono focus:border-amber-400 focus:outline-none"
                    />
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ({formatTime(sub.end)})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-emerald-800 flex items-center justify-between bg-emerald-900/40">
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-xs font-semibold text-emerald-200 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Restablecer originales</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md cursor-pointer"
            >
              <Save size={14} />
              <span>Guardar ajustes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
