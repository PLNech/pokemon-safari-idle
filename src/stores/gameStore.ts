import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { GameState, GamePhase, AreaType, Trainer, Notification, MinigameState } from '@/types';

interface GameStore extends GameState {
  // Core Actions
  ringBell: () => void;
  collectRevenue: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  addTrainer: (trainer: Trainer) => void;
  removeTrainer: (trainerId: string) => void;
  
  // Progress Actions
  advancePhase: () => void;
  unlockArea: (area: AreaType) => void;
  updateSatisfaction: (rating: number) => void;
  
  // Auto Systems
  enableAutoBell: (level: number) => void;
  tickAutoBell: () => void;
  
  // Game Control
  pauseGame: () => void;
  resumeGame: () => void;
  toggleSound: () => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  
  // Minigames
  startMinigame: (minigame: MinigameState) => void;
  endMinigame: () => void;
  
  // Statistics
  incrementPokemonCaught: (isRare?: boolean, isShiny?: boolean) => void;
  updatePlayTime: (deltaTime: number) => void;
  
  // Reset
  resetGame: () => void;
}

const initialGameState: GameState = {
  // Core Progress
  money: 1000, // Starting money for tutorial
  phase: 'foundation',
  gameStartTime: new Date(),
  totalPlayTime: 0,
  
  // Trainer Stats
  trainersAttracted: 0,
  totalRevenue: 0,
  averageSatisfaction: 0,
  
  // Pokemon Stats
  totalPokemonCaught: 0,
  rarePokemonCaught: 0,
  shinyPokemonCaught: 0,
  
  // Area Unlocks
  unlockedAreas: ['center'], // Start with center area only
  
  // Active Systems
  isAutoBellActive: false,
  autoBellLevel: 0,
  
  // Game Settings
  isPaused: false,
  soundEnabled: true,
  
  // Current Activity
  activeTrainers: [],
  recentPokemonCaught: [],
  activeMinigame: undefined,
};

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get, _api) => ({
    ...initialGameState,
    
    // Core Actions
    ringBell: () => {
      const state = get();
      if (state.isPaused) return;
      
      // TODO: Add visual/audio feedback
      console.log('🔔 Bell rung!');
      
      // Create a new trainer
      const newTrainer: Trainer = {
        id: `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'casual',
        name: `Trainer ${state.trainersAttracted + 1}`,
        currentArea: 'center',
        entryFee: 500,
        itemsPurchased: [],
        pokemonCaught: [],
        satisfactionRating: 0.8,
        timeInPark: 0,
        isActive: true,
      };
      
      set((state) => ({
        activeTrainers: [...state.activeTrainers, newTrainer],
        trainersAttracted: state.trainersAttracted + 1,
      }));
    },
    
    collectRevenue: (amount: number) => {
      set((state) => ({
        money: state.money + amount,
        totalRevenue: state.totalRevenue + amount,
      }));
    },
    
    spendMoney: (amount: number) => {
      const state = get();
      if (state.money >= amount) {
        set((state) => ({
          money: state.money - amount,
        }));
        return true;
      }
      return false;
    },
    
    addTrainer: (trainer: Trainer) => {
      set((state) => ({
        activeTrainers: [...state.activeTrainers, trainer],
        trainersAttracted: state.trainersAttracted + 1,
      }));
    },
    
    removeTrainer: (trainerId: string) => {
      set((state) => ({
        activeTrainers: state.activeTrainers.filter(t => t.id !== trainerId),
      }));
    },
    
    // Progress Actions
    advancePhase: () => {
      const state = get();
      const phases: GamePhase[] = ['foundation', 'expansion', 'optimization', 'mastery'];
      const currentIndex = phases.indexOf(state.phase);
      
      if (currentIndex < phases.length - 1) {
        set({ phase: phases[currentIndex + 1] });
      }
    },
    
    unlockArea: (area: AreaType) => {
      set((state) => ({
        unlockedAreas: state.unlockedAreas.includes(area) 
          ? state.unlockedAreas 
          : [...state.unlockedAreas, area],
      }));
    },
    
    updateSatisfaction: (rating: number) => {
      set((state) => {
        const totalRatings = state.trainersAttracted;
        const currentAverage = state.averageSatisfaction;
        const newAverage = totalRatings === 0 
          ? rating 
          : (currentAverage * (totalRatings - 1) + rating) / totalRatings;
        
        return {
          averageSatisfaction: Math.max(0, Math.min(1, newAverage)),
        };
      });
    },
    
    // Auto Systems
    enableAutoBell: (level: number) => {
      set({
        isAutoBellActive: true,
        autoBellLevel: level,
      });
    },
    
    tickAutoBell: () => {
      const state = get();
      if (state.isAutoBellActive && !state.isPaused) {
        // Auto-ring bell based on level
        // Level 1: Every 10 seconds, Level 2: Every 5 seconds, etc.
        // This will be called by a game loop interval
        get().ringBell();
      }
    },
    
    // Game Control
    pauseGame: () => {
      set({ isPaused: true });
    },
    
    resumeGame: () => {
      set({ isPaused: false });
    },
    
    toggleSound: () => {
      set((state) => ({ soundEnabled: !state.soundEnabled }));
    },
    
    // Notifications
    addNotification: (notification) => {
      const newNotification: Notification = {
        ...notification,
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        isVisible: true,
      };
      
      // Auto-remove notification after duration
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, notification.duration || 3000);
    },
    
    removeNotification: (_id: string) => {
      // Notifications are managed by UI state store
      // This is a placeholder for the notification system
    },
    
    // Minigames
    startMinigame: (minigame: MinigameState) => {
      set({ activeMinigame: minigame });
    },
    
    endMinigame: () => {
      set({ activeMinigame: undefined });
    },
    
    // Statistics
    incrementPokemonCaught: (isRare = false, isShiny = false) => {
      set((state) => ({
        totalPokemonCaught: state.totalPokemonCaught + 1,
        rarePokemonCaught: state.rarePokemonCaught + (isRare ? 1 : 0),
        shinyPokemonCaught: state.shinyPokemonCaught + (isShiny ? 1 : 0),
      }));
    },
    
    updatePlayTime: (deltaTime: number) => {
      set((state) => ({
        totalPlayTime: state.totalPlayTime + deltaTime,
      }));
    },
    
    // Reset
    resetGame: () => {
      set({
        ...initialGameState,
        gameStartTime: new Date(),
      });
    },
  }))
);

// Selectors for optimized re-renders
export const useGameMoney = () => useGameStore((state) => state.money);
export const useGamePhase = () => useGameStore((state) => state.phase);
export const useTrainerCount = () => useGameStore((state) => state.trainersAttracted);
export const useActiveTrainers = () => useGameStore((state) => state.activeTrainers);
export const useUnlockedAreas = () => useGameStore((state) => state.unlockedAreas);

// Fixed selector with stable reference for SSR
const gameStatsSelector = (state: GameStore) => ({
  money: state.money,
  trainersAttracted: state.trainersAttracted,
  totalPokemonCaught: state.totalPokemonCaught,
  averageSatisfaction: state.averageSatisfaction,
});

export const useGameStats = () => useGameStore(gameStatsSelector);

// Auto-save integration hook
export const useAutoSave = () => {
  const _gameState = useGameStore();
  
  // TODO: Integrate with save system
  // This will trigger auto-saves when game state changes
};