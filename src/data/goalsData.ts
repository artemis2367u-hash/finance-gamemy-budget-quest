import { GameGoal } from '../types/game';

export const SYSTEM_GOALS: GameGoal[] = [
  // 1. Финансовые привычки
  {
    id: 'habit_first_deposit',
    title: 'Первый взнос в копилку',
    category: 'financial_habit',
    categoryLabel: 'Финансовые привычки',
    description: 'Отложи первые 1 500 ₽ на накопительный счёт по правилу «Сначала заплати себе».',
    targetType: 'savings',
    targetValue: 1500,
    rewardIQ: 10,
    rewardHappiness: 10,
    rewardReputation: 15,
    rewardCash: 200,
    icon: '🐷'
  },
  {
    id: 'habit_safety_cushion',
    title: 'Личная подушка безопасности',
    category: 'financial_habit',
    categoryLabel: 'Финансовые привычки',
    description: 'Накопи в копилке 3 500 ₽ для защиты от внезапных форс-мажоров и поломок.',
    targetType: 'savings',
    targetValue: 3500,
    rewardIQ: 15,
    rewardHappiness: 15,
    rewardReputation: 20,
    rewardCash: 350,
    icon: '🛡️'
  },
  {
    id: 'habit_capital_accumulator',
    title: 'Капитал 10 000 ₽',
    category: 'financial_habit',
    categoryLabel: 'Финансовые привычки',
    description: 'Увеличь совокупный капитал (наличные + карта + вклад) до 10 000 рублей.',
    targetType: 'total_capital',
    targetValue: 10000,
    rewardIQ: 20,
    rewardHappiness: 15,
    rewardReputation: 25,
    rewardCash: 500,
    icon: '💰'
  },

  // 2. Кибербезопасность и цифровая гигиена
  {
    id: 'cyber_shield_junior',
    title: 'Защитник цифрового кошелька',
    category: 'cyber_safety',
    categoryLabel: 'Кибербезопасность',
    description: 'Подними уровень финансового IQ до 50 пунктов, изучая уловки мошенников и антифишинг.',
    targetType: 'knowledge',
    targetValue: 50,
    rewardIQ: 15,
    rewardHappiness: 10,
    rewardReputation: 15,
    rewardCash: 300,
    icon: '🔐'
  },
  {
    id: 'cyber_expert',
    title: 'Эксперт финансового интеллекта',
    category: 'cyber_safety',
    categoryLabel: 'Кибербезопасность',
    description: 'Достигни финансового IQ 80+, освоив законы сложного процента, инвестиций и налогов.',
    targetType: 'knowledge',
    targetValue: 80,
    rewardIQ: 25,
    rewardHappiness: 20,
    rewardReputation: 30,
    rewardCash: 700,
    icon: '🧠'
  },

  // 3. Карьера и репутация
  {
    id: 'reputation_high_trust',
    title: 'Золотое доверие родителей',
    category: 'career',
    categoryLabel: 'Карьера и доверие',
    description: 'Повысь уровень доверия родителей до 85% благодаря прозрачному бюджету и ответственности.',
    targetType: 'reputation',
    targetValue: 85,
    rewardIQ: 15,
    rewardHappiness: 20,
    rewardReputation: 10,
    rewardCash: 400,
    icon: '🤝'
  },

  // 4. Сюжетные рубежи квеста
  {
    id: 'milestone_halfway',
    title: 'Экватор месяца',
    category: 'quest_milestone',
    categoryLabel: 'Этапы квеста',
    description: 'Преодолей первые 15 дней квеста, принимая взвешенные финансовые решения.',
    targetType: 'complete_scene',
    targetValue: 15, // day 15+
    rewardIQ: 10,
    rewardHappiness: 15,
    rewardReputation: 10,
    rewardCash: 250,
    icon: '🧭'
  },
  {
    id: 'milestone_finish',
    title: 'Выпускник школы финансов',
    category: 'quest_milestone',
    categoryLabel: 'Этапы квеста',
    description: 'Пройди полный 30-дневный месяц квеста и получи финальный официальный аттестат.',
    targetType: 'complete_scene',
    targetValue: 30, // completed quest
    rewardIQ: 30,
    rewardHappiness: 25,
    rewardReputation: 30,
    rewardCash: 1000,
    icon: '🎓'
  }
];
