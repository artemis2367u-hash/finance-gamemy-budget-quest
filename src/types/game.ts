export type FinancialGoal = {
  id: string;
  title: string;
  cost: number;
  description: string;
  icon: string;
};

export type Transaction = {
  id: string;
  title: string;
  amount: number; // positive for income, negative for expense
  category: 'pocket_money' | 'job' | 'food' | 'entertainment' | 'gadgets' | 'emergency' | 'savings_interest';
  dateStr: string;
  isPlanned: boolean;
};

export type GoalCategory = 'dream' | 'financial_habit' | 'quest_milestone' | 'cyber_safety' | 'career';

export type GameGoal = {
  id: string;
  title: string;
  category: GoalCategory;
  categoryLabel: string;
  description: string;
  targetType: 'savings' | 'total_capital' | 'knowledge' | 'reputation' | 'custom_amount' | 'complete_scene' | 'phishing_score';
  targetValue: number;
  currentValue?: number;
  rewardIQ: number;
  rewardHappiness: number;
  rewardReputation?: number;
  rewardCash?: number;
  icon: string;
  isCustom?: boolean;
  deadlineDay?: number;
};

export type PlayerState = {
  name: string;
  grade: number; // 7, 8, 9, 10, 11
  goal: FinancialGoal; // Primary dream goal
  customGoals: GameGoal[]; // User-added goals
  completedGoalIds: string[]; // List of claimed or completed goal IDs
  cash: number; // Наличные в кармане
  cardBalance: number; // Баланс молодежной карты
  savings: number; // Накопительный счет (копилка)
  knowledge: number; // 0 - 100 (Финансовый IQ)
  happiness: number; // 0 - 100 (Настроение / Энергия)
  reputation: number; // 0 - 100 (Доверие родителей / Кредитный рейтинг)
  currentChapterId: string;
  currentSceneId: string;
  visitedSceneIds: string[];
  transactions: Transaction[];
  achievements: string[];
  unlockedTerms: string[];
  savingsInterestRate: number; // e.g. 14% annual
  cashbackCategory: string;
  day: number;
  isCompleted: boolean;
};

export type ChoiceConsequence = {
  cashChange?: number;
  cardChange?: number;
  savingsChange?: number;
  knowledgeChange?: number;
  happinessChange?: number;
  reputationChange?: number;
  transactionNote?: {
    title: string;
    amount: number;
    category: Transaction['category'];
  };
  unlockAchievement?: string;
  unlockTerms?: string[];
  learningTip: string; // Обучающая подсказка от эксперта
};

export type QuestChoice = {
  id: string;
  text: string;
  hint?: string;
  requiredCash?: number;
  consequences: ChoiceConsequence;
  nextSceneId: string;
};

export type QuestScene = {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  title: string;
  character?: {
    name: string;
    role: string;
    avatarEmoji: string;
  };
  narrative: string[];
  budgetContext?: {
    type: 'income' | 'unplanned_expense' | 'choice_preview';
    label: string;
    amount?: number;
  };
  choices: QuestChoice[];
  illustration?: string;
};

export type EncyclopediaTerm = {
  id: string;
  term: string;
  category: 'basics' | 'banking' | 'security' | 'investing';
  definition: string;
  teenExample: string;
  goldenRule: string;
};

export type PhishingCase = {
  id: string;
  title: string;
  sender: string;
  channel: 'SMS' | 'Telegram' | 'Phone Call' | 'Online Shop';
  messageText: string;
  isScam: boolean;
  explanation: string;
  redFlags: string[];
};
