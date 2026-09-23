import React, { useState } from 'react';
import { QuestScene, QuestChoice, PlayerState } from '../types/game';
import { sound } from '../utils/audio';
import { Lightbulb, ArrowRight, CheckCircle2, AlertTriangle, TrendingUp, Sparkles, Target } from 'lucide-react';

interface QuestViewProps {
  scene: QuestScene;
  player: PlayerState;
  onMakeChoice: (choice: QuestChoice) => void;
  onOpenFinalReport?: () => void;
  onOpenGoals?: () => void;
}

export const QuestView: React.FC<QuestViewProps> = ({
  scene,
  player,
  onMakeChoice,
  onOpenFinalReport,
  onOpenGoals
}) => {
  const [selectedChoice, setSelectedChoice] = useState<QuestChoice | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const handleSelectChoice = (choice: QuestChoice) => {
    // Check if player has enough money
    if (choice.requiredCash !== undefined && player.cash < choice.requiredCash && player.cardBalance < choice.requiredCash) {
      sound.playWarning();
      return;
    }

    setSelectedChoice(choice);
    setShowFeedback(true);

    if (choice.consequences.cashChange && choice.consequences.cashChange > 0) {
      sound.playCoin();
    } else if (choice.consequences.cashChange && choice.consequences.cashChange < 0) {
      sound.playPay();
    } else {
      sound.playClick();
    }
  };

  const handleConfirmNext = () => {
    if (!selectedChoice) return;

    if (selectedChoice.nextSceneId === 'completed') {
      sound.playSuccess();
      if (onOpenFinalReport) {
        onOpenFinalReport();
      }
      return;
    }

    onMakeChoice(selectedChoice);
    setSelectedChoice(null);
    setShowFeedback(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Chapter & Scene Editorial Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <span>{scene.chapterTitle}</span>
          <span aria-hidden="true">·</span>
          <span>Сцена {scene.chapterNumber}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">
          {scene.title}
        </h1>
      </div>

      {/* Visual Thematic Illustration Banner (Hero Student) */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-21/9 max-h-72">
        <img
          src="/src/assets/images/hero_finquest_student_1790156805018.jpg"
          alt="Иллюстрация школьника за планированием личного бюджета"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Elegant CSS fallback container
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Measured dark gradient scrim for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Floating Context Marker */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">
              {scene.character ? `${scene.character.avatarEmoji} ${scene.character.name} (${scene.character.role})` : 'Интерактивная ситуация'}
            </span>
          </div>
          {scene.budgetContext && (
            <div className="font-mono text-emerald-300 font-semibold tabular-nums">
              {scene.budgetContext.amount
                ? `${scene.budgetContext.type === 'income' ? '+' : '-'}${scene.budgetContext.amount.toLocaleString('ru-RU')} ₽`
                : scene.budgetContext.label}
            </div>
          )}
        </div>
      </div>

      {/* Narrative Section */}
      <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
        {scene.narrative.map((paragraph, index) => (
          <p key={index} className="text-slate-200 text-base sm:text-lg leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Interactive Feedback & Learning Tip Overlay when choice is selected */}
      {showFeedback && selectedChoice && (
        <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-2xl p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Совет финансового эксперта
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
              </div>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                {selectedChoice.consequences.learningTip}
              </p>

              {/* Stat Delta Preview */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
                {selectedChoice.consequences.cashChange !== undefined && (
                  <span className={`tabular-nums ${selectedChoice.consequences.cashChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    Наличные: {selectedChoice.consequences.cashChange >= 0 ? '+' : ''}{selectedChoice.consequences.cashChange} ₽
                  </span>
                )}
                {selectedChoice.consequences.savingsChange !== undefined && (
                  <span className="text-teal-400 tabular-nums">
                    Вклад: {selectedChoice.consequences.savingsChange >= 0 ? '+' : ''}{selectedChoice.consequences.savingsChange} ₽
                  </span>
                )}
                {selectedChoice.consequences.cardChange !== undefined && (
                  <span className="text-cyan-400 tabular-nums">
                    Карта: {selectedChoice.consequences.cardChange >= 0 ? '+' : ''}{selectedChoice.consequences.cardChange} ₽
                  </span>
                )}
                {selectedChoice.consequences.knowledgeChange !== undefined && (
                  <span className="text-violet-400 tabular-nums">
                    Фин-IQ: +{selectedChoice.consequences.knowledgeChange}
                  </span>
                )}
                {selectedChoice.consequences.happinessChange !== undefined && (
                  <span className={`tabular-nums ${selectedChoice.consequences.happinessChange >= 0 ? 'text-amber-300' : 'text-slate-400'}`}>
                    Настроение: {selectedChoice.consequences.happinessChange >= 0 ? '+' : ''}{selectedChoice.consequences.happinessChange}%
                  </span>
                )}
              </div>

              {selectedChoice.consequences.unlockAchievement && (
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 pt-1">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Получено достижение: «{selectedChoice.consequences.unlockAchievement}»!</span>
                </div>
              )}

              {/* Goal Impact Indicator */}
              {((selectedChoice.consequences.savingsChange && selectedChoice.consequences.savingsChange !== 0) ||
                (selectedChoice.consequences.cashChange && selectedChoice.consequences.cashChange !== 0)) && (
                <div className="flex items-center justify-between p-2.5 bg-slate-900/70 border border-slate-800 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Движение к цели «{player.goal.title}»</span>
                  </div>
                  {onOpenGoals && (
                    <button
                      type="button"
                      onClick={onOpenGoals}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer underline text-[11px]"
                    >
                      Посмотреть цели →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleConfirmNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              <span>{selectedChoice.nextSceneId === 'completed' ? 'Посмотреть результаты квеста' : 'Продолжить путь'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Choice Buttons List */}
      {!showFeedback && (
        <div className="space-y-3 pt-2">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Твое решение:
          </div>

          <div className="grid gap-3">
            {scene.choices.map((choice, idx) => {
              const cannotAfford =
                choice.requiredCash !== undefined &&
                player.cash < choice.requiredCash &&
                player.cardBalance < choice.requiredCash;

              return (
                <button
                  key={choice.id}
                  disabled={cannotAfford}
                  onClick={() => handleSelectChoice(choice)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all text-slate-100 flex flex-col gap-2 group cursor-pointer ${
                    cannotAfford
                      ? 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 hover:border-emerald-500/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-medium text-base sm:text-lg leading-snug group-hover:text-emerald-300 transition-colors">
                      {idx + 1}. {choice.text}
                    </span>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 shrink-0 transition-transform group-hover:translate-x-1 mt-0.5" />
                  </div>

                  {choice.hint && (
                    <div className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
                      <span className="text-slate-500">Подсказка:</span>
                      <span>{choice.hint}</span>
                    </div>
                  )}

                  {cannotAfford && (
                    <div className="text-xs text-rose-400 flex items-center gap-1 font-mono">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Недостаточно средств (нужно {choice.requiredCash?.toLocaleString('ru-RU')} ₽)</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
