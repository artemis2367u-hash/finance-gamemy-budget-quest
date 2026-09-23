import React, { useState } from 'react';
import { ENCYCLOPEDIA_TERMS } from '../data/encyclopediaData';
import { EncyclopediaTerm } from '../types/game';
import { BookOpen, Search, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { sound } from '../utils/audio';

interface EncyclopediaViewProps {
  unlockedTermIds: string[];
}

export const EncyclopediaView: React.FC<EncyclopediaViewProps> = ({ unlockedTermIds }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Все термины' },
    { id: 'basics', label: 'Основы бюджета' },
    { id: 'banking', label: 'Банки и карты' },
    { id: 'security', label: 'Безопасность' },
    { id: 'investing', label: 'Инвестиции' }
  ];

  const filtered = ENCYCLOPEDIA_TERMS.filter((term) => {
    const matchesCat = activeCategory === 'all' || term.category === activeCategory;
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Editorial Header */}
      <div className="space-y-1">
        <div className="text-xs uppercase font-semibold tracking-wider text-emerald-400">
          Справочник школьного финансиста
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Финансовая Энциклопедия & Лайфхаки
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Простые и практичные объяснения главных законов денег с примерами из жизни подростка.
        </p>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Segmented Buttons */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                sound.playClick();
                setActiveCategory(c.id);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === c.id
                  ? 'bg-slate-700 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Поиск по терминам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isUnlocked = unlockedTermIds.includes(item.id);

          return (
            <div
              key={item.id}
              className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-3.5 flex flex-col justify-between hover:border-slate-600 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item.term}</span>
                  </h3>
                  {isUnlocked ? (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Изучено
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium shrink-0">
                      В словаре
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.definition}
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-700/50 text-xs">
                <div className="p-3 bg-slate-900/70 rounded-xl text-slate-300">
                  <span className="font-semibold text-cyan-300">Пример для школьника: </span>
                  {item.teenExample}
                </div>

                <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-emerald-200/90 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-300">Золотое правило: </span>
                    {item.goldenRule}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
