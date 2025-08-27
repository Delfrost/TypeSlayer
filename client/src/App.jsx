import React, { useState } from "react";
import Game from "./components/Game";
import "./index.css"; // Make sure to import the CSS

function App() {
  const [currentView, setCurrentView] = useState('welcome'); // welcome, game

  const WelcomeScreen = () => (
    <div className="welcome-screen">
      <div className="welcome-container">
        <h1 className="game-title">TypeSlayer</h1>
        <div className="welcome-subtitle">
          Master the Art of Speed Typing
        </div>
        
        <div className="welcome-description">
          <p>Challenge yourself with our fast-paced typing game!</p>
          <p>Type falling words before they reach the bottom and level up to face greater challenges.</p>
        </div>

        <div className="feature-list">
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span>Real-time WPM tracking</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span>5 difficulty levels</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✨</span>
            <span>Particle effects & animations</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span>Detailed performance stats</span>
          </div>
        </div>

        <button 
          className="start-game-btn"
          onClick={() => setCurrentView('game')}
        >
          Start Playing
        </button>

        <div className="quick-instructions">
          <h3>Quick Start:</h3>
          <p>Type the falling words and press <kbd>Enter</kbd> to destroy them!</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="App">
      {currentView === 'welcome' ? (
        <WelcomeScreen />
      ) : (
        <div className="game-view">
          <button 
            className="back-to-welcome"
            onClick={() => setCurrentView('welcome')}
          >
            ← Back to Welcome
          </button>
          <Game />
        </div>
      )}
    </div>
  );
}

export default App;