'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';

interface SafariBellProps {
  onRing?: () => void;
}

export function SafariBell({ onRing }: SafariBellProps) {
  const [isRinging, setIsRinging] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [bellEffect, setBellEffect] = useState<'normal' | 'golden' | 'perfect'>('normal');
  const [consecutiveClicks, setConsecutiveClicks] = useState(0);
  const [showPerfectStreak, setShowPerfectStreak] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [pokemonAnimations, setPokemonAnimations] = useState<Array<{ 
    id: number; 
    pokemon: string; 
    x: number; 
    y: number; 
    direction: { x: number; y: number } 
  }>>([]);
  const [isTrainerFrenzy, setIsTrainerFrenzy] = useState(false);
  const [frenzyWave, setFrenzyWave] = useState(0);
  
  const { ringBell, isAutoBellActive, autoBellLevel, soundEnabled } = useGameStore();
  const lastClickTime = useRef<number>(0);
  const glowInterval = useRef<NodeJS.Timeout | null>(null);
  const perfectClickWindow = useRef<boolean>(false);

  // Bell glow animation (indicates perfect timing)
  useEffect(() => {
    const startGlowCycle = () => {
      let intensity = 0;
      let increasing = true;
      
      glowInterval.current = setInterval(() => {
        if (increasing) {
          intensity += 0.1;
          if (intensity >= 1) {
            increasing = false;
            perfectClickWindow.current = true;
            // Golden flash window lasts 500ms
            setTimeout(() => {
              perfectClickWindow.current = false;
            }, 500);
          }
        } else {
          intensity -= 0.05;
          if (intensity <= 0) {
            intensity = 0;
            increasing = true;
          }
        }
        setGlowIntensity(intensity);
      }, 50);
    };

    // Start glow cycle for rhythm minigame
    startGlowCycle();

    return () => {
      if (glowInterval.current) {
        clearInterval(glowInterval.current);
      }
    };
  }, []);

  // Auto-bell functionality
  useEffect(() => {
    if (!isAutoBellActive) return;

    const autoBellInterval = setInterval(() => {
      handleBellRing(true);
    }, Math.max(1000, 10000 / autoBellLevel));

    return () => clearInterval(autoBellInterval);
  }, [isAutoBellActive, autoBellLevel]);

  const playBellSound = () => {
    if (!soundEnabled) return;
    
    // TODO: Replace with actual bell sound
    // For now, use Web Audio API to generate a bell-like tone
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Could not play bell sound:', error);
    }
  };

  const generateSparkles = (isPerfect = false) => {
    const sparkleCount = isPerfect ? 12 : 6;
    const newSparkles = Array.from({ length: sparkleCount }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100, // Random position around bell
      y: Math.random() * 200 - 100,
      delay: Math.random() * 0.3, // Stagger animation
    }));
    
    setSparkles(newSparkles);
    
    // Clear sparkles after animation
    setTimeout(() => setSparkles([]), 1000);
  };

  const spawnPokemonAnimation = (isPerfect = false) => {
    const pokemonList = ['pikachu', 'bulbasaur', 'charmander', 'squirtle', 'eevee', 'psyduck', 'magikarp', 'dratini'];
    const randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
    
    // Random direction from center
    const angle = Math.random() * 2 * Math.PI;
    const distance = isPerfect ? 200 + Math.random() * 150 : 150 + Math.random() * 100; // Longer travel for perfect clicks
    
    const newPokemon = {
      id: Date.now() + Math.random(),
      pokemon: randomPokemon,
      x: 0, // Start at center
      y: 0,
      direction: {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      }
    };

    setPokemonAnimations(prev => [...prev, newPokemon]);
    
    // Remove after animation completes
    setTimeout(() => {
      setPokemonAnimations(prev => prev.filter(p => p.id !== newPokemon.id));
    }, 2000);
  };

  const triggerTrainerFrenzy = () => {
    setIsTrainerFrenzy(true);
    setFrenzyWave(0);
    
    // Create 10 waves of 10 trainers each, with 1 second between waves
    const spawnWave = (waveIndex: number) => {
      if (waveIndex >= 10) {
        setIsTrainerFrenzy(false);
        return;
      }
      
      setFrenzyWave(waveIndex + 1);
      
      // Spawn 10 trainers for this wave
      for (let i = 0; i < 10; i++) {
        setTimeout(() => ringBell(), i * 100); // Stagger trainers within wave
      }
      
      // Schedule next wave
      setTimeout(() => spawnWave(waveIndex + 1), 1000);
    };
    
    spawnWave(0);
  };

  const handleBellRing = (isAutoRing = false) => {
    if (isRinging && !isAutoRing) return; // Prevent spam clicking

    const now = Date.now();
    lastClickTime.current = now;

    // Determine click quality for manual clicks
    let clickQuality: 'normal' | 'golden' | 'perfect' = 'normal';
    let trainersToAttract = 1;

    if (!isAutoRing) {
      if (perfectClickWindow.current) {
        // Perfect timing during golden flash
        clickQuality = 'perfect';
        trainersToAttract = 2;
        setConsecutiveClicks(prev => prev + 1);
        generateSparkles(true); // Over-the-top sparkles for perfect click
        
        // Escalating streak rewards system
        if (consecutiveClicks >= 19) {
          // 20+ Perfect Clicks: Trainer Frenzy (100 trainers)
          triggerTrainerFrenzy();
          setShowPerfectStreak(true);
          setConsecutiveClicks(0);
          setTimeout(() => setShowPerfectStreak(false), 5000);
          spawnPokemonAnimation(true); // Legendary Pokemon animation
        } else if (consecutiveClicks >= 9) {
          // 10+ Perfect Clicks: Special Trainers (15 trainers)
          trainersToAttract = 15;
          setShowPerfectStreak(true);
          setConsecutiveClicks(0);
          setTimeout(() => setShowPerfectStreak(false), 4000);
          spawnPokemonAnimation(true); // Rare Pokemon animation
        } else if (consecutiveClicks >= 4) {
          // 5+ Perfect Clicks: Guaranteed Pokemon (8 trainers)
          trainersToAttract = 8;
          setShowPerfectStreak(true);
          setConsecutiveClicks(0);
          setTimeout(() => setShowPerfectStreak(false), 3000);
          spawnPokemonAnimation(true); // Guaranteed Pokemon animation
        }
      } else if (glowIntensity > 0.5) {
        // Good timing during glow
        clickQuality = 'golden';
        trainersToAttract = 1;
        generateSparkles(false); // Normal sparkles for good timing
        spawnPokemonAnimation(false); // Normal Pokemon animation
        setConsecutiveClicks(0);
      } else {
        // Normal click
        generateSparkles(false); // Light sparkles for normal click
        spawnPokemonAnimation(false); // Light Pokemon animation
        setConsecutiveClicks(0);
      }
    }

    setBellEffect(clickQuality);
    setIsRinging(true);

    // Play sound
    playBellSound();

    // Ring the bell in game state
    for (let i = 0; i < trainersToAttract; i++) {
      ringBell();
    }

    // Visual feedback duration
    setTimeout(() => {
      setIsRinging(false);
      setBellEffect('normal');
    }, 300);

    // Callback
    onRing?.();
  };

  const getBellColor = () => {
    if (isRinging) {
      switch (bellEffect) {
        case 'perfect':
          return 'text-purple-400';
        case 'golden':
          return 'text-yellow-400';
        default:
          return 'text-green-400';
      }
    }
    
    if (glowIntensity > 0.8) {
      return 'text-yellow-300'; // Golden flash
    }
    
    if (glowIntensity > 0.3) {
      return 'text-blue-300'; // Glow phase
    }
    
    return 'text-gray-400';
  };

  const getGlowEffect = () => {
    if (isRinging) {
      switch (bellEffect) {
        case 'perfect':
          return 'drop-shadow-2xl shadow-purple-400';
        case 'golden':
          return 'drop-shadow-xl shadow-yellow-400';
        default:
          return 'drop-shadow-lg shadow-green-400';
      }
    }
    
    if (glowIntensity > 0.5) {
      return `drop-shadow-lg shadow-blue-300`;
    }
    
    return '';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Perfect Streak Notification */}
      <AnimatePresence>
        {showPerfectStreak && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg font-bold"
          >
            {consecutiveClicks >= 19 ? '🎪 TRAINER FRENZY! 100+ Trainers! 🎪' :
             consecutiveClicks >= 9 ? '👥 SPECIAL TRAINERS! 15 Arriving! 👥' :
             '🎉 TRAINER CARAVAN! 8 Trainers Arriving! 🎉'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Perfect Click Indicator */}
      {consecutiveClicks > 0 && (
        <div className="flex items-center space-x-1 text-purple-600">
          <Zap size={16} />
          <span className="text-sm font-semibold">
            Perfect Streak: {consecutiveClicks} 
            {consecutiveClicks >= 20 ? ' (MAX!)' : 
             consecutiveClicks >= 10 ? ` → Special Trainers at 10` : 
             ` → Caravan at 5`}
          </span>
        </div>
      )}

      {/* Main Bell Button */}
      <div className="relative">
        <motion.button
          onClick={() => handleBellRing()}
          onTouchStart={() => handleBellRing()} // Better touch response
          disabled={isAutoBellActive}
          animate={{
            scale: isRinging ? 1.1 : 1,
            rotate: isRinging ? [0, -10, 10, 0] : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
          className={`
            relative w-32 h-32 sm:w-40 sm:h-40 rounded-full 
            bg-gradient-to-b from-yellow-300 to-yellow-500
            border-4 border-yellow-600 shadow-lg
            flex items-center justify-center
            touch-manipulation select-none
            ${isAutoBellActive 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:shadow-xl active:scale-95 cursor-pointer'
            }
            transition-all duration-200
          `}
          style={{
            filter: getGlowEffect(),
          }}
        >
        {/* Bell Icon */}
        <Bell 
          size={48} 
          className={`${getBellColor()} transition-colors duration-200`}
        />
        
        {/* Glow Ring Effect */}
        {glowIntensity > 0 && (
          <div 
            className="absolute inset-0 rounded-full border-4 border-blue-400 pointer-events-none"
            style={{
              opacity: glowIntensity * 0.6,
              transform: `scale(${1 + glowIntensity * 0.2})`,
              borderColor: glowIntensity > 0.8 ? '#fbbf24' : '#60a5fa',
            }}
          />
        )}
        
        {/* Perfect Click Window Indicator */}
        {perfectClickWindow.current && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full border-4 border-yellow-400 pointer-events-none"
          />
        )}
      </motion.button>

      {/* Sparkle Animations */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              opacity: 0, 
              scale: 0, 
              x: sparkle.x,
              y: sparkle.y,
              rotate: 0
            }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0, 1.5, 1, 0],
              y: sparkle.y - 50,
              rotate: 360
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 0.8,
              delay: sparkle.delay,
              ease: "easeOut",
              rotate: { repeat: 1, duration: 0.8 }
            }}
            className="absolute pointer-events-none text-yellow-400 text-xl"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            ✨
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Pokemon Animations */}
      <AnimatePresence>
        {pokemonAnimations.map((pokemon) => (
          <motion.div
            key={pokemon.id}
            initial={{ 
              opacity: 0,
              scale: 0,
              x: pokemon.x,
              y: pokemon.y
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0, 1.2, 1, 0.8],
              x: pokemon.direction.x,
              y: pokemon.direction.y,
              rotate: [0, 360]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 2,
              ease: "easeOut",
              scale: { duration: 0.5 },
              rotate: { duration: 2, ease: "linear" }
            }}
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-lg">
              🐾
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

      {/* Bell Status */}
      <div className="text-center space-y-1">
        {isAutoBellActive ? (
          <div className="text-sm text-gray-600">
            🤖 Auto-Bell Active (Level {autoBellLevel})
          </div>
        ) : (
          <div className="text-sm text-gray-700">
            🔔 Click to attract trainers!
          </div>
        )}
        
        {/* Timing Guidance */}
        {!isAutoBellActive && (
          <div className="text-xs text-gray-500">
            {glowIntensity > 0.8 ? (
              <span className="text-yellow-600 font-semibold">✨ PERFECT TIMING! ✨</span>
            ) : glowIntensity > 0.3 ? (
              <span className="text-blue-600">💫 Good timing!</span>
            ) : (
              'Watch for the golden flash!'
            )}
          </div>
        )}
      </div>
    </div>
  );
}