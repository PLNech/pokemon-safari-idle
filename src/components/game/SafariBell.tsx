'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { useToastContext } from '@/context/ToastContext';

interface SafariBellProps {
  onRing?: () => void;
}

export function SafariBell({ onRing }: SafariBellProps) {
  const [isRinging, setIsRinging] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [perfectClickCount, setPerfectClickCount] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [isPerfectWindow, setIsPerfectWindow] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [pokemonAnimations, setPokemonAnimations] = useState<Array<{ 
    id: number; 
    pokemon: string; 
    x: number; 
    y: number; 
  }>>([]);
  
  const { ringBell, isAutoBellActive, autoBellLevel, soundEnabled } = useGameStore();
  const toast = useToastContext();

  // Glow timing cycle
  useEffect(() => {
    const cycle = () => {
      let intensity = 0;
      let increasing = true;
      
      const interval = setInterval(() => {
        if (increasing) {
          intensity += 0.1;
          if (intensity >= 1) {
            increasing = false;
            setIsPerfectWindow(true);
            setTimeout(() => setIsPerfectWindow(false), 300); // 300ms perfect window
          }
        } else {
          intensity -= 0.05;
          if (intensity <= 0) {
            intensity = 0;
            increasing = true;
          }
        }
        setGlowIntensity(intensity);
      }, 100);

      return interval;
    };

    const interval = cycle();
    return () => clearInterval(interval);
  }, []);

  // Auto bell functionality
  useEffect(() => {
    if (!isAutoBellActive) return;

    const interval = setInterval(() => {
      handleBellClick(true);
    }, Math.max(500, 2000 - (autoBellLevel * 200))); // Faster with higher levels

    return () => clearInterval(interval);
  }, [isAutoBellActive, autoBellLevel, handleBellClick]);

  // Clear animations after delay
  useEffect(() => {
    if (sparkles.length > 0) {
      const timer = setTimeout(() => setSparkles([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [sparkles]);

  useEffect(() => {
    if (pokemonAnimations.length > 0) {
      const timer = setTimeout(() => setPokemonAnimations([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [pokemonAnimations]);

  const playBellSound = () => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Could not play bell sound:', error);
    }
  };

  const generateSparkles = () => {
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }));
    setSparkles(newSparkles);
  };

  const spawnPokemonAnimation = () => {
    const pokemonEmojis = ['🐾', '✨', '🌟', '⭐', '💫'];
    const newPokemon = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      pokemon: pokemonEmojis[Math.floor(Math.random() * pokemonEmojis.length)],
      x: Math.random() * 300 - 150,
      y: Math.random() * 300 - 150,
    }));
    setPokemonAnimations(newPokemon);
  };

  const handlePerfectStreakReward = (perfectStreakCount: number) => {
    if (perfectStreakCount === 5) {
      toast.achievement('🎉 Trainer Caravan!', '5 perfect clicks! More trainers incoming!');
      spawnPokemonAnimation();
      return 5; // Extra trainers
    } else if (perfectStreakCount === 10) {
      toast.achievement('👥 Special Trainers!', '10 perfect clicks! Elite trainers arriving!');
      spawnPokemonAnimation();
      return 10; // Extra trainers
    } else if (perfectStreakCount === 20) {
      toast.achievement('🎪 TRAINER FRENZY!', '20 perfect clicks! Massive wave incoming!');
      spawnPokemonAnimation();
      
      // Trigger frenzy - spawn many trainers over time
      for (let i = 0; i < 50; i++) {
        setTimeout(() => ringBell(), i * 100);
      }
      
      setPerfectClickCount(0); // Reset after frenzy
      return 50; // Frenzy trainers
    }
    return 0;
  };

  const handleBellClick = (isAutoClick = false) => {
    if (isRinging && !isAutoClick) return; // Prevent spam

    setIsRinging(true);
    playBellSound();
    generateSparkles();

    let trainersToAttract = 1;

    if (!isAutoClick) {
      // Check if this is a perfect click
      if (isPerfectWindow) {
        const newPerfectCount = perfectClickCount + 1;
        setPerfectClickCount(newPerfectCount);
        
        // Check for perfect streak rewards
        const extraTrainers = handlePerfectStreakReward(newPerfectCount);
        trainersToAttract += extraTrainers;
      } else {
        // Regular click resets perfect streak but still attracts 1 trainer
        setPerfectClickCount(0);
      }
      
      // Always increment total click count
      setClickCount(prev => prev + 1);
    }

    // Attract trainers
    for (let i = 0; i < trainersToAttract; i++) {
      setTimeout(() => ringBell(), i * 50);
    }

    // Reset visual state
    setTimeout(() => {
      setIsRinging(false);
    }, 300);

    onRing?.();
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Perfect Streak Counter */}
      {perfectClickCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10"
        >
          ⚡ {perfectClickCount} perfect
        </motion.div>
      )}

      {/* Total Click Counter */}
      {clickCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10"
        >
          🔔 {clickCount} total
        </motion.div>
      )}

      {/* Bell Button */}
      <motion.button
        onClick={() => handleBellClick()}
        disabled={isAutoBellActive}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: isRinging ? 1.2 : 1,
          rotate: isRinging ? [0, -10, 10, -10, 0] : 0,
        }}
        className={`
          relative w-32 h-32 rounded-full border-4 transition-all duration-200
          ${isAutoBellActive 
            ? 'bg-gray-200 border-gray-300 cursor-not-allowed' 
            : isPerfectWindow
              ? 'bg-gradient-to-b from-yellow-200 to-yellow-400 border-yellow-500 shadow-2xl shadow-yellow-300/80 cursor-pointer'
              : glowIntensity > 0.3
                ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 border-yellow-600 shadow-lg shadow-yellow-400/50 cursor-pointer'
                : 'bg-gradient-to-b from-yellow-400 to-yellow-600 border-yellow-700 hover:shadow-xl cursor-pointer'
          }
          ${isRinging ? 'shadow-2xl shadow-yellow-400/50' : ''}
        `}
      >
        <Bell 
          size={48} 
          className={`
            ${isAutoBellActive ? 'text-gray-500' : 'text-yellow-900'}
            ${isRinging ? 'drop-shadow-lg' : ''}
          `} 
        />
        
        {/* Sparkles */}
        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
              animate={{ 
                opacity: 0, 
                scale: 1, 
                x: sparkle.x, 
                y: sparkle.y,
                rotate: 360 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute text-yellow-300 text-xl pointer-events-none"
              style={{ left: '50%', top: '50%' }}
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
              initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
              animate={{ 
                opacity: 0, 
                scale: 1.5, 
                x: pokemon.x, 
                y: pokemon.y 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute text-2xl pointer-events-none"
              style={{ left: '50%', top: '50%' }}
            >
              {pokemon.pokemon}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.button>

      {/* Auto Bell Status */}
      {isAutoBellActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center"
        >
          <div className="flex items-center space-x-2 text-blue-600">
            <Zap size={16} />
            <span className="text-sm font-semibold">Auto-Bell Active</span>
          </div>
          <div className="text-xs text-gray-600">Level {autoBellLevel}</div>
        </motion.div>
      )}

      {/* Perfect Click Progress */}
      {perfectClickCount > 0 && perfectClickCount < 20 && (
        <div className="mt-2 text-xs text-gray-600 text-center">
          {perfectClickCount < 5 && `⚡ ${5 - perfectClickCount} more perfect clicks for Caravan`}
          {perfectClickCount >= 5 && perfectClickCount < 10 && `⚡ ${10 - perfectClickCount} more perfect clicks for Special Trainers`}
          {perfectClickCount >= 10 && perfectClickCount < 20 && `⚡ ${20 - perfectClickCount} more perfect clicks for FRENZY!`}
        </div>
      )}

      {/* Perfect Click Instructions */}
      {perfectClickCount === 0 && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Click during the golden glow for perfect timing!
        </div>
      )}
    </div>
  );
}