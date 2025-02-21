import React, { useEffect } from "react";
import "/src/game/main.js"; // Import Phaser script

const Game = () => {
  useEffect(() => {
    console.log("Game component mounted!");
  }, []);

  return (
    <div>
      <div id="game-container"></div>
    </div>
  );
};

export default Game;
