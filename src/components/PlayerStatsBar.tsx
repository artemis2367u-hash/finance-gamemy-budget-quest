import React from 'react';
import { PlayerState } from '../types/game';
import { Wallet, CreditCard, PiggyBank, Target, Brain, Smile } from 'lucide-react';

interface PlayerStatsBarProps {
  player: PlayerState;
  onOpenGoals?: () => void;
}

export const PlayerStatsBar: React.FC<PlayerStatsBarProps> = ({ player, onOpenGoals }) => {
  const totalMoney = player.cash + player.cardBalance + player.savings;
  const goalProgress = Math.min(100, Math.round((totalMoney / player.goal.cost) * 100));

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Player Profile & Total Capital */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-100">{player.name}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{player.grade} класс</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>День {player.day} из 30</span>
          </div>

          <div className="hidden sm:inline text-slate-600" aria-hidden="true">|</div>

          <div className="flex items-center gap-1.5 text-slate-200">
            <span className="text-slate-400">Капитал:</span>
            <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
              {totalMoney.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        {/* Center: Accounts Breakdown (Zero pills, clean structured items) */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300" title="Наличные в кармане">
            <Wallet className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-400">Наличные:</span>
            <span className="tabular-nums font-medium text-slate-100">{player.cash.toLocaleString('ru-RU')} ₽</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300" title="Баланс дебетовой карты">
            <CreditCard className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400">Карта:</span>
            <span className="tabular-nums font-medium text-slate-100">{player.cardBalance.toLocaleString('ru-RU')} ₽</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300" title="Накопительный счет со сложным процентом">
            <PiggyBank className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-400">Вклад 14%:</span>
            <span className="tabular-nums font-medium text-emerald-300">{player.savings.toLocaleString('ru-RU')} ₽</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300" title="Финансовая грамотность (IQ)">
            <Brain className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span className="text-slate-400">Фин-IQ:</span>
            <span className="tabular-nums font-medium text-violet-300">{player.knowledge}/100</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300" title="Настроение и уровень энергии">
            <Smile className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="text-slate-400">Настроение:</span>
            <span className="tabular-nums font-medium text-amber-200">{player.happiness}%</span>
          </div>
        </div>

        {/* Right: Interactive Goal Tracker */}
        <button
          onClick={onOpenGoals}
          title="Открыть дерево целей и наград"
          className="flex items-center gap-3 min-w-[200px] text-left hover:opacity-90 transition-opacity cursor-pointer p-1 rounded-lg hover:bg-slate-800/40"
        >
          <div className="flex items-center gap-1.5 text-xs text-slate-300 shrink-0">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[110px]" title={player.goal.title}>{player.goal.title}:</span>
          </div>

          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-300 font-medium shrink-0">
              {goalProgress}%
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
