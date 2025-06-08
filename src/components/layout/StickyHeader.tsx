'use client';

import { useState, useEffect } from 'react';
import { Bell, Settings, Save, RotateCcw } from 'lucide-react';
import { useClientSafeGameStats } from '@/hooks/useClientSafeStore';
import { useSaveSystem } from '@/hooks/useSaveSystem';

export function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { money, trainersAttracted, totalPokemonCaught } = useClientSafeGameStats();
  const { save, hasSaveData } = useSaveSystem();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSave = async () => {
    try {
      await save();
      // TODO: Show success notification
    } catch (error) {
      // TODO: Show error notification
      console.error('Save failed:', error);
    }
  };

  const handleReset = () => {
    // TODO: Show confirmation dialog
    if (confirm('Are you sure you want to reset your game? This cannot be undone.')) {
      // TODO: Reset game state
    }
  };

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
          : 'bg-transparent'
        }
      `}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Game Title */}
          <div className="flex items-center space-x-2">
            <div className="text-xl">🎯</div> {/* TODO: Replace with actual logo */}
            <h1 className="text-lg font-bold text-green-800 hidden sm:block">
              Safari Zone Tycoon
            </h1>
            <h1 className="text-sm font-bold text-green-800 sm:hidden">
              Safari Zone
            </h1>
          </div>

          {/* Quick Stats - Always Visible */}
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-lg">
              <span className="text-yellow-600">💰</span>
              <span className="font-semibold text-yellow-800">
                ${money.toLocaleString()}
              </span>
            </div>
            
            <div className="hidden sm:flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded-lg">
              <span className="text-blue-600">👥</span>
              <span className="font-semibold text-blue-800">
                {trainersAttracted}
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1 bg-purple-100 px-2 py-1 rounded-lg">
              <span className="text-purple-600">⭐</span>
              <span className="font-semibold text-purple-800">
                {totalPokemonCaught}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Save Button */}
            <button
              onClick={handleSave}
              className="
                p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg
                transition-colors duration-200 touch-manipulation
                min-w-[44px] min-h-[44px] flex items-center justify-center
              "
              title="Save Game"
            >
              <Save size={18} />
            </button>

            {/* Reset Button */}
            {hasSaveData() && (
              <button
                onClick={handleReset}
                className="
                  p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg
                  transition-colors duration-200 touch-manipulation
                  min-w-[44px] min-h-[44px] flex items-center justify-center
                "
                title="Reset Game"
              >
                <RotateCcw size={18} />
              </button>
            )}

            {/* Settings Button */}
            <button
              className="
                p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg
                transition-colors duration-200 touch-manipulation
                min-w-[44px] min-h-[44px] flex items-center justify-center
              "
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Expanded Stats Bar - Mobile Only, Visible When Scrolled */}
        {isScrolled && (
          <div className="mt-2 flex items-center justify-center space-x-4 text-xs sm:hidden">
            <div className="flex items-center space-x-1">
              <span>👥</span>
              <span>{trainersAttracted} trainers</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>⭐</span>
              <span>{totalPokemonCaught} caught</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}