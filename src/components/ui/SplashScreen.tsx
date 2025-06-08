'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function SplashScreen({ isVisible, onComplete }: SplashScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Bienvenue dans",
      subtitle: "Safari Zone Tycoon",
      description: "Le manager de Pokemon Safari",
      emoji: "🌿"
    },
    {
      title: "Ring the Bell",
      subtitle: "Attract PokeTrainers",
      description: "Perfect timing gives 2x trainers and builds streaks that attract VIPs",
      emoji: "🔔"
    },
    {
      title: "Catch Pokemons",
      subtitle: "Expand Your Zone", 
      description: "Unlock new areas with new rare Pokemon species and opportunities",
      emoji: "⚡"
    },
    {
      title: "Ready to Start?",
      subtitle: "Safari Zone Awaits",
      description: "Tap anywhere to start managin'",
      emoji: "🚀"
    }
  ];

  useEffect(() => {
    if (isVisible) {      
      // Auto-advance through steps
      const intervals: NodeJS.Timeout[] = [];
      
      steps.forEach((_, index) => {
        const timer = setTimeout(() => {
          setCurrentStep(index);
        }, index * 2500);
        intervals.push(timer);
      });

      // Auto-complete after all steps
      const finalTimer = setTimeout(() => {
        onComplete();
      }, steps.length * 2500 + 1000);
      intervals.push(finalTimer);

      return () => {
        intervals.forEach(clearTimeout);
      };
    }
  }, [isVisible, onComplete, steps]);

  const handleSkip = () => {
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={handleSkip}
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('/splash.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={handleSkip}
          className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors bg-black/20 rounded-lg px-4 py-2 backdrop-blur-sm"
        >
          Skip Intro
        </motion.button>

        {/* Main Content */}
        <div className="text-center px-8 max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              {/* Emoji */}
              <motion.div 
                className="text-8xl mb-6"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {steps[currentStep].emoji}
              </motion.div>

              {/* Title */}
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-2"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {steps[currentStep].title}
              </motion.h1>

              {/* Subtitle */}
              <motion.h2 
                className="text-3xl md:text-4xl font-semibold mb-4 text-green-300"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                {steps[currentStep].subtitle}
              </motion.h2>

              {/* Description */}
              <motion.p 
                className="text-lg md:text-xl text-white/90 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {steps[currentStep].description}
              </motion.p>

              {/* Progress Dots */}
              <motion.div 
                className="flex justify-center space-x-2 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index <= currentStep ? 'bg-green-400' : 'bg-white/30'
                    }`}
                  />
                ))}
              </motion.div>

              {/* Call to Action (final step) */}
              {currentStep === steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="animate-pulse"
                >
                  <p className="text-xl text-green-300 font-semibold">
                    Tap anywhere to continue
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Photo Credit - Bottom Right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-4 right-4 text-white/60 text-xs"
        >
          Photo by{' '}
          <a 
            href="https://unsplash.com/@bahnijit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-white/80 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Bahnijit Barman
          </a>
          {' '}on{' '}
          <a 
            href="https://unsplash.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-white/80 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Unsplash
          </a>
        </motion.div>

        {/* Modern Cinematic Overlay Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle animated particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
