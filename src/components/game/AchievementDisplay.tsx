'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock, Check, Filter, Eye, EyeOff } from 'lucide-react';
import { useAchievementStore } from '@/stores/achievementStore';
import { ACHIEVEMENTS_EXPANDED } from '@/data/achievementsExpanded';
import { useClientSafeGameStats } from '@/hooks/useClientSafeStore';
import { Achievement, AchievementReward } from '@/types';

interface AchievementDisplayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementDisplay({ isOpen, onClose }: AchievementDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('progression');
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState<boolean>(true);
  const [showSecrets, setShowSecrets] = useState<boolean>(false);
  const { unlockedAchievements } = useAchievementStore();
  const gameStats = useClientSafeGameStats();

  const categories = [
    { id: 'progression', name: 'Progress', icon: '📈', color: 'bg-blue-500' },
    { id: 'activity', name: 'Activity', icon: '🎯', color: 'bg-green-500' },
    { id: 'pokemon', name: 'Pokemon', icon: '🐾', color: 'bg-purple-500' },
    { id: 'skill', name: 'Skill', icon: '⚡', color: 'bg-yellow-500' },
    { id: 'trainers', name: 'Trainers', icon: '👥', color: 'bg-pink-500' },
    { id: 'quality', name: 'Quality', icon: '⭐', color: 'bg-orange-500' },
    { id: 'secret', name: 'Secret', icon: '🔮', color: 'bg-gray-700' },
  ];

  const filteredAchievements = useMemo(() => {
    let achievements = ACHIEVEMENTS_EXPANDED.filter(achievement => {
      // Category filter
      if (achievement.category !== selectedCategory) return false;
      
      // Secret filter
      if (achievement.isSecret && !showSecrets) return false;
      if (!achievement.isSecret && selectedCategory === 'secret') return false;
      
      // Unlocked filter
      if (showOnlyUnlocked && !achievement.isUnlocked) return false;
      
      return true;
    });
    
    // Sort by unlock status, then by progress
    return achievements.sort((a, b) => {
      if (a.isUnlocked !== b.isUnlocked) {
        return a.isUnlocked ? -1 : 1;
      }
      return getAchievementProgress(b) - getAchievementProgress(a);
    });
  }, [selectedCategory, showOnlyUnlocked, showSecrets]);

  const getAchievementProgress = (achievement: Achievement) => {
    // Simple progress calculation for now
    let progress = 0;
    
    switch (achievement.requirement.type) {
      case 'trainers_attracted':
        progress = gameStats.trainersAttracted;
        break;
      case 'pokemon_caught':
        progress = gameStats.totalPokemonCaught;
        break;
      case 'money_total':
        progress = gameStats.money;
        break;
      case 'satisfaction_average':
        progress = Math.round(gameStats.averageSatisfaction * 100);
        break;
      default:
        progress = achievement.requirement.currentProgress;
    }
    
    return Math.min(100, (progress / achievement.requirement.target) * 100);
  };

  const getAchievementStatus = (achievement: Achievement) => {
    if (achievement.isUnlocked) return 'completed';
    
    const progress = getAchievementProgress(achievement);
    if (progress >= 100) return 'ready';
    if (progress > 0) return 'progress';
    return 'locked';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-50';
      case 'ready': return 'border-yellow-500 bg-yellow-50';
      case 'progress': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const formatReward = (reward: AchievementReward) => {
    switch (reward.type) {
      case 'money':
        return `💰 $${reward.value}`;
      case 'permanent_bonus':
        return `📈 +${reward.value}% ${reward.description.replace(/\+\d+%\s*/, '')}`;
      case 'unlock_feature':
        return `🔓 ${reward.description}`;
      default:
        return reward.description;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[60] flex items-end justify-center p-4 pt-32"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-[90vw] w-full max-h-[60vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Trophy size={24} />
                  <h2 className="text-2xl font-bold">Achievements</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold">
                    🏆 {unlockedAchievements.length}/{ACHIEVEMENTS_EXPANDED.length}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              {/* Filter Controls */}
              <div className="flex items-center space-x-4 mt-4">
                <button
                  onClick={() => setShowOnlyUnlocked(!showOnlyUnlocked)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors ${
                    showOnlyUnlocked ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
                  }`}
                >
                  {showOnlyUnlocked ? <Eye size={16} /> : <EyeOff size={16} />}
                  <span className="text-sm">Unlocked Only</span>
                </button>
                
                <button
                  onClick={() => setShowSecrets(!showSecrets)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors ${
                    showSecrets ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
                  }`}
                >
                  <Filter size={16} />
                  <span className="text-sm">Show Secrets</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row h-[calc(80vh-120px)]">
              {/* Category Sidebar */}
              <div className="md:w-64 bg-gray-50 border-r border-gray-200">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const categoryAchievements = ACHIEVEMENTS_EXPANDED.filter(a => a.category === category.id);
                      const unlockedCount = categoryAchievements.filter(a => a.isUnlocked).length;

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
                          <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            {unlockedCount}/{categoryAchievements.length}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Achievements List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 capitalize">
                    {selectedCategory} Achievements
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {filteredAchievements.filter(a => a.isUnlocked).length}/{filteredAchievements.length} unlocked
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredAchievements.map((achievement) => {
                    const status = getAchievementStatus(achievement);
                    const progress = getAchievementProgress(achievement);

                    return (
                      <motion.div
                        key={achievement.id}
                        layout
                        className={`
                          border-2 rounded-xl p-4 transition-all
                          ${getStatusColor(status)}
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="text-2xl">{achievement.icon}</div>
                              <div>
                                <h4 className="font-semibold text-gray-800 flex items-center">
                                  {achievement.name}
                                  {achievement.isUnlocked && (
                                    <Check size={16} className="ml-2 text-green-600" />
                                  )}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {achievement.description}
                                </p>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            {!achievement.isUnlocked && (
                              <div className="mb-3">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                  <span>Progress</span>
                                  <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <motion.div
                                    className={`
                                      h-2 rounded-full transition-all duration-500
                                      ${status === 'ready' ? 'bg-yellow-500' : 'bg-blue-500'}
                                    `}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Reward Display */}
                            <div className="text-sm">
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                                Reward: {formatReward(achievement.reward)}
                              </span>
                            </div>
                          </div>

                          <div className="ml-4">
                            {achievement.isUnlocked ? (
                              <div className="flex flex-col items-center text-green-600">
                                <Trophy size={24} />
                                <span className="text-xs mt-1">Unlocked</span>
                                {achievement.unlockedAt && (
                                  <span className="text-xs text-gray-500">
                                    {achievement.unlockedAt.toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            ) : status === 'ready' ? (
                              <div className="flex flex-col items-center text-yellow-600">
                                <Trophy size={24} />
                                <span className="text-xs mt-1 font-semibold">Ready!</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-gray-400">
                                <Lock size={24} />
                                <span className="text-xs mt-1">Locked</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}