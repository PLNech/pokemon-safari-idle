import { TrainerType, TrainerRarity, Trainer } from '@/types';
import { generateTrainerName } from './trainerNames';

export interface SpecialTrainerEffect {
  type: 'revenue_bonus' | 'catch_rate_bonus' | 'time_bonus' | 'rare_pokemon_attraction' | 'satisfaction_boost';
  value: number;
  description: string;
}

export interface SpecialTrainerTemplate {
  name: string;
  title: string;
  type: TrainerType;
  rarity: TrainerRarity;
  effects: SpecialTrainerEffect[];
  entryFeeMultiplier: number;
  spawnWeight: number; // Higher = more common
  unlockCondition?: {
    type: 'achievement' | 'trainer_count' | 'money_earned' | 'pokemon_caught';
    target: number;
  };
}

// Special trainer templates with unique bonuses
export const SPECIAL_TRAINERS: SpecialTrainerTemplate[] = [
  // Legendary Trainers (Ultra Rare)
  {
    name: 'Champion Red',
    title: 'Pokemon Champion',
    type: 'collector',
    rarity: 'legendary',
    effects: [
      { type: 'revenue_bonus', value: 300, description: '+300% entry fee' },
      { type: 'rare_pokemon_attraction', value: 50, description: '+50% rare Pokemon spawn rate' },
      { type: 'satisfaction_boost', value: 25, description: '+25% satisfaction rating' }
    ],
    entryFeeMultiplier: 4.0,
    spawnWeight: 1,
    unlockCondition: { type: 'pokemon_caught', target: 100 }
  },
  {
    name: 'Professor Oak',
    title: 'Pokemon Professor',
    type: 'collector',
    rarity: 'legendary',
    effects: [
      { type: 'catch_rate_bonus', value: 40, description: '+40% catch success rate' },
      { type: 'revenue_bonus', value: 200, description: '+200% entry fee' },
      { type: 'time_bonus', value: 50, description: '+50% time in park' }
    ],
    entryFeeMultiplier: 3.5,
    spawnWeight: 1,
    unlockCondition: { type: 'trainer_count', target: 50 }
  },

  // Epic Trainers (Very Rare)
  {
    name: 'Elite Four Member',
    title: 'Elite Trainer',
    type: 'speedrunner',
    rarity: 'epic',
    effects: [
      { type: 'revenue_bonus', value: 150, description: '+150% entry fee' },
      { type: 'catch_rate_bonus', value: 25, description: '+25% catch rate' }
    ],
    entryFeeMultiplier: 2.5,
    spawnWeight: 3,
    unlockCondition: { type: 'money_earned', target: 10000 }
  },
  {
    name: 'Gym Leader',
    title: 'Pokemon Gym Leader',
    type: 'collector',
    rarity: 'epic',
    effects: [
      { type: 'satisfaction_boost', value: 20, description: '+20% satisfaction' },
      { type: 'revenue_bonus', value: 125, description: '+125% entry fee' }
    ],
    entryFeeMultiplier: 2.25,
    spawnWeight: 5,
    unlockCondition: { type: 'trainer_count', target: 25 }
  },
  {
    name: 'Shiny Hunter Master',
    title: 'Shiny Specialist',
    type: 'shiny_hunter',
    rarity: 'epic',
    effects: [
      { type: 'rare_pokemon_attraction', value: 30, description: '+30% shiny spawn rate' },
      { type: 'revenue_bonus', value: 100, description: '+100% entry fee' }
    ],
    entryFeeMultiplier: 2.0,
    spawnWeight: 4,
    unlockCondition: { type: 'pokemon_caught', target: 25 }
  },

  // Rare Trainers (Uncommon)
  {
    name: 'Ace Trainer',
    title: 'Skilled Trainer',
    type: 'speedrunner',
    rarity: 'rare',
    effects: [
      { type: 'catch_rate_bonus', value: 15, description: '+15% catch rate' },
      { type: 'revenue_bonus', value: 75, description: '+75% entry fee' }
    ],
    entryFeeMultiplier: 1.75,
    spawnWeight: 8,
  },
  {
    name: 'Pokedex Completionist',
    title: 'Data Collector',
    type: 'collector',
    rarity: 'rare',
    effects: [
      { type: 'time_bonus', value: 30, description: '+30% time in park' },
      { type: 'satisfaction_boost', value: 15, description: '+15% satisfaction' }
    ],
    entryFeeMultiplier: 1.5,
    spawnWeight: 10,
  },
  {
    name: 'Contest Star',
    title: 'Beauty Coordinator',
    type: 'casual',
    rarity: 'rare',
    effects: [
      { type: 'satisfaction_boost', value: 20, description: '+20% satisfaction' },
      { type: 'revenue_bonus', value: 50, description: '+50% entry fee' }
    ],
    entryFeeMultiplier: 1.6,
    spawnWeight: 12,
  }
];

export function checkSpecialTrainerUnlocks(gameStats: any): SpecialTrainerTemplate[] {
  return SPECIAL_TRAINERS.filter(template => {
    if (!template.unlockCondition) return true;
    
    const { type, target } = template.unlockCondition;
    
    switch (type) {
      case 'trainer_count':
        return gameStats.trainersAttracted >= target;
      case 'money_earned':
        return gameStats.totalRevenue >= target;
      case 'pokemon_caught':
        return gameStats.totalPokemonCaught >= target;
      case 'achievement':
        // TODO: Check specific achievement unlock
        return false;
      default:
        return false;
    }
  });
}

export function generateSpecialTrainer(
  type?: TrainerType,
  forceRarity?: TrainerRarity,
  gameStats?: any
): Trainer | null {
  const availableTemplates = checkSpecialTrainerUnlocks(gameStats || {});
  
  if (availableTemplates.length === 0) return null;

  // Filter by type if specified
  const filteredTemplates = type 
    ? availableTemplates.filter(t => t.type === type)
    : availableTemplates;

  if (filteredTemplates.length === 0) return null;

  // Weight-based selection
  const totalWeight = filteredTemplates.reduce((sum, t) => sum + t.spawnWeight, 0);
  let random = Math.random() * totalWeight;
  
  let selectedTemplate: SpecialTrainerTemplate | null = null;
  for (const template of filteredTemplates) {
    random -= template.spawnWeight;
    if (random <= 0) {
      selectedTemplate = template;
      break;
    }
  }

  if (!selectedTemplate) {
    selectedTemplate = filteredTemplates[0]; // Fallback
  }

  // Override rarity if forced
  const finalRarity = forceRarity || selectedTemplate.rarity;

  // Generate base trainer
  const baseTrainer: Trainer = {
    id: `special_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: selectedTemplate.type,
    name: selectedTemplate.name,
    rarity: finalRarity,
    title: selectedTemplate.title,
    currentArea: 'center',
    entryFee: Math.floor(50 * selectedTemplate.entryFeeMultiplier),
    itemsPurchased: [],
    pokemonCaught: [],
    satisfactionRating: 85 + (finalRarity === 'legendary' ? 15 : finalRarity === 'epic' ? 10 : 5),
    timeInPark: 0,
    isActive: true,
  };

  return baseTrainer;
}

export function calculateSpecialTrainerBonuses(trainer: Trainer): {
  revenueMultiplier: number;
  catchRateBonus: number;
  timeBonus: number;
  rarePokemonBonus: number;
  satisfactionBonus: number;
} {
  const template = SPECIAL_TRAINERS.find(t => t.name === trainer.name);
  
  if (!template) {
    return {
      revenueMultiplier: 1,
      catchRateBonus: 0,
      timeBonus: 0,
      rarePokemonBonus: 0,
      satisfactionBonus: 0,
    };
  }

  const bonuses = {
    revenueMultiplier: 1,
    catchRateBonus: 0,
    timeBonus: 0,
    rarePokemonBonus: 0,
    satisfactionBonus: 0,
  };

  template.effects.forEach(effect => {
    switch (effect.type) {
      case 'revenue_bonus':
        bonuses.revenueMultiplier += effect.value / 100;
        break;
      case 'catch_rate_bonus':
        bonuses.catchRateBonus += effect.value;
        break;
      case 'time_bonus':
        bonuses.timeBonus += effect.value;
        break;
      case 'rare_pokemon_attraction':
        bonuses.rarePokemonBonus += effect.value;
        break;
      case 'satisfaction_boost':
        bonuses.satisfactionBonus += effect.value;
        break;
    }
  });

  return bonuses;
}

export function getSpecialTrainerDescription(trainer: Trainer): string {
  const template = SPECIAL_TRAINERS.find(t => t.name === trainer.name);
  
  if (!template) {
    return 'A regular trainer visiting the Safari Zone.';
  }

  const effectDescriptions = template.effects.map(e => e.description).join(', ');
  return `${template.title}: ${effectDescriptions}`;
}