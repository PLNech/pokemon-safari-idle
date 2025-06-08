'use client';

import { useEffect, useState } from 'react';
import { GameLayout } from '@/components/layout/GameLayout';
import { SafariBell } from '@/components/game/SafariBell';
import { TrainerDisplay } from '@/components/game/TrainerDisplay';
import { AreaDisplay } from '@/components/game/AreaDisplay';
import { UpgradeShop } from '@/components/game/UpgradeShop';
import { usePokemonStore } from '@/stores/pokemonStore';
import { useUnlockedAreas } from '@/stores/gameStore';
import { useProgressionGoals } from '@/hooks/useProgressionGoals';
import { saveSystem } from '@/utils/saveSystem';

export default function Home() {
  const { initializeAreas } = usePokemonStore();
  const unlockedAreas = useUnlockedAreas();
  const [isUpgradeShopOpen, setIsUpgradeShopOpen] = useState(false);
  
  // Initialize progression tracking
  useProgressionGoals();

  // Initialize game on mount
  useEffect(() => {
    // Initialize Pokemon areas with data
    initializeAreas();
    
    // Enable auto-save
    saveSystem.enableAutoSave(30); // Auto-save every 30 seconds
    
    // Try to load existing save
    const loadGame = async () => {
      try {
        const saveData = await saveSystem.loadGame();
        if (saveData) {
          console.log('Game loaded successfully');
          // TODO: Apply save data to stores
        } else {
          console.log('No save data found, starting new game');
        }
      } catch (error) {
        console.error('Failed to load game:', error);
        // TODO: Show error notification to user
      }
    };

    loadGame();

    // Cleanup on unmount
    return () => {
      saveSystem.disableAutoSave();
    };
  }, [initializeAreas]);

  return (
    <GameLayout>
      {/* Game Introduction */}
      <div className="text-center mb-8 pt-24">
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          🌿 Safari Zone Tycoon 🌿
        </h1>
        <p className="text-green-600 max-w-md mx-auto">
          Welcome, Safari Zone Manager! Ring the bell to attract trainers and build your Pokemon paradise.
        </p>
      </div>

      {/* Main Game Area */}
      <div className="space-y-8">
        {/* Safari Bell - Center Stage */}
        <div className="flex justify-center">
          <SafariBell />
        </div>

        {/* Areas Display */}
        <div className="space-y-6">
          {/* Center Area - Always unlocked */}
          <AreaDisplay area="center" isUnlocked={true} />
          
          {/* Other areas based on unlock status */}
          <AreaDisplay area="east" isUnlocked={unlockedAreas.includes('east')} />
          <AreaDisplay area="north" isUnlocked={unlockedAreas.includes('north')} />
          <AreaDisplay area="west" isUnlocked={unlockedAreas.includes('west')} />
        </div>

        {/* Active Trainers Display */}
        <TrainerDisplay />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setIsUpgradeShopOpen(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">🛒</div>
            <div className="font-semibold">Upgrades</div>
            <div className="text-xs opacity-80">Improve your park</div>
          </button>
          
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl p-4 text-center transition-colors">
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-semibold">Achievements</div>
            <div className="text-xs opacity-80">View progress</div>
          </button>
        </div>

        {/* Tutorial/Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Getting Started</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ring the bell to attract trainers to your Safari Zone</li>
                <li>• Watch for the golden flash for perfect timing (2x trainers!)</li>
                <li>• Chain 5 perfect clicks for a Trainer Caravan (8 trainers)</li>
                <li>• Collect entry fees and upgrade your facilities</li>
                <li>• Unlock new areas with rare Pokemon as you progress</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Shop Modal */}
      <UpgradeShop 
        isOpen={isUpgradeShopOpen} 
        onClose={() => setIsUpgradeShopOpen(false)} 
      />
    </GameLayout>
  );
}