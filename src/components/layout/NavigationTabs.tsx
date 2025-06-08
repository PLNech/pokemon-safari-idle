'use client';

import { useState } from 'react';
import { Home, ShoppingCart, Trophy, Settings, Map } from 'lucide-react';

type TabType = 'game' | 'areas' | 'upgrades' | 'achievements' | 'settings';

interface NavigationTabsProps {
  onTabChange?: (tab: TabType) => void;
}

export function NavigationTabs({ onTabChange }: NavigationTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('game');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const tabs = [
    {
      id: 'game' as TabType,
      icon: Home,
      label: 'Game',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 'areas' as TabType,
      icon: Map,
      label: 'Areas',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'upgrades' as TabType,
      icon: ShoppingCart,
      label: 'Shop',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 'achievements' as TabType,
      icon: Trophy,
      label: 'Awards',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      id: 'settings' as TabType,
      icon: Settings,
      label: 'Settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="grid grid-cols-5 gap-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center py-2 px-1 transition-all duration-200
                touch-manipulation min-h-[60px] relative
                ${isActive 
                  ? `${tab.bgColor} ${tab.color}` 
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className={`absolute top-0 left-0 right-0 h-1 ${tab.color.replace('text-', 'bg-')}`} />
              )}
              
              {/* Icon */}
              <Icon size={20} className="mb-1" />
              
              {/* Label */}
              <span className="text-xs font-medium">
                {tab.label}
              </span>
              
              {/* Badge for notifications */}
              {tab.id === 'upgrades' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
              
              {tab.id === 'achievements' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}