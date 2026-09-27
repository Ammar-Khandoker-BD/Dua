import React, { useState, useEffect, useRef } from 'react';
import { IslamicDua, WALLPAPER_BACKGROUNDS } from '../data/duas';
import { RenderOptions, renderWallpaperToCanvas, RESOLUTIONS } from '../utils/wallpaperRenderer';
import { Download, Monitor, Eye, Copy, Check, Sparkles, RefreshCw, ZoomIn, SlidersHorizontal } from 'lucide-react';

interface WallpaperPreviewProps {
  options: RenderOptions;
  setOptions: React.Dispatch<React.SetStateAction<RenderOptions>>;
  onDownload: () => void;
  isGenerating: boolean;
  onEnterFullscreen: () => void;
}

export const WallpaperPreview: React.FC<WallpaperPreviewProps> = ({
  options,
  setOptions,
  onDownload,
  isGenerating,
  onEnterFullscreen
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDesktopMock, setShowDesktopMock] = useState(false);
  const [previewScale, setPreviewScale] = useState<'fit' | 'fill'>('fit');
  const [renderCount, setRenderCount] = useState(0);

  // Render preview canvas whenever options change
  useEffect(() => {
    let isCancelled = false;

    const render = async () => {
      if (!canvasRef.current) return;
      // For quick live preview, use a 1920x1080 canvas size so it renders instantaneously in real-time
      const previewResolution = { width: 1920, height: 1080, label: 'Preview' };
      const previewOpts = { ...options, resolution: previewResolution };

      await renderWallpaperToCanvas(canvasRef.current, previewOpts);
      if (!isCancelled) {
        setRenderCount((prev) => prev + 1);
      }
    };

    const timer = setTimeout(render, 50);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [options]);

  const handleCopyText = () => {
    const fullText = `【${options.dua.title}】\n\n[আরবি]:\n${options.dua.arabic}\n\n[উচ্চারণ]:\n${options.dua.pronunciation}\n\n[বাংলা অনুবাদ]:\n${options.dua.meaning}\n\n[ফজিলত ও রেফারেন্স]:\n${options.dua.virtue} (${options.dua.reference})\n\n— Designed by ${options.designerCredit}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top control strip above preview */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-amber-400 font-bangla flex items-center gap-1.5">
            <Monitor className="h-4 w-4" />
            লাইভ ৪কে ডিসপ্লে প্রিভিউ (16:9)
          </span>
          <span className="text-slate-500">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{options.resolution.width} × {options.resolution.height}px (4K Ready)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Simulated desktop icons toggle */}
          <button
            onClick={() => setShowDesktopMock(!showDesktopMock)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
              showDesktopMock
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="ডেস্কটপ আইকনগুলোর সাথে প্রিভিউ দেখুন"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>ডেস্কটপ সিমুলেশন {showDesktopMock ? 'অন' : 'অফ'}</span>
          </button>

          {/* Copy full text */}
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="দোয়ার পুরো টেক্সট কপি করুন"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'কপি হয়েছে!' : 'টেক্সট কপি'}</span>
          </button>
        </div>
      </div>

      {/* Main Wallpaper Preview Frame */}
      <div className="relative group overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-black shadow-2xl shadow-amber-950/20 aspect-video w-full flex items-center justify-center">
        {/* Render Canvas */}
        <canvas
          ref={canvasRef}
          className="h-full w-full object-contain transition-all duration-300"
        />

        {/* Optional Windows / Desktop Mock Overlay */}
        {showDesktopMock && (
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 z-10">
            {/* Desktop Icons column on the left */}
            <div className="flex flex-col gap-5 pt-2">
              <div className="flex flex-col items-center w-14 gap-1 text-center">
                <div className="h-8 w-8 rounded-lg bg-blue-600/80 backdrop-blur-sm border border-blue-400/40 flex items-center justify-center shadow-lg">
                  <Monitor className="h-4 w-4 text-white" />
                </div>
                <span className="text-[9px] text-white drop-shadow font-medium">This PC</span>
              </div>

              <div className="flex flex-col items-center w-14 gap-1 text-center">
                <div className="h-8 w-8 rounded-lg bg-amber-600/80 backdrop-blur-sm border border-amber-400/40 flex items-center justify-center shadow-lg">
                  <span className="text-xs">📖</span>
                </div>
                <span className="text-[9px] text-white drop-shadow font-medium">Quran Majeed</span>
              </div>

              <div className="flex flex-col items-center w-14 gap-1 text-center">
                <div className="h-8 w-8 rounded-lg bg-emerald-600/80 backdrop-blur-sm border border-emerald-400/40 flex items-center justify-center shadow-lg">
                  <span className="text-xs">🤲</span>
                </div>
                <span className="text-[9px] text-white drop-shadow font-medium">Daily Dua</span>
              </div>

              <div className="flex flex-col items-center w-14 gap-1 text-center">
                <div className="h-8 w-8 rounded-lg bg-slate-700/80 backdrop-blur-sm border border-slate-500/40 flex items-center justify-center shadow-lg">
                  <span className="text-xs">📁</span>
                </div>
                <span className="text-[9px] text-white drop-shadow font-medium">Work Files</span>
              </div>
            </div>

            {/* Desktop Taskbar at bottom */}
            <div className="h-8 -mx-4 -mb-4 bg-slate-950/85 backdrop-blur-md border-t border-slate-800 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-cyan-400 rounded-[1px]" />
                  <div className="bg-cyan-400 rounded-[1px]" />
                  <div className="bg-cyan-400 rounded-[1px]" />
                  <div className="bg-cyan-400 rounded-[1px]" />
                </div>
                <span className="text-[10px] text-slate-400">Search Windows</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                <span>ENG</span>
                <span>12:00 PM</span>
              </div>
            </div>
          </div>
        )}

        {/* Hover quick action overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 pointer-events-auto">
          <div className="text-left font-bangla">
            <p className="text-xs font-semibold text-amber-400">৪কে রেজোলিউশন প্রিভিউ</p>
            <p className="text-[11px] text-slate-300">ডেস্কটপ ওয়ালপেপারের উপযোগী নিখুঁত স্পষ্টতা ও কন্ট্রাস্ট</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onEnterFullscreen}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white px-3 py-2 text-xs font-semibold backdrop-blur-md border border-slate-700 transition-all hover:scale-105"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>ফুলস্ক্রিন দেখুন</span>
            </button>
            <button
              onClick={onDownload}
              disabled={isGenerating}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 px-4 py-2 text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isGenerating ? 'প্রসেসিং...' : '4K PNG সেভ করুন'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick bottom badge info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium font-bangla">সহীহ হাদিস ও নির্ভুল উচ্চারণ</p>
            <p className="text-[11px] text-amber-400/90 font-bangla">{options.dua.reference}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Monitor className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium font-bangla">৪কে আল্ট্রা এইচডি রেন্ডার</p>
            <p className="text-[11px] text-slate-300 font-mono">3840×2160 Pixels (16:9 Ratio)</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <span className="text-xs font-bold">AK</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium font-bangla">ওয়ালপেপার ডিজাইনার ক্রেডিট</p>
            <p className="text-[11px] text-amber-300 font-semibold">{options.designerCredit}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
