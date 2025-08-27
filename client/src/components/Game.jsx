import React, { useEffect, useRef, useState } from "react";
import { initializeGame, destroyGame } from "../game/main.js";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Game = ({ onRestart }) => {
  const gameRef = useRef(null);
  const [gameStats, setGameStats] = useState({
    score: 0,
    level: 1,
    lives: 3,
    wpm: 0
  });
  const [gameStatus, setGameStatus] = useState('loading'); // loading, playing, gameOver
  const [sessionSaving, setSessionSaving] = useState(false);
  const { user, isAuthenticated, updateUserStats } = useAuth();

  const handleGameComplete = async (gameSessionData) => {
    if (!isAuthenticated) {
      console.log('Game completed but user not authenticated, skipping save');
      return;
    }

    console.log('🎮 Game completed! Sending session data:', gameSessionData);
    setSessionSaving(true);
    try {
      const response = await axios.post('/games/session', gameSessionData);
      console.log('📡 Backend response:', response.data);
      if (response.data.success) {
        console.log('✅ Game session saved successfully');
        updateUserStats(response.data.updatedStats);
      } else {
        console.error('❌ Backend returned success: false');
      }
    } catch (error) {
      console.error('❌ Failed to save game session:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setSessionSaving(false);
    }
  };

  useEffect(() => {
    // Initialize the game when component mounts
    if (gameRef.current) {
      console.log("Initializing Phaser game...");
      const game = initializeGame(gameRef.current, handleGameComplete);
      
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
      const game = initializeGame(gameRef.current, handleGameComplete);
      setGameStatus('playing');
      setGameStats({
        score: 0,
        level: 1,
        lives: 3,
        wpm: 0
      });
    }
  };

  // Connect restart function to parent
  useEffect(() => {
    if (onRestart) {
      // Update parent's restart handler to use our local handler
      window.gameRestartHandler = handleRestartGame;
    }
  }, [onRestart]);

 return (
    <div 
      ref={gameRef} 
      id="game-container"
      className="game-canvas"
      style={{
        width: '800px',
        height: '600px',
        border: '2px solid #333333',
        borderRadius: '12px',
        boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)',
        background: '#0a0a0a',
        // This is the key: it prevents the browser from trying to scale the canvas
        // and respects the native size set by Phaser.
        overflow: 'hidden' 
      }}
    />
  );
};

export default Game;