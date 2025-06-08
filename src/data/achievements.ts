import { Achievement } from '@/types';

export const ACHIEVEMENTS: Achievement[] = [
  // Early Achievements (Drive Engagement)
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Attract your first trainer to the Safari Zone',
    category: 'early',
    requirement: {
      type: 'trainers_attracted',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 200,
      description: '$200 bonus',
    },
    isUnlocked: false,
    icon: '👋', // TODO: Replace with actual icon
  },
  {
    id: 'nest_egg',
    name: 'Nest Egg',
    description: 'Collect $1,000 in total revenue',
    category: 'early',
    requirement: {
      type: 'money_earned',
      target: 1000,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 300,
      description: '$300 bonus',
    },
    isUnlocked: false,
    icon: '💰', // TODO: Replace with actual icon
  },
  {
    id: 'population_control',
    name: 'Population Control',
    description: 'Stock 50 Pokemon across all areas',
    category: 'early',
    requirement: {
      type: 'pokemon_caught',
      target: 50,
      currentProgress: 0,
    },
    reward: {
      type: 'permanent_bonus',
      value: 10,
      description: '+10% breeding speed',
    },
    isUnlocked: false,
    icon: '🥚', // TODO: Replace with actual icon
  },
  {
    id: 'customer_service',
    name: 'Customer Service',
    description: 'Achieve 90% trainer satisfaction',
    category: 'early',
    requirement: {
      type: 'trainers_attracted',
      target: 90, // Will check satisfaction % instead
      currentProgress: 0,
    },
    reward: {
      type: 'unlock_feature',
      value: 'premium_trainers',
      description: 'Unlock premium trainer types',
    },
    isUnlocked: false,
    icon: '😊', // TODO: Replace with actual icon
  },

  // Progression Achievements (Guide Discovery)
  {
    id: 'area_explorer',
    name: 'Area Explorer',
    description: 'Unlock all 4 Safari Zone areas',
    category: 'progression',
    requirement: {
      type: 'areas_unlocked',
      target: 4,
      currentProgress: 1, // Start with center area
    },
    reward: {
      type: 'permanent_bonus',
      value: 25,
      description: '+25% revenue from all areas',
    },
    isUnlocked: false,
    icon: '🗺️', // TODO: Replace with actual icon
  },
  {
    id: 'rare_finder',
    name: 'Rare Finder',
    description: 'Witness the capture of a rare Pokemon (Chansey, Scyther, or Tauros)',
    category: 'progression',
    requirement: {
      type: 'pokemon_caught',
      target: 1, // Special check for rare Pokemon
      currentProgress: 0,
    },
    reward: {
      type: 'unlock_feature',
      value: 'rare_tracker',
      description: 'See rare Pokemon spawn notifications',
    },
    isUnlocked: false,
    icon: '⭐', // TODO: Replace with actual icon
  },
  {
    id: 'shiny_hunter',
    name: 'Shiny Hunter',
    description: 'Witness the capture of a shiny Pokemon',
    category: 'progression',
    requirement: {
      type: 'pokemon_caught',
      target: 1, // Special check for shiny Pokemon
      currentProgress: 0,
    },
    reward: {
      type: 'permanent_bonus',
      value: 100,
      description: 'Double shiny spawn rate',
    },
    isUnlocked: false,
    icon: '✨', // TODO: Replace with actual icon
  },
  {
    id: 'bell_master',
    name: 'Bell Master',
    description: 'Achieve 10 perfect bell clicks in a row',
    category: 'progression',
    requirement: {
      type: 'trainers_attracted',
      target: 10, // Special tracking needed
      currentProgress: 0,
    },
    reward: {
      type: 'unlock_feature',
      value: 'bell_mastery',
      description: 'Perfect clicks attract 3x trainers',
    },
    isUnlocked: false,
    icon: '🔔', // TODO: Replace with actual icon
  },

  // Collection Achievements (Long-term Goals)
  {
    id: 'pokemon_researcher',
    name: 'Pokemon Researcher',
    description: 'Have 25 different Pokemon species caught in your zones',
    category: 'collection',
    requirement: {
      type: 'pokemon_caught',
      target: 25, // Special tracking for species diversity
      currentProgress: 0,
    },
    reward: {
      type: 'unlock_feature',
      value: 'research_lab',
      description: 'Unlock advanced research options',
    },
    isUnlocked: false,
    icon: '🔬', // TODO: Replace with actual icon
  },
  {
    id: 'shiny_collector',
    name: 'Shiny Collector',
    description: 'Witness 5 different shiny Pokemon species being caught',
    category: 'collection',
    requirement: {
      type: 'pokemon_caught',
      target: 5, // Special tracking for shiny diversity
      currentProgress: 0,
    },
    reward: {
      type: 'permanent_bonus',
      value: 500,
      description: 'Shiny Pokemon worth 10x more',
    },
    isUnlocked: false,
    icon: '🌟', // TODO: Replace with actual icon
  },
  {
    id: 'legendary_sanctuary',
    name: 'Legendary Sanctuary',
    description: 'Have all 3 legendary birds visit your Safari Zone',
    category: 'collection',
    requirement: {
      type: 'pokemon_caught',
      target: 3, // Articuno, Zapdos, Moltres
      currentProgress: 0,
    },
    reward: {
      type: 'unlock_feature',
      value: 'legendary_habitat',
      description: 'Legendary Pokemon visit more frequently',
    },
    isUnlocked: false,
    icon: '🦅', // TODO: Replace with actual icon
  },

  // Mastery Achievements (Prestige Rewards)
  {
    id: 'tycoon_status',
    name: 'Tycoon Status',
    description: 'Earn $100,000 in a single session',
    category: 'mastery',
    requirement: {
      type: 'money_earned',
      target: 100000,
      currentProgress: 0,
    },
    reward: {
      type: 'unlock_feature',
      value: 'prestige_system',
      description: 'Unlock prestige mode for permanent bonuses',
    },
    isUnlocked: false,
    icon: '👑', // TODO: Replace with actual icon
  },
  {
    id: 'world_famous',
    name: 'World Famous',
    description: 'Attract 1,000 total trainers to your Safari Zone',
    category: 'mastery',
    requirement: {
      type: 'trainers_attracted',
      target: 1000,
      currentProgress: 0,
    },
    reward: {
      type: 'permanent_bonus',
      value: 50,
      description: '+50% trainer attraction rate',
    },
    isUnlocked: false,
    icon: '🌍', // TODO: Replace with actual icon
  },
  {
    id: 'master_breeder',
    name: 'Master Breeder',
    description: 'Have Pokemon breeding programs active in all areas',
    category: 'mastery',
    requirement: {
      type: 'upgrades_purchased',
      target: 4, // Breeding programs for all 4 areas
      currentProgress: 0,
    },
    reward: {
      type: 'permanent_bonus',
      value: 200,
      description: 'Triple breeding speed in all areas',
    },
    isUnlocked: false,
    icon: '🧬', // TODO: Replace with actual icon
  },
  {
    id: 'safari_legend',
    name: 'Safari Legend',
    description: 'Complete all other achievements',
    category: 'mastery',
    requirement: {
      type: 'trainers_attracted',
      target: 1, // Special check for all achievements
      currentProgress: 0,
    },
    reward: {
      type: 'unlock_feature',
      value: 'ultimate_prestige',
      description: 'Unlock the ultimate Safari Zone experience',
    },
    isUnlocked: false,
    icon: '🏆', // TODO: Replace with actual icon
  },
];

// Helper functions
export const getAchievementsByCategory = (category: string) => {
  return ACHIEVEMENTS.filter(achievement => achievement.category === category);
};

export const getUnlockedAchievements = () => {
  return ACHIEVEMENTS.filter(achievement => achievement.isUnlocked);
};

export const getCompletableAchievements = (gameStats: {
  trainersAttracted: number;
  totalRevenue: number;
  totalPokemonCaught: number;
  averageSatisfaction: number;
  unlockedAreas: number;
  rarePokemonCaught: number;
  shinyPokemonCaught: number;
}) => {
  return ACHIEVEMENTS.filter(achievement => {
    if (achievement.isUnlocked) return false;
    
    // Check if achievement can be completed based on current stats
    switch (achievement.requirement.type) {
      case 'trainers_attracted':
        return gameStats.trainersAttracted >= achievement.requirement.target;
      case 'money_earned':
        return gameStats.totalRevenue >= achievement.requirement.target;
      case 'pokemon_caught':
        // Special handling for specific achievement types
        if (achievement.id === 'rare_finder') {
          return gameStats.rarePokemonCaught >= 1;
        }
        if (achievement.id === 'shiny_hunter') {
          return gameStats.shinyPokemonCaught >= 1;
        }
        return gameStats.totalPokemonCaught >= achievement.requirement.target;
      case 'areas_unlocked':
        return gameStats.unlockedAreas >= achievement.requirement.target;
      default:
        return false;
    }
  });
};

export const calculateAchievementProgress = (achievement: Achievement, gameStats: any) => {
  let current = 0;
  
  switch (achievement.requirement.type) {
    case 'trainers_attracted':
      current = gameStats.trainersAttracted;
      break;
    case 'money_earned':
      current = gameStats.totalRevenue;
      break;
    case 'pokemon_caught':
      if (achievement.id === 'rare_finder') {
        current = gameStats.rarePokemonCaught;
      } else if (achievement.id === 'shiny_hunter') {
        current = gameStats.shinyPokemonCaught;
      } else {
        current = gameStats.totalPokemonCaught;
      }
      break;
    case 'areas_unlocked':
      current = gameStats.unlockedAreas;
      break;
    default:
      current = 0;
  }
  
  return Math.min(current, achievement.requirement.target);
};