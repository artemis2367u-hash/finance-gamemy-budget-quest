/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlayerState, QuestChoice, FinancialGoal, Transaction } from './types/game';
import { QUEST_SCENES } from './data/questData';
import { getDefaultPlayerState, loadPlayerState, savePlayerState, clearPlayerState } from './utils/storage';
import { sound } from './utils/audio';

import { Header, ActiveTab } from './components/Header';
import { PlayerStatsBar } from './components/PlayerStatsBar';
import { QuestView } from './components/QuestView';
import { GoalsView } from './components/GoalsView';
import { BudgetSimulatorView } from './components/BudgetSimulatorView';
import { BankSimulatorView } from './components/BankSimulatorView';
import { PhishingTrainerView } from './components/PhishingTrainerView';
import { EncyclopediaView } from './components/EncyclopediaView';
import { GoalSelectModal } from './components/GoalSelectModal';
import { FinalReportModal } from './components/FinalReportModal';
import { GameGoal } from './types/game';
import { SYSTEM_GOALS } from './data/goalsData';
import { INITIAL_GOALS } from './data/encyclopediaData';

export default function App() {
  const [player, setPlayer] = useState<PlayerState>(() => {
    const saved = loadPlayerState();
    return saved || getDefaultPlayerState();
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('quest');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(() => {
    return !loadPlayerState();
  });
  const [isFinalReportOpen, setIsFinalReportOpen] = useState<boolean>(false);

  // Auto-save on player state changes
  useEffect(() => {
    savePlayerState(player);
  }, [player]);

  const currentScene = QUEST_SCENES[player.currentSceneId] || QUEST_SCENES['scene_1_start'];

  // Handle choice consequences from Quest
  const handleMakeChoice = (choice: QuestChoice) => {
    setPlayer((prev) => {
      const c = choice.consequences;

      const newCash = Math.max(0, prev.cash + (c.cashChange || 0));
      const newCard = Math.max(0, prev.cardBalance + (c.cardChange || 0));
      const newSavings = Math.max(0, prev.savings + (c.savingsChange || 0));
      const newKnowledge = Math.min(100, Math.max(0, prev.knowledge + (c.knowledgeChange || 0)));
      const newHappiness = Math.min(100, Math.max(0, prev.happiness + (c.happinessChange || 0)));
      const newReputation = Math.min(100, Math.max(0, prev.reputation + (c.reputationChange || 0)));

      // Advance day
      const newDay = Math.min(30, prev.day + 2);

      // Add transaction if note exists
      const newTransactions: Transaction[] = [...prev.transactions];
      if (c.transactionNote) {
        newTransactions.push({
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          title: c.transactionNote.title,
          amount: c.transactionNote.amount,
          category: c.transactionNote.category,
          dateStr: `День ${newDay}`,
          isPlanned: c.transactionNote.amount >= 0 || choice.id.includes('envelope')
        });
      }

      // Add achievement if unlocked
      const newAchievements = [...prev.achievements];
      if (c.unlockAchievement && !newAchievements.includes(c.unlockAchievement)) {
        newAchievements.push(c.unlockAchievement);
      }

      // Unlock terms
      const newUnlockedTerms = [...prev.unlockedTerms];
      if (c.unlockTerms) {
        c.unlockTerms.forEach((termId) => {
          if (!newUnlockedTerms.includes(termId)) {
            newUnlockedTerms.push(termId);
          }
        });
      }

      const nextScene = choice.nextSceneId;
      const isCompleted = nextScene === 'completed' || nextScene === 'scene_final_summary';

      return {
        ...prev,
        cash: newCash,
        cardBalance: newCard,
        savings: newSavings,
        knowledge: newKnowledge,
        happiness: newHappiness,
        reputation: newReputation,
        day: newDay,
        currentSceneId: nextScene,
        visitedSceneIds: prev.visitedSceneIds.includes(nextScene)
          ? prev.visitedSceneIds
          : [...prev.visitedSceneIds, nextScene],
        transactions: newTransactions,
        achievements: newAchievements,
        unlockedTerms: newUnlockedTerms,
        isCompleted: isCompleted || prev.isCompleted
      };
    });
  };

  // Start new game setup
  const handleStartNewGame = (name: string, grade: number, goal: FinancialGoal) => {
    const fresh = getDefaultPlayerState(name, grade, goal);
    setPlayer(fresh);
    savePlayerState(fresh);
    setIsSetupOpen(false);
    setIsFinalReportOpen(false);
    setActiveTab('quest');
  };

  // Reset current game
  const handleResetGame = () => {
    sound.playWarning();
    if (window.confirm('Начать квест сначала? Текущий прогресс будет сброшен.')) {
      clearPlayerState();
      setIsSetupOpen(true);
      setIsFinalReportOpen(false);
    }
  };

  // Deposit money into savings account from budget view
  const handleUpdateSavings = (amount: number) => {
    setPlayer((prev) => {
      let remaining = amount;
      let newCash = prev.cash;
      let newCard = prev.cardBalance;

      if (newCard >= remaining) {
        newCard -= remaining;
        remaining = 0;
      } else {
        remaining -= newCard;
        newCard = 0;
        newCash = Math.max(0, newCash - remaining);
      }

      const newSavings = prev.savings + amount;
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        title: 'Пополнение накопительного счета 14%',
        amount: -amount,
        category: 'savings_interest',
        dateStr: `День ${prev.day}`,
        isPlanned: true
      };

      return {
        ...prev,
        cash: newCash,
        cardBalance: newCard,
        savings: newSavings,
        transactions: [...prev.transactions, newTx]
      };
    });
  };

  // Change cashback category
  const handleChangeCashback = (category: string) => {
    setPlayer((prev) => ({
      ...prev,
      cashbackCategory: category
    }));
  };

  // Add bonus IQ from phishing trainer
  const handleBonusIQ = (amount: number) => {
    setPlayer((prev) => ({
      ...prev,
      knowledge: Math.min(100, prev.knowledge + amount)
    }));
  };

  // Claim goal reward
  const handleClaimGoalReward = (goal: GameGoal) => {
    setPlayer((prev) => {
      if (prev.completedGoalIds.includes(goal.id)) return prev;

      const newCompleted = [...prev.completedGoalIds, goal.id];
      const newKnowledge = Math.min(100, prev.knowledge + (goal.rewardIQ || 0));
      const newHappiness = Math.min(100, prev.happiness + (goal.rewardHappiness || 0));
      const newReputation = Math.min(100, prev.reputation + (goal.rewardReputation || 0));
      const newCash = prev.cash + (goal.rewardCash || 0);

      const newTx = goal.rewardCash && goal.rewardCash > 0 ? [
        ...prev.transactions,
        {
          id: `tx_goal_${Date.now()}`,
          title: `Награда за цель: «${goal.title}»`,
          amount: goal.rewardCash,
          category: 'job' as const,
          dateStr: `День ${prev.day}`,
          isPlanned: true
        }
      ] : prev.transactions;

      const newAchievements = [...prev.achievements];
      const achTitle = `Цель: ${goal.title}`;
      if (!newAchievements.includes(achTitle)) {
        newAchievements.push(achTitle);
      }

      return {
        ...prev,
        completedGoalIds: newCompleted,
        knowledge: newKnowledge,
        happiness: newHappiness,
        reputation: newReputation,
        cash: newCash,
        transactions: newTx,
        achievements: newAchievements
      };
    });
  };

  // Add custom goal
  const handleAddCustomGoal = (goal: GameGoal) => {
    setPlayer((prev) => ({
      ...prev,
      customGoals: [...prev.customGoals, goal]
    }));
  };

  // Remove custom goal
  const handleRemoveCustomGoal = (goalId: string) => {
    sound.playClick();
    setPlayer((prev) => ({
      ...prev,
      customGoals: prev.customGoals.filter((g) => g.id !== goalId),
      completedGoalIds: prev.completedGoalIds.filter((id) => id !== goalId)
    }));
  };

  // Switch primary dream goal
  const handleSwitchPrimaryGoal = (newGoalId: string) => {
    const found = INITIAL_GOALS.find((g) => g.id === newGoalId);
    if (!found) return;
    sound.playClick();
    setPlayer((prev) => ({
      ...prev,
      goal: found
    }));
  };

  // Calculate unclaimed completed goals count for badge
  const totalCapital = player.cash + player.cardBalance + player.savings;
  const allGameGoals = [...SYSTEM_GOALS, ...player.customGoals];
  const unclaimedGoalsCount = allGameGoals.filter((goal) => {
    if (player.completedGoalIds.includes(goal.id)) return false;
    if (goal.targetType === 'savings') return player.savings >= goal.targetValue;
    if (goal.targetType === 'total_capital' || goal.targetType === 'custom_amount') return totalCapital >= goal.targetValue;
    if (goal.targetType === 'knowledge') return player.knowledge >= goal.targetValue;
    if (goal.targetType === 'reputation') return player.reputation >= goal.targetValue;
    if (goal.targetType === 'complete_scene') {
      if (goal.targetValue === 15) return player.day >= 15;
      if (goal.targetValue === 30) return player.isCompleted || player.day >= 30;
    }
    return false;
  }).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 3-Zone Top Navigation Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onResetGame={handleResetGame}
        achievementsCount={player.achievements.length}
        unclaimedGoalsCount={unclaimedGoalsCount}
      />

      {/* Financial Health & Accounts HUD Bar */}
      <PlayerStatsBar
        player={player}
        onOpenGoals={() => {
          sound.playClick();
          setActiveTab('goals');
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'quest' && (
          <QuestView
            scene={currentScene}
            player={player}
            onMakeChoice={handleMakeChoice}
            onOpenFinalReport={() => setIsFinalReportOpen(true)}
            onOpenGoals={() => {
              sound.playClick();
              setActiveTab('goals');
            }}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsView
            player={player}
            onClaimGoalReward={handleClaimGoalReward}
            onAddCustomGoal={handleAddCustomGoal}
            onRemoveCustomGoal={handleRemoveCustomGoal}
            onSwitchPrimaryGoal={handleSwitchPrimaryGoal}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
            }}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetSimulatorView
            player={player}
            onUpdateSavings={handleUpdateSavings}
          />
        )}

        {activeTab === 'bank' && (
          <BankSimulatorView
            player={player}
            onChangeCashback={handleChangeCashback}
          />
        )}

        {activeTab === 'phishing' && (
          <PhishingTrainerView onBonusIQ={handleBonusIQ} />
        )}

        {activeTab === 'encyclopedia' && (
          <EncyclopediaView unlockedTermIds={player.unlockedTerms} />
        )}
      </main>

      {/* Initial Goal & Character Setup Modal */}
      <GoalSelectModal
        isOpen={isSetupOpen}
        onStart={handleStartNewGame}
      />

      {/* End-of-Month Financial Graduation Certificate Modal */}
      <FinalReportModal
        isOpen={isFinalReportOpen}
        player={player}
        onRestart={() => {
          setIsFinalReportOpen(false);
          setIsSetupOpen(true);
        }}
        onClose={() => setIsFinalReportOpen(false)}
      />
    </div>
  );
}
