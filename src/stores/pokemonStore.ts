import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { PokemonState, AreaType, Pokemon, PokemonSpecies, AreaPokemonPopulation } from '@/types';
import { getPokemonById, INITIAL_AREA_POPULATIONS } from '@/data/pokemon';

interface PokemonStore extends PokemonState {
  // Population Management
  spawnPokemon: (area: AreaType, species: PokemonSpecies) => Pokemon;
  updatePopulation: (area: AreaType, speciesId: number, change: number) => void;
  checkPopulationLevels: () => { area: AreaType; level: number }[];
  restockArea: (area: AreaType, speciesId: number, count: number) => void;
  
  // Breeding Programs
  enableBreeding: (area: AreaType) => void;
  disableBreeding: (area: AreaType) => void;
  setBreedingMultiplier: (multiplier: number) => void;
  tickBreeding: () => void;
  
  // Special Pokemon
  spawnLegendary: (area: AreaType, species: PokemonSpecies) => Pokemon;
  generateShiny: (pokemon: Pokemon) => Pokemon;
  setShinyMultiplier: (multiplier: number) => void;
  
  // Research
  researchSpecies: (speciesId: number) => void;
  addResearchBonus: (bonusType: string, value: number) => void;
  
  // Pokemon Encounters
  attemptCatch: (pokemon: Pokemon, catchRate: number) => boolean;
  calculateCatchValue: (pokemon: Pokemon) => number;
  
  // Data Management
  initializeAreas: () => void;
  getAreaPokemon: (area: AreaType) => AreaPokemonPopulation[];
  
  // Reset
  resetPokemon: () => void;
}

const initialPokemonState: PokemonState = {
  // Area Populations - will be initialized with actual data
  areaPopulations: {
    center: [],
    east: [],
    north: [],
    west: [],
  },
  
  // Breeding Programs
  breedingPrograms: {
    center: false,
    east: false,
    north: false,
    west: false,
  },
  breedingMultiplier: 1.0,
  
  // Special Pokemon
  legendarySpawns: [],
  shinyMultiplier: 50, // 50x value for shiny Pokemon
  
  // Research
  researchedSpecies: [],
  researchBonuses: {},
};

export const usePokemonStore = create<PokemonStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialPokemonState,
    
    // Population Management
    spawnPokemon: (area: AreaType, species: PokemonSpecies) => {
      const isShiny = Math.random() < 0.001; // 1/1000 chance for shiny
      const level = Math.floor(Math.random() * (species.maxLevel - species.minLevel + 1)) + species.minLevel;
      
      const pokemon: Pokemon = {
        id: Date.now() + Math.random(),
        name: species.name,
        rarity: species.rarity,
        baseValue: species.baseValue,
        level,
        isShiny,
        caughtAt: new Date(),
        area,
      };
      
      // If shiny, apply multiplier
      if (isShiny) {
        const state = get();
        pokemon.baseValue *= state.shinyMultiplier;
      }
      
      return pokemon;
    },
    
    updatePopulation: (area: AreaType, speciesId: number, change: number) => {
      set((state) => {
        const areaPopulation = state.areaPopulations[area];
        const speciesPopulation = areaPopulation.find(pop => pop.species.id === speciesId);
        
        if (speciesPopulation) {
          const newCount = Math.max(0, Math.min(
            speciesPopulation.maxCapacity,
            speciesPopulation.currentCount + change
          ));
          
          speciesPopulation.currentCount = newCount;
        }
        
        return {
          areaPopulations: {
            ...state.areaPopulations,
            [area]: [...areaPopulation],
          },
        };
      });
    },
    
    checkPopulationLevels: () => {
      const state = get();
      const lowPopulations: { area: AreaType; level: number }[] = [];
      
      Object.entries(state.areaPopulations).forEach(([area, populations]) => {
        const totalCurrent = populations.reduce((sum, pop) => sum + pop.currentCount, 0);
        const totalCapacity = populations.reduce((sum, pop) => sum + pop.maxCapacity, 0);
        const level = totalCapacity > 0 ? totalCurrent / totalCapacity : 0;
        
        if (level < 0.2) { // Below 20% triggers Population Panic minigame
          lowPopulations.push({ area: area as AreaType, level });
        }
      });
      
      return lowPopulations;
    },
    
    restockArea: (area: AreaType, speciesId: number, count: number) => {
      get().updatePopulation(area, speciesId, count);
    },
    
    // Breeding Programs
    enableBreeding: (area: AreaType) => {
      set((state) => ({
        breedingPrograms: {
          ...state.breedingPrograms,
          [area]: true,
        },
      }));
    },
    
    disableBreeding: (area: AreaType) => {
      set((state) => ({
        breedingPrograms: {
          ...state.breedingPrograms,
          [area]: false,
        },
      }));
    },
    
    setBreedingMultiplier: (multiplier: number) => {
      set({ breedingMultiplier: multiplier });
    },
    
    tickBreeding: () => {
      const state = get();
      
      Object.entries(state.breedingPrograms).forEach(([area, isActive]) => {
        if (!isActive) return;
        
        const areaPopulations = state.areaPopulations[area as AreaType];
        
        areaPopulations.forEach((population) => {
          if (population.currentCount > 0 && population.currentCount < population.maxCapacity) {
            // Calculate breeding rate
            const baseRate = population.breedingRate * state.breedingMultiplier;
            const breedingChance = baseRate / 3600; // Per second rate
            
            if (Math.random() < breedingChance) {
              get().updatePopulation(area as AreaType, population.species.id, 1);
            }
          }
        });
      });
    },
    
    // Special Pokemon
    spawnLegendary: (area: AreaType, species: PokemonSpecies) => {
      const legendary = get().spawnPokemon(area, species);
      
      set((state) => ({
        legendarySpawns: [...state.legendarySpawns, legendary],
      }));
      
      return legendary;
    },
    
    generateShiny: (pokemon: Pokemon) => {
      const shinyPokemon = {
        ...pokemon,
        isShiny: true,
        baseValue: pokemon.baseValue * get().shinyMultiplier,
      };
      
      return shinyPokemon;
    },
    
    setShinyMultiplier: (multiplier: number) => {
      set({ shinyMultiplier: multiplier });
    },
    
    // Research
    researchSpecies: (speciesId: number) => {
      set((state) => ({
        researchedSpecies: state.researchedSpecies.includes(speciesId)
          ? state.researchedSpecies
          : [...state.researchedSpecies, speciesId],
      }));
    },
    
    addResearchBonus: (bonusType: string, value: number) => {
      set((state) => ({
        researchBonuses: {
          ...state.researchBonuses,
          [bonusType]: (state.researchBonuses[bonusType] || 0) + value,
        },
      }));
    },
    
    // Pokemon Encounters
    attemptCatch: (pokemon: Pokemon, catchRate: number) => {
      // Base catch rate calculation
      let finalCatchRate = catchRate;
      
      // Apply research bonuses
      const state = get();
      const researchBonus = state.researchBonuses['catch_rate'] || 0;
      finalCatchRate += researchBonus;
      
      // Rarity affects catch rate
      const rarityModifiers = {
        common: 1.0,
        uncommon: 0.8,
        rare: 0.6,
        ultra_rare: 0.4,
        legendary: 0.1,
      };
      
      finalCatchRate *= rarityModifiers[pokemon.rarity];
      
      // Shiny Pokemon are harder to catch
      if (pokemon.isShiny) {
        finalCatchRate *= 0.5;
      }
      
      return Math.random() < finalCatchRate;
    },
    
    calculateCatchValue: (pokemon: Pokemon) => {
      let value = pokemon.baseValue;
      
      // Level bonus
      value += pokemon.level * 10;
      
      // Research bonuses
      const state = get();
      const valueBonus = state.researchBonuses['pokemon_value'] || 0;
      value *= (1 + valueBonus);
      
      return Math.floor(value);
    },
    
    // Data Management
    initializeAreas: () => {
      const initialPopulations: Record<AreaType, AreaPokemonPopulation[]> = {
        center: [],
        east: [],
        north: [],
        west: [],
      };
      
      // Initialize each area with Pokemon populations
      Object.entries(INITIAL_AREA_POPULATIONS).forEach(([area, populations]) => {
        const areaKey = area as AreaType;
        
        initialPopulations[areaKey] = populations.map(pop => {
          const species = getPokemonById(pop.speciesId);
          if (!species) {
            console.warn(`Pokemon species ${pop.speciesId} not found`);
            return null;
          }
          
          return {
            species,
            currentCount: pop.count,
            maxCapacity: pop.maxCapacity,
            breedingRate: 0.1, // Base breeding rate: 0.1 Pokemon per hour
          };
        }).filter(Boolean) as AreaPokemonPopulation[];
      });
      
      set({ areaPopulations: initialPopulations });
    },
    
    getAreaPokemon: (area: AreaType) => {
      return get().areaPopulations[area];
    },
    
    // Reset
    resetPokemon: () => {
      set({
        ...initialPokemonState,
      });
    },
  }))
);

// Selectors for optimized re-renders
export const useAreaPopulations = () => usePokemonStore((state) => state.areaPopulations);
export const useAreaPopulation = (area: AreaType) => 
  usePokemonStore((state) => state.areaPopulations[area]);
export const useBreedingPrograms = () => usePokemonStore((state) => state.breedingPrograms);
export const useShinyMultiplier = () => usePokemonStore((state) => state.shinyMultiplier);
export const useLegendarySpawns = () => usePokemonStore((state) => state.legendarySpawns);
export const useResearchBonuses = () => usePokemonStore((state) => state.researchBonuses);