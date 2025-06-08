# Safari Zone Tycoon - Development Guide

## Project Architecture

### Core Tech Stack
- **Next.js 14** with TypeScript (App Router)
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Framer Motion** for animations
- **Playwright** for E2E testing
- **LocalStorage** for save system

### Development Philosophy
- **TDD Approach**: Write tests first, implement features second
- **MVP Iteration**: Build minimum viable features, then enhance
- **Mobile-First**: Responsive design starting from mobile viewport
- **Component-Driven**: Reusable, testable components

### Folder Structure
```
src/
├── app/                     # Next.js app router
├── components/
│   ├── game/               # Core game components
│   ├── minigames/          # Three main minigames
│   ├── ui/                 # Reusable UI components
│   └── layout/             # Layout components (sticky header, etc)
├── stores/                 # Zustand state stores
├── data/                   # Game data (Pokemon, upgrades, etc)
├── utils/                  # Helper functions
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
└── __tests__/              # Test files
```

## Testing Strategy

### Unit Tests (Jest + React Testing Library)
- Component rendering and behavior
- State management logic
- Utility functions
- Game calculations

### E2E Tests (Playwright)
- Full gameplay flow
- Save/load functionality
- Mobile responsiveness
- Minigame interactions

### Test Coverage Goals
- Components: 80%+
- Utilities: 90%+
- Critical paths: 100%

## State Management Architecture

### Game Store (Zustand)
```typescript
interface GameState {
  // Player Progress
  money: number;
  trainersAttracted: number;
  totalPokemonCaught: number;
  currentPhase: GamePhase;
  
  // UI State
  activeArea: AreaType;
  isGamePaused: boolean;
  notifications: Notification[];
  
  // Actions
  ringBell: () => void;
  collectRevenue: (amount: number) => void;
  purchaseUpgrade: (upgrade: Upgrade) => void;
}
```

### Pokemon Store
```typescript
interface PokemonState {
  // Pokemon Data
  pokemonInAreas: Record<AreaType, Pokemon[]>;
  rarePokemonSpawned: Pokemon[];
  shinyPokemonCaught: Pokemon[];
  
  // Population Management
  populationLevels: Record<AreaType, number>;
  breedingPrograms: BreedingProgram[];
  
  // Actions
  spawnPokemon: (area: AreaType, pokemon: Pokemon) => void;
  updatePopulation: (area: AreaType, change: number) => void;
}
```

### Achievement Store
```typescript
interface AchievementState {
  unlockedAchievements: Achievement[];
  achievementProgress: Record<string, number>;
  
  // Actions
  checkAchievements: () => void;
  unlockAchievement: (id: string) => void;
}
```

## Component Design Patterns

### Container Components
- Handle business logic
- Connect to Zustand stores
- Pass data to presentation components

### Presentation Components
- Pure display logic
- Receive props from containers
- No direct state access

### Custom Hooks
- Encapsulate complex logic
- Handle side effects
- Reusable across components

## Development Commands

### Core Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint check
npm run type-check   # TypeScript check
npm test             # Run unit tests
npm run test:e2e     # Run Playwright tests
npm run test:watch   # Run tests in watch mode
```

### Testing Commands
```bash
npm run test:unit            # Unit tests only
npm run test:e2e:headed      # E2E tests with browser UI
npm run test:coverage        # Generate coverage report
```

## Mobile-First Design Principles

### Responsive Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Sticky Header Layout
- Game stats always visible
- Quick action buttons accessible
- Scroll-aware content organization

### Touch-Friendly Design
- Minimum 44px touch targets
- Gesture-based interactions
- Swipe navigation for areas

## Performance Optimization

### Code Splitting
- Lazy load minigames
- Dynamic imports for heavy components
- Route-based splitting

### State Optimization
- Memoized selectors
- Batched updates
- Efficient re-renders

### Asset Optimization
- SVG icons for scalability
- Optimized images
- Sound effect preloading

## Placeholder Resources Strategy

### Graphics
- Use Lucide React icons for UI elements
- Generate SVG Pokemon placeholders with CSS
- Emoji-based visual feedback (⭐ for rare, 🌟 for shiny)
- TODO markers for graphic asset replacement

### Audio
- Browser-generated tones for bell sounds
- CSS animations for visual feedback
- TODO markers for audio asset integration

## Save System Architecture

### LocalStorage Schema
```typescript
interface SaveData {
  version: string;
  timestamp: number;
  gameState: GameState;
  pokemonState: PokemonState;
  achievementState: AchievementState;
}
```

### Features
- Auto-save every 30 seconds
- Manual save/load buttons
- Export/import functionality
- Save validation and migration

## Error Handling Strategy

### Client-Side Errors
- Error boundaries for component crashes
- Graceful fallbacks for failed operations
- User-friendly error messages

### Save System Errors
- Backup save files
- Corruption detection
- Recovery mechanisms

## Accessibility Considerations

### WCAG Compliance
- Keyboard navigation
- Screen reader support
- Color contrast standards
- Focus management

### Game Accessibility
- Reduced motion options
- Alternative input methods
- Visual/audio cues for important events

## Deployment Strategy

### Build Process
1. TypeScript compilation
2. ESLint validation
3. Test suite execution
4. Production build generation

### Environment Variables
```bash
NEXT_PUBLIC_GAME_VERSION=1.0.0
NEXT_PUBLIC_DEBUG_MODE=false
```

## Monitoring and Analytics

### Performance Monitoring
- Core Web Vitals tracking
- Game loop performance
- State update efficiency

### User Behavior
- Feature usage tracking
- Session length analytics
- Achievement completion rates

---

## TODO Markers for Assets

When implementing features, use these TODO markers:

```typescript
// TODO: Replace with actual Pokemon sprite
const pokemonSprite = "🐾";

// TODO: Replace with custom bell sound
const bellSound = "🔔";

// TODO: Replace with safari zone background
const backgroundImage = "url('data:image/svg+xml,<svg>...</svg>')";
```

This allows easy searching and replacement when actual assets are available.

## Git Workflow

### Commit Early, Commit Often Philosophy
**IMPORTANT**: Use git profusely throughout development to track progress and enable easy state comparison.

**When to Commit:**
- After implementing any new feature (`feat:`)
- After fixing any bug or issue (`fix:`)
- After refactoring code (`refactor:`)
- After adding tests (`test:`)
- After updating documentation (`docs:`)
- After any significant code change

**Benefits:**
- Easy rollback to working states
- Clear development history
- Ability to compare different approaches
- Safe experimentation with new features
- Better collaboration and code review

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Individual features
- `bugfix/*`: Bug fixes

### Commit Messages
- Follow conventional commits format
- Use descriptive commit messages
- Include test coverage in commits
- Reference TODO items when relevant

**Examples:**
```bash
feat: implement trainer simulation with Pokemon encounters
fix: resolve localStorage SSR issue in save system
refactor: optimize Pokemon population display component
test: add E2E tests for bell clicking mechanism
docs: update CLAUDE.md with git workflow guidelines
```

---

*This document should be updated as the project evolves. Keep architecture decisions documented and maintain clear development patterns.*