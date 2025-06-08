'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useToast, ToastContainer, Toast } from '@/components/ui/Toast';

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
  achievement: (title: string, message?: string) => string;
  rarePokemon: (pokemon: string, rarity: string, message?: string) => string;
  shinyPokemon: (pokemon: string, message?: string) => string;
  legendaryPokemon: (pokemon: string, message?: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}