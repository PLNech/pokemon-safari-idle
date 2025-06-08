'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useUpgradeStore } from '@/stores/upgradeStore';

export function useProgressionGoals() {
  const { trainersAttracted, money, totalPokemonCaught, averageSatisfaction } = useGameStore();
  const { unlockUpgrade, checkUnlockConditions } = useUpgradeStore();

  useEffect(() => {
    // Phase 1 Goal 1: 10 trainers → Auto-Bell available
    if (trainersAttracted >= 10) {
      unlockUpgrade('auto_bell_1');
    }

    // Check other unlock conditions
    checkUnlockConditions({
      trainersAttracted,
      totalPokemonCaught,
      averageSatisfaction,
      differentSpeciesCaught: 0, // TODO: Calculate from caught Pokemon
    });
  }, [trainersAttracted, money, totalPokemonCaught, averageSatisfaction, unlockUpgrade, checkUnlockConditions]);

  // Calculate progress for Phase 1 goals
  const phase1Progress = {
    autoBellProgress: Math.min(100, (trainersAttracted / 10) * 100),
    areaUnlockProgress: Math.min(100, (money / 5000) * 100),
  };

  return {
    phase1Progress,
    goals: {
      autoBell: {
        completed: trainersAttracted >= 10,
        current: trainersAttracted,
        target: 10,
        description: '10 trainers to unlock Auto-Bell',
      },
      areaUnlock: {
        completed: money >= 5000,
        current: money,
        target: 5000,
        description: '$5,000 to unlock East Area',
      },
    },
  };
}