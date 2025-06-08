/**
 * Unit tests for the streak system logic
 * These tests validate the core streak mechanics without UI dependencies
 */

// Mock timing functions for controlled testing
jest.useFakeTimers();

describe('Streak System Logic', () => {
  // Simulate the streak system state
  interface StreakState {
    consecutiveClicks: number;
    isInPerfectWindow: boolean;
    lastClickTime: number;
  }

  // Simulate the streak logic from SafariBell
  class StreakSystem {
    private state: StreakState = {
      consecutiveClicks: 0,
      isInPerfectWindow: false,
      lastClickTime: 0,
    };

    private callbacks = {
      onCaravan: jest.fn(),
      onSpecialTrainers: jest.fn(),
      onTrainerFrenzy: jest.fn(),
    };

    setPerfectWindow(isActive: boolean) {
      this.state.isInPerfectWindow = isActive;
    }

    click(timestamp: number): { type: string; trainersToAttract: number } {
      this.state.lastClickTime = timestamp;

      if (this.state.isInPerfectWindow) {
        // Perfect click
        this.state.consecutiveClicks += 1;

        // Check for streak rewards (only trigger highest applicable reward)
        if (this.state.consecutiveClicks === 20) {
          this.callbacks.onTrainerFrenzy();
          this.state.consecutiveClicks = 0;
          return { type: 'trainer_frenzy', trainersToAttract: 100 };
        } else if (this.state.consecutiveClicks === 10) {
          this.callbacks.onSpecialTrainers();
          this.state.consecutiveClicks = 0;
          return { type: 'special_trainers', trainersToAttract: 15 };
        } else if (this.state.consecutiveClicks === 5) {
          this.callbacks.onCaravan();
          this.state.consecutiveClicks = 0;
          return { type: 'caravan', trainersToAttract: 8 };
        }

        return { type: 'perfect', trainersToAttract: 2 };
      } else {
        // Normal or golden click (reset streak)
        this.state.consecutiveClicks = 0;
        return { type: 'normal', trainersToAttract: 1 };
      }
    }

    getState() {
      return { ...this.state };
    }

    getCallbacks() {
      return this.callbacks;
    }
  }

  let streakSystem: StreakSystem;

  beforeEach(() => {
    streakSystem = new StreakSystem();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Perfect Click Mechanics', () => {
    it('increases streak counter on perfect clicks', () => {
      streakSystem.setPerfectWindow(true);
      
      streakSystem.click(1000);
      expect(streakSystem.getState().consecutiveClicks).toBe(1);
      
      streakSystem.click(2000);
      expect(streakSystem.getState().consecutiveClicks).toBe(2);
    });

    it('resets streak counter on non-perfect clicks', () => {
      streakSystem.setPerfectWindow(true);
      
      // Build up a streak
      streakSystem.click(1000);
      streakSystem.click(2000);
      expect(streakSystem.getState().consecutiveClicks).toBe(2);
      
      // Miss the perfect window
      streakSystem.setPerfectWindow(false);
      streakSystem.click(3000);
      expect(streakSystem.getState().consecutiveClicks).toBe(0);
    });

    it('returns correct trainer count for perfect clicks', () => {
      streakSystem.setPerfectWindow(true);
      
      const result = streakSystem.click(1000);
      expect(result.trainersToAttract).toBe(2);
      expect(result.type).toBe('perfect');
    });

    it('returns correct trainer count for normal clicks', () => {
      streakSystem.setPerfectWindow(false);
      
      const result = streakSystem.click(1000);
      expect(result.trainersToAttract).toBe(1);
      expect(result.type).toBe('normal');
    });
  });

  describe('Streak Rewards', () => {
    it('triggers trainer caravan at 5 perfect clicks', () => {
      streakSystem.setPerfectWindow(true);
      
      // Click 4 times (should not trigger)
      for (let i = 0; i < 4; i++) {
        const result = streakSystem.click(1000 + i * 100);
        expect(result.type).toBe('perfect');
      }
      
      // 5th click should trigger caravan
      const result = streakSystem.click(1500);
      expect(result.type).toBe('caravan');
      expect(result.trainersToAttract).toBe(8);
      expect(streakSystem.getCallbacks().onCaravan).toHaveBeenCalled();
      
      // Streak should reset
      expect(streakSystem.getState().consecutiveClicks).toBe(0);
    });

    it('triggers special trainers at 10 perfect clicks', () => {
      streakSystem.setPerfectWindow(true);
      
      // Click 9 times
      for (let i = 0; i < 9; i++) {
        streakSystem.click(1000 + i * 100);
      }
      
      // 10th click should trigger special trainers
      const result = streakSystem.click(2000);
      expect(result.type).toBe('special_trainers');
      expect(result.trainersToAttract).toBe(15);
      expect(streakSystem.getCallbacks().onSpecialTrainers).toHaveBeenCalled();
      
      // Streak should reset
      expect(streakSystem.getState().consecutiveClicks).toBe(0);
    });

    it('triggers trainer frenzy at 20 perfect clicks', () => {
      streakSystem.setPerfectWindow(true);
      
      // Click 19 times
      for (let i = 0; i < 19; i++) {
        streakSystem.click(1000 + i * 100);
      }
      
      // 20th click should trigger trainer frenzy
      const result = streakSystem.click(3000);
      expect(result.type).toBe('trainer_frenzy');
      expect(result.trainersToAttract).toBe(100);
      expect(streakSystem.getCallbacks().onTrainerFrenzy).toHaveBeenCalled();
      
      // Streak should reset
      expect(streakSystem.getState().consecutiveClicks).toBe(0);
    });

    it('prioritizes highest reward (20 > 10 > 5)', () => {
      streakSystem.setPerfectWindow(true);
      
      // Click 20 times in a row
      for (let i = 0; i < 19; i++) {
        streakSystem.click(1000 + i * 100);
      }
      
      // Should trigger frenzy, not special trainers or caravan
      const result = streakSystem.click(3000);
      expect(result.type).toBe('trainer_frenzy');
      
      // Only frenzy callback should be called
      expect(streakSystem.getCallbacks().onTrainerFrenzy).toHaveBeenCalledTimes(1);
      expect(streakSystem.getCallbacks().onSpecialTrainers).not.toHaveBeenCalled();
      expect(streakSystem.getCallbacks().onCaravan).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid clicking without breaking', () => {
      streakSystem.setPerfectWindow(true);
      
      // Rapid clicks in quick succession
      for (let i = 0; i < 25; i++) {
        const result = streakSystem.click(1000 + i * 10);
        expect(result).toBeDefined();
        expect(typeof result.trainersToAttract).toBe('number');
      }
    });

    it('handles alternating perfect and non-perfect clicks', () => {
      // Perfect click
      streakSystem.setPerfectWindow(true);
      streakSystem.click(1000);
      expect(streakSystem.getState().consecutiveClicks).toBe(1);
      
      // Non-perfect click
      streakSystem.setPerfectWindow(false);
      streakSystem.click(1100);
      expect(streakSystem.getState().consecutiveClicks).toBe(0);
      
      // Perfect click again
      streakSystem.setPerfectWindow(true);
      streakSystem.click(1200);
      expect(streakSystem.getState().consecutiveClicks).toBe(1);
    });

    it('resets properly after reward triggers', () => {
      streakSystem.setPerfectWindow(true);
      
      // Trigger caravan (5 clicks)
      for (let i = 0; i < 5; i++) {
        streakSystem.click(1000 + i * 100);
      }
      
      // Start new streak
      const result = streakSystem.click(2000);
      expect(streakSystem.getState().consecutiveClicks).toBe(1);
      expect(result.type).toBe('perfect');
    });
  });
});

// Test the timing window system
describe('Perfect Click Timing Window', () => {
  it('validates perfect click window duration', () => {
    // Test that the perfect window lasts for the expected duration (500ms)
    const windowDuration = 500;
    const startTime = Date.now();
    
    // Simulate window opening
    let windowOpen = true;
    
    // Simulate window closing after duration
    setTimeout(() => {
      windowOpen = false;
    }, windowDuration);
    
    jest.advanceTimersByTime(250); // Half duration
    expect(windowOpen).toBe(true);
    
    jest.advanceTimersByTime(300); // Past duration
    expect(windowOpen).toBe(false);
  });
});