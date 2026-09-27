import React, { useEffect, useRef } from 'react';
import { RenderOptions, renderWallpaperToCanvas } from '../utils/wallpaperRenderer';
import { X, Download, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';
import { ISLAMIC_DUAS } from '../data/duas';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: RenderOptions;
  setOptions: React.Dispatch<React.SetStateAction<RenderOptions>>;
  onDownload: () => void;
}

export const FullscreenModal: React.FC<FullscreenModalProps> = ({
  isOpen,
  onClose,
  options,
  setOptions,
  onDownload
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Render on canvas
    const render = async () => {
      if (!canvasRef.current) return;
      const fhd = { width: 2560, height: 1440, label: 'Fullscreen 2K' };
      await renderWallpaperToCanvas(canvasRef.current, { ...options, resolution: fhd });
    };
    render();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, options, onClose]);

  if (!isOpen) return null;

  const currentDuaIdx = ISLAMIC_DUAS.findIndex((d) => d.id === options.dua.id);

  const handleNextDua = () => {
    const nextIdx = (currentDuaIdx + 1) % ISLAMIC_DUAS.length;
    setOptions((prev) => ({ ...prev, dua: ISLAMIC_DUAS[nextIdx] }));
  };

  const handlePrevDua = () => {
    const prevIdx = (currentDuaIdx - 1 + ISLAMIC_DUAS.length) % ISLAMIC_DUAS.length;
    setOptions((prev) => ({ ...prev, dua: ISLAMIC_DUAS[prevIdx] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-bangla text-slate-300">
          <span className="text-amber-400 font-bold">۞</span>
          <span>ফুলস্ক্রিন স্ক্রিন রিডার (মুখস্থ করার জন্য পূর্ণ পর্দা)</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs shadow hover:bg-amber-400 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>4K ডাউনলোড</span>
          </button>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-rose-900/80 hover:text-white transition-colors"
            title="বন্ধ করতে ESC চাপুন"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main full-screen 16:9 Canvas */}
      <div className="relative w-full h-full max-h-screen aspect-video flex items-center justify-center p-2 sm:p-6">
        <canvas
          ref={canvasRef}
          className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-amber-500/20"
        />

        {/* Floating previous / next dua arrows */}
        <button
          onClick={handlePrevDua}
          className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center backdrop-blur-md transition-all"
          title="পূর্ববর্তী দোয়া"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={handleNextDua}
          className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center backdrop-blur-md transition-all"
          title="পরবর্তী দোয়া"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
