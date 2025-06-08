'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, X } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { addMoney } = useGameStore();

  // Only show in development or when debug mode is enabled
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev) return null;

  const handleAddMoney = () => {
    addMoney(1000000); // 1 million PokeDollars
  };

  return (
    <>
      {/* Debug Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[70] bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bug size={20} />
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 z-[60] bg-white rounded-lg shadow-xl p-4 border-2 border-red-500 min-w-[200px]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-red-600">Debug Panel</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddMoney}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                style={{ fontFamily: 'Pokemon' }}
              >
                +1M $ PokeDollars
              </button>

              <div className="text-xs text-gray-500 text-center">
                Development Mode Only
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}