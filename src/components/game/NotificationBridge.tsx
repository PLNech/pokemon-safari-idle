'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useToastContext } from '@/context/ToastContext';

/**
 * NotificationBridge component watches for notifications from the game store
 * and converts them to toast notifications
 */
export function NotificationBridge() {
  const notifications = useGameStore(state => state.notifications);
  const clearNotification = useGameStore(state => state.clearNotification);
  const toast = useToastContext();
  const processedNotifications = useRef(new Set<string>());

  useEffect(() => {
    // Process new notifications
    notifications.forEach(notification => {
      if (processedNotifications.current.has(notification.id)) {
        return; // Already processed
      }

      processedNotifications.current.add(notification.id);

      // Convert game notification to toast based on type
      switch (notification.type) {
        case 'trainer_rare':
          const trainerData = notification.data?.trainer;
          if (trainerData) {
            if (trainerData.rarity === 'legendary') {
              toast.legendaryPokemon(
                trainerData.name,
                `A legendary trainer has arrived at your Safari Zone!`
              );
            } else if (trainerData.rarity === 'epic') {
              toast.rarePokemon(
                trainerData.name,
                'Epic Trainer',
                'An epic trainer has joined your Safari Zone!'
              );
            } else if (trainerData.rarity === 'rare') {
              toast.rarePokemon(
                trainerData.name,
                'Rare Trainer',
                'A rare trainer has arrived!'
              );
            }
          }
          break;

        case 'pokemon_caught':
          const pokemonData = notification.data?.pokemon;
          if (pokemonData) {
            if (pokemonData.isShiny) {
              toast.shinyPokemon(
                pokemonData.name,
                `${notification.data?.trainerName} caught a shiny!`
              );
            } else if (pokemonData.rarity === 'legendary') {
              toast.legendaryPokemon(
                pokemonData.name,
                `${notification.data?.trainerName} caught a legendary Pokemon!`
              );
            } else if (pokemonData.rarity === 'ultra_rare' || pokemonData.rarity === 'rare') {
              toast.rarePokemon(
                pokemonData.name,
                pokemonData.rarity.replace('_', ' ').toUpperCase(),
                `${notification.data?.trainerName} caught a rare Pokemon!`
              );
            }
          }
          break;

        case 'achievement_unlocked':
          toast.achievement(
            notification.message || 'Achievement Unlocked!',
            notification.data?.description
          );
          break;

        case 'milestone_reached':
          toast.success(
            notification.message || 'Milestone Reached!',
            notification.data?.description
          );
          break;

        case 'phase_progression':
          toast.info(
            notification.message || 'Phase Progression!',
            notification.data?.description
          );
          break;

        default:
          // Generic notification
          toast.info(notification.message || 'Notification');
      }

      // Clean up the notification after a delay
      setTimeout(() => {
        clearNotification(notification.id);
        processedNotifications.current.delete(notification.id);
      }, notification.duration || 5000);
    });
  }, [notifications, clearNotification, toast]);

  // Clean up processed notifications when component unmounts
  useEffect(() => {
    return () => {
      processedNotifications.current.clear();
    };
  }, []);

  return null; // This component doesn't render anything
}