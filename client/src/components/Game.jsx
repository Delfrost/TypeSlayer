import React, { useEffect, useRef, useState } from "react";
import { initializeGame, destroyGame } from "../game/main.js";

const Game = () => {
  const gameRef = useRef(null);
  const [gameStats, setGameStats] = useState({
    score: 0,
    level: 1,
    lives: 3,
    wpm: 0
  });
  const [gameStatus, setGameStatus] = useState('loading'); // loading, playing, gameOver

  useEffect(() => {
    // Initialize the game when component mounts
    if (gameRef.current) {
      console.log("Initializing Phaser game...");
      const game = initializeGame(gameRef.current);
      
      // Set up event listeners for game state updates
      // Note: In a real implementation, you'd emit events from Phaser scenes
      // and listen for them here to update React state
      setGameStatus('playing');
    }

    // Cleanup function
    return () => {
      console.log("Cleaning up Phaser game...");
      destroyGame();
    };
  }, []);

  const handleRestartGame = () => {
    if (gameRef.current) {
      destroyGame();
      const game = initializeGame(gameRef.current);
      setGameStatus('playing');
      setGameStats({
        score: 0,
        level: 1,
        lives: 3,
        wpm: 0
      });
    }
  };

  return (
    <div className="game-wrapper">
      <div className="game-header">
        <div className="header-content">
          <div className="logo">TypeSlayer</div>
          <div className="game-nav">
            <button className="nav-btn" onClick={handleRestartGame}>
              Restart Game
            </button>
            <button className="nav-btn" onClick={() => window.location.reload()}>
              New Game
            </button>
          </div>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-label">Score</div>
          <div className="stat-value">{gameStats.score}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Level</div>
          <div className="stat-value">{gameStats.level}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Lives</div>
          <div className="stat-value">{gameStats.lives}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">WPM</div>
          <div className="stat-value">{gameStats.wpm}</div>
        </div>
      </div>

      <div className="game-canvas-container">
        <div 
          ref={gameRef} 
          id="game-container"
          className="game-canvas"
          style={{
            width: '800px',
            height: '600px',
            margin: '0 auto',
            border: '2px solid #333333',
            borderRadius: '12px',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)',
            background: '#0a0a0a'
          }}
        />
      </div>

      <div className="instructions-panel">
        <h3>How to Play TypeSlayer</h3>
        <ul>
          <li>Words will fall from the top of the screen</li>
          <li>Type each word exactly as it appears</li>
          <li>Press Enter to submit your typed word</li>
          <li>Successfully typed words will explode with green particles</li>
          <li>If a word reaches the bottom, you lose a life</li>
          <li>Level up every 300 points for increased difficulty</li>
          <li>Track your Words Per Minute (WPM) to improve speed</li>
          <li>Game over when you lose all 3 lives</li>
        </ul>
        
        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '8px' }}>
          <strong>Pro Tips:</strong>
          <ul style={{ marginTop: '10px' }}>
            <li>Focus on accuracy first, then speed</li>
            <li>Keep your eyes on the falling words, not the keyboard</li>
            <li>Use proper touch typing technique</li>
            <li>Stay calm as the game gets faster</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Game;