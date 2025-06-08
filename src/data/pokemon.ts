import { PokemonSpecies, PokemonRarity, AreaType } from '@/types';

// Safari Zone Pokemon based on Generation I data from PRD
export const safariZonePokemon: PokemonSpecies[] = [
  // Center Area Pokemon
  {
    id: 29,
    name: "Nidoran♀",
    rarity: 'common',
    baseValue: 50,
    spawnRate: 0.2,
    areas: ['center'],
    minLevel: 22,
    maxLevel: 36,
    sprite: "🦄", // TODO: Replace with actual sprite
  },
  {
    id: 32,
    name: "Nidoran♂",
    rarity: 'common',
    baseValue: 50,
    spawnRate: 0.2,
    areas: ['center'],
    minLevel: 14,
    maxLevel: 22,
    sprite: "🦄", // TODO: Replace with actual sprite
  },
  {
    id: 102,
    name: "Exeggcute",
    rarity: 'common',
    baseValue: 75,
    spawnRate: 0.15,
    areas: ['center'],
    minLevel: 24,
    maxLevel: 25,
    sprite: "🥚", // TODO: Replace with actual sprite
  },
  {
    id: 111,
    name: "Rhyhorn",
    rarity: 'common',
    baseValue: 100,
    spawnRate: 0.15,
    areas: ['center'],
    minLevel: 20,
    maxLevel: 25,
    sprite: "🦏", // TODO: Replace with actual sprite
  },
  {
    id: 30,
    name: "Nidorina",
    rarity: 'uncommon',
    baseValue: 200,
    spawnRate: 0.1,
    areas: ['center'],
    minLevel: 31,
    maxLevel: 31,
    sprite: "🦄", // TODO: Replace with actual sprite
  },
  {
    id: 33,
    name: "Nidorino",
    rarity: 'uncommon',
    baseValue: 200,
    spawnRate: 0.1,
    areas: ['center'],
    minLevel: 23,
    maxLevel: 31,
    sprite: "🦄", // TODO: Replace with actual sprite
  },
  {
    id: 46,
    name: "Paras",
    rarity: 'uncommon',
    baseValue: 150,
    spawnRate: 0.12,
    areas: ['center'],
    minLevel: 27,
    maxLevel: 27,
    sprite: "🍄", // TODO: Replace with actual sprite
  },
  {
    id: 47,
    name: "Parasect",
    rarity: 'uncommon',
    baseValue: 250,
    spawnRate: 0.08,
    areas: ['center'],
    minLevel: 27,
    maxLevel: 32,
    sprite: "🍄", // TODO: Replace with actual sprite
  },
  {
    id: 48,
    name: "Venonat",
    rarity: 'uncommon',
    baseValue: 180,
    spawnRate: 0.1,
    areas: ['center'],
    minLevel: 22,
    maxLevel: 22,
    sprite: "🐛", // TODO: Replace with actual sprite
  },
  {
    id: 113,
    name: "Chansey",
    rarity: 'rare',
    baseValue: 1000,
    spawnRate: 0.02,
    areas: ['center'],
    minLevel: 7,
    maxLevel: 23,
    sprite: "🥚", // TODO: Replace with actual sprite
  },
  {
    id: 114,
    name: "Tangela",
    rarity: 'rare',
    baseValue: 800,
    spawnRate: 0.04,
    areas: ['center'],
    minLevel: 22,
    maxLevel: 22,
    sprite: "🌿", // TODO: Replace with actual sprite
  },
  {
    id: 123,
    name: "Scyther",
    rarity: 'rare',
    baseValue: 1200,
    spawnRate: 0.04,
    areas: ['center'],
    minLevel: 23,
    maxLevel: 23,
    sprite: "🗡️", // TODO: Replace with actual sprite
  },
  {
    id: 127,
    name: "Pinsir",
    rarity: 'rare',
    baseValue: 1100,
    spawnRate: 0.04,
    areas: ['center'],
    minLevel: 23,
    maxLevel: 23,
    sprite: "🪲", // TODO: Replace with actual sprite
  },

  // Area 1 (East) Pokemon
  {
    id: 84,
    name: "Doduo",
    rarity: 'common',
    baseValue: 120,
    spawnRate: 0.2,
    areas: ['east'],
    minLevel: 26,
    maxLevel: 26,
    sprite: "🦆", // TODO: Replace with actual sprite
  },
  {
    id: 104,
    name: "Cubone",
    rarity: 'uncommon',
    baseValue: 300,
    spawnRate: 0.1,
    areas: ['east'],
    minLevel: 19,
    maxLevel: 19,
    sprite: "💀", // TODO: Replace with actual sprite
  },
  {
    id: 105,
    name: "Marowak",
    rarity: 'uncommon',
    baseValue: 500,
    spawnRate: 0.05,
    areas: ['east'],
    minLevel: 24,
    maxLevel: 24,
    sprite: "💀", // TODO: Replace with actual sprite
  },
  {
    id: 115,
    name: "Kangaskhan",
    rarity: 'rare',
    baseValue: 1500,
    spawnRate: 0.04,
    areas: ['east', 'north'],
    minLevel: 25,
    maxLevel: 33,
    sprite: "🦘", // TODO: Replace with actual sprite
  },
  {
    id: 128,
    name: "Tauros",
    rarity: 'rare',
    baseValue: 2000,
    spawnRate: 0.1,
    areas: ['east', 'north', 'west'],
    minLevel: 21,
    maxLevel: 28,
    sprite: "🐂", // TODO: Replace with actual sprite
  },

  // Area 2 (North) Pokemon
  {
    id: 49,
    name: "Venomoth",
    rarity: 'uncommon',
    baseValue: 400,
    spawnRate: 0.05,
    areas: ['north'],
    minLevel: 32,
    maxLevel: 32,
    sprite: "🦋", // TODO: Replace with actual sprite
  },

  // Area 3 (West) Pokemon - Additional Tangela and Tauros spawns
  // (Tangela and Tauros already defined above)

  // Fishing Pokemon (All Areas)
  {
    id: 129,
    name: "Magikarp",
    rarity: 'common',
    baseValue: 25,
    spawnRate: 1.0, // 100% with Old Rod
    areas: ['center', 'east', 'north', 'west'],
    minLevel: 5,
    maxLevel: 5,
    sprite: "🐟", // TODO: Replace with actual sprite
  },
  {
    id: 60,
    name: "Poliwag",
    rarity: 'uncommon',
    baseValue: 180,
    spawnRate: 0.5, // Good Rod
    areas: ['center', 'east', 'north', 'west'],
    minLevel: 10,
    maxLevel: 10,
    sprite: "🐸", // TODO: Replace with actual sprite
  },
  {
    id: 118,
    name: "Goldeen",
    rarity: 'uncommon',
    baseValue: 200,
    spawnRate: 0.5, // Good Rod
    areas: ['center', 'east', 'north', 'west'],
    minLevel: 10,
    maxLevel: 10,
    sprite: "🐠", // TODO: Replace with actual sprite
  },
  {
    id: 54,
    name: "Psyduck",
    rarity: 'uncommon',
    baseValue: 250,
    spawnRate: 0.25, // Super Rod
    areas: ['center', 'east', 'north', 'west'],
    minLevel: 15,
    maxLevel: 15,
    sprite: "🦆", // TODO: Replace with actual sprite
  },
  {
    id: 79,
    name: "Slowpoke",
    rarity: 'uncommon',
    baseValue: 220,
    spawnRate: 0.25, // Super Rod
    areas: ['center', 'east', 'north', 'west'],
    minLevel: 15,
    maxLevel: 15,
    sprite: "🦥", // TODO: Replace with actual sprite
  },
  {
    id: 98,
    name: "Krabby",
    rarity: 'uncommon',
    baseValue: 240,
    spawnRate: 0.25, // Super Rod
    areas: ['center', 'east', 'north', 'west'],
    minLevel: 15,
    maxLevel: 15,
    sprite: "🦀", // TODO: Replace with actual sprite
  },
  {
    id: 147,
    name: "Dratini",
    rarity: 'ultra_rare',
    baseValue: 5000,
    spawnRate: 0.25, // Super Rod, very rare
    areas: ['center', 'east', 'north', 'west'],
    minLevel: 10,
    maxLevel: 15,
    sprite: "🐉", // TODO: Replace with actual sprite
  },
  {
    id: 148,
    name: "Dragonair",
    rarity: 'ultra_rare',
    baseValue: 8000,
    spawnRate: 0.1, // Super Rod, extremely rare
    areas: ['center', 'east', 'north', 'west'],
    minLevel: 15,
    maxLevel: 15,
    sprite: "🐉", // TODO: Replace with actual sprite
  },

  // Legendary Pokemon (Event-only spawns)
  {
    id: 144,
    name: "Articuno",
    rarity: 'legendary',
    baseValue: 50000,
    spawnRate: 0.001,
    areas: ['center', 'east', 'north', 'west'],
    minLevel: 50,
    maxLevel: 50,
    sprite: "🧊", // TODO: Replace with actual sprite
  },
  {
    id: 145,
    name: "Zapdos",
    rarity: 'legendary',
    baseValue: 50000,
    spawnRate: 0.001,
    areas: ['center', 'east', 'north', 'west'],
    minLevel: 50,
    maxLevel: 50,
    sprite: "⚡", // TODO: Replace with actual sprite
  },
  {
    id: 146,
    name: "Moltres",
    rarity: 'legendary',
    baseValue: 50000,
    spawnRate: 0.001,
    areas: ['center', 'east', 'north', 'west'],
    minLevel: 50,
    maxLevel: 50,
    sprite: "🔥", // TODO: Replace with actual sprite
  },
];

// Pokemon rarity configuration
export const POKEMON_RARITY_CONFIG = {
  common: { 
    baseValue: 50, 
    spawnRate: 0.4,
    color: '#9CA3AF', // Gray
  },
  uncommon: { 
    baseValue: 200, 
    spawnRate: 0.3,
    color: '#10B981', // Green
  },
  rare: { 
    baseValue: 1000, 
    spawnRate: 0.15,
    color: '#3B82F6', // Blue
  },
  ultra_rare: { 
    baseValue: 5000, 
    spawnRate: 0.05,
    color: '#8B5CF6', // Purple
  },
  legendary: { 
    baseValue: 50000, 
    spawnRate: 0.001,
    color: '#F59E0B', // Amber/Gold
  },
} as const;

// Helper functions
export const getPokemonByArea = (area: AreaType): PokemonSpecies[] => {
  return safariZonePokemon.filter(pokemon => pokemon.areas.includes(area));
};

export const getPokemonById = (id: number): PokemonSpecies | undefined => {
  return safariZonePokemon.find(pokemon => pokemon.id === id);
};

export const getPokemonByRarity = (rarity: PokemonRarity): PokemonSpecies[] => {
  return safariZonePokemon.filter(pokemon => pokemon.rarity === rarity);
};

export const getRandomPokemonForArea = (area: AreaType): PokemonSpecies | null => {
  const areaPokemon = getPokemonByArea(area);
  if (areaPokemon.length === 0) return null;
  
  // Weighted random selection based on spawn rates
  const totalWeight = areaPokemon.reduce((sum, pokemon) => sum + pokemon.spawnRate, 0);
  let random = Math.random() * totalWeight;
  
  for (const pokemon of areaPokemon) {
    random -= pokemon.spawnRate;
    if (random <= 0) {
      return pokemon;
    }
  }
  
  // Fallback to first pokemon
  return areaPokemon[0];
};

// Initial population configuration for areas
export const INITIAL_AREA_POPULATIONS = {
  center: [
    { speciesId: 29, count: 15, maxCapacity: 30 }, // Nidoran♀
    { speciesId: 32, count: 15, maxCapacity: 30 }, // Nidoran♂
    { speciesId: 102, count: 10, maxCapacity: 20 }, // Exeggcute
    { speciesId: 111, count: 8, maxCapacity: 15 }, // Rhyhorn
    { speciesId: 46, count: 5, maxCapacity: 12 }, // Paras
    { speciesId: 48, count: 5, maxCapacity: 12 }, // Venonat
  ],
  east: [
    { speciesId: 84, count: 12, maxCapacity: 25 }, // Doduo
    { speciesId: 104, count: 6, maxCapacity: 15 }, // Cubone
    { speciesId: 128, count: 3, maxCapacity: 8 }, // Tauros
  ],
  north: [
    { speciesId: 115, count: 4, maxCapacity: 10 }, // Kangaskhan
    { speciesId: 128, count: 2, maxCapacity: 6 }, // Tauros
  ],
  west: [
    { speciesId: 114, count: 2, maxCapacity: 5 }, // Tangela
    { speciesId: 128, count: 3, maxCapacity: 8 }, // Tauros
  ],
};