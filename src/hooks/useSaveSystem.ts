'use client';

import { useEffect, useState } from 'react';
import { saveSystem } from '@/utils/saveSystem';

export const useSaveSystem = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const save = async () => {
    if (!isClient) return;
    // TODO: Connect to actual stores
    // const gameState = useGameStore.getState();
    // const pokemonState = usePokemonStore.getState();
    // await saveSystem.saveGame(gameState, pokemonState, upgradeState, achievementState);
  };

  const load = async () => {
    if (!isClient) return false;
    
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
    if (!isClient) return null;
    
    try {
      return saveSystem.exportSave();
    } catch (error) {
      console.error('Failed to export save:', error);
      return null;
    }
  };

  const importSave = async (data: string) => {
    if (!isClient) return false;
    
    try {
      await saveSystem.importSave(data);
      return true;
    } catch (error) {
      console.error('Failed to import save:', error);
      return false;
    }
  };

  const hasSaveData = () => {
    if (!isClient) return false;
    return saveSystem.hasSaveData();
  };

  const getSaveInfo = () => {
    if (!isClient) return null;
    return saveSystem.getSaveInfo();
  };

  return {
    save,
    load,
    exportSave,
    importSave,
    deleteSave: () => isClient && saveSystem.deleteSave(),
    hasSaveData,
    getSaveInfo,
  };
};