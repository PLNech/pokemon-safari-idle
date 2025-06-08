'use client';

import { AreaType } from '@/types';
import { useAreaPopulation } from '@/stores/pokemonStore';
import { POKEMON_RARITY_CONFIG } from '@/data/pokemon';
import { PokemonImage } from '@/components/ui/PokemonImage';

interface AreaDisplayProps {
  area: AreaType;
  isUnlocked: boolean;
}

export function AreaDisplay({ area, isUnlocked }: AreaDisplayProps) {
  const areaPopulation = useAreaPopulation(area);

  const getAreaName = (area: AreaType) => {
    const names = {
      center: 'Center Area',
      east: 'East Area',
      north: 'North Area',
      west: 'West Area',
    };
    return names[area];
  };

  const getAreaDescription = (area: AreaType) => {
    const descriptions = {
      center: 'Your starting Safari Zone area with common Pokemon',
      east: 'Grassland area with Doduo, Cubone, and Tauros',
      north: 'Mountain area with Kangaskhan and rare Tauros',
      west: 'Forest area with Tangela and powerful Tauros',
    };
    return descriptions[area];
  };

  const getRarityColor = (rarity: string) => {
    const config = POKEMON_RARITY_CONFIG[rarity as keyof typeof POKEMON_RARITY_CONFIG];
    return config?.color || '#9CA3AF';
  };

  const getPopulationStatus = () => {
    if (!areaPopulation.length) return { level: 0, text: 'Empty' };
    
    const totalCurrent = areaPopulation.reduce((sum, pop) => sum + pop.currentCount, 0);
    const totalCapacity = areaPopulation.reduce((sum, pop) => sum + pop.maxCapacity, 0);
    const level = totalCapacity > 0 ? totalCurrent / totalCapacity : 0;
    
    if (level >= 0.8) return { level, text: 'Abundant' };
    if (level >= 0.6) return { level, text: 'Healthy' };
    if (level >= 0.4) return { level, text: 'Moderate' };
    if (level >= 0.2) return { level, text: 'Low' };
    return { level, text: 'Critical' };
  };

  const populationStatus = getPopulationStatus();

  if (!isUnlocked) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 shadow-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-4xl mb-2">🔒</div>
          <h2 className="text-xl font-semibold text-gray-500 mb-2">
            {getAreaName(area)}
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Locked - Need $5,000 to unlock
          </p>
          {/* TODO: Add unlock button */}
          <button className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed">
            Unlock Area
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-green-800">
          {getAreaName(area)}
        </h2>
        <p className="text-sm text-green-600">
          {getAreaDescription(area)}
        </p>
      </div>

      {/* Pokemon Population Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {areaPopulation.map((population) => {
          const species = population.species;
          const populationPercent = (population.currentCount / population.maxCapacity) * 100;
          
          return (
            <div
              key={species.id}
              className={`
                rounded-lg p-3 text-center transition-all duration-200
                ${populationPercent > 80 ? 'bg-green-100' : 
                  populationPercent > 50 ? 'bg-yellow-100' : 
                  populationPercent > 20 ? 'bg-orange-100' : 'bg-red-100'}
              `}
            >
              <div className="flex justify-center mb-1">
                <PokemonImage 
                  pokemonName={species.name} 
                  size="large" 
                  fallbackEmoji={species.sprite}
                />
              </div>
              <div className="text-xs font-medium" style={{ color: getRarityColor(species.rarity) }}>
                {species.name}
              </div>
              <div className="text-xs text-gray-600">
                {population.currentCount}/{population.maxCapacity}
              </div>
              
              {/* Population bar */}
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div 
                  className={`
                    h-1 rounded-full transition-all duration-300
                    ${populationPercent > 80 ? 'bg-green-500' : 
                      populationPercent > 50 ? 'bg-yellow-500' : 
                      populationPercent > 20 ? 'bg-orange-500' : 'bg-red-500'}
                  `}
                  style={{ width: `${populationPercent}%` }}
                />
              </div>
              
              {species.rarity === 'rare' || species.rarity === 'ultra_rare' || species.rarity === 'legendary' ? (
                <div className="text-xs text-blue-600 font-medium mt-1">
                  {species.rarity === 'legendary' ? 'Legendary!' : 'Rare!'}
                </div>
              ) : null}
            </div>
          );
        })}
        
        {/* Empty slots for visual balance */}
        {Array.from({ length: Math.max(0, 6 - areaPopulation.length) }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="bg-gray-100 rounded-lg p-3 text-center border-2 border-dashed border-gray-300"
          >
            <div className="text-2xl mb-1">❓</div>
            <div className="text-xs text-gray-400">Empty</div>
          </div>
        ))}
      </div>

      {/* Area Status */}
      <div className="flex justify-between items-center text-sm border-t pt-3">
        <div>
          <span className="font-semibold text-gray-700">Population:</span>
          <span className={`
            ml-2 font-medium
            ${populationStatus.level >= 0.8 ? 'text-green-600' :
              populationStatus.level >= 0.6 ? 'text-yellow-600' :
              populationStatus.level >= 0.4 ? 'text-orange-600' : 'text-red-600'}
          `}>
            {populationStatus.text} ({Math.round(populationStatus.level * 100)}%)
          </span>
        </div>
        
        <div className="text-blue-600">
          <span className="font-semibold">Species:</span>
          <span className="ml-1">{areaPopulation.length}</span>
        </div>
      </div>
      
      {/* Low population warning */}
      {populationStatus.level < 0.2 && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-xs text-red-700 flex items-center">
            <span className="text-base mr-2">⚠️</span>
            Population critical! Consider breeding programs or restocking.
          </div>
        </div>
      )}
    </div>
  );
}