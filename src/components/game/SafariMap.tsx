'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useActiveTrainers, useUnlockedAreas } from '@/stores/gameStore';
import { usePokemonStore } from '@/stores/pokemonStore';
import { PokemonImage } from '@/components/ui/PokemonImage';
import mapGridData from '@/data/mapGrid.json';

interface TrainerPosition {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  area: string;
}

interface PokemonSpawn {
  id: string;
  species: string;
  x: number;
  y: number;
  area: string;
  despawnTime: number;
}

export function SafariMap() {
  const [trainerPositions, setTrainerPositions] = useState<TrainerPosition[]>([]);
  const [pokemonSpawns, setPokemonSpawns] = useState<PokemonSpawn[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('center');
  const activeTrainers = useActiveTrainers();
  const unlockedAreas = useUnlockedAreas();
  const { areaPopulations } = usePokemonStore();

  const { config, grid } = mapGridData;
  const { width: gridWidth, height: gridHeight } = config.dimensions;

  // Initialize trainer positions when trainers arrive
  useEffect(() => {
    const newTrainers = activeTrainers.filter(
      trainer => !trainerPositions.find(pos => pos.id === trainer.id)
    );

    if (newTrainers.length > 0) {
      const newPositions = newTrainers.map(trainer => {
        const areaConfig = config.areas[trainer.currentArea];
        const bounds = areaConfig.bounds;
        
        // Find a walkable spawn point in the trainer's area
        let x, y;
        do {
          x = Math.floor(Math.random() * (bounds.x_max - bounds.x_min)) + bounds.x_min;
          y = Math.floor(Math.random() * (bounds.y_max - bounds.y_min)) + bounds.y_min;
        } while (!grid[y]?.[x]?.walkable);

        return {
          id: trainer.id,
          x,
          y,
          targetX: x,
          targetY: y,
          area: trainer.currentArea
        };
      });

      setTrainerPositions(prev => [...prev, ...newPositions]);
    }

    // Remove positions for trainers that left
    setTrainerPositions(prev => 
      prev.filter(pos => activeTrainers.find(trainer => trainer.id === pos.id))
    );
  }, [activeTrainers]);

  // Random walk simulation for trainers
  useEffect(() => {
    const moveTrainers = () => {
      setTrainerPositions(prev => prev.map(pos => {
        // 30% chance to start moving to a new location
        if (Math.random() < 0.3) {
          const areaConfig = config.areas[pos.area];
          const bounds = areaConfig.bounds;
          
          // Find a nearby walkable target
          let targetX, targetY;
          let attempts = 0;
          do {
            targetX = Math.max(bounds.x_min, Math.min(bounds.x_max - 1, 
              pos.x + Math.floor(Math.random() * 6) - 3));
            targetY = Math.max(bounds.y_min, Math.min(bounds.y_max - 1, 
              pos.y + Math.floor(Math.random() * 6) - 3));
            attempts++;
          } while (!grid[targetY]?.[targetX]?.walkable && attempts < 10);

          if (attempts < 10) {
            return { ...pos, targetX, targetY };
          }
        }

        // Move towards target
        const dx = pos.targetX - pos.x;
        const dy = pos.targetY - pos.y;
        
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          return {
            ...pos,
            x: pos.x + dx * 0.1,
            y: pos.y + dy * 0.1
          };
        }

        return pos;
      }));
    };

    const interval = setInterval(moveTrainers, 1000);
    return () => clearInterval(interval);
  }, [config.areas, grid]);

  // Spawn Pokemon randomly on the map
  useEffect(() => {
    const spawnPokemon = () => {
      // Remove despawned Pokemon
      setPokemonSpawns(prev => prev.filter(spawn => Date.now() < spawn.despawnTime));

      // Maybe spawn new Pokemon (20% chance per area)
      unlockedAreas.forEach(areaName => {
        if (Math.random() < 0.2) {
          const areaPopulation = areaPopulations[areaName] || [];
          if (areaPopulation.length === 0) return;

          const randomSpecies = areaPopulation[Math.floor(Math.random() * areaPopulation.length)];
          const areaConfig = config.areas[areaName];
          const bounds = areaConfig.bounds;

          // Find spawnable location
          let x, y;
          let attempts = 0;
          do {
            x = Math.floor(Math.random() * (bounds.x_max - bounds.x_min)) + bounds.x_min;
            y = Math.floor(Math.random() * (bounds.y_max - bounds.y_min)) + bounds.y_min;
            attempts++;
          } while (!grid[y]?.[x]?.spawnable && attempts < 10);

          if (attempts < 10) {
            setPokemonSpawns(prev => [...prev, {
              id: `${areaName}_${Date.now()}_${Math.random()}`,
              species: randomSpecies.species.name,
              x,
              y,
              area: areaName,
              despawnTime: Date.now() + 10000 // 10 seconds
            }]);
          }
        }
      });
    };

    const interval = setInterval(spawnPokemon, 3000);
    return () => clearInterval(interval);
  }, [unlockedAreas, areaPopulations, config.areas, grid]);

  const getAreaColor = (areaName: string) => {
    const colors = {
      center: 'rgba(34, 197, 94, 0.3)', // green
      west: 'rgba(22, 163, 74, 0.4)',   // dark green (forest)
      east: 'rgba(59, 130, 246, 0.3)',  // blue (water)
      north: 'rgba(245, 158, 11, 0.3)'  // amber (desert/mountain)
    };
    return colors[areaName] || 'rgba(156, 163, 175, 0.2)';
  };

  const isAreaUnlocked = (areaName: string) => {
    return unlockedAreas.includes(areaName);
  };

  // Calculate visible area bounds based on selected area
  const getViewBounds = () => {
    if (selectedArea === 'all') {
      return { x: 0, y: 0, width: gridWidth, height: gridHeight };
    }
    
    const areaConfig = config.areas[selectedArea];
    if (!areaConfig) return { x: 0, y: 0, width: gridWidth, height: gridHeight };
    
    const bounds = areaConfig.bounds;
    return {
      x: bounds.x_min,
      y: bounds.y_min,
      width: bounds.x_max - bounds.x_min,
      height: bounds.y_max - bounds.y_min
    };
  };

  const viewBounds = getViewBounds();
  const cellSize = 8; // Render size of each grid cell
  const mapWidth = viewBounds.width * cellSize;
  const mapHeight = viewBounds.height * cellSize;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-800">
          🗺️ Safari Zone Map
        </h3>
        
        {/* Area Filter */}
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white"
        >
          <option value="all">All Areas</option>
          {Object.entries(config.areas).map(([areaName, _]) => (
            <option 
              key={areaName} 
              value={areaName}
              disabled={!isAreaUnlocked(areaName)}
            >
              {areaName.charAt(0).toUpperCase() + areaName.slice(1)} Area
              {!isAreaUnlocked(areaName) ? ' (Locked)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Map Container */}
      <div className="relative border-2 border-green-300 rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-blue-100">
        <div 
          className="relative"
          style={{ width: `${mapWidth}px`, height: `${mapHeight}px`, minHeight: '300px' }}
        >
          {/* Actual Safari Zone Map Image Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-no-repeat opacity-90"
            style={{
              backgroundImage: 'url(/map.png)',
              backgroundPosition: `${-viewBounds.x * cellSize}px ${-viewBounds.y * cellSize}px`,
              backgroundSize: `${gridWidth * cellSize}px ${gridHeight * cellSize}px`,
              filter: 'brightness(1.1) contrast(1.05)'
            }}
          />
          {/* Render terrain grid */}
          {Array.from({ length: viewBounds.height }).map((_, gridY) => 
            Array.from({ length: viewBounds.width }).map((_, gridX) => {
              const actualX = viewBounds.x + gridX;
              const actualY = viewBounds.y + gridY;
              const cell = grid[actualY]?.[actualX];
              
              if (!cell) return null;

              const x = gridX * cellSize;
              const y = gridY * cellSize;

              let bgColor = '#86efac'; // default grass
              if (cell.terrain === 'water') bgColor = '#60a5fa';
              else if (cell.terrain === 'forest') bgColor = '#22c55e';
              else if (cell.terrain === 'desert') bgColor = '#fbbf24';
              else if (cell.terrain === 'mountain') bgColor = '#a3a3a3';
              else if (cell.terrain === 'building') bgColor = '#ef4444';

              return (
                <div
                  key={`${actualX}-${actualY}`}
                  className="absolute border border-white/20"
                  style={{
                    left: x,
                    top: y,
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: bgColor,
                    opacity: isAreaUnlocked(cell.area) ? 1 : 0.3
                  }}
                />
              );
            })
          )}

          {/* Area boundaries overlay */}
          {selectedArea === 'all' && Object.entries(config.areas).map(([areaName, areaConfig]) => {
            const bounds = areaConfig.bounds;
            const areaX = (bounds.x_min - viewBounds.x) * cellSize;
            const areaY = (bounds.y_min - viewBounds.y) * cellSize;
            const areaWidth = (bounds.x_max - bounds.x_min) * cellSize;
            const areaHeight = (bounds.y_max - bounds.y_min) * cellSize;

            if (areaX < 0 || areaY < 0 || areaX >= mapWidth || areaY >= mapHeight) return null;

            return (
              <div
                key={areaName}
                className="absolute border-2 border-dashed pointer-events-none"
                style={{
                  left: areaX,
                  top: areaY,
                  width: areaWidth,
                  height: areaHeight,
                  borderColor: getAreaColor(areaName).replace('0.3', '0.8'),
                  backgroundColor: isAreaUnlocked(areaName) ? getAreaColor(areaName) : 'rgba(156, 163, 175, 0.1)'
                }}
              >
                <div className="absolute top-1 left-1 text-xs font-bold text-gray-700 bg-white/80 px-1 rounded">
                  {areaName.toUpperCase()}
                  {!isAreaUnlocked(areaName) && ' 🔒'}
                </div>
              </div>
            );
          })}

          {/* Render trainers */}
          {trainerPositions
            .filter(pos => selectedArea === 'all' || pos.area === selectedArea)
            .filter(pos => isAreaUnlocked(pos.area))
            .map(pos => {
              const x = (pos.x - viewBounds.x) * cellSize;
              const y = (pos.y - viewBounds.y) * cellSize;
              
              if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) return null;

              return (
                <motion.div
                  key={pos.id}
                  className="absolute text-lg pointer-events-none z-10"
                  style={{ left: x - 8, top: y - 8 }}
                  animate={{ x: 0, y: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  🧑‍🦱
                </motion.div>
              );
            })}

          {/* Render Pokemon spawns */}
          {pokemonSpawns
            .filter(spawn => selectedArea === 'all' || spawn.area === selectedArea)
            .filter(spawn => isAreaUnlocked(spawn.area))
            .map(spawn => {
              const x = (spawn.x - viewBounds.x) * cellSize;
              const y = (spawn.y - viewBounds.y) * cellSize;
              
              if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) return null;

              return (
                <motion.div
                  key={spawn.id}
                  className="absolute pointer-events-none z-5"
                  style={{ left: x - 6, top: y - 6 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <PokemonImage 
                    pokemonName={spawn.species} 
                    size="small" 
                    fallbackEmoji="🐾"
                  />
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Map Legend */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-300 border"></div>
          <span>Grass</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 border"></div>
          <span>Forest</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-400 border"></div>
          <span>Water</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-400 border"></div>
          <span>Desert</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Trainers on map: {trainerPositions.length}</span>
          <span>Wild Pokemon: {pokemonSpawns.length}</span>
        </div>
      </div>
    </div>
  );
}