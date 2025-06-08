'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Zap, Save, RotateCcw, Download, Upload, Info } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { ConfirmationDialog } from './ConfirmationDialog';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GameSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  autoSaveInterval: number;
  showFPS: boolean;
  reducedMotion: boolean;
  compactMode: boolean;
}

export function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const { soundEnabled, toggleSound, pauseGame, resumeGame, isPaused } = useGameStore();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled,
    animationsEnabled: !localStorage.getItem('safari-reduced-motion'),
    autoSaveInterval: parseInt(localStorage.getItem('safari-autosave-interval') || '30'),
    showFPS: localStorage.getItem('safari-show-fps') === 'true',
    reducedMotion: localStorage.getItem('safari-reduced-motion') === 'true',
    compactMode: localStorage.getItem('safari-compact-mode') === 'true',
  });

  const handleSettingChange = (key: keyof GameSettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Apply setting immediately
    switch (key) {
      case 'soundEnabled':
        toggleSound();
        break;
      case 'animationsEnabled':
        localStorage.setItem('safari-reduced-motion', (!value).toString());
        break;
      case 'autoSaveInterval':
        localStorage.setItem('safari-autosave-interval', value.toString());
        break;
      case 'showFPS':
        localStorage.setItem('safari-show-fps', value.toString());
        break;
      case 'reducedMotion':
        localStorage.setItem('safari-reduced-motion', value.toString());
        break;
      case 'compactMode':
        localStorage.setItem('safari-compact-mode', value.toString());
        break;
    }
  };

  const handleDataExport = () => {
    try {
      const gameData = {
        gameStore: JSON.parse(localStorage.getItem('safari-zone-save') || '{}'),
        settings: {
          soundEnabled: settings.soundEnabled,
          animationsEnabled: settings.animationsEnabled,
          autoSaveInterval: settings.autoSaveInterval,
          showFPS: settings.showFPS,
          reducedMotion: settings.reducedMotion,
          compactMode: settings.compactMode,
        },
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const dataStr = JSON.stringify(gameData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `safari-zone-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setShowDataExport(true);
      setTimeout(() => setShowDataExport(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleDataImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            
            if (importedData.gameStore) {
              localStorage.setItem('safari-zone-save', JSON.stringify(importedData.gameStore));
            }
            
            if (importedData.settings) {
              Object.entries(importedData.settings).forEach(([key, value]) => {
                handleSettingChange(key as keyof GameSettings, value as boolean | number);
              });
            }
            
            alert('Data imported successfully! The page will reload to apply changes.');
            window.location.reload();
          } catch (error) {
            console.error('Import failed:', error);
            alert('Invalid backup file. Please select a valid Safari Zone backup.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
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
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">⚙️</div>
                  <h2 className="text-2xl font-bold">Game Settings</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Audio Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Volume2 size={20} className="mr-2" />
                  Audio Settings
                </h3>
                <div className="pl-6 space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Sound Effects</span>
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </label>
                </div>
              </div>

              {/* Visual Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Zap size={20} className="mr-2" />
                  Visual Settings
                </h3>
                <div className="pl-6 space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Animations</span>
                    <input
                      type="checkbox"
                      checked={settings.animationsEnabled}
                      onChange={(e) => handleSettingChange('animationsEnabled', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Reduced Motion</span>
                    <input
                      type="checkbox"
                      checked={settings.reducedMotion}
                      onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Compact Mode</span>
                    <input
                      type="checkbox"
                      checked={settings.compactMode}
                      onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Show FPS Counter</span>
                    <input
                      type="checkbox"
                      checked={settings.showFPS}
                      onChange={(e) => handleSettingChange('showFPS', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </label>
                </div>
              </div>

              {/* Game Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Save size={20} className="mr-2" />
                  Game Settings
                </h3>
                <div className="pl-6 space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Auto-save Interval (seconds)</span>
                    <select
                      value={settings.autoSaveInterval}
                      onChange={(e) => handleSettingChange('autoSaveInterval', parseInt(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-1 bg-white text-sm"
                    >
                      <option value={10}>10 seconds</option>
                      <option value={30}>30 seconds</option>
                      <option value={60}>1 minute</option>
                      <option value={300}>5 minutes</option>
                      <option value={0}>Disabled</option>
                    </select>
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Game State</span>
                    <button
                      onClick={isPaused ? resumeGame : pauseGame}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isPaused 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      }`}
                    >
                      {isPaused ? 'Resume Game' : 'Pause Game'}
                    </button>
                  </label>
                </div>
              </div>

              {/* Data Management */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Save size={20} className="mr-2" />
                  Data Management
                </h3>
                <div className="pl-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Export Game Data</span>
                    <button
                      onClick={handleDataExport}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <Download size={16} />
                      <span>Export</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Import Game Data</span>
                    <button
                      onClick={handleDataImport}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <Upload size={16} />
                      <span>Import</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Reset All Data</span>
                    <button
                      onClick={() => setShowResetDialog(true)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <RotateCcw size={16} />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Game Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Info size={20} className="mr-2" />
                  Game Information
                </h3>
                <div className="pl-6 space-y-2 text-sm text-gray-600">
                  <p>Safari Zone Tycoon v1.0.0</p>
                  <p>Built with Next.js, TypeScript, and Zustand</p>
                  <p>© 2024 Safari Zone Tycoon</p>
                </div>
              </div>
            </div>

            {/* Export Success Message */}
            <AnimatePresence>
              {showDataExport && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
                >
                  ✅ Game data exported successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Reset Confirmation Dialog */}
          <ConfirmationDialog
            isOpen={showResetDialog}
            onClose={() => setShowResetDialog(false)}
            onConfirm={() => {
              localStorage.clear();
              window.location.reload();
            }}
            title="Reset All Data"
            message="This will permanently delete all your game progress, settings, and saved data. This action cannot be undone."
            confirmText="Yes, Reset Everything"
            cancelText="Cancel"
            type="danger"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}