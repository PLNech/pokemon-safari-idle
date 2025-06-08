import { SaveData, GameState, PokemonState, UpgradeState, AchievementState } from '@/types';

const SAVE_KEY = 'safari-zone-tycoon-save';
const BACKUP_SAVE_KEY = 'safari-zone-tycoon-backup';
const CURRENT_VERSION = '1.0.0';

export interface SaveSystemError {
  type: 'corruption' | 'version_mismatch' | 'storage_full' | 'parse_error';
  message: string;
  recoverable: boolean;
}

export class SaveSystem {
  private static instance: SaveSystem;
  private autoSaveInterval?: NodeJS.Timeout;
  private autoSaveEnabled = true;

  static getInstance(): SaveSystem {
    if (!SaveSystem.instance) {
      SaveSystem.instance = new SaveSystem();
    }
    return SaveSystem.instance;
  }

  // Auto-save functionality
  enableAutoSave(intervalSeconds = 30): void {
    this.disableAutoSave(); // Clear existing interval
    this.autoSaveEnabled = true;
    
    this.autoSaveInterval = setInterval(() => {
      if (this.autoSaveEnabled) {
        this.autoSave();
      }
    }, intervalSeconds * 1000);
  }

  disableAutoSave(): void {
    this.autoSaveEnabled = false;
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = undefined;
    }
  }

  private async autoSave(): Promise<void> {
    try {
      // Get current state from stores
      // This will be connected to the actual stores
      const gameState = this.getCurrentGameState();
      const pokemonState = this.getCurrentPokemonState();
      const upgradeState = this.getCurrentUpgradeState();
      const achievementState = this.getCurrentAchievementState();

      await this.saveGame(gameState, pokemonState, upgradeState, achievementState);
    } catch (error) {
      console.warn('Auto-save failed:', error);
      // Don't throw on auto-save failures
    }
  }

  // Main save functionality
  async saveGame(
    gameState: GameState,
    pokemonState: PokemonState,
    upgradeState: UpgradeState,
    achievementState: AchievementState
  ): Promise<void> {
    const saveData: SaveData = {
      version: CURRENT_VERSION,
      timestamp: Date.now(),
      gameState,
      pokemonState,
      upgradeState,
      achievementState,
    };

    try {
      // Create backup of existing save
      const existingSave = localStorage.getItem(SAVE_KEY);
      if (existingSave) {
        localStorage.setItem(BACKUP_SAVE_KEY, existingSave);
      }

      // Save new data
      const serializedData = JSON.stringify(saveData);
      localStorage.setItem(SAVE_KEY, serializedData);

      console.log('Game saved successfully');
    } catch (error) {
      // Handle storage errors
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw {
          type: 'storage_full',
          message: 'Not enough storage space to save game',
          recoverable: true,
        } as SaveSystemError;
      }
      
      throw {
        type: 'parse_error',
        message: 'Failed to save game data',
        recoverable: false,
      } as SaveSystemError;
    }
  }

  // Load functionality
  async loadGame(): Promise<SaveData | null> {
    try {
      const savedData = localStorage.getItem(SAVE_KEY);
      if (!savedData) {
        return null; // No save file exists
      }

      const saveData: SaveData = JSON.parse(savedData);
      
      // Validate save data
      const validationResult = this.validateSaveData(saveData);
      if (!validationResult.isValid) {
        throw {
          type: 'corruption',
          message: validationResult.error || 'Save data is corrupted',
          recoverable: true,
        } as SaveSystemError;
      }

      // Check version compatibility
      if (saveData.version !== CURRENT_VERSION) {
        const migrated = this.migrateSaveData(saveData);
        if (!migrated) {
          throw {
            type: 'version_mismatch',
            message: `Save version ${saveData.version} is incompatible with current version ${CURRENT_VERSION}`,
            recoverable: false,
          } as SaveSystemError;
        }
        return migrated;
      }

      return saveData;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw {
          type: 'parse_error',
          message: 'Save file is corrupted and cannot be parsed',
          recoverable: true,
        } as SaveSystemError;
      }
      
      // Re-throw our custom errors
      if ((error as SaveSystemError).type) {
        throw error;
      }
      
      throw {
        type: 'corruption',
        message: 'Unknown error loading save file',
        recoverable: true,
      } as SaveSystemError;
    }
  }

  // Recovery functionality
  async loadBackupSave(): Promise<SaveData | null> {
    try {
      const backupData = localStorage.getItem(BACKUP_SAVE_KEY);
      if (!backupData) {
        return null;
      }

      const saveData: SaveData = JSON.parse(backupData);
      const validationResult = this.validateSaveData(saveData);
      
      if (validationResult.isValid) {
        return saveData;
      }
      
      return null;
    } catch {
      return null;
    }
  }

  // Export/Import functionality
  exportSave(): string {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (!savedData) {
      throw new Error('No save data to export');
    }

    // Encode to base64 for easy sharing
    return btoa(savedData);
  }

  async importSave(encodedData: string): Promise<void> {
    try {
      // Decode from base64
      const decodedData = atob(encodedData);
      const saveData: SaveData = JSON.parse(decodedData);

      // Validate imported data
      const validationResult = this.validateSaveData(saveData);
      if (!validationResult.isValid) {
        throw new Error(validationResult.error || 'Invalid save data');
      }

      // Create backup of current save
      const currentSave = localStorage.getItem(SAVE_KEY);
      if (currentSave) {
        localStorage.setItem(BACKUP_SAVE_KEY, currentSave);
      }

      // Import the new save
      localStorage.setItem(SAVE_KEY, decodedData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to import save: ${error.message}`);
      }
      throw new Error('Failed to import save: Unknown error');
    }
  }

  // Validation
  private validateSaveData(saveData: any): { isValid: boolean; error?: string } {
    // Basic structure validation
    if (!saveData || typeof saveData !== 'object') {
      return { isValid: false, error: 'Invalid save data structure' };
    }

    const requiredFields = ['version', 'timestamp', 'gameState', 'pokemonState'];
    for (const field of requiredFields) {
      if (!(field in saveData)) {
        return { isValid: false, error: `Missing required field: ${field}` };
      }
    }

    // Validate timestamp
    if (typeof saveData.timestamp !== 'number' || saveData.timestamp <= 0) {
      return { isValid: false, error: 'Invalid timestamp' };
    }

    // Validate game state structure
    const gameState = saveData.gameState;
    if (!gameState || typeof gameState.money !== 'number' || gameState.money < 0) {
      return { isValid: false, error: 'Invalid game state' };
    }

    return { isValid: true };
  }

  // Migration for version compatibility
  private migrateSaveData(saveData: SaveData): SaveData | null {
    // For now, no migration needed
    // TODO: Implement migration logic when versions change
    return null;
  }

  // Delete save data
  deleteSave(): void {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(BACKUP_SAVE_KEY);
  }

  // Check if save exists
  hasSaveData(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
  }

  // Get save info without loading
  getSaveInfo(): { timestamp: number; version: string } | null {
    try {
      const savedData = localStorage.getItem(SAVE_KEY);
      if (!savedData) return null;

      const saveData = JSON.parse(savedData);
      return {
        timestamp: saveData.timestamp,
        version: saveData.version,
      };
    } catch {
      return null;
    }
  }

  // TODO: Connect these to actual stores
  private getCurrentGameState(): GameState {
    // This will be connected to useGameStore
    throw new Error('Not implemented - connect to game store');
  }

  private getCurrentPokemonState(): PokemonState {
    // This will be connected to usePokemonStore
    throw new Error('Not implemented - connect to pokemon store');
  }

  private getCurrentUpgradeState(): UpgradeState {
    // This will be connected to upgrade store
    return {
      purchasedUpgrades: {},
      availableUpgrades: [],
      totalUpgradesBought: 0,
    };
  }

  private getCurrentAchievementState(): AchievementState {
    // This will be connected to achievement store
    return {
      unlockedAchievements: [],
      achievementProgress: {},
      totalAchievements: 0,
    };
  }
}

// Singleton instance
export const saveSystem = SaveSystem.getInstance();

// React hook for save system
export const useSaveSystem = () => {
  const save = async () => {
    // TODO: Connect to actual stores
    // const gameState = useGameStore.getState();
    // const pokemonState = usePokemonStore.getState();
    // await saveSystem.saveGame(gameState, pokemonState, upgradeState, achievementState);
  };

  const load = async () => {
    try {
      const saveData = await saveSystem.loadGame();
      if (saveData) {
        // TODO: Apply loaded data to stores
        // useGameStore.setState(saveData.gameState);
        // usePokemonStore.setState(saveData.pokemonState);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load game:', error);
      return false;
    }
  };

  const exportSave = () => {
    try {
      return saveSystem.exportSave();
    } catch (error) {
      console.error('Failed to export save:', error);
      return null;
    }
  };

  const importSave = async (data: string) => {
    try {
      await saveSystem.importSave(data);
      return true;
    } catch (error) {
      console.error('Failed to import save:', error);
      return false;
    }
  };

  return {
    save,
    load,
    exportSave,
    importSave,
    deleteSave: () => saveSystem.deleteSave(),
    hasSaveData: () => saveSystem.hasSaveData(),
    getSaveInfo: () => saveSystem.getSaveInfo(),
  };
};