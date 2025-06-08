'use client';

import { useEffect, useRef } from 'react';
import { useAchievementStore } from '@/stores/achievementStore';
import { useToastContext } from '@/context/ToastContext';

/**
 * Bridge component that automatically triggers toast notifications 
 * when new achievements are unlocked
 */
export function AchievementNotificationBridge() {
  const { unlockedAchievements } = useAchievementStore();
  const toast = useToastContext();
  const processedAchievements = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Check for newly unlocked achievements
    unlockedAchievements.forEach((achievement) => {
      if (!processedAchievements.current.has(achievement.id)) {
        // Mark as processed first to prevent duplicates
        processedAchievements.current.add(achievement.id);
        
        // Trigger achievement toast
        toast.achievement(
          `🏆 ${achievement.name}`,
          achievement.description
        );
        
        // Show reward notification
        if (achievement.reward) {
          setTimeout(() => {
            const rewardText = formatReward(achievement.reward);
            toast.success(
              '🎁 Reward Unlocked!',
              rewardText
            );
          }, 1500); // Delay to show after achievement toast
        }
      }
    });
  }, [unlockedAchievements, toast]);

  // Helper function to format reward text
  const formatReward = (reward: any) => {
    switch (reward.type) {
      case 'money':
        return `Earned $${reward.value} PokeDollars!`;
      case 'permanent_bonus':
        return `Permanent bonus: ${reward.description}`;
      case 'unlock_feature':
        return `Unlocked: ${reward.description}`;
      default:
        return reward.description || 'Special reward unlocked!';
    }
  };

  return null; // This component only handles side effects
}