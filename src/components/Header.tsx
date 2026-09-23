import React from 'react';
import { Volume2, VolumeX, RotateCcw, Award } from 'lucide-react';
import { sound } from '../utils/audio';

export type ActiveTab = 'quest' | 'goals' | 'budget' | 'bank' | 'phishing' | 'encyclopedia';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onResetGame: () => void;
  achievementsCount: number;
  unclaimedGoalsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  onResetGame,
  achievementsCount,
  unclaimedGoalsCount = 0
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    sound.enabled = next;
    setSoundEnabled(next);
    if (next) sound.playClick();
  };

  const navItems: { id: ActiveTab; label: string; badge?: number }[] = [
    { id: 'quest', label: 'Квест' },
    { id: 'goals', label: 'Цели', badge: unclaimedGoalsCount },
    { id: 'budget', label: 'Мой Бюджет' },
    { id: 'bank', label: 'Банк-Онлайн' },
    { id: 'phishing', label: 'Антифишинг' },
    { id: 'encyclopedia', label: 'Энциклопедия' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('quest');
          }}
          className="text-left font-bold text-lg tracking-tight text-white hover:text-emerald-400 transition-colors cursor-pointer"
        >
          ФинКвест
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(item.id);
                }}
                className={`py-1 px-2.5 sm:px-3 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-slate-800/80 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full font-mono animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary functional actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {achievementsCount > 0 && (
            <div className="hidden lg:flex items-center gap-1 text-xs text-amber-400 font-medium">
              <Award className="w-3.5 h-3.5" />
              <span className="tabular-nums">{achievementsCount}</span>
            </div>
          )}

          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Выключить звук' : 'Включить звук'}
            title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            onClick={onResetGame}
            title="Начать квест сначала"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700/70 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Сброс</span>
          </button>
        </div>
      </div>
    </header>
  );
};
