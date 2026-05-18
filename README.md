# TypeSlayer ⚔️

TypeSlayer is a typing game where you fight off enemies by typing words and sentences. Type fast and accurately to defeat the forces of evil!

## Setup Instructions

1. Clone the repository.
2. Run `npm install` inside the `server` directory.
3. Run `npm install` inside the `client` directory.
4. Set up your `.env` file inside the `server` directory (e.g., `MONGO_URI`, `JWT_SECRET`).
5. Open two terminal instances:
   - In the first terminal, navigate to `server` and run `npm start`.
   - In the second terminal, navigate to `client` and run `npm run dev`.
6. Open the game in your browser at the provided Vite URL (typically `http://localhost:5173`).

## Features
- Real-time WPM calculation.
- Authentication & progress tracking (saved to a database).
- Enemy pathing & boss fights.
- Ally spawning that provide temporary boosts (slow-motion, extra lives).

Enjoy the journey, hero!
