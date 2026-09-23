import React, { useState } from 'react';
import { PlayerState } from '../types/game';
import { sound } from '../utils/audio';
import { ShieldCheck, ShieldAlert, Percent, Smartphone, Lock, Eye, EyeOff, Sparkles, TrendingUp } from 'lucide-react';

interface BankSimulatorViewProps {
  player: PlayerState;
  onChangeCashback: (category: string) => void;
}

export const BankSimulatorView: React.FC<BankSimulatorViewProps> = ({
  player,
  onChangeCashback
}) => {
  const [showCvv, setShowCvv] = useState<boolean>(false);
  const [isCardFrozen, setIsCardFrozen] = useState<boolean>(false);

  // Compound interest calculator state
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1000);
  const [years, setYears] = useState<number>(3);
  const rate = 0.14; // 14% annual

  // Calculate compound interest
  // FV = P * ((1 + r/12)^(12*t) - 1) / (r/12)
  const months = years * 12;
  const monthlyRate = rate / 12;
  const totalInvested = monthlyContribution * months;
  const futureValue = Math.round(
    monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
  );
  const interestEarned = futureValue - totalInvested;

  const categories = [
    { name: 'Транспорт и проезд', pct: '10%' },
    { name: 'Книги и образование', pct: '7%' },
    { name: 'Спортивные секции', pct: '5%' },
    { name: 'Кино и театры', pct: '5%' }
  ];

  const handleToggleFreeze = () => {
    sound.playClick();
    setIsCardFrozen(!isCardFrozen);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Editorial Header */}
      <div className="space-y-1">
        <div className="text-xs uppercase font-semibold tracking-wider text-cyan-400">
          Виртуальный молодежный необанк
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Банк-Онлайн & Калькулятор сложного процента
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Управляй картой, изучай безопасность платежей и смотри, как растут сбережения.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Teen Debit Card Mockup & Controls */}
        <div className="space-y-5">
          {/* Card Mockup */}
          <div className={`relative aspect-16/10 rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl border transition-all ${
            isCardFrozen
              ? 'bg-gradient-to-br from-slate-700 to-slate-900 border-slate-600 grayscale'
              : 'bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 border-emerald-500/30'
          }`}>
            {/* Top row: Bank name & Chip */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  ФинКвест<span className="text-emerald-400">Junior</span>
                </span>
                {isCardFrozen && (
                  <span className="text-xs bg-rose-500 text-white font-bold px-2 py-0.5 rounded">
                    ЗАМОРОЖЕНА
                  </span>
                )}
              </div>
              <div className="w-11 h-8 rounded-lg bg-amber-400/80 border border-amber-300 flex items-center justify-center text-[10px] font-mono text-slate-950 font-bold">
                CHIP
              </div>
            </div>

            {/* Middle row: Card Number */}
            <div className="font-mono text-lg sm:text-xl tracking-widest text-slate-200">
              •••• •••• •••• 4289
            </div>

            {/* Bottom row: Balance, Name & Expiry */}
            <div className="flex items-end justify-between text-xs">
              <div>
                <div className="text-slate-400 uppercase text-[10px] tracking-wider">Баланс карты</div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                  {player.cardBalance.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-slate-300 font-medium uppercase tracking-wider mt-1">
                  {player.name}
                </div>
              </div>

              <div className="text-right">
                <div className="text-slate-400 uppercase text-[10px] tracking-wider">Срок</div>
                <div className="font-mono text-slate-200 font-bold">12/29</div>
                <div className="mt-1 flex items-center gap-1 font-mono text-slate-300 justify-end">
                  <span className="text-slate-400">CVV:</span>
                  <span>{showCvv ? '942' : '•••'}</span>
                  <button
                    onClick={() => setShowCvv(!showCvv)}
                    className="ml-1 text-slate-400 hover:text-white"
                  >
                    {showCvv ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/90 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300 mb-0.5">Урок кибербезопасности:</div>
              Код CVV (три цифры на обороте) и коды из SMS — это ключи от сейфа. Банк никогда не просит их назвать. Если кто-то их требует — это 100% мошенник!
            </div>
          </div>

          {/* Quick Security Controls */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Управление безопасностью
            </h3>

            <div className="flex items-center justify-between py-2 border-t border-slate-700/60">
              <div className="text-xs">
                <div className="font-medium text-slate-200">Экстренная заморозка карты</div>
                <div className="text-slate-400">Если заметил подозрительный звонок или транзакцию</div>
              </div>
              <button
                onClick={handleToggleFreeze}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isCardFrozen
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40'
                }`}
              >
                {isCardFrozen ? 'Разблокировать' : 'Заморозить карту'}
              </button>
            </div>
          </div>

          {/* Cashback Category Selector */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-cyan-400" />
              Категория повышенного кешбэка
            </h3>
            <p className="text-xs text-slate-400">
              Текущая категория: <span className="font-semibold text-cyan-300">{player.cashbackCategory}</span>
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {categories.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    sound.playClick();
                    onChangeCashback(c.name);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    player.cashbackCategory === c.name
                      ? 'bg-cyan-950/60 border-cyan-500/60 text-white font-semibold'
                      : 'bg-slate-900/60 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{c.name}</span>
                    <span className="font-mono text-cyan-400 font-bold ml-1">{c.pct}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Compound Interest Simulator */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Магия сложного процента («Снежный ком»)
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-400">
            Посмотри, сколько денег накопится, если каждый месяц откладывать карманные деньги на счет с доходностью 14% годовых с капитализацией процентов.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Откладывать в месяц:</span>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">
                  {monthlyContribution.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="5000"
                step="100"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Горизонт накопления:</span>
                <span className="font-mono text-cyan-400 font-bold tabular-nums">
                  {years} {years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Comparison Matrix */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-slate-900/80 border border-slate-700/70 rounded-xl space-y-1">
              <div className="text-[11px] text-slate-400">Своими руками внесено:</div>
              <div className="text-base sm:text-lg font-mono font-bold text-slate-200 tabular-nums">
                {totalInvested.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-[10px] text-slate-500">Без дохода под матрасом</div>
            </div>

            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-1">
              <div className="text-[11px] text-emerald-300 font-medium">Итоговый капитал:</div>
              <div className="text-base sm:text-lg font-mono font-bold text-emerald-400 tabular-nums">
                {futureValue.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-[10px] text-emerald-300/80 font-mono">
                +{interestEarned.toLocaleString('ru-RU')} ₽ подарком от процентов!
              </div>
            </div>
          </div>

          {/* Visual Bar Comparison */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Доля процентов от банка в итоговом капитале:</span>
              <span className="font-mono text-emerald-400 font-bold">
                +{Math.round((interestEarned / futureValue) * 100)}%
              </span>
            </div>
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-700/60">
              <div style={{ width: `${(totalInvested / futureValue) * 100}%` }} className="bg-slate-500" title="Внесенные деньги" />
              <div style={{ width: `${(interestEarned / futureValue) * 100}%` }} className="bg-emerald-400" title="Проценты" />
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-emerald-400">Секрет миллионеров:</span> Сложный процент работает медленно в первые месяцы, но через 3–5 лет проценты начинают приносить больше денег, чем ты откладываешь сам!
          </div>
        </div>
      </div>
    </div>
  );
};
