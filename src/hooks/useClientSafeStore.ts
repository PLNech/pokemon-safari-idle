'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

// Create a client-safe version of the game stats selector
export function useClientSafeGameStats() {
  const [isClient, setIsClient] = useState(false);
  
  // Always call hooks unconditionally - follow Rules of Hooks
  const money = useGameStore(state => state.money);
  const trainersAttracted = useGameStore(state => state.trainersAttracted);
  const totalPokemonCaught = useGameStore(state => state.totalPokemonCaught);
  const averageSatisfaction = useGameStore(state => state.averageSatisfaction);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return default values during SSR, actual values on client
  return {
    money: isClient ? money : 1000,
    trainersAttracted: isClient ? trainersAttracted : 0,
    totalPokemonCaught: isClient ? totalPokemonCaught : 0,
    averageSatisfaction: isClient ? averageSatisfaction : 0,
  };
}