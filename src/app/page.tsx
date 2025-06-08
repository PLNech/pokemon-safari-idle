'use client';

import { useEffect, useState } from 'react';
import { GameLayout } from '@/components/layout/GameLayout';
import { SafariBell } from '@/components/game/SafariBell';
import { TrainerDisplay } from '@/components/game/TrainerDisplay';
import { AreaDisplay } from '@/components/game/AreaDisplay';
import { UpgradeShop } from '@/components/game/UpgradeShop';
import { AchievementDisplay } from '@/components/game/AchievementDisplay';
import { SafariMap } from '@/components/game/SafariMap';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { usePokemonStore } from '@/stores/pokemonStore';
import { useUnlockedAreas } from '@/stores/gameStore';
import { useProgressionGoals } from '@/hooks/useProgressionGoals';
import { saveSystem } from '@/utils/saveSystem';

type TabType = 'game' | 'areas' | 'upgrades' | 'achievements';

export default function Home() {
  const { initializeAreas } = usePokemonStore();
  const unlockedAreas = useUnlockedAreas();
  const [activeTab, setActiveTab] = useState<TabType>('game');
  const [isUpgradeShopOpen, setIsUpgradeShopOpen] = useState(false);
  const [isAchievementDisplayOpen, setIsAchievementDisplayOpen] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(false);
  
  // Initialize progression tracking
  useProgressionGoals();

  // Initialize game on mount
  useEffect(() => {
    // Check if this is a first-time user
    const hasExistingSave = saveSystem.hasSaveData();
    const hasSeenSplash = localStorage.getItem('safari-zone-seen-splash') === 'true';
    
    if (!hasExistingSave && !hasSeenSplash) {
      setShowSplashScreen(true);
    }
    
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

  const handleTabChange = (tab: TabType) => {
    // Close any open modals when switching tabs
    setIsUpgradeShopOpen(false);
    setIsAchievementDisplayOpen(false);
    
    setActiveTab(tab);
    
    // Handle tab-specific actions
    if (tab === 'upgrades') {
      setIsUpgradeShopOpen(true);
    } else if (tab === 'achievements') {
      setIsAchievementDisplayOpen(true);
    }

    // Auto-scroll to bell when switching to game tab
    if (tab === 'game') {
      setTimeout(() => {
        const bellElement = document.getElementById('safari-bell');
        if (bellElement) {
          bellElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  };

  // Auto-scroll to bell on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      const bellElement = document.getElementById('safari-bell');
      if (bellElement) {
        bellElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 1000); // Wait 1 second for everything to load

    return () => clearTimeout(timer);
  }, []);

  const handleSplashComplete = () => {
    setShowSplashScreen(false);
    localStorage.setItem('safari-zone-seen-splash', 'true');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'game':
        return (
          <div className="space-y-8">
            {/* Safari Bell - Center Stage */}
            <div className="flex justify-center" id="safari-bell">
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
        );

      case 'areas':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-2">🗺️ Safari Zone Map</h2>
              <p className="text-green-600">Explore your Safari Zone and track trainer movement</p>
            </div>
            <SafariMap />
          </div>
        );

      case 'upgrades':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">🛒 Upgrade Shop</h2>
              <p className="text-purple-600">Enhance your Safari Zone with powerful upgrades</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <button 
                onClick={() => setIsUpgradeShopOpen(true)}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl p-6 text-center transition-colors"
              >
                <div className="text-4xl mb-4">🛒</div>
                <div className="text-xl font-semibold mb-2">Open Upgrade Shop</div>
                <div className="text-sm opacity-80">Browse and purchase upgrades for your Safari Zone</div>
              </button>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-yellow-800 mb-2">🏆 Achievements</h2>
              <p className="text-yellow-600">Track your progress and unlock rewards</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <button 
                onClick={() => setIsAchievementDisplayOpen(true)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl p-6 text-center transition-colors"
              >
                <div className="text-4xl mb-4">🏆</div>
                <div className="text-xl font-semibold mb-2">View Achievements</div>
                <div className="text-sm opacity-80">Check your accomplishments and progress</div>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Splash Screen for first-time users */}
      <SplashScreen 
        isVisible={showSplashScreen} 
        onComplete={handleSplashComplete} 
      />

      <GameLayout onTabChange={handleTabChange}>
        {/* Game Introduction */}
        <div className="text-center mb-8 pt-24">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            🌿 Safari Zone Tycoon 🌿
          </h1>
          <p className="text-green-600 max-w-md mx-auto">
            Welcome, Safari Zone Manager! Ring the bell to attract trainers and build your Pokemon paradise.
          </p>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Upgrade Shop Modal */}
        <UpgradeShop 
          isOpen={isUpgradeShopOpen} 
          onClose={() => setIsUpgradeShopOpen(false)} 
        />

        {/* Achievement Display Modal */}
        <AchievementDisplay 
          isOpen={isAchievementDisplayOpen} 
          onClose={() => setIsAchievementDisplayOpen(false)} 
        />
      </GameLayout>
    </>
  );
}