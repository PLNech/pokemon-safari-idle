'use client';

import { ReactNode } from 'react';
import { StickyHeader } from './StickyHeader';
import { GameStats } from './GameStats';
import { NavigationTabs } from './NavigationTabs';

interface GameLayoutProps {
  children: ReactNode;
  onTabChange?: (tab: 'game' | 'areas' | 'upgrades' | 'achievements') => void;
}

export function GameLayout({ children, onTabChange }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200">
      {/* Sticky Header with Key Game Stats */}
      <StickyHeader />
      
      {/* Game Stats Bar - Visible below header when scrolled */}
      <GameStats />
      
      {/* Main Game Content */}
      <main className="relative z-10 px-4 pb-20 pt-4">
        {children}
      </main>
      
      {/* Bottom Navigation for Mobile */}
      <NavigationTabs onTabChange={onTabChange} />
    </div>
  );
}