// Core Game Types

export type GamePhase = 'foundation' | 'expansion' | 'optimization' | 'mastery';

export type AreaType = 'center' | 'east' | 'north' | 'west';

export type PokemonRarity = 'common' | 'uncommon' | 'rare' | 'ultra_rare' | 'legendary';

export type TrainerType = 'casual' | 'collector' | 'speedrunner' | 'shiny_hunter';

export type UpgradeCategory = 'marketing' | 'pokemon' | 'facilities' | 'research';

// Pokemon Types
export interface Pokemon {
  id: number;
  name: string;
  rarity: PokemonRarity;
  baseValue: number;
  level: number;
  isShiny: boolean;
  caughtAt: Date;
  area: AreaType;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  rarity: PokemonRarity;
  baseValue: number;
  spawnRate: number;
  areas: AreaType[];
  minLevel: number;
  maxLevel: number;
  // TODO: Replace with actual sprite path
  sprite: string;
}

export interface AreaPokemonPopulation {
  species: PokemonSpecies;
  currentCount: number;
  maxCapacity: number;
  breedingRate: number;
}

// Trainer Types
export interface Trainer {
  id: string;
  type: TrainerType;
  name: string;
  currentArea: AreaType;
  entryFee: number;
  itemsPurchased: SafariItem[];
  pokemonCaught: Pokemon[];
  satisfactionRating: number;
  timeInPark: number;
  isActive: boolean;
}

export interface TrainerFlow {
  trainersPerMinute: number;
  averageStayTime: number;
  averageSatisfaction: number;
  premiumTrainerRate: number;
}

// Safari Items
export interface SafariItem {
  id: string;
  name: string;
  price: number;
  effect: 'catch_rate' | 'flee_prevention' | 'pokemon_attraction';
  multiplier: number;
  // TODO: Replace with actual icon
  icon: string;
}

// Upgrades
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  category: UpgradeCategory;
  level: number;
  maxLevel: number;
  baseCost: number;
  costScaling: number;
  effect: UpgradeEffect;
  isUnlocked: boolean;
  isPurchased: boolean;
  // TODO: Replace with actual icon
  icon: string;
}

export interface UpgradeEffect {
  type: 'trainer_attraction' | 'revenue_multiplier' | 'pokemon_spawn_rate' | 'breeding_speed' | 'satisfaction_bonus';
  value: number;
  isPercentage: boolean;
}

// Achievements
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'early' | 'progression' | 'collection' | 'mastery';
  requirement: AchievementRequirement;
  reward: AchievementReward;
  isUnlocked: boolean;
  unlockedAt?: Date;
  // TODO: Replace with actual icon
  icon: string;
}

export interface AchievementRequirement {
  type: 'trainers_attracted' | 'money_earned' | 'pokemon_caught' | 'areas_unlocked' | 'upgrades_purchased';
  target: number;
  currentProgress: number;
}

export interface AchievementReward {
  type: 'money' | 'unlock_feature' | 'permanent_bonus';
  value: number | string;
  description: string;
}

// Minigames
export interface MinigameState {
  isActive: boolean;
  type: 'bell_rhythm' | 'population_panic' | 'legendary_migration';
  timeRemaining: number;
  score: number;
  difficulty: number;
}

export interface BellRhythmState extends MinigameState {
  type: 'bell_rhythm';
  perfectClicks: number;
  consecutiveHits: number;
  rhythm: number[];
  currentBeat: number;
}

export interface PopulationPanicState extends MinigameState {
  type: 'population_panic';
  areasToRestock: AreaType[];
  restockedAreas: AreaType[];
  pokemonCosts: Record<AreaType, number>;
}

export interface LegendaryMigrationState extends MinigameState {
  type: 'legendary_migration';
  legendaryPokemon: PokemonSpecies;
  currentArea: AreaType;
  trainersGuided: number;
  targetTrainers: number;
}

// Game State
export interface GameState {
  // Core Progress
  money: number;
  phase: GamePhase;
  gameStartTime: Date;
  totalPlayTime: number;
  
  // Trainer Stats
  trainersAttracted: number;
  totalRevenue: number;
  averageSatisfaction: number;
  
  // Pokemon Stats
  totalPokemonCaught: number;
  rarePokemonCaught: number;
  shinyPokemonCaught: number;
  
  // Area Unlocks
  unlockedAreas: AreaType[];
  
  // Active Systems
  isAutoBellActive: boolean;
  autoBellLevel: number;
  
  // Game Settings
  isPaused: boolean;
  soundEnabled: boolean;
  
  // Current Activity
  activeTrainers: Trainer[];
  recentPokemonCaught: Pokemon[];
  activeMinigame?: MinigameState;
}

export interface PokemonState {
  // Area Populations
  areaPopulations: Record<AreaType, AreaPokemonPopulation[]>;
  
  // Breeding Programs
  breedingPrograms: Record<AreaType, boolean>;
  breedingMultiplier: number;
  
  // Special Pokemon
  legendarySpawns: Pokemon[];
  shinyMultiplier: number;
  
  // Research
  researchedSpecies: number[];
  researchBonuses: Record<string, number>;
}

export interface UpgradeState {
  purchasedUpgrades: Record<string, Upgrade>;
  availableUpgrades: Upgrade[];
  totalUpgradesBought: number;
}

export interface AchievementState {
  unlockedAchievements: Achievement[];
  achievementProgress: Record<string, number>;
  totalAchievements: number;
}

// Save System
export interface SaveData {
  version: string;
  timestamp: number;
  gameState: GameState;
  pokemonState: PokemonState;
  upgradeState: UpgradeState;
  achievementState: AchievementState;
}

// Notifications
export interface Notification {
  id: string;
  type: 'achievement' | 'rare_pokemon' | 'revenue' | 'upgrade' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  duration: number;
  isVisible: boolean;
  // TODO: Replace with actual icon
  icon: string;
}

// Game Events
export interface GameEvent {
  id: string;
  type: 'trainer_arrival' | 'pokemon_caught' | 'pokemon_spawned' | 'upgrade_purchased' | 'achievement_unlocked';
  timestamp: Date;
  data: any;
}

// UI State
export interface UIState {
  currentView: 'game' | 'upgrades' | 'achievements' | 'settings';
  selectedArea: AreaType;
  notifications: Notification[];
  modals: {
    upgradeShop: boolean;
    achievements: boolean;
    settings: boolean;
    saveLoad: boolean;
  };
}