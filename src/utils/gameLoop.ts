import { useGameStore } from '@/stores/gameStore';
import { usePokemonStore } from '@/stores/pokemonStore';
import { getRandomPokemonForArea } from '@/data/pokemon';
import { Pokemon, Trainer } from '@/types';

export class GameLoop {
  private static instance: GameLoop;
  private intervalId?: NodeJS.Timeout;
  private isRunning = false;

  static getInstance(): GameLoop {
    if (!GameLoop.instance) {
      GameLoop.instance = new GameLoop();
    }
    return GameLoop.instance;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    // Run game loop every second
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private tick() {
    this.updateTrainerSimulation();
    this.updatePokemonBreeding();
    this.updateAutoBell();
  }

  private updateTrainerSimulation() {
    const gameStore = useGameStore.getState();
    const pokemonStore = usePokemonStore.getState();
    
    // Update each active trainer
    gameStore.activeTrainers.forEach(trainer => {
      // Increase time in park
      trainer.timeInPark += 1;
      
      // Check if trainer should encounter a Pokemon
      if (Math.random() < 0.1) { // 10% chance per second
        this.trainerEncountersPokemon(trainer);
      }
      
      // Check if trainer should leave (after 30-120 seconds)
      const maxStayTime = 30 + Math.random() * 90;
      if (trainer.timeInPark > maxStayTime) {
        this.trainerLeaves(trainer);
      }
    });
  }

  private trainerEncountersPokemon(trainer: Trainer) {
    const pokemonStore = usePokemonStore.getState();
    const gameStore = useGameStore.getState();
    
    // Get random Pokemon from trainer's current area
    const pokemonSpecies = getRandomPokemonForArea(trainer.currentArea);
    if (!pokemonSpecies) return;
    
    // Check if Pokemon is available in area
    const areaPopulation = pokemonStore.areaPopulations[trainer.currentArea];
    const speciesPopulation = areaPopulation.find(pop => pop.species.id === pokemonSpecies.id);
    
    if (!speciesPopulation || speciesPopulation.currentCount <= 0) {
      return; // No Pokemon available
    }
    
    // Spawn the Pokemon
    const pokemon = pokemonStore.spawnPokemon(trainer.currentArea, pokemonSpecies);
    
    // Trainer attempts to catch
    const catchSuccess = this.attemptPokemonCatch(trainer, pokemon);
    
    if (catchSuccess) {
      // Add Pokemon to trainer's collection
      trainer.pokemonCaught.push(pokemon);
      
      // Calculate revenue
      const revenue = pokemonStore.calculateCatchValue(pokemon);
      gameStore.collectRevenue(revenue);
      
      // Update game stats
      gameStore.incrementPokemonCaught(
        pokemon.rarity === 'rare' || pokemon.rarity === 'ultra_rare' || pokemon.rarity === 'legendary',
        pokemon.isShiny
      );
      
      // Reduce Pokemon population
      pokemonStore.updatePopulation(trainer.currentArea, pokemonSpecies.id, -1);
      
      // TODO: Show notification for rare catches
      if (pokemon.rarity === 'rare' || pokemon.isShiny) {
        console.log(`🎉 ${trainer.name} caught a ${pokemon.isShiny ? 'shiny ' : ''}${pokemon.name}!`);
      }
    }
  }

  private attemptPokemonCatch(trainer: Trainer, pokemon: Pokemon): boolean {
    const pokemonStore = usePokemonStore.getState();
    
    // Base catch rate varies by Pokemon rarity
    const baseCatchRates = {
      common: 0.8,
      uncommon: 0.6,
      rare: 0.4,
      ultra_rare: 0.2,
      legendary: 0.1,
    };
    
    const baseCatchRate = baseCatchRates[pokemon.rarity];
    
    // Use Pokemon store's catch calculation
    return pokemonStore.attemptCatch(pokemon, baseCatchRate);
  }

  private trainerLeaves(trainer: Trainer) {
    const gameStore = useGameStore.getState();
    
    // Calculate satisfaction based on Pokemon caught
    let satisfaction = 0.5; // Base satisfaction
    
    if (trainer.pokemonCaught.length > 0) {
      satisfaction = Math.min(1.0, 0.6 + (trainer.pokemonCaught.length * 0.2));
    }
    
    // Bonus for rare Pokemon
    const rareCount = trainer.pokemonCaught.filter(p => 
      p.rarity === 'rare' || p.rarity === 'ultra_rare' || p.rarity === 'legendary'
    ).length;
    
    if (rareCount > 0) {
      satisfaction = Math.min(1.0, satisfaction + (rareCount * 0.1));
    }
    
    trainer.satisfactionRating = satisfaction;
    
    // Update average satisfaction
    gameStore.updateSatisfaction(satisfaction);
    
    // Collect entry fee
    gameStore.collectRevenue(trainer.entryFee);
    
    // Remove trainer from active list
    gameStore.removeTrainer(trainer.id);
  }

  private updatePokemonBreeding() {
    const pokemonStore = usePokemonStore.getState();
    pokemonStore.tickBreeding();
  }

  private updateAutoBell() {
    const gameStore = useGameStore.getState();
    if (gameStore.isAutoBellActive) {
      // Auto-bell rings based on level (every 10/level seconds)
      const shouldRing = Math.random() < (gameStore.autoBellLevel / 10);
      if (shouldRing) {
        gameStore.tickAutoBell();
      }
    }
  }
}

// Singleton instance
export const gameLoop = GameLoop.getInstance();