import React from 'react';
import { Download, Maximize2, BookOpen, Sliders, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'wallpaper' | 'memorize' | 'library';
  setActiveTab: (tab: 'wallpaper' | 'memorize' | 'library') => void;
  onDownload4K: () => void;
  onEnterFullscreen: () => void;
  isGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onDownload4K,
  onEnterFullscreen,
  isGenerating
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#080d14]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <span className="text-lg">۞</span>
          </div>
          <span className="font-bangla text-lg font-bold tracking-tight text-white sm:text-xl">
            সাইয়্যেদুল ইস্তিগফার <span className="text-amber-400 font-normal">| ৪কে স্টুডিও</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('wallpaper')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'wallpaper'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>ওয়ালপেপার ডিজাইনার</span>
          </button>

          <button
            onClick={() => setActiveTab('memorize')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'memorize'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>মুখস্থ করার মোড</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'library'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>দোয়া সম্ভার</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onEnterFullscreen}
            title="ফুলস্ক্রিন রিডিং মোড"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/70 text-slate-300 transition-colors hover:border-amber-500/50 hover:text-white hover:bg-slate-800"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          <button
            onClick={onDownload4K}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 whitespace-nowrap"
          >
            <Download className="h-4 w-4" />
            <span>{isGenerating ? 'রেন্ডার হচ্ছে...' : 'ডাউনলোড 4K (Ultra-HD)'}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden border-t border-slate-800/60 bg-slate-950/70 px-4 py-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('wallpaper')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'wallpaper' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          ওয়ালপেপার ডিজাইনার
        </button>
        <button
          onClick={() => setActiveTab('memorize')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'memorize' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          মুখস্থ করার মোড
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'library' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          শ্রেষ্ঠ দোয়া সংকলন
        </button>
      </div>
    </header>
  );
};
