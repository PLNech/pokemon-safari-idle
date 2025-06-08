'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Lock, Check } from 'lucide-react';
import { useGameStore, useGameMoney } from '@/stores/gameStore';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { calculateUpgradeCost } from '@/data/upgrades';
import { UpgradeCategory } from '@/types';

interface UpgradeShopProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeShop({ isOpen, onClose }: UpgradeShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<UpgradeCategory>('marketing');
  const money = useGameMoney();
  const { spendMoney } = useGameStore();
  const { availableUpgrades, purchaseUpgrade, getUpgradeCost } = useUpgradeStore();

  const categories = [
    { id: 'marketing', name: 'Marketing', icon: '📢', color: 'bg-blue-500' },
    { id: 'pokemon', name: 'Pokemon', icon: '🎯', color: 'bg-green-500' },
    { id: 'facilities', name: 'Facilities', icon: '🏢', color: 'bg-purple-500' },
    { id: 'research', name: 'Research', icon: '🔬', color: 'bg-orange-500' },
  ] as const;

  const filteredUpgrades = availableUpgrades.filter(upgrade => 
    upgrade.category === selectedCategory && upgrade.isUnlocked
  );

  const handlePurchase = (upgradeId: string) => {
    const cost = getUpgradeCost(upgradeId);
    
    if (money >= cost && spendMoney(cost)) {
      const success = purchaseUpgrade(upgradeId, cost);
      if (success) {
        // TODO: Show success notification
        console.log(`Purchased upgrade: ${upgradeId}`);
        
        // Special handling for area unlocks
        if (upgradeId.startsWith('unlock_area_')) {
          const area = upgradeId.replace('unlock_area_', '') as any;
          useGameStore.getState().unlockArea(area);
        }
      }
    }
  };

  const formatCost = (cost: number) => {
    if (cost >= 1000000) {
      return `$${(cost / 1000000).toFixed(1)}M`;
    }
    if (cost >= 1000) {
      return `$${(cost / 1000).toFixed(1)}K`;
    }
    return `$${cost}`;
  };

  const getUpgradeStatusColor = (upgrade: any) => {
    if (upgrade.isPurchased) return 'border-green-500 bg-green-50';
    if (!upgrade.isUnlocked) return 'border-gray-300 bg-gray-50';
    
    const cost = calculateUpgradeCost(upgrade);
    if (money >= cost) return 'border-blue-500 bg-blue-50';
    return 'border-gray-400 bg-gray-100';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShoppingCart size={24} />
                  <h2 className="text-2xl font-bold">Upgrade Shop</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold">
                    💰 {formatCost(money)}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row h-[calc(90vh-120px)]">
              {/* Category Sidebar */}
              <div className="md:w-64 bg-gray-50 border-r border-gray-200">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const categoryUpgrades = availableUpgrades.filter(u => 
                        u.category === category.id && u.isUnlocked
                      );
                      const affordableCount = categoryUpgrades.filter(u => 
                        !u.isPurchased && calculateUpgradeCost(u) <= money
                      ).length;

                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`
                            w-full flex items-center justify-between p-3 rounded-lg transition-all
                            ${selectedCategory === category.id 
                              ? `${category.color} text-white shadow-lg` 
                              : 'hover:bg-gray-200 text-gray-700'}
                          `}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          {affordableCount > 0 && (
                            <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {affordableCount}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Upgrades List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 capitalize">
                    {selectedCategory} Upgrades
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {filteredUpgrades.length} upgrades available
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredUpgrades.map((upgrade) => {
                    const cost = calculateUpgradeCost(upgrade);
                    const canAfford = money >= cost;
                    const isAffordableAndNotPurchased = canAfford && !upgrade.isPurchased;

                    return (
                      <motion.div
                        key={upgrade.id}
                        layout
                        className={`
                          border-2 rounded-xl p-4 transition-all
                          ${getUpgradeStatusColor(upgrade)}
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="text-2xl">{upgrade.icon}</div>
                              <div>
                                <h4 className="font-semibold text-gray-800">
                                  {upgrade.name}
                                  {upgrade.maxLevel > 1 && (
                                    <span className="text-sm text-gray-500 ml-2">
                                      Level {upgrade.level}
                                    </span>
                                  )}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {upgrade.description}
                                </p>
                              </div>
                            </div>

                            {/* Effect Display */}
                            <div className="text-sm">
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                +{upgrade.effect.value}{upgrade.effect.isPercentage ? '%' : ''} {upgrade.effect.type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          <div className="text-right ml-4">
                            {upgrade.isPurchased ? (
                              <div className="flex items-center space-x-2 text-green-600">
                                <Check size={20} />
                                <span className="font-semibold">Purchased</span>
                              </div>
                            ) : !upgrade.isUnlocked ? (
                              <div className="flex items-center space-x-2 text-gray-500">
                                <Lock size={20} />
                                <span className="font-semibold">Locked</span>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className={`
                                  text-lg font-bold
                                  ${canAfford ? 'text-green-600' : 'text-red-500'}
                                `}>
                                  {formatCost(cost)}
                                </div>
                                <button
                                  onClick={() => handlePurchase(upgrade.id)}
                                  disabled={!isAffordableAndNotPurchased}
                                  className={`
                                    px-4 py-2 rounded-lg font-semibold transition-all
                                    ${isAffordableAndNotPurchased
                                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }
                                  `}
                                >
                                  {!canAfford ? 'Too Expensive' : 'Purchase'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {filteredUpgrades.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">🔒</div>
                      <p>No upgrades available in this category yet.</p>
                      <p className="text-sm mt-2">Keep playing to unlock more!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}