# TypeSlayer

A dynamic typing game built with React, Vite, and Phaser 3 that transforms typing practice into an epic RPG adventure. In TypeSlayer, players defeat enemies and bosses by typing words and casting spells, combining the thrill of combat with typing skill development.

## Game Features

### Progressive Difficulty
- 5 difficulty levels with increasingly challenging words
- Level 1: Short magical words (fire, ice, wind)
- Level 2: Medium-length spells (blaze, frost, storm)
- Level 3: Advanced incantations (inferno, blizzard, tempest)
- Level 4: Expert spells (pyroblast, thunderbolt)
- Level 5: Ultimate magic (cataclysm, apocalypse)

### Gameplay Mechanics
- Type words to cast spells and defeat enemies
- Face increasingly difficult opponents
- Boss battles with special mechanics
- Real-time combat system
- Progress tracking and scoring

### Educational Benefits
- Improves typing speed and accuracy
- Enhances vocabulary
- Engaging way to practice touch typing
- Fun alternative to traditional typing tutors

## Project Structure

```
client/
├── assets/         # Game assets (images, sounds)
├── public/         # Static files
├── src/
│   ├── components/ # React components
│   ├── game/       # Phaser game logic
│   ├── App.jsx     # Main React component
│   └── main.jsx    # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Delfrost/TypeSlayer.git
cd TypeSlayer/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The game will be available at `http://localhost:5173`

## Development

- The React application is in `src/App.jsx`
- The Phaser game code is in `src/game/main.js`
- Game assets should be placed in the `assets` directory

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technology Stack

- React - Frontend framework
- Vite - Build tool and development server
- Phaser 3 - Game framework
