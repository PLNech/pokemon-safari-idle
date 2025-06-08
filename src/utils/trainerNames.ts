import { TrainerType } from '@/types';

// Trainer name components based on Pokemon naming conventions
const firstNames = {
  casual: [
    'Alex', 'Sam', 'Riley', 'Casey', 'Jordan', 'Taylor', 'Morgan', 'Jamie',
    'Avery', 'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Hayden', 'Jesse'
  ],
  collector: [
    'Professor', 'Dr.', 'Scholar', 'Curator', 'Archivist', 'Researcher',
    'Expert', 'Master', 'Sage', 'Keeper', 'Guardian', 'Elder'
  ],
  speedrunner: [
    'Flash', 'Sonic', 'Dash', 'Bolt', 'Rush', 'Quick', 'Swift', 'Rapid',
    'Turbo', 'Zoom', 'Blitz', 'Sprint', 'Rocket', 'Thunder', 'Lightning'
  ],
  shiny_hunter: [
    'Shimmer', 'Gleam', 'Sparkle', 'Glitter', 'Shine', 'Radiant', 'Brilliant',
    'Prismatic', 'Aurora', 'Chrome', 'Crystal', 'Diamond', 'Platinum', 'Silver'
  ]
};

const lastNames = {
  casual: [
    'Walker', 'Rivers', 'Woods', 'Fields', 'Stone', 'Hill', 'Brook', 'Vale',
    'Cross', 'Green', 'Blue', 'Gray', 'Reed', 'Fox', 'Wolf', 'Hawk'
  ],
  collector: [
    'Archives', 'Codex', 'Index', 'Registry', 'Catalogue', 'Repository',
    'Vault', 'Library', 'Museum', 'Gallery', 'Collection', 'Compendium'
  ],
  speedrunner: [
    'Runner', 'Racer', 'Pacer', 'Sprinter', 'Dasher', 'Rusher', 'Streaker',
    'Blazer', 'Charger', 'Flyer', 'Rider', 'Skipper', 'Hopper', 'Jumper'
  ],
  shiny_hunter: [
    'Hunter', 'Seeker', 'Finder', 'Tracker', 'Stalker', 'Pursuer', 'Chaser',
    'Scout', 'Ranger', 'Explorer', 'Searcher', 'Detective', 'Sleuth', 'Prowler'
  ]
};

const titles = {
  casual: ['Youngster', 'Lass', 'Bug Catcher', 'Picnicker', 'Camper', 'Hiker'],
  collector: ['Elite Four', 'Gym Leader', 'Champion', 'Professor', 'Ace Trainer', 'Veteran'],
  speedrunner: ['Racer', 'Biker', 'Runner', 'Jogger', 'Skater', 'Cyclist'],
  shiny_hunter: ['Hunter', 'Ranger', 'Scout', 'Tracker', 'Seeker', 'Stalker']
};

// Rarity tiers affect naming patterns and special titles
export type TrainerRarity = 'common' | 'rare' | 'epic' | 'legendary';

const rarityWeights = {
  common: 0.70,    // 70% chance
  rare: 0.20,      // 20% chance
  epic: 0.08,      // 8% chance
  legendary: 0.02  // 2% chance
};

const specialTitles = {
  rare: ['Ace', 'Pro', 'Expert', 'Skilled', 'Advanced'],
  epic: ['Elite', 'Master', 'Champion', 'Legend', 'Hero'],
  legendary: ['Mythical', 'Divine', 'Cosmic', 'Ethereal', 'Supreme']
};

interface GeneratedTrainer {
  name: string;
  type: TrainerType;
  rarity: TrainerRarity;
  title?: string;
  nickname?: string;
}

export function generateTrainerName(preferredType?: TrainerType): GeneratedTrainer {
  // Determine trainer type (if not specified, random)
  const types: TrainerType[] = ['casual', 'collector', 'speedrunner', 'shiny_hunter'];
  const trainerType = preferredType || types[Math.floor(Math.random() * types.length)];
  
  // Determine rarity based on weights
  const rarity = determineRarity();
  
  // Generate base name
  const firstName = getRandomElement(firstNames[trainerType]);
  const lastName = getRandomElement(lastNames[trainerType]);
  
  let name = `${firstName} ${lastName}`;
  let title = getRandomElement(titles[trainerType]);
  let nickname: string | undefined;
  
  // Apply rarity bonuses
  switch (rarity) {
    case 'rare':
      title = `${getRandomElement(specialTitles.rare)} ${title}`;
      break;
    case 'epic':
      title = `${getRandomElement(specialTitles.epic)} ${title}`;
      nickname = generateNickname(trainerType);
      break;
    case 'legendary':
      title = `${getRandomElement(specialTitles.legendary)} ${title}`;
      nickname = generateLegendaryNickname(trainerType);
      name = `${firstName} "${nickname}" ${lastName}`;
      break;
  }
  
  return {
    name: `${title} ${name}`,
    type: trainerType,
    rarity,
    title,
    nickname
  };
}

function determineRarity(): TrainerRarity {
  const random = Math.random();
  let cumulative = 0;
  
  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    cumulative += weight;
    if (random <= cumulative) {
      return rarity as TrainerRarity;
    }
  }
  
  return 'common'; // Fallback
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateNickname(type: TrainerType): string {
  const nicknames = {
    casual: ['Rookie', 'Newbie', 'Explorer', 'Wanderer', 'Friend'],
    collector: ['Curator', 'Keeper', 'Archivist', 'Scholar', 'Sage'],
    speedrunner: ['Flash', 'Rocket', 'Blur', 'Storm', 'Lightning'],
    shiny_hunter: ['Sparkle', 'Gleam', 'Shine', 'Prism', 'Aurora']
  };
  
  return getRandomElement(nicknames[type]);
}

function generateLegendaryNickname(type: TrainerType): string {
  const legendaryNicknames = {
    casual: ['The Wanderer', 'Worldwalker', 'Pathfinder', 'Trailblazer'],
    collector: ['The Chronicler', 'Lorekeeper', 'Memory Keeper', 'Time Guardian'],
    speedrunner: ['The Unstoppable', 'Lightning Strike', 'Time Breaker', 'Velocity'],
    shiny_hunter: ['The Illuminated', 'Starfinder', 'Light Chaser', 'Cosmic Hunter']
  };
  
  return getRandomElement(legendaryNicknames[type]);
}

// Helper function to get trainer rarity color for UI
export function getTrainerRarityColor(rarity: TrainerRarity): string {
  switch (rarity) {
    case 'common': return 'text-gray-600';
    case 'rare': return 'text-blue-600';
    case 'epic': return 'text-purple-600';
    case 'legendary': return 'text-yellow-600';
    default: return 'text-gray-600';
  }
}

// Helper function to get trainer rarity border for UI
export function getTrainerRarityBorder(rarity: TrainerRarity): string {
  switch (rarity) {
    case 'common': return 'border-gray-300';
    case 'rare': return 'border-blue-400 shadow-blue-200';
    case 'epic': return 'border-purple-400 shadow-purple-200';
    case 'legendary': return 'border-yellow-400 shadow-yellow-200 animate-pulse';
    default: return 'border-gray-300';
  }
}