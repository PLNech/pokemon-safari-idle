'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveTrainers } from '@/stores/gameStore';
import { gameLoop } from '@/utils/gameLoop';
import { PokemonImage } from '@/components/ui/PokemonImage';

const TRAINER_EMOJIS = ['🧑‍🦱', '👩‍🦰', '🧑‍🦲', '👨‍🦳', '👩‍🦱', '🧑‍🦰', '👨‍🦱', '👩‍🦳'];

export function TrainerDisplay() {
  const activeTrainers = useActiveTrainers();

  // Start game loop when component mounts
  useEffect(() => {
    gameLoop.start();
    
    return () => {
      gameLoop.stop();
    };
  }, []);

  const getTrainerEmoji = (trainerId: string) => {
    // Use trainer ID to consistently assign emoji
    const hash = trainerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return TRAINER_EMOJIS[hash % TRAINER_EMOJIS.length];
  };

  const getStatusText = (trainer: any) => {
    if (trainer.pokemonCaught.length > 0) {
      const lastCaught = trainer.pokemonCaught[trainer.pokemonCaught.length - 1];
      return `Caught ${lastCaught.name}! ${lastCaught.isShiny ? '✨' : ''}`;
    }
    
    if (trainer.timeInPark < 10) {
      return 'Exploring area...';
    }
    
    return 'Looking for Pokemon...';
  };

  const getProgressWidth = (trainer: any) => {
    // Progress based on time in park (max 120 seconds)
    return Math.min(100, (trainer.timeInPark / 120) * 100);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-800">
          👥 Active Trainers
        </h3>
        <div className="text-sm text-gray-600">
          {activeTrainers.length}/10 max
        </div>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTrainers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center text-gray-500 text-sm py-8"
            >
              Ring the bell to attract trainers!
            </motion.div>
          ) : (
            activeTrainers.map((trainer) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-blue-50 rounded-lg p-3 border border-blue-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getTrainerEmoji(trainer.id)}
                    </div>
                    <div>
                      <div className="font-medium text-blue-800">
                        {trainer.name}
                      </div>
                      <div className="text-xs text-blue-600">
                        {getStatusText(trainer)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      ${trainer.entryFee}
                    </div>
                    <div className="text-xs text-gray-500">
                      {trainer.pokemonCaught.length} caught
                    </div>
                  </div>
                </div>
                
                {/* Progress bar showing time in park */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Time in park</span>
                    <span>{Math.floor(trainer.timeInPark)}s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <motion.div
                      className="bg-blue-500 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressWidth(trainer)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                
                {/* Pokemon caught display */}
                {trainer.pokemonCaught.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {trainer.pokemonCaught.slice(-3).map((pokemon, index) => (
                      <div
                        key={index}
                        className={`
                          text-xs px-2 py-1 rounded-lg flex items-center space-x-1
                          ${pokemon.rarity === 'common' ? 'bg-gray-100 text-gray-700' : ''}
                          ${pokemon.rarity === 'uncommon' ? 'bg-green-100 text-green-700' : ''}
                          ${pokemon.rarity === 'rare' ? 'bg-blue-100 text-blue-700' : ''}
                          ${pokemon.rarity === 'ultra_rare' ? 'bg-purple-100 text-purple-700' : ''}
                          ${pokemon.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' : ''}
                        `}
                      >
                        <PokemonImage 
                          pokemonName={pokemon.name} 
                          size="small" 
                          fallbackEmoji={pokemon.sprite || '🐾'}
                          className="shrink-0"
                        />
                        {pokemon.isShiny && <span>✨</span>}
                        <span>{pokemon.name}</span>
                      </div>
                    ))}
                    {trainer.pokemonCaught.length > 3 && (
                      <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                        +{trainer.pokemonCaught.length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      {/* Summary stats */}
      {activeTrainers.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold text-blue-700">
                {activeTrainers.reduce((sum, t) => sum + t.pokemonCaught.length, 0)}
              </div>
              <div className="text-xs text-gray-600">Total Catches</div>
            </div>
            <div>
              <div className="font-semibold text-green-700">
                ${activeTrainers.reduce((sum, t) => sum + t.entryFee, 0)}
              </div>
              <div className="text-xs text-gray-600">Expected Revenue</div>
            </div>
            <div>
              <div className="font-semibold text-purple-700">
                {Math.round(activeTrainers.reduce((sum, t) => sum + (t.satisfactionRating || 0.5), 0) / activeTrainers.length * 100)}%
              </div>
              <div className="text-xs text-gray-600">Avg Satisfaction</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}