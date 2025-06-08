'use client';

import { useGameStats, useGamePhase } from '@/stores/gameStore';
import { POKEMON_RARITY_CONFIG } from '@/data/pokemon';

export function GameStats() {
  const { money, trainersAttracted, totalPokemonCaught, averageSatisfaction } = useGameStats();
  const phase = useGamePhase();

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

  const formatSatisfaction = (rating: number) => {
    return `${Math.round(rating * 100)}%`;
  };

  const getPhaseColor = (phase: string) => {
    const colors = {
      foundation: 'bg-green-100 text-green-800',
      expansion: 'bg-blue-100 text-blue-800',
      optimization: 'bg-purple-100 text-purple-800',
      mastery: 'bg-yellow-100 text-yellow-800',
    };
    return colors[phase as keyof typeof colors] || colors.foundation;
  };

  return (
    <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Money */}
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-lg font-bold text-yellow-800">
            {formatMoney(money)}
          </div>
          <div className="text-xs text-yellow-600">Money</div>
        </div>

        {/* Trainers */}
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">👥</div>
          <div className="text-lg font-bold text-blue-800">
            {trainersAttracted.toLocaleString()}
          </div>
          <div className="text-xs text-blue-600">Trainers</div>
        </div>

        {/* Pokemon Caught */}
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-lg font-bold text-purple-800">
            {totalPokemonCaught.toLocaleString()}
          </div>
          <div className="text-xs text-purple-600">Caught</div>
        </div>

        {/* Satisfaction */}
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">😊</div>
          <div className="text-lg font-bold text-green-800">
            {formatSatisfaction(averageSatisfaction)}
          </div>
          <div className="text-xs text-green-600">Satisfaction</div>
        </div>

        {/* Current Phase */}
        <div className="bg-gray-50 rounded-lg p-3 text-center hidden lg:block">
          <div className="text-2xl mb-1">🎯</div>
          <div className={`text-sm font-bold px-2 py-1 rounded ${getPhaseColor(phase)}`}>
            {phase.charAt(0).toUpperCase() + phase.slice(1)}
          </div>
          <div className="text-xs text-gray-600">Phase</div>
        </div>

        {/* Revenue Rate (calculated) */}
        <div className="bg-orange-50 rounded-lg p-3 text-center hidden lg:block">
          <div className="text-2xl mb-1">📈</div>
          <div className="text-lg font-bold text-orange-800">
            {/* TODO: Calculate actual revenue rate */}
            $0/min
          </div>
          <div className="text-xs text-orange-600">Revenue</div>
        </div>
      </div>

      {/* Phase Progress Bar */}
      <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000"
          style={{ 
            width: `${Math.min(100, (trainersAttracted / 10) * 100)}%` 
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>Phase: {phase}</span>
        <span>
          {/* TODO: Show actual progress goals */}
          Next: {trainersAttracted < 10 ? '10 trainers for Auto-Bell' : '$5K for Area 1'}
        </span>
      </div>
    </div>
  );
}