import React from 'react';
import { PlayerState } from '../types/game';
import { sound } from '../utils/audio';
import { Award, CheckCircle2, RotateCcw, Share2, Sparkles, TrendingUp, ShieldCheck, Heart } from 'lucide-react';

interface FinalReportModalProps {
  isOpen: boolean;
  player: PlayerState;
  onRestart: () => void;
  onClose: () => void;
}

export const FinalReportModal: React.FC<FinalReportModalProps> = ({
  isOpen,
  player,
  onRestart,
  onClose
}) => {
  if (!isOpen) return null;

  const totalCapital = player.cash + player.cardBalance + player.savings;
  const isGoalAchieved = totalCapital >= player.goal.cost;

  let rankTitle = 'Разумный практик';
  let rankDesc = 'Ты освоил базовые законы бюджета, умеешь говорить "нет" импульсивным тратам и ценишь заработанный рубль.';

  if (player.knowledge >= 85 && totalCapital > 5000) {
    rankTitle = 'Магистр финансовой независимости';
    rankDesc = 'Феноменальный результат! Твоей финансовой дисциплине, знанию инвестиций и защите от мошенников могут позавидовать даже взрослые!';
  } else if (player.knowledge >= 65) {
    rankTitle = 'Опытный капиталист';
    rankDesc = 'Отличные навыки! Ты активно копил со сложным процентом, выбрал верный кешбэк и защитил свои счета от аферистов.';
  } else if (player.knowledge < 40) {
    rankTitle = 'Импульсивный ученик';
    rankDesc = 'Ты пока часто поддаешься сиюминутным эмоциям и давлению окружения. Попробуй пройти квест еще раз, применяя правило 50/30/20!';
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 my-8">
        {/* Certificate Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl mx-auto flex items-center justify-center text-amber-400">
            <Award className="w-9 h-9" />
          </div>
          <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            Официальный аттестат школьного финансиста
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {player.name}, {player.grade} класс
          </h2>
          <div className="inline-block px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-semibold text-emerald-300">
            Звание: {rankTitle}
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            {rankDesc}
          </p>
        </div>

        {/* Final Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-center">
            <div className="text-[11px] text-slate-400">Итоговый капитал</div>
            <div className="text-base font-mono font-bold text-emerald-400 tabular-nums">
              {totalCapital.toLocaleString('ru-RU')} ₽
            </div>
          </div>

          <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-center">
            <div className="text-[11px] text-slate-400">Целей выполнено</div>
            <div className="text-base font-mono font-bold text-amber-400 tabular-nums">
              {player.completedGoalIds?.length || 0}
            </div>
          </div>

          <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-center">
            <div className="text-[11px] text-slate-400">Финансовый IQ</div>
            <div className="text-base font-mono font-bold text-violet-400 tabular-nums">
              {player.knowledge} / 100
            </div>
          </div>

          <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-center">
            <div className="text-[11px] text-slate-400">Репутация доверия</div>
            <div className="text-base font-mono font-bold text-cyan-400 tabular-nums">
              {player.reputation} %
            </div>
          </div>

          <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-center">
            <div className="text-[11px] text-slate-400">Счастье / Энергия</div>
            <div className="text-base font-mono font-bold text-amber-300 tabular-nums">
              {player.happiness} %
            </div>
          </div>
        </div>

        {/* Goal Achievement Card */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
          isGoalAchieved
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
            : 'bg-slate-800/50 border-slate-700/60 text-slate-300'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{player.goal.icon}</span>
            <div>
              <div className="text-xs text-slate-400">Цель мечты:</div>
              <div className="font-bold text-sm sm:text-base text-white">
                {player.goal.title} ({player.goal.cost.toLocaleString('ru-RU')} ₽)
              </div>
            </div>
          </div>

          <div className="text-right">
            {isGoalAchieved ? (
              <span className="font-bold text-xs sm:text-sm text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                ЦЕЛЬ ДОСТИГНУТА!
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-mono">
                Накоплено {Math.round((totalCapital / player.goal.cost) * 100)}%
              </span>
            )}
          </div>
        </div>

        {/* 3 Golden Teen Rules */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="font-bold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            3 золотых правила, которые останутся с тобой:
          </div>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            <li><strong className="text-slate-100">Сначала заплати себе:</strong> Откладывай минимум 20% в копилку сразу в день получения карманных денег.</li>
            <li><strong className="text-slate-100">Тайна CVV и кодов:</strong> Никому и никогда не называй 3 цифры с карты и пароли из SMS.</li>
            <li><strong className="text-slate-100">Сложный процент — твой союзник:</strong> Деньги должны приносить доход выше инфляции.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Исследовать симуляторы и банк
          </button>

          <button
            onClick={() => {
              sound.playSuccess();
              onRestart();
            }}
            className="py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Пройти новый месяц с другой целью</span>
          </button>
        </div>
      </div>
    </div>
  );
};
