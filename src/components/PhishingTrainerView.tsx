import React, { useState } from 'react';
import { PHISHING_CASES } from '../data/phishingCases';
import { sound } from '../utils/audio';
import { ShieldCheck, ShieldAlert, CheckCircle, XCircle, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';

interface PhishingTrainerViewProps {
  onBonusIQ: (amount: number) => void;
}

export const PhishingTrainerView: React.FC<PhishingTrainerViewProps> = ({ onBonusIQ }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null); // true = said scam, false = said safe
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentCase = PHISHING_CASES[currentIdx];

  const handleAnswer = (saidScam: boolean) => {
    setUserAnswer(saidScam);
    const isCorrect = saidScam === currentCase.isScam;

    if (isCorrect) {
      sound.playSuccess();
      setScore((prev) => prev + 1);
      onBonusIQ(5);
    } else {
      sound.playWarning();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIdx + 1 < PHISHING_CASES.length) {
      setCurrentIdx((prev) => prev + 1);
      setUserAnswer(null);
    } else {
      setIsCompleted(true);
      sound.playSuccess();
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIdx(0);
    setUserAnswer(null);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="text-xs uppercase font-semibold tracking-wider text-rose-400">
          Интерактивный тренажер кибербезопасности
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Антифишинг: Распознай мошенника
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Научись определять уловки аферистов, фишинговые ссылки и ловушки социальной инженерии.
        </p>
      </div>

      {!isCompleted ? (
        <div className="space-y-5">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Кейс {currentIdx + 1} из {PHISHING_CASES.length}
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              Верно: {score} из {currentIdx + (userAnswer !== null ? 1 : 0)}
            </span>
          </div>

          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-rose-500 to-amber-400 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / PHISHING_CASES.length) * 100}%` }}
            />
          </div>

          {/* Simulated Message Card */}
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl overflow-hidden shadow-xl">
            {/* Message Header */}
            <div className="bg-slate-900/90 px-5 py-3.5 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Канал: {currentCase.channel}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-xs font-mono text-slate-300 truncate max-w-[200px]">
                  {currentCase.sender}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Только что</span>
            </div>

            {/* Message Body */}
            <div className="p-5 sm:p-6 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {currentCase.title}
              </div>
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-slate-200 text-sm sm:text-base leading-relaxed font-sans">
                {currentCase.messageText}
              </div>
            </div>

            {/* Decision Controls */}
            {userAnswer === null ? (
              <div className="p-5 bg-slate-900/50 border-t border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleAnswer(true)}
                  className="py-3 px-4 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ShieldAlert className="w-5 h-5" />
                  <span>Это МОШЕННИКИ!</span>
                </button>

                <button
                  onClick={() => handleAnswer(false)}
                  className="py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Безопасно / Настоящее</span>
                </button>
              </div>
            ) : (
              /* Answer Review Breakdown */
              <div className="p-5 bg-slate-900/90 border-t border-slate-700/60 space-y-4">
                <div className="flex items-center gap-2.5">
                  {userAnswer === currentCase.isScam ? (
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                      <CheckCircle className="w-5 h-5" />
                      <span>В точку! Ты правильно определил угрозу (+5 IQ).</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                      <XCircle className="w-5 h-5" />
                      <span>Ошибка! Будь бдителен.</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-slate-200 leading-relaxed">
                  {currentCase.explanation}
                </p>

                {currentCase.redFlags.length > 0 && (
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Красные флаги (признаки обмана):
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {currentCase.redFlags.map((flag, idx) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    <span>
                      {currentIdx + 1 < PHISHING_CASES.length ? 'Следующий кейс' : 'Завершить тренировку'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Completed Summary */
        <div className="bg-slate-800/60 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl mx-auto flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Тренировка по кибербезопасности завершена!
            </h2>
            <p className="text-sm text-slate-300">
              Твой результат: <span className="font-mono font-bold text-emerald-400">{score}</span> из {PHISHING_CASES.length} верных решений.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            {score === PHISHING_CASES.length
              ? 'Идеально! Ты обладаешь железной цифровой гигиеной. Мошенники не смогут выманить у тебя ни рубля!'
              : 'Отличный опыт! Теперь ты знаешь, на какие признаки обращать внимание при подозрительных звонках и сообщениях.'}
          </p>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Пройти тренировку еще раз
          </button>
        </div>
      )}
    </div>
  );
};
