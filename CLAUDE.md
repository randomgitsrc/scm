# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **超级密码机 (Super Cipher Machine)**, a mobile H5 game based on the classic Mastermind code-breaking game.

- **Chinese Name**: 超级密码机
- **English Name**: Super Cipher Machine
- **Live URL**: http://scm.gsis.top

### Core Game Mechanics

- **Password length**: 4 colors
- **Color palette**: 7 high-contrast colors (red, yellow, blue, green, purple, orange, cyan)
- **Attempts**: 7 tries per level
- **Difficulty progression**: Levels 1-10 use non-repeating colors; level 11+ allows color repetition
- **Feedback system**:
  - 🟢 Green: Correct position AND color
  - 🟡 Yellow: Correct color, wrong position

### Technical Stack

- **Frontend Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite 7
- **State Management**: React useReducer + LocalStorage persistence
- **Audio**: Web Audio API
- **Deployment**: Nginx / Docker / GitHub Actions

### Project Structure

```
supercolor/
├── super-code/              # Game source code
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── HistoryBoard.tsx    # Game history display
│   │   │   ├── InputSlots.tsx      # Current input slots
│   │   │   ├── ColorPalette.tsx    # Color selection
│   │   │   ├── VerifyButton.tsx    # Verify button
│   │   │   └── ResultModal.tsx     # Win/lose modal
│   │   ├── hooks/
│   │   │   └── useGameState.ts     # Game state management
│   │   ├── utils/
│   │   │   ├── gameLogic.ts        # Core algorithms
│   │   │   └── audio.ts            # Audio manager
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript types
│   │   ├── App.tsx
│   │   └── index.css
│   ├── dist/                # Build output
│   └── package.json
├── deploy.sh                # Auto-deployment script
├── docker-compose.yml       # Docker deployment
├── nginx.conf              # Nginx configuration
├── DEPLOY.md               # Deployment documentation
└── README.md               # Project documentation
```

### UI Architecture

Five-section vertical layout optimized for single-hand play:

1. **Header**: Bilingual title (中文/English) with breathing lock icon
2. **Level Bar**: Level badge + attempt counter
3. **History Board**: 7 rows with feedback indicators (green/yellow LED matrix)
4. **Input Area**: 4 slots with position indicator
5. **Color Palette**: 7 circular color buttons in single row
6. **Action Area**: Refined verify button

### Color System

```css
/* Military Theme */
--color-army: #3D4A1E;        /* Military green background */
--color-army-dark: #2A3314;
--color-panel-dark: #1C1C1E;

/* LED Feedback Colors */
--color-led-green: #30D158;   /* Correct position & color */
--color-led-yellow: #FFCC00;  /* Correct color, wrong position */
--color-led-off: #1A1A1A;

/* High-Contrast Game Colors */
--color-game-red: #FF2D55;
--color-game-yellow: #FFCC00;
--color-game-blue: #007AFF;
--color-game-green: #34C759;
--color-game-purple: #AF52DE;
--color-game-orange: #FF9500;
--color-game-cyan: #00C7BE;
```

### Key Algorithms

1. **Secret Generation** (`generateSecret`)
   - Random 4-color code
   - Non-repeating for levels 1-10
   - Repeating allowed for level 11+

2. **Feedback Calculation** (`calculateFeedback`)
   - Compares guess against secret
   - Returns green count (position + color match)
   - Returns yellow count (color match only)

3. **Duplicate Prevention**
   - Selecting a color already in use moves it to new position
   - Prevents duplicate colors in input

### Features Implemented

- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Portrait-only orientation lock
- ✅ Military-style UI with camouflage background
- ✅ Bilingual title (中文 + English)
- ✅ Breathing lock icon animation
- ✅ High-contrast color palette
- ✅ Green/Yellow feedback system
- ✅ Keyboard shortcuts (1-4, Backspace, Enter)
- ✅ Sound effects (Web Audio API)
- ✅ LocalStorage save/load
- ✅ Level progression (unlimited)
- ✅ Auto-deployment scripts

### Deployment Options

1. **Auto Script** (`./deploy.sh`)
   - One-command deployment to VPS
   - Automatic Nginx setup
   - SSL certificate configuration

2. **Docker** (`docker-compose up -d`)
   - Containerized deployment
   - Optional Traefik reverse proxy

3. **GitHub Actions**
   - Automatic deployment on push
   - Requires VPS secrets configuration

### Development Notes

- Build output in `super-code/dist/`
- Single HTML file output (<300KB total)
- CSS animations preferred over JS for performance
- LocalStorage key: `super-code-save`

### File Modifications

Key files to understand the implementation:
- `src/App.tsx` - Main layout and composition
- `src/hooks/useGameState.ts` - Game logic and state
- `src/utils/gameLogic.ts` - Algorithms
- `src/components/HistoryBoard.tsx` - History display
- `src/index.css` - Theme variables and animations
