import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AchievementState, Achievement, GameState } from '@/types';
import { ACHIEVEMENTS, getCompletableAchievements } from '@/data/achievements';

interface AchievementStore extends AchievementState {
  // Achievement Actions
  unlockAchievement: (achievementId: string) => void;
  checkAchievements: (gameStats: Partial<GameState>) => Achievement[];
  updateProgress: (achievementId: string, progress: number) => void;
  
  // Getters
  getAchievement: (achievementId: string) => Achievement | undefined;
  getUnlockedAchievements: () => Achievement[];
  getAchievementsByCategory: (category: string) => Achievement[];
  
  // Reset
  resetAchievements: () => void;
}

const initialAchievementState: AchievementState = {
  unlockedAchievements: [],
  achievementProgress: {},
  totalAchievements: ACHIEVEMENTS.length,
};

export const useAchievementStore = create<AchievementStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialAchievementState,
    
    // Achievement Actions
    unlockAchievement: (achievementId: string) => {
      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (!achievement || achievement.isUnlocked) return;
      
      // Mark achievement as unlocked
      achievement.isUnlocked = true;
      achievement.unlockedAt = new Date();
      
      set((state) => ({
        unlockedAchievements: [...state.unlockedAchievements, achievement],
      }));
      
      // Apply achievement reward
      console.log(`🏆 Achievement unlocked: ${achievement.name}`);
      console.log(`Reward: ${achievement.reward.description}`);
      
      // TODO: Apply actual rewards to game state
      // Examples:
      // - money: Add to player's money
      // - permanent_bonus: Apply to relevant systems
      // - unlock_feature: Enable new game features
    },
    
    checkAchievements: (gameStats: Partial<GameState>) => {
      const completableAchievements = getCompletableAchievements({
        trainersAttracted: gameStats.trainersAttracted || 0,
        totalRevenue: gameStats.totalRevenue || 0,
        totalPokemonCaught: gameStats.totalPokemonCaught || 0,
        averageSatisfaction: gameStats.averageSatisfaction || 0,
        unlockedAreas: gameStats.unlockedAreas?.length || 1,
        rarePokemonCaught: gameStats.rarePokemonCaught || 0,
        shinyPokemonCaught: gameStats.shinyPokemonCaught || 0,
      });
      
      const newlyUnlocked: Achievement[] = [];
      
      completableAchievements.forEach(achievement => {
        if (!achievement.isUnlocked) {
          get().unlockAchievement(achievement.id);
          newlyUnlocked.push(achievement);
        }
      });
      
      return newlyUnlocked;
    },
    
    updateProgress: (achievementId: string, progress: number) => {
      set((state) => ({
        achievementProgress: {
          ...state.achievementProgress,
          [achievementId]: progress,
        },
      }));
    },
    
    // Getters
    getAchievement: (achievementId: string) => {
      return ACHIEVEMENTS.find(a => a.id === achievementId);
    },
    
    getUnlockedAchievements: () => {
      return get().unlockedAchievements;
    },
    
    getAchievementsByCategory: (category: string) => {
      return ACHIEVEMENTS.filter(a => a.category === category);
    },
    
    // Reset
    resetAchievements: () => {
      // Reset all achievements to locked state
      ACHIEVEMENTS.forEach(achievement => {
        achievement.isUnlocked = false;
        achievement.unlockedAt = undefined;
      });
      
      set({
        ...initialAchievementState,
      });
    },
  }))
);

// Stable selectors to prevent hydration issues
const unlockedAchievementsSelector = (state: AchievementStore) => state.unlockedAchievements;
const achievementProgressSelector = (state: AchievementStore) => state.achievementProgress;

// Selectors for optimized re-renders
export const useUnlockedAchievements = () => useAchievementStore(unlockedAchievementsSelector);
export const useAchievementProgress = () => useAchievementStore(achievementProgressSelector);
export const useAchievementsByCategory = (category: string) => 
  useAchievementStore((state) => state.getAchievementsByCategory(category));