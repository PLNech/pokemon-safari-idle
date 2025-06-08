import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { UpgradeState, Upgrade } from '@/types';
import { ALL_UPGRADES, calculateUpgradeCost, getNextUpgrade, checkUpgradeUnlocks } from '@/data/upgrades';

interface UpgradeUnlockGameStats {
  trainersAttracted: number;
  totalPokemonCaught: number;
  averageSatisfaction: number;
  differentSpeciesCaught: number;
}

interface UpgradeStore extends UpgradeState {
  // Upgrade Actions
  purchaseUpgrade: (upgradeId: string, cost: number) => boolean;
  unlockUpgrade: (upgradeId: string) => void;
  checkUnlockConditions: (gameStats: UpgradeUnlockGameStats) => void;
  
  // Getters
  getUpgrade: (upgradeId: string) => Upgrade | undefined;
  getUpgradesByCategory: (category: string) => Upgrade[];
  getAffordableUpgrades: (currentMoney: number) => Upgrade[];
  isUpgradePurchased: (upgradeId: string) => boolean;
  getUpgradeCost: (upgradeId: string) => number;
  
  // Effects
  getActiveEffects: () => Record<string, number>;
  applyUpgradeEffect: (upgrade: Upgrade) => void;
  
  // Reset
  resetUpgrades: () => void;
}

const initialUpgradeState: UpgradeState = {
  purchasedUpgrades: {},
  availableUpgrades: ALL_UPGRADES.map(upgrade => ({ ...upgrade })),
  totalUpgradesBought: 0,
};

export const useUpgradeStore = create<UpgradeStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialUpgradeState,
    
    // Upgrade Actions
    purchaseUpgrade: (upgradeId: string, cost: number) => {
      const state = get();
      const upgrade = state.availableUpgrades.find(u => u.id === upgradeId);
      
      if (!upgrade || !upgrade.isUnlocked || upgrade.isPurchased) {
        return false;
      }
      
      const actualCost = calculateUpgradeCost(upgrade);
      if (actualCost !== cost) {
        console.warn(`Cost mismatch for ${upgradeId}: expected ${actualCost}, got ${cost}`);
        return false;
      }
      
      // Mark as purchased
      const updatedUpgrade = { ...upgrade, isPurchased: true };
      
      set((state) => ({
        purchasedUpgrades: {
          ...state.purchasedUpgrades,
          [upgradeId]: updatedUpgrade,
        },
        availableUpgrades: state.availableUpgrades.map(u => 
          u.id === upgradeId ? updatedUpgrade : u
        ),
        totalUpgradesBought: state.totalUpgradesBought + 1,
      }));
      
      // Apply upgrade effect
      get().applyUpgradeEffect(updatedUpgrade);
      
      // Check if this enables next level
      if (upgrade.level < upgrade.maxLevel) {
        const nextLevelUpgrade = getNextUpgrade(upgradeId);
        if (nextLevelUpgrade) {
          set((state) => ({
            availableUpgrades: [...state.availableUpgrades, nextLevelUpgrade],
          }));
        }
      }
      
      return true;
    },
    
    unlockUpgrade: (upgradeId: string) => {
      set((state) => ({
        availableUpgrades: state.availableUpgrades.map(upgrade =>
          upgrade.id === upgradeId ? { ...upgrade, isUnlocked: true } : upgrade
        ),
      }));
    },
    
    checkUnlockConditions: (gameStats: UpgradeUnlockGameStats) => {
      const unlocksNeeded = checkUpgradeUnlocks(gameStats);
      
      unlocksNeeded.forEach(upgradeId => {
        const state = get();
        const upgrade = state.availableUpgrades.find(u => u.id === upgradeId);
        if (upgrade && !upgrade.isUnlocked) {
          get().unlockUpgrade(upgradeId);
          
          // TODO: Show notification
          console.log(`🎉 New upgrade unlocked: ${upgrade.name}`);
        }
      });
    },
    
    // Getters
    getUpgrade: (upgradeId: string) => {
      return get().availableUpgrades.find(u => u.id === upgradeId);
    },
    
    getUpgradesByCategory: (category: string) => {
      return get().availableUpgrades.filter(u => u.category === category);
    },
    
    getAffordableUpgrades: (currentMoney: number) => {
      return get().availableUpgrades.filter(upgrade => 
        upgrade.isUnlocked && 
        !upgrade.isPurchased && 
        calculateUpgradeCost(upgrade) <= currentMoney
      );
    },
    
    isUpgradePurchased: (upgradeId: string) => {
      return upgradeId in get().purchasedUpgrades;
    },
    
    getUpgradeCost: (upgradeId: string) => {
      const upgrade = get().getUpgrade(upgradeId);
      return upgrade ? calculateUpgradeCost(upgrade) : 0;
    },
    
    // Effects
    getActiveEffects: () => {
      const effects: Record<string, number> = {};
      const purchasedUpgrades = Object.values(get().purchasedUpgrades);
      
      purchasedUpgrades.forEach(upgrade => {
        const effectKey = upgrade.effect.type;
        if (!effects[effectKey]) {
          effects[effectKey] = 0;
        }
        
        if (upgrade.effect.isPercentage) {
          effects[effectKey] += upgrade.effect.value / 100;
        } else {
          effects[effectKey] += upgrade.effect.value;
        }
      });
      
      return effects;
    },
    
    applyUpgradeEffect: (upgrade: Upgrade) => {
      // This will be handled by the game systems
      // For now, just log the effect
      console.log(`Applied upgrade effect: ${upgrade.effect.type} +${upgrade.effect.value}${upgrade.effect.isPercentage ? '%' : ''}`);
      
      // TODO: Integrate with game and pokemon stores
      // Examples:
      // - trainer_attraction: Modify trainer spawn rate
      // - revenue_multiplier: Modify revenue calculations
      // - breeding_speed: Modify Pokemon breeding rates
      // - satisfaction_bonus: Modify satisfaction calculations
      // - pokemon_spawn_rate: Modify rare Pokemon spawn rates
    },
    
    // Reset
    resetUpgrades: () => {
      set({
        ...initialUpgradeState,
        availableUpgrades: ALL_UPGRADES.map(upgrade => ({ ...upgrade })),
      });
    },
  }))
);

// Selectors for optimized re-renders
export const useAvailableUpgrades = () => useUpgradeStore((state) => state.availableUpgrades);
export const usePurchasedUpgrades = () => useUpgradeStore((state) => state.purchasedUpgrades);
export const useUpgradesByCategory = (category: string) => 
  useUpgradeStore((state) => state.getUpgradesByCategory(category));
export const useAffordableUpgrades = (currentMoney: number) => 
  useUpgradeStore((state) => state.getAffordableUpgrades(currentMoney));
export const useActiveEffects = () => useUpgradeStore((state) => state.getActiveEffects());