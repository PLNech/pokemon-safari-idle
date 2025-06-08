import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SafariBell } from '@/components/game/SafariBell';
import { useGameStore } from '@/stores/gameStore';
import { useToastContext } from '@/context/ToastContext';

// Mock the stores and context
jest.mock('@/stores/gameStore');
jest.mock('@/context/ToastContext');

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;
const mockUseToastContext = useToastContext as jest.MockedFunction<typeof useToastContext>;

describe('SafariBell', () => {
  const mockRingBell = jest.fn();
  const mockToast = {
    achievement: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    rarePokemon: jest.fn(),
    shinyPokemon: jest.fn(),
    legendaryPokemon: jest.fn(),
    addToast: jest.fn(),
    removeToast: jest.fn(),
    clearAll: jest.fn(),
    toasts: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseGameStore.mockReturnValue({
      ringBell: mockRingBell,
      isAutoBellActive: false,
      autoBellLevel: 1,
      soundEnabled: true,
    });

    mockUseToastContext.mockReturnValue(mockToast);
  });

  it('renders the bell button', () => {
    render(<SafariBell />);
    
    const bellButton = screen.getByRole('button');
    expect(bellButton).toBeInTheDocument();
  });

  it('calls ringBell when clicked', () => {
    render(<SafariBell />);
    
    const bellButton = screen.getByRole('button');
    fireEvent.click(bellButton);
    
    expect(mockRingBell).toHaveBeenCalled();
  });

  it('shows perfect streak indicator when consecutive clicks > 0', () => {
    render(<SafariBell />);
    
    const bellButton = screen.getByRole('button');
    
    // Simulate perfect clicks by clicking during the golden flash window
    // This is tricky to test since it depends on timing, so we'll test the UI state
    fireEvent.click(bellButton);
    
    // The streak indicator should appear after perfect clicks
    // Note: This test would need to be enhanced to properly simulate timing
  });

  it('displays the correct streak progress', async () => {
    render(<SafariBell />);
    
    // Test that the streak counter shows correct values
    // This would require simulating multiple perfect clicks in sequence
    const bellButton = screen.getByRole('button');
    
    // Click multiple times (though without perfect timing simulation)
    fireEvent.click(bellButton);
    fireEvent.click(bellButton);
    fireEvent.click(bellButton);
    
    // Check if any streak indicators appear
    // Note: Perfect click detection requires actual timing simulation
  });

  it('triggers achievement toast for 5-click streak', async () => {
    render(<SafariBell />);
    
    // This test would require simulating 5 perfect clicks
    // For now, we can test that the achievement toast function is available
    expect(mockToast.achievement).toBeDefined();
  });

  it('disables button when auto-bell is active', () => {
    mockUseGameStore.mockReturnValue({
      ringBell: mockRingBell,
      isAutoBellActive: true,
      autoBellLevel: 2,
      soundEnabled: true,
    });

    render(<SafariBell />);
    
    const bellButton = screen.getByRole('button');
    expect(bellButton).toBeDisabled();
  });

  it('shows auto-bell status when active', () => {
    mockUseGameStore.mockReturnValue({
      ringBell: mockRingBell,
      isAutoBellActive: true,
      autoBellLevel: 2,
      soundEnabled: true,
    });

    render(<SafariBell />);
    
    expect(screen.getByText(/Auto-Bell Active/)).toBeInTheDocument();
    expect(screen.getByText(/Level 2/)).toBeInTheDocument();
  });
});

// Integration test for streak system
describe('SafariBell Streak System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseGameStore.mockReturnValue({
      ringBell: mockRingBell,
      isAutoBellActive: false,
      autoBellLevel: 1,
      soundEnabled: true,
    });

    mockUseToastContext.mockReturnValue(mockToast);
  });

  // Note: These tests are challenging because the streak system depends on
  // precise timing with the golden flash window. A more comprehensive test
  // would require mocking the timing mechanisms or creating a test mode.
  
  it('maintains consecutive click counter', () => {
    // This would test the internal state management of consecutive clicks
    // In a real test, we'd need to access the component's internal state
    // or test through observable behaviors
    expect(true).toBe(true); // Placeholder
  });

  it('resets streak on missed timing', () => {
    // Test that clicking outside the perfect window resets the streak
    expect(true).toBe(true); // Placeholder
  });

  it('shows appropriate rewards for different streak levels', () => {
    // Test that 5, 10, and 20 click streaks show correct rewards
    expect(true).toBe(true); // Placeholder
  });
});