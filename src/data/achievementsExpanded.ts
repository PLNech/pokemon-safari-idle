import { Achievement } from '@/types';

export const ACHIEVEMENTS_EXPANDED: Achievement[] = [
  // === EARLY GAME ACHIEVEMENTS (1-10) ===
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Attract your first trainer to the Safari Zone',
    category: 'progression',
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
    icon: '👋',
  },
  {
    id: 'bell_ringer',
    name: 'Bell Ringer',
    description: 'Ring the bell 10 times',
    category: 'activity',
    requirement: {
      type: 'bell_rings',
      target: 10,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 150,
      description: '$150 bonus',
    },
    isUnlocked: false,
    icon: '🔔',
  },
  {
    id: 'first_catch',
    name: 'First Catch',
    description: 'Your first Pokemon is caught by a trainer',
    category: 'pokemon',
    requirement: {
      type: 'pokemon_caught',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 300,
      description: '$300 bonus',
    },
    isUnlocked: false,
    icon: '🐾',
  },
  {
    id: 'perfect_timing',
    name: 'Perfect Timing',
    description: 'Achieve your first perfect bell click',
    category: 'skill',
    requirement: {
      type: 'perfect_clicks',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 250,
      description: '$250 bonus',
    },
    isUnlocked: false,
    icon: '⚡',
  },
  {
    id: 'nest_egg',
    name: 'Nest Egg',
    description: 'Accumulate $1,000 in total',
    category: 'progression',
    requirement: {
      type: 'money_total',
      target: 1000,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 500,
      description: '$500 bonus',
    },
    isUnlocked: false,
    icon: '💰',
  },

  // === TRAINER TYPE ACHIEVEMENTS (11-20) ===
  {
    id: 'casual_crowd',
    name: 'Casual Crowd',
    description: 'Attract 25 casual trainers',
    category: 'trainers',
    requirement: {
      type: 'trainer_type_casual',
      target: 25,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 400,
      description: '$400 bonus',
    },
    isUnlocked: false,
    icon: '👥',
  },
  {
    id: 'collector_magnet',
    name: 'Collector Magnet',
    description: 'Attract 10 collector trainers',
    category: 'trainers',
    requirement: {
      type: 'trainer_type_collector',
      target: 10,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 800,
      description: '$800 bonus',
    },
    isUnlocked: false,
    icon: '📚',
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Attract 15 speedrunner trainers',
    category: 'trainers',
    requirement: {
      type: 'trainer_type_speedrunner',
      target: 15,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 600,
      description: '$600 bonus',
    },
    isUnlocked: false,
    icon: '⚡',
  },
  {
    id: 'shiny_seeker',
    name: 'Shiny Seeker',
    description: 'Attract 5 shiny hunter trainers',
    category: 'trainers',
    requirement: {
      type: 'trainer_type_shiny_hunter',
      target: 5,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 1000,
      description: '$1000 bonus',
    },
    isUnlocked: false,
    icon: '✨',
  },
  {
    id: 'rare_visitor',
    name: 'Rare Visitor',
    description: 'Attract your first rare trainer',
    category: 'trainers',
    requirement: {
      type: 'rare_trainer_attracted',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 750,
      description: '$750 bonus',
    },
    isUnlocked: false,
    icon: '🌟',
  },

  // === SKILL-BASED ACHIEVEMENTS (21-30) ===
  {
    id: 'streak_starter',
    name: 'Streak Starter',
    description: 'Achieve a 5-click perfect streak',
    category: 'skill',
    requirement: {
      type: 'perfect_streak_5',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 500,
      description: '$500 bonus',
    },
    isUnlocked: false,
    icon: '🎯',
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Achieve a 10-click perfect streak',
    category: 'skill',
    requirement: {
      type: 'perfect_streak_10',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 1000,
      description: '$1000 bonus',
    },
    isUnlocked: false,
    icon: '🎪',
  },
  {
    id: 'streak_legend',
    name: 'Streak Legend',
    description: 'Achieve a 20-click perfect streak',
    category: 'skill',
    requirement: {
      type: 'perfect_streak_20',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 2500,
      description: '$2500 bonus',
    },
    isUnlocked: false,
    icon: '🏆',
  },
  {
    id: 'caravan_caller',
    name: 'Caravan Caller',
    description: 'Trigger 10 Trainer Caravans',
    category: 'skill',
    requirement: {
      type: 'trainer_caravans',
      target: 10,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 800,
      description: '$800 bonus',
    },
    isUnlocked: false,
    icon: '🚛',
  },
  {
    id: 'frenzy_master',
    name: 'Frenzy Master',
    description: 'Trigger your first Trainer Frenzy',
    category: 'skill',
    requirement: {
      type: 'trainer_frenzies',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 3000,
      description: '$3000 bonus',
    },
    isUnlocked: false,
    icon: '🌪️',
  },

  // === POKEMON TYPE ACHIEVEMENTS (31-40) ===
  {
    id: 'grass_enthusiast',
    name: 'Grass Enthusiast',
    description: 'Catch 20 Grass-type Pokemon',
    category: 'pokemon',
    requirement: {
      type: 'pokemon_type_grass',
      target: 20,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 600,
      description: '$600 bonus',
    },
    isUnlocked: false,
    icon: '🌱',
  },
  {
    id: 'water_collector',
    name: 'Water Collector',
    description: 'Catch 20 Water-type Pokemon',
    category: 'pokemon',
    requirement: {
      type: 'pokemon_type_water',
      target: 20,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 600,
      description: '$600 bonus',
    },
    isUnlocked: false,
    icon: '💧',
  },
  {
    id: 'fire_master',
    name: 'Fire Master',
    description: 'Catch 20 Fire-type Pokemon',
    category: 'pokemon',
    requirement: {
      type: 'pokemon_type_fire',
      target: 20,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 600,
      description: '$600 bonus',
    },
    isUnlocked: false,
    icon: '🔥',
  },
  {
    id: 'electric_expert',
    name: 'Electric Expert',
    description: 'Catch 15 Electric-type Pokemon',
    category: 'pokemon',
    requirement: {
      type: 'pokemon_type_electric',
      target: 15,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 700,
      description: '$700 bonus',
    },
    isUnlocked: false,
    icon: '⚡',
  },
  {
    id: 'psychic_specialist',
    name: 'Psychic Specialist',
    description: 'Catch 10 Psychic-type Pokemon',
    category: 'pokemon',
    requirement: {
      type: 'pokemon_type_psychic',
      target: 10,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 800,
      description: '$800 bonus',
    },
    isUnlocked: false,
    icon: '🔮',
  },

  // === RARITY ACHIEVEMENTS (41-45) ===
  {
    id: 'rare_hunter',
    name: 'Rare Hunter',
    description: 'Catch 5 rare Pokemon',
    category: 'pokemon',
    requirement: {
      type: 'rare_pokemon_caught',
      target: 5,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 1000,
      description: '$1000 bonus',
    },
    isUnlocked: false,
    icon: '🌟',
  },
  {
    id: 'ultra_collector',
    name: 'Ultra Collector',
    description: 'Catch 3 ultra rare Pokemon',
    category: 'pokemon',
    requirement: {
      type: 'ultra_rare_pokemon_caught',
      target: 3,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 2000,
      description: '$2000 bonus',
    },
    isUnlocked: false,
    icon: '💎',
  },
  {
    id: 'legendary_witness',
    name: 'Legendary Witness',
    description: 'Witness your first legendary Pokemon catch',
    category: 'pokemon',
    requirement: {
      type: 'legendary_pokemon_caught',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 5000,
      description: '$5000 bonus',
    },
    isUnlocked: false,
    icon: '👑',
  },
  {
    id: 'shiny_spotter',
    name: 'Shiny Spotter',
    description: 'Spot your first shiny Pokemon',
    category: 'pokemon',
    requirement: {
      type: 'shiny_pokemon_caught',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 3000,
      description: '$3000 bonus',
    },
    isUnlocked: false,
    icon: '✨',
  },
  {
    id: 'shiny_magnet',
    name: 'Shiny Magnet',
    description: 'Catch 5 shiny Pokemon',
    category: 'pokemon',
    requirement: {
      type: 'shiny_pokemon_caught',
      target: 5,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 10000,
      description: '$10,000 bonus',
    },
    isUnlocked: false,
    icon: '🌈',
  },

  // === MILESTONE ACHIEVEMENTS (46-50) ===
  {
    id: 'hundred_club',
    name: 'Hundred Club',
    description: 'Attract 100 trainers',
    category: 'progression',
    requirement: {
      type: 'trainers_attracted',
      target: 100,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 2000,
      description: '$2000 bonus',
    },
    isUnlocked: false,
    icon: '💯',
  },
  {
    id: 'thousand_strong',
    name: 'Thousand Strong',
    description: 'Attract 1000 trainers',
    category: 'progression',
    requirement: {
      type: 'trainers_attracted',
      target: 1000,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 15000,
      description: '$15,000 bonus',
    },
    isUnlocked: false,
    icon: '🏰',
  },
  {
    id: 'millionaire',
    name: 'Millionaire',
    description: 'Accumulate $1,000,000 total',
    category: 'progression',
    requirement: {
      type: 'money_total',
      target: 1000000,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 100000,
      description: '$100,000 bonus',
    },
    isUnlocked: false,
    icon: '💰',
  },
  {
    id: 'pokedex_master',
    name: 'Pokedex Master',
    description: 'Catch 500 Pokemon total',
    category: 'pokemon',
    requirement: {
      type: 'pokemon_caught',
      target: 500,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 8000,
      description: '$8000 bonus',
    },
    isUnlocked: false,
    icon: '📖',
  },
  {
    id: 'satisfaction_guru',
    name: 'Satisfaction Guru',
    description: 'Maintain 95% average satisfaction',
    category: 'quality',
    requirement: {
      type: 'satisfaction_average',
      target: 95,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 5000,
      description: '$5000 bonus',
    },
    isUnlocked: false,
    icon: '😊',
  },

  // === SECRET ACHIEVEMENTS (51-60) ===
  {
    id: 'secret_midnight',
    name: '🌙 Midnight Manager',
    description: 'Some say the best trainers come when the moon is high...',
    category: 'secret',
    requirement: {
      type: 'bell_rings_midnight',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 2500,
      description: '$2500 bonus',
    },
    isUnlocked: false,
    isSecret: true,
    icon: '🌙',
  },
  {
    id: 'secret_speed',
    name: '⚡ Lightning Reflexes',
    description: 'Speed beyond comprehension draws unusual visitors...',
    category: 'secret',
    requirement: {
      type: 'rapid_clicks',
      target: 20, // 20 clicks in 10 seconds
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 3000,
      description: '$3000 bonus',
    },
    isUnlocked: false,
    isSecret: true,
    icon: '⚡',
  },
  {
    id: 'secret_patience',
    name: '🧘 Zen Master',
    description: 'Patience reveals hidden wonders to those who wait...',
    category: 'secret',
    requirement: {
      type: 'no_clicks_duration',
      target: 300, // 5 minutes without clicking
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 4000,
      description: '$4000 bonus',
    },
    isUnlocked: false,
    isSecret: true,
    icon: '🧘',
  },
  {
    id: 'secret_konami',
    name: '🎮 Old School',
    description: 'Some codes never die, they just wait to be remembered...',
    category: 'secret',
    requirement: {
      type: 'konami_code',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 10000,
      description: '$10,000 bonus + Special Unlock',
    },
    isUnlocked: false,
    isSecret: true,
    icon: '🎮',
  },
  {
    id: 'secret_collector',
    name: '🎭 The Collector',
    description: 'True collectors seek not just Pokemon, but experiences...',
    category: 'secret',
    requirement: {
      type: 'all_trainer_types_same_day',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 5000,
      description: '$5000 bonus',
    },
    isUnlocked: false,
    isSecret: true,
    icon: '🎭',
  },
  {
    id: 'secret_perfect_hundred',
    name: '💯 Centennial Precision',
    description: 'When precision meets dedication, legends are born...',
    category: 'secret',
    requirement: {
      type: 'perfect_clicks',
      target: 100,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 15000,
      description: '$15,000 bonus',
    },
    isUnlocked: false,
    isSecret: true,
    icon: '💯',
  },
  {
    id: 'secret_early_bird',
    name: '🌅 Early Bird',
    description: 'The early manager catches the rarest trainers...',
    category: 'secret',
    requirement: {
      type: 'bell_rings_dawn',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 2000,
      description: '$2000 bonus',
    },
    isUnlocked: false,
    isSecret: true,
    icon: '🌅',
  },
  {
    id: 'secret_minimalist',
    name: '🎯 Minimalist',
    description: 'Sometimes less is more, efficiency speaks volumes...',
    category: 'secret',
    requirement: {
      type: 'attract_50_trainers_minimal_clicks',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 7500,
      description: '$7500 bonus',
    },
    isUnlocked: false,
    isSecret: true,
    icon: '🎯',
  },
  {
    id: 'secret_archaeologist',
    name: '🏺 Digital Archaeologist',
    description: 'Some treasures are hidden in the oldest corners...',
    category: 'secret',
    requirement: {
      type: 'visit_all_areas_specific_order',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 6000,
      description: '$6000 bonus',
    },
    isUnlocked: false,
    isSecret: true,
    icon: '🏺',
  },
  {
    id: 'secret_finale',
    name: '🎊 The Ultimate Manager',
    description: 'Only the most dedicated will discover this truth...',
    category: 'secret',
    requirement: {
      type: 'complete_all_non_secret_achievements',
      target: 1,
      currentProgress: 0,
    },
    reward: {
      type: 'money',
      value: 50000,
      description: '$50,000 bonus + Ultimate Title',
    },
    isUnlocked: false,
    isSecret: true,
    icon: '🎊',
  },
];

// Helper function to get achievements by category
export function getAchievementsByCategory(category: string): Achievement[] {
  return ACHIEVEMENTS_EXPANDED.filter(achievement => achievement.category === category);
}

// Helper function to get unlocked achievements
export function getUnlockedAchievements(): Achievement[] {
  return ACHIEVEMENTS_EXPANDED.filter(achievement => achievement.isUnlocked);
}

// Helper function to get secret achievements
export function getSecretAchievements(): Achievement[] {
  return ACHIEVEMENTS_EXPANDED.filter(achievement => achievement.isSecret);
}

// Helper function to get visible achievements (unlocked + non-secret locked)
export function getVisibleAchievements(): Achievement[] {
  return ACHIEVEMENTS_EXPANDED.filter(achievement => achievement.isUnlocked || !achievement.isSecret);
}