import Phaser from "phaser";

// Word lists by difficulty
const wordsByLevel = {
  1: ["type", "code", "game", "fun", "play", "word"],
  2: ["phaser", "react", "typing", "speed", "wizard"],
  3: ["javascript", "developer", "challenge", "keyboard", "practice"],
  4: ["programming", "application", "experience", "difficulty", "interactive"]
};

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let wordGroup;
let inputText;
let scoreText;
let levelText;
let livesText;
let gameState = {
  score: 0,
  level: 1,
  lives: 3,
  gameOver: false,
  wordSpeed: 2500, // Initial word falling duration in ms
  spawnRate: 2000,  // How often words spawn in ms
};

function preload() {
  // Load assets
  this.load.image('particle', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAADklEQVQImWNgoBL4DwABFQGJCHdqJwAAAABJRU5ErkJggg==');
}

function create() {
  // Initialize game
  this.physics.world.setBounds(0, 0, config.width, config.height);
  wordGroup = this.add.group();
  
  // UI elements
  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
  levelText = this.add.text(16, 50, 'Level: 1', { fontSize: '24px', fill: '#fff' });
  livesText = this.add.text(config.width - 120, 16, 'Lives: 3', { fontSize: '24px', fill: '#fff' });
  
  // Create input text field
  inputText = this.add.text(config.width/2, 550, "", {
    fontSize: "32px",
    fill: "#ffffff",
    backgroundColor: "#222222",
    padding: { x: 10, y: 5 },
  }).setOrigin(0.5);
  
  // Spawn words timer
  this.wordTimer = this.time.addEvent({
    delay: gameState.spawnRate,
    callback: spawnWord,
    callbackScope: this,
    loop: true,
  });
  
  // Capture keyboard input
  this.input.keyboard.on("keydown", (event) => {
    if (gameState.gameOver) return;
    
    if (event.key === "Enter") {
      // Try to match the typed word
      checkWordMatch.call(this);
      inputText.setText(""); // Reset input
    } else if (event.key === "Backspace") {
      // Remove last character on backspace
      inputText.setText(inputText.text.substring(0, inputText.text.length - 1));
    } else if (event.key.length === 1) {
      // Add character to input
      inputText.setText(inputText.text + event.key);
    }
  });
}

function spawnWord() {
  if (gameState.gameOver) return;
  
  // Get words from current level
  const currentLevelWords = wordsByLevel[gameState.level] || wordsByLevel[4];
  const randomWord = Phaser.Utils.Array.GetRandom(currentLevelWords);

  // Randomize starting position
  const startX = Phaser.Math.Between(100, config.width - 100);
  const startY = -50;

  // Create the word text
  const wordText = this.add.text(startX, startY, randomWord, {
    fontSize: "28px",
    fill: "#ffffff",
    backgroundColor: "#000000",
    padding: { x: 10, y: 5 },
  });
  
  wordText.setData('value', randomWord);
  wordGroup.add(wordText);

  // Animate word floating downwards
  this.tweens.add({
    targets: wordText,
    y: config.height + 50,
    duration: gameState.wordSpeed,
    ease: "Linear",
    onComplete: () => {
      // Player missed this word
      if (!wordText.getData('matched') && !gameState.gameOver) {
        loseLife.call(this);
      }
      wordText.destroy();
    },
  });
}

function checkWordMatch() {
  const playerText = inputText.text.trim().toLowerCase();
  if (!playerText) return;
  
  let matched = false;
  
  wordGroup.getChildren().forEach((wordObj) => {
    const wordValue = wordObj.getData('value').toLowerCase();
    
    if (wordValue === playerText && !wordObj.getData('matched')) {
      // Word matched!
      matched = true;
      wordObj.setData('matched', true);
      
      // Visual feedback - change color and add particles
      wordObj.setFill('#00ff00');
      
      // Create particles at word position
      const emitter = this.add.particles(wordObj.x, wordObj.y, 'particle', {
        speed: 100,
        scale: { start: 1, end: 0 },
        lifespan: 800,
        quantity: 1,
        frequency: 50,
        emitting: true
      });
      
      // Destroy word and particles after a short delay
      this.time.delayedCall(300, () => {
        emitter.stop();
        wordObj.destroy();
        updateScore.call(this, wordValue.length * 10);
      });
    }
  });
  
  // If no match, give visual feedback
  if (!matched) {
    // Flash input field red
    inputText.setBackgroundColor('#ff0000');
    this.time.delayedCall(200, () => {
      inputText.setBackgroundColor('#222222');
    });
  }
}

function updateScore(points) {
  gameState.score += points;
  scoreText.setText(`Score: ${gameState.score}`);
  
  // Level up based on score
  const newLevel = Math.floor(gameState.score / 200) + 1;
  if (newLevel > gameState.level && newLevel <= 4) {
    levelUp.call(this, newLevel);
  }
}

function levelUp(newLevel) {
  gameState.level = newLevel;
  levelText.setText(`Level: ${gameState.level}`);
  
  // Increase difficulty
  gameState.wordSpeed = Math.max(1000, 3000 - (gameState.level * 500));
  gameState.spawnRate = Math.max(1000, 2500 - (gameState.level * 300));
  
  // Update spawn timer
  this.wordTimer.delay = gameState.spawnRate;
  
  // Visual feedback for level up
  const levelUpText = this.add.text(config.width/2, config.height/2, `Level ${gameState.level}!`, {
    fontSize: '48px',
    fill: '#ffff00',
    stroke: '#000',
    strokeThickness: 6
  }).setOrigin(0.5);
  
  this.tweens.add({
    targets: levelUpText,
    scale: 1.5,
    duration: 1000,
    ease: 'Sine.easeInOut',
    yoyo: true,
    onComplete: () => levelUpText.destroy()
  });
}

function loseLife() {
  gameState.lives--;
  livesText.setText(`Lives: ${gameState.lives}`);
  
  if (gameState.lives <= 0) {
    gameOver.call(this);
  } else {
    // Visual feedback for losing a life
    this.cameras.main.shake(250, 0.01);
  }
}

function gameOver() {
  gameState.gameOver = true;
  
  // Stop spawning words
  this.wordTimer.remove();
  
  // Show game over screen
  const gameOverText = this.add.text(config.width/2, config.height/2 - 50, 'GAME OVER', {
    fontSize: '64px',
    fill: '#ff0000',
    stroke: '#000',
    strokeThickness: 6
  }).setOrigin(0.5);
  
  const finalScore = this.add.text(config.width/2, config.height/2 + 30, `Final Score: ${gameState.score}`, {
    fontSize: '32px',
    fill: '#ffffff'
  }).setOrigin(0.5);
  
  const restartText = this.add.text(config.width/2, config.height/2 + 100, 'Press SPACE to restart', {
    fontSize: '24px',
    fill: '#ffffff'
  }).setOrigin(0.5);
  
  // Add restart functionality
  this.input.keyboard.once('keydown-SPACE', () => {
    resetGame.call(this);
  });
}

function resetGame() {
  // Reset game state
  gameState.score = 0;
  gameState.level = 1;
  gameState.lives = 3;
  gameState.gameOver = false;
  gameState.wordSpeed = 2500;
  gameState.spawnRate = 2000;
  
  // Update UI
  scoreText.setText('Score: 0');
  levelText.setText('Level: 1');
  livesText.setText('Lives: 3');
  
  // Clear all existing words
  wordGroup.clear(true, true);
  
  // Reset input field
  inputText.setText('');
  
  // Restart word spawning
  this.wordTimer = this.time.addEvent({
    delay: gameState.spawnRate,
    callback: spawnWord,
    callbackScope: this,
    loop: true,
  });
}

function update() {
  // Update logic can be expanded here if needed
}

if (!window.phaserGame) {
  window.phaserGame = new Phaser.Game(config);
}