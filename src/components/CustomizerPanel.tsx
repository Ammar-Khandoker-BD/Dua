import React from 'react';
import { IslamicDua, WALLPAPER_BACKGROUNDS, ISLAMIC_DUAS } from '../data/duas';
import { RenderOptions, RESOLUTIONS } from '../utils/wallpaperRenderer';
import { Palette, Layout, Type, Image as ImageIcon, Sliders, Check, User, Sparkles, Shield, BookmarkCheck } from 'lucide-react';

interface CustomizerPanelProps {
  options: RenderOptions;
  setOptions: React.Dispatch<React.SetStateAction<RenderOptions>>;
}

export const CustomizerPanel: React.FC<CustomizerPanelProps> = ({ options, setOptions }) => {
  const handleBgSelect = (bg: typeof WALLPAPER_BACKGROUNDS[0]) => {
    setOptions((prev) => ({
      ...prev,
      backgroundSrc: bg.src,
      overlayOpacity: bg.overlayDefault
    }));
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOptions((prev) => ({ ...prev, backgroundSrc: url }));
    }
  };

  const layoutModes = [
    {
      id: 'single' as const,
      name: 'একক হিরো ভিউ',
      description: 'সাইয়্যেদুল ইস্তিগফারের পূর্ণাঙ্গ রূপ'
    },
    {
      id: 'chunks' as const,
      name: 'মুখস্থ করার ভাগসমূহ',
      description: '৭টি ছোট বাক্যে সহজ পাঠ'
    },
    {
      id: 'dual' as const,
      name: 'দ্বৈত সুরক্ষা রূপ',
      description: 'ইস্তিগফার + আয়াতুল কুরসী'
    },
    {
      id: 'grid4' as const,
      name: '৪টি শ্রেষ্ঠ প্রাত্যহিক দোয়া',
      description: 'দৈনন্দিন হিফাজতের পূর্ণাঙ্গ ৪টি দোয়া'
    }
  ];

  const themes = [
    { id: 'gold' as const, name: 'স্বর্ণালী নূর', color: '#facc15' },
    { id: 'emerald' as const, name: 'মরকত সবুজ', color: '#10b981' },
    { id: 'cyan' as const, name: 'নীলিমা গম্বুজ', color: '#0ea5e9' },
    { id: 'amber' as const, name: 'অ্যাম্বার দীপ্তি', color: '#f59e0b' }
  ];

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-[#0f1726]/80 p-5 sm:p-6 backdrop-blur-md">
      {/* 1. Background Selection */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-bangla text-sm font-semibold text-slate-200 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-amber-400" />
            <span>ইসলামিক ব্যাকগ্রাউন্ড নির্বাচন</span>
          </label>
          <span className="text-[11px] text-slate-400">উচ্চ রেজোলিউশন (AI Art)</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {WALLPAPER_BACKGROUNDS.map((bg) => {
            const isSelected = options.backgroundSrc === bg.src;
            return (
              <button
                key={bg.id}
                onClick={() => handleBgSelect(bg)}
                className={`group relative overflow-hidden rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-950/40'
                    : 'border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={bg.src}
                    alt={bg.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-2 bg-slate-950/90 border-t border-slate-850">
                  <p className="font-bangla text-[11px] font-medium text-slate-200 truncate">{bg.name}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom background uploader option */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>অথবা আপনার নিজস্ব ছবি ব্যবহার করুন:</span>
          <label className="cursor-pointer font-medium text-amber-400 hover:text-amber-300 transition-colors">
            কম্পিউটার থেকে ছবি আনুন
            <input type="file" accept="image/*" onChange={handleCustomBgUpload} className="hidden" />
          </label>
        </div>
      </section>

      {/* 2. Layout Mode */}
      <section className="space-y-3 pt-4 border-t border-slate-800/80">
        <label className="font-bangla text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Layout className="h-4 w-4 text-amber-400" />
          <span>ওয়ালপেপার লেআউট ও দোয়ার বিন্যাস</span>
        </label>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {layoutModes.map((m) => {
            const isSelected = options.layoutMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setOptions((prev) => ({ ...prev, layoutMode: m.id }))}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 text-white ring-1 ring-amber-400/30'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <p className="font-bangla text-xs font-semibold text-amber-300">{m.name}</p>
                <p className="font-bangla text-[10px] text-slate-400 mt-1 leading-tight line-clamp-1">{m.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Resolution Selector */}
      <section className="space-y-3 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="font-bangla text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-amber-400" />
            <span>ওয়ালপেপার রেজোলিউশন</span>
          </label>
          <span className="text-[11px] text-amber-400 font-mono">16:9 Aspect Ratio</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {RESOLUTIONS.map((res) => {
            const isSelected = options.resolution.width === res.width;
            return (
              <button
                key={res.width}
                onClick={() => setOptions((prev) => ({ ...prev, resolution: res }))}
                className={`px-3 py-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/15 text-white ring-1 ring-amber-400/30'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div>
                  <p className="text-xs font-semibold text-slate-100">{res.label}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{res.width} × {res.height} px</p>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Contrast, Vignette & Islamic Border */}
      <section className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="font-bangla text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Palette className="h-4 w-4 text-amber-400" />
            <span>কন্ট্রাস্ট, ফন্ট ও ইসলামিক অলংকরণ</span>
          </label>
          <span className="text-xs text-amber-400 font-mono">{Math.round(options.overlayOpacity * 100)}% অন্ধকার স্তর</span>
        </div>

        {/* Darkness slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>হালকা ব্যাকগ্রাউন্ড</span>
            <span>সর্বোচ্চ টেক্সট স্পষ্টতা (গাঢ়)</span>
          </div>
          <input
            type="range"
            min="0.30"
            max="0.85"
            step="0.05"
            value={options.overlayOpacity}
            onChange={(e) => setOptions((prev) => ({ ...prev, overlayOpacity: parseFloat(e.target.value) }))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Accent Theme Swatches */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-bangla">থিম কালার:</span>
          <div className="flex items-center gap-2">
            {themes.map((th) => (
              <button
                key={th.id}
                onClick={() => setOptions((prev) => ({ ...prev, accentTheme: th.id }))}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bangla transition-all ${
                  options.accentTheme === th.id
                    ? 'border-amber-400 bg-slate-800 text-white ring-1 ring-amber-400/40'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: th.color }} />
                <span>{th.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Islamic Corner Filigree & Vignette toggles */}
        <div className="grid grid-cols-2 gap-2.5">
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-800 bg-slate-900/40 cursor-pointer hover:bg-slate-900/70">
            <input
              type="checkbox"
              checked={options.borderOrnament}
              onChange={(e) => setOptions((prev) => ({ ...prev, borderOrnament: e.target.checked }))}
              className="rounded accent-amber-500 h-4 w-4"
            />
            <span className="font-bangla text-xs text-slate-300">ইসলামিক সোনালী বর্ডার ও কোণা</span>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-800 bg-slate-900/40 cursor-pointer hover:bg-slate-900/70">
            <input
              type="checkbox"
              checked={options.vignette}
              onChange={(e) => setOptions((prev) => ({ ...prev, vignette: e.target.checked }))}
              className="rounded accent-amber-500 h-4 w-4"
            />
            <span className="font-bangla text-xs text-slate-300">রেডিয়াল ভিজনেট (লেখায় মনোযোগ)</span>
          </label>
        </div>
      </section>

      {/* 5. Typography & Visibility Elements */}
      <section className="space-y-3 pt-4 border-t border-slate-800/80">
        <label className="font-bangla text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Type className="h-4 w-4 text-amber-400" />
          <span>দৃশ্যমান উপাদান ও ফন্ট নির্বাচন</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bangla">
          <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={options.showArabic}
              onChange={(e) => setOptions((prev) => ({ ...prev, showArabic: e.target.checked }))}
              className="accent-amber-400"
            />
            <span className="text-slate-300">আরবি ক্যালিগ্রাফি</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={options.showPronunciation}
              onChange={(e) => setOptions((prev) => ({ ...prev, showPronunciation: e.target.checked }))}
              className="accent-amber-400"
            />
            <span className="text-slate-300">বাংলা উচ্চারণ</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={options.showMeaning}
              onChange={(e) => setOptions((prev) => ({ ...prev, showMeaning: e.target.checked }))}
              className="accent-amber-400"
            />
            <span className="text-slate-300">বাংলা অর্থ</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={options.showVirtue}
              onChange={(e) => setOptions((prev) => ({ ...prev, showVirtue: e.target.checked }))}
              className="accent-amber-400"
            />
            <span className="text-slate-300">হাদিস রেফারেন্স</span>
          </label>
        </div>

        {/* Font size scale */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <span className="text-xs text-slate-400 font-bangla whitespace-nowrap">ফন্ট সাইজ স্কেল:</span>
          <input
            type="range"
            min="0.85"
            max="1.25"
            step="0.05"
            value={options.fontSizeScale}
            onChange={(e) => setOptions((prev) => ({ ...prev, fontSizeScale: parseFloat(e.target.value) }))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <span className="text-xs text-amber-400 font-mono">{Math.round(options.fontSizeScale * 100)}%</span>
        </div>
      </section>

      {/* 6. Designer Credit Watermark (Prompt requirement: "Designed by Ammar Khandoker") */}
      <section className="space-y-3 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="font-bangla text-sm font-semibold text-slate-200 flex items-center gap-2">
            <User className="h-4 w-4 text-amber-400" />
            <span>ওয়ালপেপার ডিজাইনার সিগনেচার</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-amber-400 cursor-pointer">
            <input
              type="checkbox"
              checked={options.showDesignerCredit}
              onChange={(e) => setOptions((prev) => ({ ...prev, showDesignerCredit: e.target.checked }))}
              className="rounded accent-amber-500"
            />
            <span className="font-bangla">সিগনেচার প্রদর্শন</span>
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            value={options.designerCredit}
            onChange={(e) => setOptions((prev) => ({ ...prev, designerCredit: e.target.value }))}
            placeholder="Designed by Ammar Khandoker"
            className="w-full rounded-xl border border-amber-500/40 bg-slate-900/80 px-3.5 py-2.5 text-xs text-amber-300 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          <span className="absolute right-3 top-2.5 text-[11px] text-slate-500 pointer-events-none">৪কে ওয়াটারমার্ক</span>
        </div>
        <p className="text-[11px] text-slate-400 font-bangla">
          ওয়ালপেপারের ডানপাশের নিচে সুনিপুণ সোনালী হরফে এই ক্রেডিট মুদ্রিত থাকবে।
        </p>
      </section>
    </div>
  );
};
