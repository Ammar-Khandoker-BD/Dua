import React, { useState } from 'react';
import { ISLAMIC_DUAS, IslamicDua } from '../data/duas';
import { Eye, EyeOff, RotateCcw, Volume2, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, BookOpen } from 'lucide-react';

interface MemorizationStudioProps {
  onSelectDuaForWallpaper: (dua: IslamicDua) => void;
}

export const MemorizationStudio: React.FC<MemorizationStudioProps> = ({ onSelectDuaForWallpaper }) => {
  const sayyidul = ISLAMIC_DUAS[0]; // Sayyidul Istighfar
  const chunks = sayyidul.chunks || [];

  const [activeStep, setActiveStep] = useState(0);
  const [hidePronunciation, setHidePronunciation] = useState(false);
  const [hideMeaning, setHideMeaning] = useState(false);
  const [hideArabic, setHideArabic] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  const [targetRepeats, setTargetRepeats] = useState(7);
  const [revealedChunks, setRevealedChunks] = useState<Record<number, boolean>>({});

  const handleNextStep = () => {
    if (activeStep < chunks.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const toggleChunkReveal = (idx: number) => {
    setRevealedChunks((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const currentChunk = chunks[activeStep];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-4">
      {/* Hero Intro Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-emerald-950/40 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-amber-400 font-bangla">
              সহজে মুখস্থ করার বিশেষ পদ্ধতি · ধাপ ভিত্তিক অনুশীলন
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-bangla">
              সাইয়্যেদুল ইস্তিগফার মুখস্থ করার ডিজিটাল স্টুডিও
            </h2>
            <p className="text-sm text-slate-300 font-bangla max-w-2xl leading-relaxed">
              নবীজী (ﷺ) বলেছেন— যে ব্যক্তি গভীর বিশ্বাসের সাথে সকালে বা সন্ধ্যায় এই দোয়া পাঠ করবে, সে জান্নাতীদের অন্তর্ভুক্ত হবে (বুখারী: ৬৩০৬)। বড় এই দোয়াটিকে সহজ ৭টি অর্থপূর্ণ বাক্যে ভাগ করা হয়েছে যাতে স্ক্রিনের দিকে তাকিয়ে আপনি মাত্র ১৫ মিনিটে এটি সম্পূর্ণ মুখস্থ করে নিতে পারেন।
            </p>
          </div>

          <button
            onClick={() => onSelectDuaForWallpaper(sayyidul)}
            className="shrink-0 flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>ওয়ালপেপারে সেট করুন</span>
          </button>
        </div>
      </div>

      {/* Main Memorization Interactive Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1422] p-6 sm:p-8 shadow-2xl relative">
        {/* Step indicator header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-sm">
              0{activeStep + 1}
            </span>
            <div>
              <p className="text-xs text-slate-400 font-bangla">বর্তমান বাক্য ধাপ</p>
              <p className="text-sm font-bold text-white font-bangla">৭টি পর্বের মধ্যে {activeStep + 1} নং অংশ</p>
            </div>
          </div>

          {/* Quick hiding toggles for memory testing */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHidePronunciation(!hidePronunciation)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bangla transition-colors border ${
                hidePronunciation
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {hidePronunciation ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>উচ্চারণ {hidePronunciation ? 'লুকানো' : 'দৃশ্যমান'}</span>
            </button>

            <button
              onClick={() => setHideMeaning(!hideMeaning)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bangla transition-colors border ${
                hideMeaning
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {hideMeaning ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>অর্থ {hideMeaning ? 'লুকানো' : 'দৃশ্যমান'}</span>
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full my-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
            style={{ width: `${((activeStep + 1) / chunks.length) * 100}%` }}
          />
        </div>

        {/* Current Active Chunk Display Area */}
        {currentChunk && (
          <div className="my-8 flex flex-col items-center text-center space-y-6">
            {/* Arabic */}
            <div className="relative group w-full py-4">
              <p
                dir="rtl"
                className={`font-arabic text-3xl sm:text-5xl lg:text-6xl text-amber-300 leading-relaxed transition-all ${
                  hideArabic ? 'blur-md select-none' : ''
                }`}
              >
                {currentChunk.arabic}
              </p>
            </div>

            {/* Pronunciation */}
            <div className="w-full max-w-2xl py-3 px-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-amber-400/80 font-bangla mb-1">বিশুদ্ধ বাংলা উচ্চারণ:</p>
              <p
                className={`font-bangla text-xl sm:text-2xl font-semibold text-white transition-all ${
                  hidePronunciation ? 'blur-sm select-none hover:blur-none cursor-pointer' : ''
                }`}
                title={hidePronunciation ? 'দেখতে ক্লিক করুন' : undefined}
              >
                {currentChunk.pronunciation}
              </p>
              {hidePronunciation && (
                <p className="text-[10px] text-amber-400/60 mt-1 font-bangla">লুকানো আছে — না দেখে পড়ার চেষ্টা করুন (হোভার/ক্লিক করলে দেখা যাবে)</p>
              )}
            </div>

            {/* Bengali Meaning */}
            <div className="w-full max-w-2xl py-3 px-6 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <p className="text-xs text-slate-400 font-bangla mb-1">অর্থ ও মর্মার্থ:</p>
              <p
                className={`font-bangla text-base sm:text-lg text-slate-200 transition-all ${
                  hideMeaning ? 'blur-sm select-none hover:blur-none cursor-pointer' : ''
                }`}
                title={hideMeaning ? 'দেখতে ক্লিক করুন' : undefined}
              >
                “{currentChunk.meaning}”
              </p>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <button
            onClick={handlePrevStep}
            disabled={activeStep === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-sm font-bangla text-slate-200 hover:bg-slate-700 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>পূর্ববর্তী বাক্য</span>
          </button>

          {/* Quick chunk navigation dots */}
          <div className="flex items-center gap-1.5">
            {chunks.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === activeStep
                    ? 'w-7 bg-amber-400'
                    : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`ধাপ ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNextStep}
            disabled={activeStep === chunks.length - 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm font-bangla hover:bg-amber-400 disabled:opacity-40 transition-colors shadow-md shadow-amber-500/20"
          >
            <span>পরবর্তী বাক্য</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Repetition / Dhikr Practice Counter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-[#0d1422] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bangla text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-amber-400" />
              <span>পুনরাবৃত্তি কাউন্টার (মুখস্থ মজবুত করতে)</span>
            </h3>
            <span className="font-mono text-sm text-amber-400 font-bold">{repeatCount} / {targetRepeats} বার</span>
          </div>

          <p className="text-xs text-slate-400 font-bangla">
            প্রতিটি বাক্য কমপক্ষে ৩ থেকে ৭ বার একাধারে পাঠ করলে মস্তিষ্কে স্থায়ীভাবে গেঁথে যায়।
          </p>

          <div className="flex items-center gap-2">
            {[3, 7, 11, 21].map((cnt) => (
              <button
                key={cnt}
                onClick={() => setTargetRepeats(cnt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  targetRepeats === cnt
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {cnt}x লক্ষ্য
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setRepeatCount((prev) => prev + 1)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bangla font-bold text-base shadow-lg shadow-emerald-950/40 hover:brightness-110 active:scale-95 transition-all"
            >
              + ১ বার পাঠ করলাম
            </button>
            <button
              onClick={() => setRepeatCount(0)}
              title="রিসেট করুন"
              className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tajweed & Pronunciation Tips */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d1422] p-6 space-y-4">
          <h3 className="font-bangla text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span>সঠিক উচ্চারণ ও তাজভীদ নির্দেশনা</span>
          </h3>

          <ul className="space-y-2.5 text-xs text-slate-300 font-bangla">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">১.</span>
              <span><strong>‘খলাক্বতানী’ (خَلَقْتَنِي):</strong> ‘ক্বাফ’ অক্ষরে ক্বলক্বলাহ করতে হবে (হালকা প্রতিধ্বনি হবে)।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">২.</span>
              <span><strong>‘আ‘ঊযু’ (أَعُوذُ):</strong> ‘আইন’ হরফটি গলার মধ্যভাগ থেকে এবং ‘যাল’ জিহ্বার আগা থেকে নরমভাবে পড়তে হবে।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">৩.</span>
              <span><strong>‘আবূউ লাকা’ (أَبُوءُ لَكَ):</strong> হামযাহ স্পষ্ট করে পড়তে হবে; নিয়ামতের কৃতজ্ঞতাসূচক চমৎকার আরবী শব্দ।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">৪.</span>
              <span><strong>‘ফাইন্নাহু’ (فَإِنَّهُ):</strong> ‘নূন’ এর উপর তাশদীদ থাকায় ওয়াজিব গুন্নাহ সহকারে পাঠ করতে হবে।</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Full 7-Chunk Overview Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1422] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bangla text-lg font-bold text-white">
            সাইয়্যেদুল ইস্তিগফারের পূর্ণাঙ্গ ৭টি খণ্ড একনজরে
          </h3>
          <span className="text-xs text-amber-400 font-bangla">যেকোনো সারিতে ক্লিক করে সরাসরি পড়ুন</span>
        </div>

        <div className="space-y-2.5">
          {chunks.map((chunk, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400/30'
                    : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`h-6 w-6 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                    isCurrent ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    0{idx + 1}
                  </span>
                  <div>
                    <p className="font-bangla text-sm font-semibold text-white">{chunk.pronunciation}</p>
                    <p className="font-bangla text-xs text-slate-400 mt-0.5">{chunk.meaning}</p>
                  </div>
                </div>

                <p dir="rtl" className="font-arabic text-xl text-amber-300 font-medium">
                  {chunk.arabic}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
