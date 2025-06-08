import { Upgrade, UpgradeCategory } from '@/types';

// Phase 1 Upgrades (Foundation - 0-15 min)
export const PHASE_1_UPGRADES: Upgrade[] = [
  {
    id: 'auto_bell_1',
    name: 'Auto-Bell Ringer',
    description: 'Automatically rings the bell every 10 seconds',
    category: 'marketing',
    level: 1,
    maxLevel: 4,
    baseCost: 1000,
    costScaling: 3,
    effect: {
      type: 'trainer_attraction',
      value: 1,
      isPercentage: false,
    },
    isUnlocked: true,
    isPurchased: false,
    icon: '🔔', // TODO: Replace with actual icon
  },
  {
    id: 'billboard_1',
    name: 'Billboard Campaign',
    description: 'Increases trainer arrival rate by 25%',
    category: 'marketing',
    level: 1,
    maxLevel: 4,
    baseCost: 2000,
    costScaling: 4,
    effect: {
      type: 'trainer_attraction',
      value: 25,
      isPercentage: true,
    },
    isUnlocked: true,
    isPurchased: false,
    icon: '📺', // TODO: Replace with actual icon
  },
  {
    id: 'breeding_program_1',
    name: 'Basic Breeding Program',
    description: 'Pokemon automatically repopulate over time',
    category: 'pokemon',
    level: 1,
    maxLevel: 4,
    baseCost: 3000,
    costScaling: 2,
    effect: {
      type: 'breeding_speed',
      value: 100,
      isPercentage: true,
    },
    isUnlocked: true,
    isPurchased: false,
    icon: '🥚', // TODO: Replace with actual icon
  },
  {
    id: 'rest_house_1',
    name: 'Rest House Comfort',
    description: 'Increases trainer satisfaction by 15%',
    category: 'facilities',
    level: 1,
    maxLevel: 4,
    baseCost: 4000,
    costScaling: 2,
    effect: {
      type: 'satisfaction_bonus',
      value: 15,
      isPercentage: true,
    },
    isUnlocked: true,
    isPurchased: false,
    icon: '🏠', // TODO: Replace with actual icon
  },
];

// Phase 2 Upgrades (Expansion - 15-45 min)
export const PHASE_2_UPGRADES: Upgrade[] = [
  {
    id: 'research_lab',
    name: 'Research Lab',
    description: 'Unlocks Pokemon research and catch rate bonuses',
    category: 'research',
    level: 1,
    maxLevel: 1,
    baseCost: 8000,
    costScaling: 1,
    effect: {
      type: 'revenue_multiplier',
      value: 10,
      isPercentage: true,
    },
    isUnlocked: false, // Requires 50 Pokemon caught
    isPurchased: false,
    icon: '🔬', // TODO: Replace with actual icon
  },
  {
    id: 'item_shop_1',
    name: 'Item Shop Expansion',
    description: 'Trainers buy items, increasing revenue per visit',
    category: 'facilities',
    level: 1,
    maxLevel: 4,
    baseCost: 7000,
    costScaling: 3,
    effect: {
      type: 'revenue_multiplier',
      value: 25,
      isPercentage: true,
    },
    isUnlocked: true,
    isPurchased: false,
    icon: '🛒', // TODO: Replace with actual icon
  },
  {
    id: 'rare_pokemon_permit',
    name: 'Rare Pokemon Permit',
    description: 'Allows rare Pokemon to spawn in areas',
    category: 'pokemon',
    level: 1,
    maxLevel: 4,
    baseCost: 10000,
    costScaling: 3,
    effect: {
      type: 'pokemon_spawn_rate',
      value: 50,
      isPercentage: true,
    },
    isUnlocked: true,
    isPurchased: false,
    icon: '⭐', // TODO: Replace with actual icon
  },
];

// Area Unlock "Upgrades"
export const AREA_UNLOCKS: Upgrade[] = [
  {
    id: 'unlock_area_east',
    name: 'Unlock East Area',
    description: 'Open the grassland area with Doduo, Cubone, and Tauros',
    category: 'facilities',
    level: 1,
    maxLevel: 1,
    baseCost: 5000,
    costScaling: 1,
    effect: {
      type: 'revenue_multiplier',
      value: 50,
      isPercentage: true,
    },
    isUnlocked: true,
    isPurchased: false,
    icon: '🌾', // TODO: Replace with actual icon
  },
  {
    id: 'unlock_area_north',
    name: 'Unlock North Area',
    description: 'Open the mountain area with Kangaskhan and rare Tauros',
    category: 'facilities',
    level: 1,
    maxLevel: 1,
    baseCost: 25000,
    costScaling: 1,
    effect: {
      type: 'revenue_multiplier',
      value: 100,
      isPercentage: true,
    },
    isUnlocked: false, // Requires 85%+ satisfaction
    isPurchased: false,
    icon: '⛰️', // TODO: Replace with actual icon
  },
  {
    id: 'unlock_area_west',
    name: 'Unlock West Area',
    description: 'Open the forest area with Tangela and powerful Tauros',
    category: 'facilities',
    level: 1,
    maxLevel: 1,
    baseCost: 100000,
    costScaling: 1,
    effect: {
      type: 'revenue_multiplier',
      value: 200,
      isPercentage: true,
    },
    isUnlocked: false, // Requires 20 different species caught
    isPurchased: false,
    icon: '🌲', // TODO: Replace with actual icon
  },
];

// Helper functions
export const calculateUpgradeCost = (upgrade: Upgrade): number => {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costScaling, upgrade.level - 1));
};

export const getUpgradesByCategory = (category: UpgradeCategory): Upgrade[] => {
  return [...PHASE_1_UPGRADES, ...PHASE_2_UPGRADES, ...AREA_UNLOCKS].filter(
    upgrade => upgrade.category === category
  );
};

export const getAffordableUpgrades = (currentMoney: number): Upgrade[] => {
  return [...PHASE_1_UPGRADES, ...PHASE_2_UPGRADES, ...AREA_UNLOCKS].filter(
    upgrade => upgrade.isUnlocked && !upgrade.isPurchased && calculateUpgradeCost(upgrade) <= currentMoney
  );
};

export const getNextUpgrade = (upgradeId: string): Upgrade | null => {
  const allUpgrades = [...PHASE_1_UPGRADES, ...PHASE_2_UPGRADES, ...AREA_UNLOCKS];
  const upgrade = allUpgrades.find(u => u.id === upgradeId);
  
  if (!upgrade || upgrade.level >= upgrade.maxLevel) {
    return null;
  }
  
  return {
    ...upgrade,
    level: upgrade.level + 1,
  };
};

// Unlock conditions checker
export const checkUpgradeUnlocks = (gameStats: {
  trainersAttracted: number;
  totalPokemonCaught: number;
  averageSatisfaction: number;
  differentSpeciesCaught: number;
}) => {
  const unlocks: string[] = [];
  
  // Research Lab: 50 Pokemon caught
  if (gameStats.totalPokemonCaught >= 50) {
    unlocks.push('research_lab');
  }
  
  // North Area: 85%+ satisfaction
  if (gameStats.averageSatisfaction >= 0.85) {
    unlocks.push('unlock_area_north');
  }
  
  // West Area: 20 different species
  if (gameStats.differentSpeciesCaught >= 20) {
    unlocks.push('unlock_area_west');
  }
  
  return unlocks;
};

export const ALL_UPGRADES = [...PHASE_1_UPGRADES, ...PHASE_2_UPGRADES, ...AREA_UNLOCKS];