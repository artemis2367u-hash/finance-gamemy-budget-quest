import { PlayerState, FinancialGoal } from '../types/game';
import { INITIAL_GOALS } from '../data/encyclopediaData';

const STORAGE_KEY = 'finquest_school_save_v1';

export const getDefaultPlayerState = (
  name: string = 'Артём',
  grade: number = 9,
  goal: FinancialGoal = INITIAL_GOALS[0]
): PlayerState => ({
  name,
  grade,
  goal,
  customGoals: [],
  completedGoalIds: [],
  cash: 0,
  cardBalance: 0,
  savings: 0,
  knowledge: 20, // Базовый IQ
  happiness: 75,
  reputation: 60,
  currentChapterId: '1',
  currentSceneId: 'scene_1_start',
  visitedSceneIds: ['scene_1_start'],
  transactions: [],
  achievements: [],
  unlockedTerms: ['rule_50_30_20'],
  savingsInterestRate: 0.14, // 14% годовых
  cashbackCategory: 'Транспорт и проезд',
  day: 1,
  isCompleted: false
});

export const loadPlayerState = (): PlayerState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlayerState;
    // Backwards-compatible safeguards
    if (!parsed.customGoals) parsed.customGoals = [];
    if (!parsed.completedGoalIds) parsed.completedGoalIds = [];
    return parsed;
  } catch (e) {
    console.error('Failed to load save state:', e);
    return null;
  }
};

export const savePlayerState = (state: PlayerState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
};

export const clearPlayerState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear state:', e);
  }
};
