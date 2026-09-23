import React, { useState } from 'react';
import { INITIAL_GOALS } from '../data/encyclopediaData';
import { FinancialGoal } from '../types/game';
import { sound } from '../utils/audio';
import { Target, Sparkles, Check, ArrowRight } from 'lucide-react';

interface GoalSelectModalProps {
  isOpen: boolean;
  onStart: (name: string, grade: number, goal: FinancialGoal) => void;
}

export const GoalSelectModal: React.FC<GoalSelectModalProps> = ({ isOpen, onStart }) => {
  const [name, setName] = useState<string>('Артём');
  const [grade, setGrade] = useState<number>(9);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal>(INITIAL_GOALS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    onStart(name.trim() || 'Юный финансист', grade, selectedGoal);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="space-y-1 text-center">
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-400">
            Добро пожаловать в игру
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ФинКвест: Твой личный бюджет
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Обучающий текстовый квест для школьников. Научись управлять карманными деньгами, откладывать на мечту и защищаться от мошенников!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Grade Input */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Твоё имя:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Как тебя зовут?"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Класс школы:
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-hidden focus:border-emerald-500"
              >
                <option value={7}>7 класс</option>
                <option value={8}>8 класс</option>
                <option value={9}>9 класс</option>
                <option value={10}>10 класс</option>
                <option value={11}>11 класс</option>
              </select>
            </div>
          </div>

          {/* Goal Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Выбери свою финансовую цель на месяц:</span>
              <span className="text-slate-500 font-normal">Стимул копить и не транжирить</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INITIAL_GOALS.map((goal) => {
                const isSelected = selectedGoal.id === goal.id;
                return (
                  <button
                    type="button"
                    key={goal.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedGoal(goal);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/50'
                        : 'bg-slate-800/50 border-slate-700/70 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{goal.icon}</span>
                      <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
                        {goal.cost.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-100">
                        {goal.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {goal.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base rounded-2xl transition-colors shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Начать квест: Получить первые карманные деньги</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
