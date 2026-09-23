import React, { useState } from 'react';
import { PlayerState } from '../types/game';
import { sound } from '../utils/audio';
import { PieChart, Clock, Calculator, ArrowUpRight, ArrowDownRight, Check, AlertCircle } from 'lucide-react';

interface BudgetSimulatorViewProps {
  player: PlayerState;
  onUpdateSavings: (amount: number) => void;
}

export const BudgetSimulatorView: React.FC<BudgetSimulatorViewProps> = ({
  player,
  onUpdateSavings
}) => {
  const [plannerIncome, setPlannerIncome] = useState<number>(5000);
  const [needsPct, setNeedsPct] = useState<number>(50);
  const [wantsPct, setWantsPct] = useState<number>(30);
  const [savingsPct, setSavingsPct] = useState<number>(20);

  // Impulse buying test calculator state
  const [impulseItemName, setImpulseItemName] = useState<string>('');
  const [impulseItemCost, setImpulseItemCost] = useState<number>(1500);
  const [hourlyWage, setHourlyWage] = useState<number>(300); // 300 руб/час школьной подработки
  const [analyzedItem, setAnalyzedItem] = useState<{
    hoursNeeded: number;
    goalDelayPercent: number;
    verdict: string;
  } | null>(null);

  // Manual savings deposit
  const [depositAmount, setDepositAmount] = useState<number>(500);

  const totalPct = needsPct + wantsPct + savingsPct;
  const needsMoney = Math.round((plannerIncome * needsPct) / 100);
  const wantsMoney = Math.round((plannerIncome * wantsPct) / 100);
  const savingsMoney = Math.round((plannerIncome * savingsPct) / 100);

  const handleAnalyzeImpulse = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const hours = Math.round((impulseItemCost / hourlyWage) * 10) / 10;
    const goalDelay = Math.round((impulseItemCost / player.goal.cost) * 100);

    let verdict = 'Умеренная покупка';
    if (impulseItemCost > player.cash + player.cardBalance) {
      verdict = 'Не по карману! Приведет к долгам.';
    } else if (goalDelay > 15) {
      verdict = 'Опасное замедление цели! Лучше подождать 24 часа.';
    } else {
      verdict = 'Вписывается в лимит «Желания», если это запланировано.';
    }

    setAnalyzedItem({
      hoursNeeded: hours,
      goalDelayPercent: goalDelay,
      verdict
    });
  };

  const handleTransferToSavings = () => {
    const available = player.cash + player.cardBalance;
    if (depositAmount <= 0 || depositAmount > available) {
      sound.playWarning();
      return;
    }
    sound.playCoin();
    onUpdateSavings(depositAmount);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Editorial Header */}
      <div className="space-y-1">
        <div className="text-xs uppercase font-semibold tracking-wider text-emerald-400">
          Инструмент школьного финансиста
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Управление личным бюджетом
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Калькулятор правила 50/30/20, проверка импульсивных покупок и анализ расходов.
        </p>
      </div>

      {/* Grid: 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Interactive 50/30/20 Budget Allocator */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              Планировщик «Правило 50/30/20»
            </h2>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${totalPct === 100 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
              Итого: {totalPct}%
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Месячный доход (карманные + заработок):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="500"
                  max="100000"
                  step="500"
                  value={plannerIncome}
                  onChange={(e) => setPlannerIncome(Number(e.target.value) || 0)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-sm focus:outline-hidden focus:border-emerald-500"
                />
                <span className="font-mono text-slate-400 text-sm">₽ / месяц</span>
              </div>
            </div>

            {/* Needs 50% */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">1. Обязательные нужды (50%):</span>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">
                  {needsMoney.toLocaleString('ru-RU')} ₽ ({needsPct}%)
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={needsPct}
                onChange={(e) => setNeedsPct(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-xs text-slate-500">
                Обеды в школе, проезд, связь, необходимые канцтовары.
              </p>
            </div>

            {/* Wants 30% */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">2. Личные желания и досуг (30%):</span>
                <span className="font-mono text-cyan-400 font-bold tabular-nums">
                  {wantsMoney.toLocaleString('ru-RU')} ₽ ({wantsPct}%)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={wantsPct}
                onChange={(e) => setWantsPct(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <p className="text-xs text-slate-500">
                Походы в кино, фастфуд с друзьями, игры, подарки.
              </p>
            </div>

            {/* Savings 20% */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">3. Сбережения и цель (20%):</span>
                <span className="font-mono text-amber-400 font-bold tabular-nums">
                  {savingsMoney.toLocaleString('ru-RU')} ₽ ({savingsPct}%)
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={savingsPct}
                onChange={(e) => setSavingsPct(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-xs text-slate-500">
                В копилку на мечту ({player.goal.title}) и подушку безопасности.
              </p>
            </div>

            {/* Visual stacked distribution bar */}
            <div className="pt-2">
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-700/60">
                <div style={{ width: `${(needsPct / totalPct) * 100}%` }} className="bg-emerald-500 transition-all" title="Нужды" />
                <div style={{ width: `${(wantsPct / totalPct) * 100}%` }} className="bg-cyan-500 transition-all" title="Желания" />
                <div style={{ width: `${(savingsPct / totalPct) * 100}%` }} className="bg-amber-500 transition-all" title="Сбережения" />
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Impulse Buy "Rule of 24 Hours" Test */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Тест: «Правило 24 часов»
            </h2>
            <span className="text-xs text-slate-400">Стоп-импульс</span>
          </div>

          <form onSubmit={handleAnalyzeImpulse} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Какую вещь захотелось купить прямо сейчас?
              </label>
              <input
                type="text"
                placeholder="Например: Новые беспроводные наушники"
                value={impulseItemName}
                onChange={(e) => setImpulseItemName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Цена товара:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="100"
                    max="100000"
                    step="100"
                    value={impulseItemCost}
                    onChange={(e) => setImpulseItemCost(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-hidden focus:border-amber-500"
                  />
                  <span className="text-xs font-mono text-slate-400">₽</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Оплата за час труда:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    step="50"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-hidden focus:border-amber-500"
                  />
                  <span className="text-xs font-mono text-slate-400">₽/ч</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              Рассчитать цену в часах жизни
            </button>
          </form>

          {analyzedItem && (
            <div className="p-4 bg-slate-900/80 border border-amber-500/30 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Сколько часов придется работать:</span>
                <span className="font-mono text-amber-300 font-bold text-sm">
                  {analyzedItem.hoursNeeded} ч. подработки
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Доля от твоей главной цели ({player.goal.title}):</span>
                <span className="font-mono text-rose-400 font-bold">
                  {analyzedItem.goalDelayPercent}% от цели!
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-slate-300">
                <span className="font-semibold text-amber-400">Вердикт:</span> {analyzedItem.verdict}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Module 3: Deposit to Savings Account (Копилка) */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-400" />
          Пополнить накопительный счет (копилку) сейчас
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Свободно в кармане и на карте:{' '}
          <span className="font-mono text-slate-200 font-bold">
            {(player.cash + player.cardBalance).toLocaleString('ru-RU')} ₽
          </span>
          . Деньги на накопительном счете приносят 14% годовых и защищены от случайных трат.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            min="100"
            max={player.cash + player.cardBalance}
            step="100"
            value={depositAmount}
            onChange={(e) => setDepositAmount(Number(e.target.value) || 0)}
            className="w-44 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-sm focus:outline-hidden focus:border-emerald-500"
          />
          <button
            onClick={handleTransferToSavings}
            disabled={depositAmount <= 0 || depositAmount > player.cash + player.cardBalance}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Перевести в копилку
          </button>
        </div>
      </div>

      {/* Module 4: Transaction History Ledger */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Журнал финансовых операций</h2>
          <span className="text-xs font-mono text-slate-400">
            {player.transactions.length} операций
          </span>
        </div>

        {player.transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            Операций пока нет. Начни проходить квест!
          </div>
        ) : (
          <div className="divide-y divide-slate-800 overflow-hidden">
            {player.transactions.slice().reverse().map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${t.amount >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {t.amount >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-medium text-slate-200">{t.title}</div>
                    <div className="text-xs text-slate-500">{t.dateStr}</div>
                  </div>
                </div>

                <div className={`font-mono font-bold tabular-nums ${t.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {t.amount >= 0 ? '+' : ''}{t.amount.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
