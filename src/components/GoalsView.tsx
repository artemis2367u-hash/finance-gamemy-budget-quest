import React, { useState } from 'react';
import { PlayerState, GameGoal, GoalCategory } from '../types/game';
import { SYSTEM_GOALS } from '../data/goalsData';
import { sound } from '../utils/audio';
import {
  Target,
  Sparkles,
  Gift,
  Plus,
  CheckCircle2,
  Trophy,
  Flame,
  Clock,
  PiggyBank,
  Brain,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';

interface GoalsViewProps {
  player: PlayerState;
  onClaimGoalReward: (goal: GameGoal) => void;
  onAddCustomGoal: (goal: GameGoal) => void;
  onRemoveCustomGoal: (goalId: string) => void;
  onSwitchPrimaryGoal: (newGoalId: string) => void;
  onNavigateToTab: (tab: 'quest' | 'budget' | 'bank' | 'phishing') => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  player,
  onClaimGoalReward,
  onAddCustomGoal,
  onRemoveCustomGoal,
  onSwitchPrimaryGoal,
  onNavigateToTab
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Form state for creating custom goal
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customCost, setCustomCost] = useState<number>(3000);
  const [customCategory, setCustomCategory] = useState<GoalCategory>('financial_habit');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [customIcon, setCustomIcon] = useState<string>('🎯');

  const totalCapital = player.cash + player.cardBalance + player.savings;
  const primaryGoalProgress = Math.min(100, Math.round((totalCapital / player.goal.cost) * 100));

  // Combine system goals and player custom goals
  const allGoals: GameGoal[] = [...SYSTEM_GOALS, ...player.customGoals];

  // Helper to compute progress for a specific goal
  const getGoalStatus = (goal: GameGoal) => {
    let current = 0;
    let target = goal.targetValue;
    let isAchieved = false;

    switch (goal.targetType) {
      case 'savings':
        current = player.savings;
        isAchieved = current >= target;
        break;
      case 'total_capital':
        current = totalCapital;
        isAchieved = current >= target;
        break;
      case 'knowledge':
        current = player.knowledge;
        isAchieved = current >= target;
        break;
      case 'reputation':
        current = player.reputation;
        isAchieved = current >= target;
        break;
      case 'complete_scene':
        if (target === 15) {
          current = player.day;
          isAchieved = player.day >= 15;
        } else if (target === 30) {
          current = player.day;
          isAchieved = player.isCompleted || player.day >= 30;
        }
        break;
      case 'custom_amount':
        current = totalCapital;
        isAchieved = current >= target;
        break;
      default:
        current = 0;
    }

    const percent = Math.min(100, Math.round((current / (target || 1)) * 100));
    const isClaimed = player.completedGoalIds.includes(goal.id);

    return {
      current,
      target,
      percent,
      isAchieved,
      isClaimed
    };
  };

  const completedCount = allGoals.filter((g) => player.completedGoalIds.includes(g.id)).length;
  const readyToClaimCount = allGoals.filter((g) => {
    const status = getGoalStatus(g);
    return status.isAchieved && !status.isClaimed;
  }).length;

  const categories = [
    { id: 'all', label: 'Все цели' },
    { id: 'ready', label: `К награде (${readyToClaimCount})` },
    { id: 'financial_habit', label: 'Привычки' },
    { id: 'cyber_safety', label: 'Безопасность' },
    { id: 'quest_milestone', label: 'Сюжетные' },
    { id: 'custom', label: 'Мои цели' }
  ];

  const filteredGoals = allGoals.filter((goal) => {
    const status = getGoalStatus(goal);
    if (activeFilter === 'all') return true;
    if (activeFilter === 'ready') return status.isAchieved && !status.isClaimed;
    if (activeFilter === 'custom') return goal.isCustom;
    return goal.category === activeFilter;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    sound.playSuccess();
    const newGoal: GameGoal = {
      id: `custom_goal_${Date.now()}`,
      title: customTitle.trim(),
      category: customCategory,
      categoryLabel: customCategory === 'financial_habit' ? 'Моя цель накоплений' : 'Мой челлендж',
      description: customDescription.trim() || `Накопить ${customCost.toLocaleString('ru-RU')} ₽ на личную цель.`,
      targetType: 'custom_amount',
      targetValue: customCost,
      rewardIQ: 15,
      rewardHappiness: 20,
      rewardReputation: 15,
      rewardCash: Math.round(customCost * 0.05), // 5% bonus cashback
      icon: customIcon,
      isCustom: true
    };

    onAddCustomGoal(newGoal);
    setIsCreateModalOpen(false);
    setCustomTitle('');
    setCustomDescription('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs uppercase font-semibold tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            Игровой элемент: Дерево целей и квестов
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Финансовые Цели & Награды
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Ставь финансовые ориентиры, вырабатывай полезные привычки и получай бонусы к IQ и капиталу.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-lg cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Поставить свою цель</span>
        </button>
      </div>

      {/* Main Hero Card: Primary Dream Goal */}
      <div className="relative overflow-hidden bg-linear-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Goal Info */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Главная цель месяца</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">День {player.day} из 30</span>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-4xl sm:text-5xl">{player.goal.icon}</span>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {player.goal.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  {player.goal.description}
                </p>
              </div>
            </div>

            {/* Smart Advice for current progress */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                {primaryGoalProgress >= 100 ? (
                  <span className="text-emerald-400 font-bold">
                    Потрясающе! Цель полностью профинансирована. Ты доказал свою финансовую дисциплину!
                  </span>
                ) : (
                  <span>
                    Осталось накопить:{' '}
                    <strong className="text-emerald-300 font-mono">
                      {Math.max(0, player.goal.cost - totalCapital).toLocaleString('ru-RU')} ₽
                    </strong>
                    . Отправляй больше средств на накопительный счет со сложным процентом 14%!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Progress Gauge */}
          <div className="w-full md:w-64 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 text-center space-y-3 shrink-0">
            <div className="text-xs text-slate-400 font-medium">Прогресс накопления</div>
            <div className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
              {primaryGoalProgress}%
            </div>

            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
              <div
                className="h-full bg-linear-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${primaryGoalProgress}%` }}
              />
            </div>

            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>{totalCapital.toLocaleString('ru-RU')} ₽</span>
              <span>{player.goal.cost.toLocaleString('ru-RU')} ₽</span>
            </div>

            {primaryGoalProgress < 100 && (
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateToTab('budget');
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Пополнить копилку в бюджете →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gamification Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl text-center space-y-1">
          <div className="text-xs text-slate-400">Всего целей в списке</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {allGoals.length}
          </div>
        </div>

        <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl text-center space-y-1">
          <div className="text-xs text-slate-400">Выполнено целей</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 tabular-nums">
            {completedCount} <span className="text-xs text-slate-500 font-normal">/ {allGoals.length}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl text-center space-y-1">
          <div className="text-xs text-slate-400">Доступно наград</div>
          <div className={`text-xl sm:text-2xl font-mono font-bold tabular-nums ${readyToClaimCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
            {readyToClaimCount}
          </div>
        </div>

        <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl text-center space-y-1">
          <div className="text-xs text-slate-400">Пользовательских целей</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-400 tabular-nums">
            {player.customGoals.length}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-800/70 border border-slate-700/60 rounded-xl">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              sound.playClick();
              setActiveFilter(c.id);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeFilter === c.id
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.map((goal) => {
          const status = getGoalStatus(goal);

          return (
            <div
              key={goal.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                status.isClaimed
                  ? 'bg-slate-900/60 border-slate-800 opacity-75'
                  : status.isAchieved
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        {goal.categoryLabel}
                      </span>
                      <h3 className="font-bold text-base text-white">{goal.title}</h3>
                    </div>
                  </div>

                  {goal.isCustom && (
                    <button
                      onClick={() => onRemoveCustomGoal(goal.id)}
                      title="Удалить цель"
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {goal.description}
                </p>
              </div>

              {/* Progress Bar & Value Metrics */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    {goal.targetType === 'savings' && 'В копилке:'}
                    {goal.targetType === 'total_capital' && 'Общий капитал:'}
                    {goal.targetType === 'knowledge' && 'Фин-IQ:'}
                    {goal.targetType === 'reputation' && 'Доверие:'}
                    {goal.targetType === 'complete_scene' && 'День квеста:'}
                    {goal.targetType === 'custom_amount' && 'Накоплено:'}
                  </span>
                  <span className="font-bold text-slate-200 tabular-nums">
                    {status.current.toLocaleString('ru-RU')} / {status.target.toLocaleString('ru-RU')}
                    {goal.targetType === 'savings' || goal.targetType === 'total_capital' || goal.targetType === 'custom_amount'
                      ? ' ₽'
                      : goal.targetType === 'knowledge'
                      ? ' IQ'
                      : goal.targetType === 'reputation'
                      ? '%'
                      : ' дн.'}
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      status.isClaimed
                        ? 'bg-slate-600'
                        : status.isAchieved
                        ? 'bg-emerald-400'
                        : 'bg-teal-500'
                    }`}
                    style={{ width: `${status.percent}%` }}
                  />
                </div>
              </div>

              {/* Rewards Strip & Action */}
              <div className="pt-2 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-3">
                {/* Rewards preview */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    Награда:
                  </span>
                  {goal.rewardIQ > 0 && (
                    <span className="text-violet-400 font-mono font-medium">+{goal.rewardIQ} IQ</span>
                  )}
                  {goal.rewardHappiness > 0 && (
                    <span className="text-amber-300 font-mono font-medium">+{goal.rewardHappiness}%</span>
                  )}
                  {goal.rewardCash && goal.rewardCash > 0 && (
                    <span className="text-emerald-400 font-mono font-bold">+{goal.rewardCash} ₽</span>
                  )}
                </div>

                {/* State button */}
                {status.isClaimed ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Награда получена
                  </span>
                ) : status.isAchieved ? (
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      onClaimGoalReward(goal);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    Забрать награду
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">
                    В процессе ({status.percent}%)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Custom Goal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Поставить личную финансовую цель
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Название цели:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Подарок маме на ДР / Кроссовки"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Целевая сумма (рублей):
                </label>
                <input
                  type="number"
                  min="500"
                  max="100000"
                  step="100"
                  required
                  value={customCost}
                  onChange={(e) => setCustomCost(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-sm focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Иконка цели:
                </label>
                <div className="flex gap-2">
                  {['🎯', '🎁', '👟', '🎮', '🎧', '📚', '🛹', '🎸'].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setCustomIcon(emoji)}
                      className={`text-xl p-2 rounded-xl border transition-all cursor-pointer ${
                        customIcon === emoji
                          ? 'bg-emerald-950/60 border-emerald-500 scale-110'
                          : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Заметка / Мотивация:
                </label>
                <textarea
                  rows={2}
                  placeholder="Зачем мне это нужно и как я планирую накопить..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md cursor-pointer"
                >
                  Создать цель
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
