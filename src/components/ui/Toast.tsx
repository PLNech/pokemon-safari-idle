'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Star, Trophy, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'achievement' | 'rare_pokemon' | 'shiny' | 'legendary';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  pokemon?: string;
  rarity?: string;
  autoClose?: boolean;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'info':
      return <Info className="w-5 h-5 text-blue-500" />;
    case 'achievement':
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    case 'rare_pokemon':
      return <Star className="w-5 h-5 text-purple-500" />;
    case 'shiny':
      return <Sparkles className="w-5 h-5 text-yellow-400" />;
    case 'legendary':
      return <Sparkles className="w-5 h-5 text-orange-500" />;
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
};

const getToastColors = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'info':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    case 'achievement':
      return 'bg-yellow-50 border-yellow-300 text-yellow-900 shadow-lg shadow-yellow-200';
    case 'rare_pokemon':
      return 'bg-purple-50 border-purple-300 text-purple-900 shadow-lg shadow-purple-200';
    case 'shiny':
      return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 text-yellow-900 shadow-lg shadow-yellow-300 animate-pulse';
    case 'legendary':
      return 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-400 text-orange-900 shadow-lg shadow-orange-300 animate-pulse';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

function SingleToast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (toast.autoClose !== false && toast.duration !== 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(toast.id), 300);
      }, toast.duration || 4000);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, toast.autoClose, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(toast.id), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -50, 
        scale: isVisible ? 1 : 0.95 
      }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative max-w-sm w-full border rounded-lg p-4 shadow-lg backdrop-blur-sm
        ${getToastColors(toast.type)}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <ToastIcon type={toast.type} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-sm opacity-90 mt-1">
                  {toast.message}
                </p>
              )}
              {toast.pokemon && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    🐾
                  </div>
                  <div>
                    <p className="text-xs font-medium">{toast.pokemon}</p>
                    {toast.rarity && (
                      <p className="text-xs opacity-75">{toast.rarity}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleClose}
              className="flex-shrink-0 ml-3 p-1 rounded-md hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Special animations for rare toasts */}
      {(toast.type === 'shiny' || toast.type === 'legendary' || toast.type === 'achievement') && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Global toast container component
interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <SingleToast toast={toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      duration: 4000,
      autoClose: true,
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((title: string, message?: string) => {
    return addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    return addToast({ type: 'error', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    return addToast({ type: 'info', title, message });
  }, [addToast]);

  const achievement = useCallback((title: string, message?: string) => {
    return addToast({ 
      type: 'achievement', 
      title, 
      message, 
      duration: 6000,
      autoClose: true 
    });
  }, [addToast]);

  const rarePokemon = useCallback((pokemon: string, rarity: string, message?: string) => {
    return addToast({ 
      type: 'rare_pokemon', 
      title: 'Rare Pokemon Caught!', 
      message,
      pokemon,
      rarity,
      duration: 5000 
    });
  }, [addToast]);

  const shinyPokemon = useCallback((pokemon: string, message?: string) => {
    return addToast({ 
      type: 'shiny', 
      title: '✨ SHINY POKEMON! ✨', 
      message,
      pokemon,
      rarity: 'Shiny',
      duration: 8000,
      autoClose: true 
    });
  }, [addToast]);

  const legendaryPokemon = useCallback((pokemon: string, message?: string) => {
    return addToast({ 
      type: 'legendary', 
      title: '🌟 LEGENDARY POKEMON! 🌟', 
      message,
      pokemon,
      rarity: 'Legendary',
      duration: 10000,
      autoClose: false // Let user manually close legendary notifications
    });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    info,
    achievement,
    rarePokemon,
    shinyPokemon,
    legendaryPokemon,
  };
}