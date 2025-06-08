# 🌿 Safari Zone Tycoon 🌿

**A modern incremental game inspired by the original Pokemon Safari Zone**

Build and manage your own Safari Zone, attract trainers, and create the ultimate Pokemon sanctuary!

[![Live Demo](https://img.shields.io/badge/🎮_Play_Now-Live_Demo-brightgreen)](https://plnech.github.io/safari-zone-tycoon/)
[![Built with Next.js](https://img.shields.io/badge/Built_with-Next.js-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)](https://www.typescriptlang.org/)

## 🎮 Game Features

### Core Gameplay
- **🔔 Bell Rhythm System**: Time your clicks perfectly for bonus trainers
- **🎯 Trainer Management**: Watch trainers explore your Safari Zone in real-time
- **⚡ Progressive Unlocking**: Expand to new areas as you grow
- **🏆 Achievement System**: Complete challenges for rewards and bragging rights

### Visual Experience
- **🗺️ Interactive Map**: Real Safari Zone map with live trainer movement
- **🖼️ Authentic Pokemon Images**: High-quality images from official sources
- **📱 Mobile-First Design**: Optimized for phones and tablets
- **✨ Rich Animations**: Smooth transitions and engaging feedback

### Technical Features
- **💾 Auto-Save System**: Never lose your progress
- **⚙️ Comprehensive Settings**: Audio, visual, and gameplay customization
- **📊 Data Export/Import**: Backup and restore your game
- **🔄 Real-time Updates**: Dynamic game state with live statistics

## 🚀 Quick Start

### Play Online
Visit **[plnech.github.io/safari-zone-tycoon/](https://plnech.github.io/safari-zone-tycoon/)** to play instantly!

### Local Development

```bash
# Clone the repository
git clone https://github.com/plnech/safari-zone-tycoon.git
cd safari-zone-tycoon

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for reactive stores
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for modern UI
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth effects
- **Testing**: [Playwright](https://playwright.dev/) for E2E testing
- **Deployment**: GitHub Pages with static export

## 🎯 Game Mechanics

### The Safari Zone Experience
1. **Ring the Bell** 🔔 - Attract trainers to your Safari Zone
2. **Perfect Timing** ⏰ - Watch for the golden flash for bonus effects
3. **Trainer Management** 👥 - Different trainer types with unique behaviors
4. **Pokemon Encounters** 🐾 - Wild Pokemon spawn and interact with trainers
5. **Revenue Collection** 💰 - Earn from entry fees and successful catches
6. **Strategic Upgrades** 🛒 - Invest in facilities and improvements
7. **Area Expansion** 🌍 - Unlock new regions with rare Pokemon

### Progression System
- **Phase 1**: Foundation (10 trainers → Auto-Bell unlock)
- **Phase 2**: Expansion ($5,000 → New area unlock)
- **Phase 3**: Optimization (Advanced trainer types)
- **Phase 4**: Mastery (Legendary encounters)

## 🎨 Visual Design

Safari Zone Tycoon features a modern, cinematic visual style inspired by documentary photography:

- **Natural Color Palette**: Earth tones and Pokemon-inspired colors
- **Smooth Animations**: Cookie Clicker-style auto-clickers and fluid transitions
- **Authentic Imagery**: Real Pokemon sprites and Safari Zone map
- **Mobile Optimization**: Touch-friendly interface with haptic feedback

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Run production server
npm run lint         # Check code quality
npm run test         # Run unit tests
npm run test:e2e     # Run Playwright E2E tests
```

### Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/
│   ├── game/              # Core game components
│   ├── layout/            # Layout and navigation
│   └── ui/                # Reusable UI components
├── stores/                # Zustand state management
├── data/                  # Game data and configurations
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

### Testing Strategy

The game follows Test-Driven Development (TDD) principles:

- **Unit Tests**: Component logic and state management
- **Integration Tests**: Cross-component interactions
- **E2E Tests**: Complete user workflows with Playwright
- **Performance Tests**: Game loop efficiency and memory usage

## 🤝 Contributing

We welcome contributions! Please see our development guidelines:

1. **Code Style**: TypeScript with strict typing
2. **Testing**: Write tests for new features
3. **Mobile First**: Ensure mobile compatibility
4. **Performance**: Optimize for 60fps gameplay

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Nintendo/Game Freak**: Original Pokemon Safari Zone concept
- **Pokemon Community**: Sprite artwork and game data
- **Next.js Team**: Amazing React framework
- **Vercel**: Hosting and deployment platform

---

**🎮 [Play Safari Zone Tycoon Now!](https://plnech.github.io/safari-zone-tycoon/)**

*Build your Pokemon paradise today!*