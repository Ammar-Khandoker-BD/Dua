import React, { useState } from 'react';
import { ISLAMIC_DUAS, IslamicDua, WALLPAPER_BACKGROUNDS } from './data/duas';
import { RenderOptions, renderWallpaperToCanvas, RESOLUTIONS } from './utils/wallpaperRenderer';
import { Header } from './components/Header';
import { WallpaperPreview } from './components/WallpaperPreview';
import { CustomizerPanel } from './components/CustomizerPanel';
import { MemorizationStudio } from './components/MemorizationStudio';
import { DuaLibrary } from './components/DuaLibrary';
import { FullscreenModal } from './components/FullscreenModal';
import { CheckCircle2, Download, Sparkles, BookOpen, Shield, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'memorize' | 'library'>('wallpaper');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [options, setOptions] = useState<RenderOptions>({
    resolution: RESOLUTIONS[0], // 3840 × 2160 (4K Ultra-HD)
    dua: ISLAMIC_DUAS[0], // Sayyidul Istighfar
    additionalDuas: [ISLAMIC_DUAS[1], ISLAMIC_DUAS[2], ISLAMIC_DUAS[4]], // Ayat al-Kursi, Dua Yunus, Dua for Parents
    layoutMode: 'single',
    backgroundSrc: WALLPAPER_BACKGROUNDS[0].src,
    overlayOpacity: 0.65,
    vignette: true,
    borderOrnament: true,
    designerCredit: 'Designed by Ammar Khandoker',
    showDesignerCredit: true,
    showArabic: true,
    showPronunciation: true,
    showMeaning: true,
    showVirtue: true,
    fontSizeScale: 1.0,
    arabicFont: 'Amiri',
    banglaFont: 'Hind Siliguri',
    accentTheme: 'gold',
  });

  const handleDownload4K = async () => {
    setIsGenerating(true);
    try {
      const offscreenCanvas = document.createElement('canvas');
      await renderWallpaperToCanvas(offscreenCanvas, options);

      offscreenCanvas.toBlob((blob) => {
        if (!blob) {
          setIsGenerating(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const safeName = options.dua.id.replace(/-/g, '_');
        a.href = url;
        a.download = `${safeName}_4k_wallpaper_ammar_khandoker.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsGenerating(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4500);
      }, 'image/png');
    } catch (err) {
      console.error('Download error:', err);
      setIsGenerating(false);
    }
  };

  const handleSelectDuaForWallpaper = (dua: IslamicDua) => {
    setOptions((prev) => ({
      ...prev,
      dua: dua,
      layoutMode: dua.chunks && dua.id === 'sayyidul-istighfar' ? prev.layoutMode : 'single',
    }));
    setActiveTab('wallpaper');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownload4K={handleDownload4K}
        onEnterFullscreen={() => setIsFullscreen(true)}
        isGenerating={isGenerating}
      />

      {/* Download Success Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-slate-950/95 p-4 text-sm shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bangla font-bold text-white text-base">৪কে ওয়ালপেপার ডাউনলোড সম্পন্ন হয়েছে!</p>
            <p className="font-bangla text-xs text-slate-400">
              ফাইলটি আপনার পিসির Wallpaper হিসেবে সেট করে প্রতিদিন সহজে দেখে দেখে মুখস্থ করুন।
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'wallpaper' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: 4K Preview Display */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <WallpaperPreview
                options={options}
                setOptions={setOptions}
                onDownload={handleDownload4K}
                isGenerating={isGenerating}
                onEnterFullscreen={() => setIsFullscreen(true)}
              />

              {/* Instructions banner for setting desktop wallpaper */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-5 text-xs text-slate-300 font-bangla space-y-2">
                <p className="font-bold text-amber-400 text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>ডেস্কটপ ব্যাকগ্রাউন্ড হিসেবে সেট করার নিয়ম:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400 pt-1">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <p className="text-white font-semibold mb-1">Windows ইউজারদের জন্য:</p>
                    <p>ডাউনলোড করা ইমেজের উপর মাউসের রাইট ক্লিক করুন এবং <span className="text-amber-300">"Set as desktop background"</span> সিলেক্ট করুন।</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <p className="text-white font-semibold mb-1">ম্যাক (macOS) ইউজারদের জন্য:</p>
                    <p>System Settings &gt; Wallpaper এ গিয়ে ডাউনলোড করা ৪কে ইমেজটি অ্যাড করুন বা ফাইন্ডার থেকে রাইট-ক্লিক করে সেট করুন।</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Customizer Controls */}
            <div className="lg:col-span-5">
              <CustomizerPanel options={options} setOptions={setOptions} />
            </div>
          </div>
        )}

        {activeTab === 'memorize' && (
          <MemorizationStudio onSelectDuaForWallpaper={handleSelectDuaForWallpaper} />
        )}

        {activeTab === 'library' && (
          <DuaLibrary
            selectedDua={options.dua}
            onSelectDua={(dua) => setOptions((prev) => ({ ...prev, dua }))}
            onSetAsPrimaryWallpaper={handleSelectDuaForWallpaper}
          />
        )}
      </main>

      {/* Fullscreen Reading Sanctuary Modal */}
      <FullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        options={options}
        setOptions={setOptions}
        onDownload={handleDownload4K}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 font-bangla">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">۞</span>
            <span>সাইয়্যেদুল ইস্তিগফার ও শ্রেষ্ঠ ইসলামিক দোয়া ৪কে ওয়ালপেপার স্টুডিও</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-semibold font-sans">
              ✦ Designed by Ammar Khandoker
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">সহীহ বুখারী ও মুসলিম রেফারেন্স সমৃদ্ধ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
