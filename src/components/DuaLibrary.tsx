import React, { useState } from 'react';
import { ISLAMIC_DUAS, IslamicDua } from '../data/duas';
import { Sparkles, Copy, Check, ExternalLink, Bookmark, Search } from 'lucide-react';

interface DuaLibraryProps {
  selectedDua: IslamicDua;
  onSelectDua: (dua: IslamicDua) => void;
  onSetAsPrimaryWallpaper: (dua: IslamicDua) => void;
}

export const DuaLibrary: React.FC<DuaLibraryProps> = ({
  selectedDua,
  onSelectDua,
  onSetAsPrimaryWallpaper
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', label: 'সকল শ্রেষ্ঠ দোয়া' },
    { id: 'istighfar', label: 'ইস্তিগফার ও তাওবা' },
    { id: 'protection', label: 'হিফাজত ও নিরাপত্তা' },
    { id: 'hardship', label: 'বিপদ ও দুশ্চিন্তা মুক্তি' },
    { id: 'worship', label: 'কল্যাণ ও ইবাদত' },
    { id: 'parents', label: 'পিতামাতার মাগফিরাত' },
    { id: 'knowledge', label: 'জ্ঞান ও ইলম বৃদ্ধি' },
  ];

  const filteredDuas = ISLAMIC_DUAS.filter((dua) => {
    const matchesCat = filterCategory === 'all' || dua.category === filterCategory;
    const matchesSearch =
      dua.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dua.pronunciation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dua.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (dua: IslamicDua) => {
    const text = `【${dua.title}】\n\n${dua.arabic}\n\nউচ্চারণ: ${dua.pronunciation}\n\nঅর্থ: ${dua.meaning}\n\nহাদিস রেফারেন্স: ${dua.reference}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto py-4">
      {/* Category filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 p-1 bg-slate-900/60 rounded-xl border border-slate-800">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bangla whitespace-nowrap transition-all ${
                filterCategory === c.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="দোয়া বা উচ্চারণ খুঁজুন..."
            className="w-full sm:w-60 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Duas List Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredDuas.map((dua) => {
          const isSelected = selectedDua.id === dua.id;
          return (
            <div
              key={dua.id}
              className={`rounded-2xl border transition-all p-6 bg-[#0f1726]/80 backdrop-blur-md relative overflow-hidden ${
                isSelected
                  ? 'border-amber-400 ring-1 ring-amber-400/40 shadow-xl shadow-amber-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card top banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">۞</span>
                  <div>
                    <h3 className="font-bangla text-lg font-bold text-white">{dua.title}</h3>
                    <p className="font-bangla text-xs text-amber-300/80">{dua.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(dua)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {copiedId === dua.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span className="font-bangla">{copiedId === dua.id ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>

                  <button
                    onClick={() => onSetAsPrimaryWallpaper(dua)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bangla font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-amber-400 border border-amber-500/30 hover:bg-amber-500/10'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isSelected ? 'বর্তমান ওয়ালপেপার' : 'ওয়ালপেপারে সেট করুন'}</span>
                  </button>
                </div>
              </div>

              {/* Arabic Calligraphy */}
              <div className="py-5 text-center">
                <p dir="rtl" className="font-arabic text-2xl sm:text-3xl text-amber-300 leading-loose">
                  {dua.arabic}
                </p>
              </div>

              {/* Pronunciation & Meaning */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[11px] font-semibold text-amber-400 font-bangla">বাংলা উচ্চারণ:</p>
                  <p className="font-bangla text-sm sm:text-base font-medium text-white mt-0.5 leading-relaxed">
                    {dua.pronunciation}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
                  <p className="text-[11px] font-semibold text-slate-400 font-bangla">বাংলা অর্থ ও তাৎপর্য:</p>
                  <p className="font-bangla text-xs sm:text-sm text-slate-200 mt-0.5 leading-relaxed">
                    “{dua.meaning}”
                  </p>
                </div>
              </div>

              {/* Fazilat & Reference footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 font-bangla gap-2">
                <div>
                  <strong className="text-slate-300 font-medium">ফজিলত: </strong>
                  <span>{dua.virtue}</span>
                </div>
                <div className="shrink-0 text-amber-400/90 font-mono text-[11px]">
                  {dua.reference}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
