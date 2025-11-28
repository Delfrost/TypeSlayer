import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { TestScene } from "../game/TestScene";

const TestAnimation = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "test-game-container",
      backgroundColor: "#2d2d2d",
      scene: [TestScene], // Load our test scene only
      pixelArt: true, // IMPORTANT: keeps sprites crisp when scaled up
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', color: 'white' }}>
      <h2>animation Testing Lab</h2>
      <div id="test-game-container" style={{ border: '2px solid #00ff88' }}></div>
      <div style={{ marginTop: '10px', maxWidth: '600px' }}>
        <p><strong>Controls:</strong></p>
        <ul>
          <li><strong>Keys 1, 2, 3:</strong> Switch between Sword, Bow, and Villain.</li>
          <li><strong>Left/Right Arrows:</strong> Cycle through frames.</li>
        </ul>
        <p>Use this to write down the <strong>Start Frame</strong> and <strong>End Frame</strong> for the animations you want (e.g., "Walking Down: 0 to 3").</p>
      </div>
    </div>
  );
};

export default TestAnimation;