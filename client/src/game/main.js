import Phaser from "phaser";
import { levelData } from './level-data.js';
import { BackgroundManager } from './BackgroundManager.js';
import { Enemy } from './Enemy.js';
import { Player } from './Player.js'; 

// Friendly ally words that give bonuses
const allyWords = {
  1: ["friend", "help", "aid", "boost", "gift"],
  2: ["ally", "support", "assist", "bonus", "power"],
  3: ["guardian", "protector", "blessing", "enhancement", "miracle"],
  4: ["champion", "salvation", "empowerment", "divine", "transcend"],
  5: ["ascendant", "omnipotent", "legendary", "ultimate", "infinity"]
};

// Enemy types and their properties (slowed down speeds)
const enemyTypes = {
  minion: {
    name: "Shadow Minion",
    hp: 1,
    speed: 4000, // Increased from 3000
    color: "#666666",
    points: 10,
    sprite: "👻",
    scale: 0.8
  },
  warrior: {
    name: "Dark Warrior",
    hp: 2,
    speed: 4500, // Increased from 3500
    color: "#aa4444",
    points: 25,
    sprite: "⚔️",
    scale: 0.9
  },
  mage: {
    name: "Evil Mage",
    hp: 2,
    speed: 5000, // Increased from 4000
    color: "#4444aa",
    points: 30,
    sprite: "🔮",
    scale: 0.9
  },
  demon: {
    name: "Demon",
    hp: 3,
    speed: 5500, // Increased from 4500
    color: "#aa44aa",
    points: 40,
    sprite: "👹",
    scale: 1.0
  },
  boss: {
    name: "Dark Lord",
    hp: 3, // Changed from 5 to 3
    speed: 10000,
    color: "#ff0088",
    points: 100,
    sprite: "👾",
    scale: 1.2
  }
};

// Ally character types
const allyTypes = {
  healer: {
    name: "Light Healer",
    sprite: "🧙‍♀️",
    color: "#00ff88",
    benefit: "extra_life",
    message: "+1 Life!"
  },
  sage: {
    name: "Wise Sage",
    sprite: "👴",
    color: "#ffaa00",
    benefit: "combo_multiplier",
    message: "+2x Combo!"
  },
  fairy: {
    name: "Magic Fairy",
    sprite: "🧚‍♀️",
    color: "#ff88aa",
    benefit: "time_slow",
    message: "Time Slowed!"
  },
  wizard: {
    name: "Grand Wizard",
    sprite: "🧙‍♂️",
    color: "#8888ff",
    benefit: "shield",
    message: "Shield Active!"
  }
};

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  preload() {
    this.load.image('menu-bg', '/start 3.jpg');
  }

  create() {
    // --- 1. Background and Title ---
    const bg = this.add.image(400, 300, 'menu-bg');
    bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.add.text(400, 80, "TypeSlayer", {
      fontSize: "96px",
      fontFamily: "Courier New, monospace",
      color: "#ffffff",
      stroke: "#a91101",
      strokeThickness: 8,
      shadow: { offsetX: 5, offsetY: 5, color: '#000', blur: 10, stroke: true, fill: true }
    }).setOrigin(0.5);

    // --- 2. Create Containers for each screen ---
    // This makes it easy to show/hide entire screens at once.
    this.mainMenuContainer = this.add.container(400, 320);
    this.howToPlayContainer = this.add.container(400, 300).setVisible(false);
    this.optionsContainer = this.add.container(400, 300).setVisible(false);
    this.storyContainer = this.add.container(400, 300).setVisible(false);

    // --- 3. Populate the Main Menu ---
    this.createMainMenu();

    // --- 4. Populate the "How to Play" Screen ---
    this.createHowToPlayScreen();

    // --- 5. Populate the Placeholder Screens ---
    this.createPlaceholderScreen(this.optionsContainer, "Game Options");
    this.createPlaceholderScreen(this.storyContainer, "The Story So Far...");
  }

  // --- Helper function to switch between screens ---
  switchScreen(containerToShow) {
    // Hide all containers first
    this.mainMenuContainer.setVisible(false);
    this.howToPlayContainer.setVisible(false);
    this.optionsContainer.setVisible(false);
    this.storyContainer.setVisible(false);

    // Show the requested one
    containerToShow.setVisible(true);
  }

  // --- Builds the main menu buttons ---
  createMainMenu() {
    const menuOptions = [
      { text: 'Start Game', action: () => {
          this.cameras.main.fadeOut(300, 0, 0, 0);
          this.time.delayedCall(300, () => this.scene.start('PlayScene'));
        }
      },
      { text: 'How to Play', action: () => this.switchScreen(this.howToPlayContainer) },
      { text: 'Options', action: () => this.switchScreen(this.optionsContainer) },
      { text: 'Story', action: () => this.switchScreen(this.storyContainer) }
    ];

    let yPos = -40;
    menuOptions.forEach(option => {
      const button = this.createButton(0, yPos, option.text, option.action);
      this.mainMenuContainer.add(button);
      yPos += 70;
    });
  }

  // --- Builds the "How to Play" content ---
  createHowToPlayScreen() {
    // Semi-transparent background for readability
    const bgRect = this.add.rectangle(0, 0, 600, 450, 0x000000, 0.7);
    bgRect.setStrokeStyle(2, 0xff4444);
    this.howToPlayContainer.add(bgRect);

    const title = this.add.text(0, -180, "How to Play", {
      fontSize: '40px', fontFamily: 'Arial', color: '#ff4444', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);
    this.howToPlayContainer.add(title);

    const instructions = [
      "⚔️ Dark forces are invading!",
      "⚔️ Type the words above an enemy's head.",
      "⚔️ Press ENTER to cast your spell and destroy them.",
      "⚔️ Defeat powerful BOSSES by typing full sentences.",
      "⚔️ Help friendly ALLIES to gain powerful bonuses.",
      "⚔️ Don't let enemies reach the bottom of the screen!",
    ];

    let yPos = -110;
    instructions.forEach(line => {
      const text = this.add.text(0, yPos, line, {
        fontSize: '20px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 550 }
      }).setOrigin(0.5);
      this.howToPlayContainer.add(text);
      yPos += 45;
    });

    const backButton = this.createButton(0, 180, 'Back to Menu', () => this.switchScreen(this.mainMenuContainer));
    this.howToPlayContainer.add(backButton);
  }

  // --- Builds the placeholder screens for Options and Story ---
  createPlaceholderScreen(container, titleText) {
    const bgRect = this.add.rectangle(0, 0, 600, 450, 0x000000, 0.7);
    bgRect.setStrokeStyle(2, 0xff4444);
    container.add(bgRect);

    const title = this.add.text(0, -180, titleText, {
      fontSize: '40px', fontFamily: 'Arial', color: '#ff4444', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);
    container.add(title);

    const placeholderText = this.add.text(0, 0, "This screen is not yet implemented.", {
      fontSize: '22px', fontFamily: 'Arial', color: '#cccccc', fontStyle: 'italic'
    }).setOrigin(0.5);
    container.add(placeholderText);

    const backButton = this.createButton(0, 180, 'Back to Menu', () => this.switchScreen(this.mainMenuContainer));
    container.add(backButton);
  }

  // --- A helper function to create consistent buttons ---
  createButton(x, y, text, action) {
    const button = this.add.text(x, y, text, {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#cccccc',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5).setInteractive();

    button.on('pointerover', () => button.setStyle({ color: '#ff4444' }));
    button.on('pointerout', () => button.setStyle({ color: '#cccccc' }));
    button.on('pointerdown', action);

    return button;
  }
}


class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayScene" });
  }

  preload() {
      console.log('🤺 Preloading player assets...');
      this.load.spritesheet('player-sword', '/assets/player-sword.png', {
        frameWidth: 64,
        frameHeight: 64
      });
      this.load.spritesheet('player-bow', '/assets/bow-shooting.png', {
        frameWidth: 64,
        frameHeight: 64
      });
    this.load.json('wordlist', '/words.json');
    this.load.json('sentenceParts', '/sentence_parts.json');
    BackgroundManager.preload(this);

    // Create magical particle texture
    this.add.graphics()
      .fillStyle(0xffffff)
      .fillRect(0, 0, 6, 6)
      .generateTexture('particle', 6, 6);

    // Create energy burst texture
    this.add.graphics()
      .fillGradientStyle(0x00ff88, 0x00ff88, 0x88ff00, 0x88ff00)
      .fillCircle(8, 8, 8)
      .generateTexture('energy', 16, 16);
  }

  create() {
    this.wordlist = this.cache.json.get('wordlist');
    this.sentenceParts = this.cache.json.get('sentenceParts');
    // --- ADD THIS VALIDATION BLOCK ---
    if (!this.wordlist || !this.sentenceParts) {
      console.error("🔥 FATAL ERROR: Word list or sentence parts JSON not found!");
      console.error("Please ensure 'words.json' and 'sentence_parts.json' are in the /public folder and there are no typos.");
      
      // Stop the scene from proceeding
      // You can also add a user-facing error message here
      this.add.text(400, 300, 'Error: Could not load game data.', { fontSize: '24px', fill: '#ff0000' }).setOrigin(0.5);
      return; 
    }
    // --- END OF VALIDATION BLOCK ---
  //   // An idle pose using a single frame from the sword sheet
  //   this.anims.create({
  //   key: 'player-idle',
  //   // Use the front-facing "walk south" frames for a breathing animation.
  //   // NOTE: Frame numbers are based on a standard 13-frame wide sheet.
  //   frames: this.anims.generateFrameNumbers('player-sword', { frames: [130, 131] }),
  //   frameRate: 2,   // A slow frame rate for a subtle effect
  //   repeat: -1      // Loop forever
  // });
  // // A sword slash animation
  // this.anims.create({
  //   key: 'player-attack-sword',
  //   // Assumes a 13-frame wide sheet, using frames from the "slash south" animation
  //   frames: this.anims.generateFrameNumbers('player-sword', { start: 182, end: 187 }),
  //   frameRate: 12,
  //   repeat: 0 // Play only once
  // });

  // // A bow shooting animation
  // this.anims.create({
  //   key: 'player-shoot-bow',
  //   // Assumes a 13-frame wide sheet, using frames from the "shoot south" animation
  //   frames: this.anims.generateFrameNumbers('player-bow', { start: 221, end: 233 }),
  //   frameRate: 15,
  //   repeat: 0 // Play only once
  // });
    // Initialize game state with new features
    this.gameState = {
      score: 0,
      level: 1,
      lives: 3,
      gameOver: false,
      enemySpeed: 4000, // Slower starting speed
      spawnRate: 2500, // Slightly slower spawn rate
      wordsTyped: 0,
      correctWords: 0,
      totalCharactersTyped: 0,
      correctCharacters: 0,
      errorCharacters: 0,
      startTime: Date.now(),
      currentInput: "",
      bossActive: false,
      enemiesKilled: 0,
      enemiesPerBoss: 8,
      comboMultiplier: 1,
      comboCount: 0,
      maxCombo: 0,
      shield: false,
      timeSlowActive: false,
      allySpawnChance: 0.15,// 15% chance for ally to spawn
      healerSpawnedThisLevel: false, // <-- ADD THIS
      lastAllySpawnTime: 0 
    };

    this.backgroundManager = new BackgroundManager(this);
    this.backgroundManager.create();

    // Create groups
    this.enemyGroup = this.add.group();
    this.allyGroup = this.add.group();

    // Create enhanced particle systems
    this.hitParticles = this.add.particles(0, 0, 'particle', {
      speed: { min: 100, max: 200 },
      scale: { start: 1.2, end: 0 },
      lifespan: 1000,
      quantity: 12,
      emitting: false
    });

    this.magicParticles = this.add.particles(0, 0, 'energy', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.8, end: 0.3 },
      lifespan: 1200,
      quantity: 8,
      emitting: false,
      alpha: { start: 0.8, end: 0 }
    });

    // this.player = new Player(this, 400, 520); 

    // UI elements with magical styling
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '24px',
      fontFamily: 'Courier New, monospace',
      fill: '#ff6b9d',
      stroke: '#000033',
      strokeThickness: 2
    });

    this.levelText = this.add.text(20, 50, 'Level: 1', {
      fontSize: '24px',
      fontFamily: 'Courier New, monospace',
      fill: '#a8e6cf',
      stroke: '#000033',
      strokeThickness: 2
    });

    this.livesText = this.add.text(20, 80, 'Lives: 3', {
      fontSize: '24px',
      fontFamily: 'Courier New, monospace',
      fill: '#ffd93d',
      stroke: '#000033',
      strokeThickness: 2
    });

    this.wpmText = this.add.text(650, 20, 'WPM: 0', {
      fontSize: '24px',
      fontFamily: 'Courier New, monospace',
      fill: '#a29bfe',
      stroke: '#000033',
      strokeThickness: 2
    });

    // New combo and status displays
    this.comboText = this.add.text(650, 50, 'Combo: x1', {
      fontSize: '20px',
      fontFamily: 'Courier New, monospace',
      fill: '#ffaa00',
      stroke: '#000033',
      strokeThickness: 2
    });

    this.statusText = this.add.text(400, 50, '', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#00ff88',
      stroke: '#000033',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Progress to boss indicator
    this.bossProgressText = this.add.text(400, 20, '', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#fd79a8',
      stroke: '#000033',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Enhanced input display with magical border
    this.inputDisplay = this.add.text(400, 550, "", {
      fontSize: "26px",
      fontFamily: "Courier New, monospace",
      fill: "#ffffff",
      backgroundColor: "#2d3436",
      padding: { x: 20, y: 10 },
      stroke: "#6c5ce7",
      strokeThickness: 2
    }).setOrigin(0.5);

    // Magical input hint
    this.inputHint = this.add.text(400, 580, "Channel your magic through typing...", {
      fontSize: "16px",
      fontFamily: "Arial",
      fill: "#b2bec3",
      fontStyle: "italic"
    }).setOrigin(0.5);

    // Start the magical quest
    this.startGame();
    this.updateBossProgress();

    // Handle magical input
    this.input.keyboard.on("keydown", this.handleKeyInput, this);
  }
  
  getWordsForLevel(level) {
      if (level >= 5) {
        return this.wordlist.expert;
      }
      if (level >= 4) {
        return this.wordlist.hard;
      }
      if (level >= 2) {
        return this.wordlist.medium;
      }
      return this.wordlist.easy;
    }

  generateBossSentence(level) {
    const parts = this.sentenceParts;
    let template;

    // Select a template based on the level
    if (level >= 4) {
      template = Phaser.Utils.Array.GetRandom(parts.templates.epic);
    } else if (level >= 2) {
      template = Phaser.Utils.Array.GetRandom(parts.templates.medium);
    } else {
      template = Phaser.Utils.Array.GetRandom(parts.templates.simple);
    }

    // Build the sentence by replacing placeholders
    const sentence = template.map(part => {
      if (part.startsWith('{') && part.endsWith('}')) {
        const wordType = part.slice(1, -1); // e.g., "noun", "verb"
        return Phaser.Utils.Array.GetRandom(parts.words[wordType]);
      }
      return part;
    }).join(' ');

    // Capitalize the first letter and return
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }
    

  startGame() {
    // Start enemy spawning with magical timing
    this.enemyTimer = this.time.addEvent({
      delay: this.gameState.spawnRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });

    // Ally spawn timer (less frequent)
    this.allyTimer = this.time.addEvent({
      delay: 8000, // Every 8 seconds, check for ally spawn
      callback: this.trySpawnAlly,
      callbackScope: this,
      loop: true
    });
  }

  spawnEnemy() {
    if (this.gameState.gameOver || this.gameState.bossActive) return;

    // Check if it's time for a boss
    if (this.gameState.enemiesKilled >= this.gameState.enemiesPerBoss && !this.gameState.bossActive) {
      this.spawnBoss();
      return;
    }

    // Spawn regular enemy with word
    this.spawnRegularEnemy();
  }

  trySpawnAlly() {
    if (this.gameState.gameOver || this.gameState.bossActive) return;

    // Cooldown: at least 10 seconds between ally spawns
    const now = this.time.now;
    if (now - this.gameState.lastAllySpawnTime < 10000) return;

    // Don't spawn if there's already an ally
    if (this.allyGroup.getLength() >= 1) return;

    // Check the random chance
    if (Math.random() <= this.gameState.allySpawnChance) {
      this.spawnAlly();
    }
  }

  spawnAlly() {
    const allyTypeNames = Object.keys(allyTypes).filter(name => name !== 'healer');
    const allyTypeName = Phaser.Utils.Array.GetRandom(allyTypeNames);
    const allyType = allyTypes[allyTypeName];

    // Update the last spawn time
    this.gameState.lastAllySpawnTime = this.time.now;
    // Get word for ally
    const currentWords = allyWords[Math.min(this.gameState.level, 5)] || allyWords[1];
    const word = Phaser.Utils.Array.GetRandom(currentWords);

    // Spawn from right side of screen
    const startX = 850;
    const startY = Phaser.Math.Between(150, 400);

    // Create ally with friendly appearance
    const ally = this.add.text(startX, startY, allyType.sprite, {
      fontSize: "36px"
    }).setOrigin(0.5);

    // Create word display above ally
    const allyWordText = this.add.text(startX, startY - 40, word, {
      fontSize: "18px",
      fontFamily: "Courier New, monospace",
      fill: allyType.color,
      backgroundColor: "#003300",
      padding: { x: 8, y: 4 },
      stroke: "#ffffff",
      strokeThickness: 1
    }).setOrigin(0.5);

    // Store ally data
    ally.setData('word', word);
    ally.setData('wordText', allyWordText);
    ally.setData('type', allyTypeName);
    ally.setData('benefit', allyType.benefit);
    ally.setData('message', allyType.message);
    ally.setData('matched', false);
    ally.setData('isAlly', true);

    this.allyGroup.add(ally);

    // Animate ally movement (slower horizontal movement)
    const tween = this.tweens.add({
      targets: [ally, allyWordText],
      x: -50, // Move left across screen
      duration: 12000, // 12 seconds to cross
      ease: 'Linear',
      onComplete: () => {
        ally.destroy();
        allyWordText.destroy();
      }
    });

    ally.setData('tween', tween);
    allyWordText.setData('tween', tween);

    // Show ally notification
    this.showNotification("🧙‍♀️ Friendly ally appeared! 🧙‍♀️", allyType.color, 2000);
  }

spawnHealerAlly() {
  const allyType = allyTypes['healer'];
  const currentWords = allyWords[Math.min(this.gameState.level, 5)] || allyWords[1];
  const word = Phaser.Utils.Array.GetRandom(currentWords);

  const startX = 850;
  const startY = Phaser.Math.Between(150, 400);

  const ally = this.add.text(startX, startY, allyType.sprite, { fontSize: "36px" }).setOrigin(0.5);
  const allyWordText = this.add.text(startX, startY - 40, word, {
    fontSize: "18px",
    fontFamily: "Courier New, monospace",
    fill: allyType.color,
    backgroundColor: "#003300",
    padding: { x: 8, y: 4 },
    stroke: "#ffffff",
    strokeThickness: 1
  }).setOrigin(0.5);

  ally.setData({
    word: word,
    wordText: allyWordText,
    type: 'healer',
    benefit: allyType.benefit,
    message: allyType.message,
    matched: false,
    isAlly: true
  });

  this.allyGroup.add(ally);

  const tween = this.tweens.add({
    targets: [ally, allyWordText],
    x: -50,
    duration: 12000,
    ease: 'Linear',
    onComplete: () => {
      ally.destroy();
      allyWordText.destroy();
    }
  });

  ally.setData('tween', tween);
  this.showNotification("A healer comes to your aid!", allyType.color, 2000);
}

// client/src/game/main.js -> in PlayScene
spawnRegularEnemy() {
  const enemyTypeNames = ['minion', 'warrior', 'mage', 'demon'];
  const enemyTypeName = Phaser.Utils.Array.GetRandom(enemyTypeNames);
  const enemyType = enemyTypes[enemyTypeName];

  const currentWords = this.getWordsForLevel(this.gameState.level);
  const word = Phaser.Utils.Array.GetRandom(currentWords);

  // Get the path data for the current level
  const levelPaths = levelData[this.gameState.level]?.paths;
  if (!levelPaths || levelPaths.length === 0) {
    console.error(`No paths found for level ${this.gameState.level}!`);
    return;
  }
  // Select a random path for this enemy to follow
  const path = Phaser.Utils.Array.GetRandom(levelPaths);

  // Create a new Enemy instance
  const enemy = new Enemy(this, path, enemyType, word);

  // Tell the enemy to start moving and define what happens when it finishes
  enemy.startFollow((finishedEnemy) => {
    // This code runs when the enemy reaches the end of its path
    if (!finishedEnemy.getData('matched') && !this.gameState.gameOver) {
      if (!this.gameState.shield) {
        this.loseLife();
        this.createMagicalExplosion(finishedEnemy.x, finishedEnemy.y, '#ff4444', 'miss');
      } else {
        this.gameState.shield = false;
        this.updateStatusDisplay();
        this.showNotification("🛡️ Shield absorbed damage!", '#ffaa00', 1500);
      }
    }
  });
}

  spawnBoss() {
    this.gameState.bossActive = true;
    const bossType = enemyTypes.boss;

    // Get boss line for current level
    const line = this.generateBossSentence(this.gameState.level);

    const startX = 400; // Center spawn for boss
    const startY = -50;

    // Create boss line display first (appears 2 seconds early)
    const bossLineText = this.add.text(startX, startY - 60, line, {
      fontSize: "18px",
      fontFamily: "Courier New, monospace",
      fill: bossType.color,
      backgroundColor: "#000033",
      padding: { x: 12, y: 8 },
      stroke: "#ff0088",
      strokeThickness: 2,
      wordWrap: { width: 400 },
      align: 'center'
    }).setOrigin(0.5).setDepth(2);

    // Create boss sprite after delay
    const boss = this.add.text(startX, startY, bossType.sprite, {
      fontSize: `${48 * bossType.scale}px`
    }).setOrigin(0.5).setDepth(1);

    // Hide boss initially, show after 2 seconds
    boss.setAlpha(0);
    this.time.delayedCall(2000, () => {
      boss.setAlpha(1);
    });

    
    // Store boss data
    boss.setData('word', line);
    boss.setData('wordText', bossLineText);
    boss.setData('hp', bossType.hp);
    boss.setData('maxHp', bossType.hp);
    boss.setData('type', 'boss');
    boss.setData('points', bossType.points);
    boss.setData('matched', false);
    boss.setData('isBoss', true);
    boss.setData('isAlly', false);
    

    this.enemyGroup.add(boss);

    // Dramatic boss entrance
    this.showNotification("🔥 BOSS APPROACHES! 🔥", '#ff0088', 2000);

    // Apply time slow effect if active
    const currentSpeed = this.gameState.timeSlowActive ?
      bossType.speed * 1.8 : bossType.speed;

    // Animate boss descent (slower than regular enemies)
    const tween = this.tweens.add({
      targets: [boss, bossLineText],
      y: `+=${650}`,
      duration: currentSpeed,
      ease: 'Linear',
      onComplete: () => {
        if (!boss.getData('matched') && !this.gameState.gameOver) {
          if (!this.gameState.shield) {
            this.loseLife();
            
            this.createMagicalExplosion(boss.x, boss.y, '#ff0088', 'boss_miss');
          } else {
            this.gameState.shield = false;
            this.updateStatusDisplay();
            this.showNotification("🛡️ Shield absorbed boss damage!", '#ffaa00', 1500);
          }
        }

         this.gameState.bossActive = false;

        if (boss.active) {
          boss.destroy();
        }
        if (bossLineText.active) {
          bossLineText.destroy();
        }
      }
    });

    boss.setData('tween', tween);
  }

  handleKeyInput(event) {
    // Prevent default browser behavior for space and other keys
    if (event.key === ' ' || event.key === 'Enter' || event.key === 'Backspace') {
      event.preventDefault();
    }
    if (this.gameState.gameOver) {
      if (event.key === ' ' || event.key === 'Enter') {
        this.scene.start("MenuScene");
      }
      return;
    }

    if (event.key === "Enter") {
      this.castSpell();
      this.gameState.currentInput = "";
      this.inputDisplay.setText("");
    } else if (event.key === "Backspace") {
      this.gameState.currentInput = this.gameState.currentInput.slice(0, -1);
      this.inputDisplay.setText(this.gameState.currentInput);
    } else if (event.key.length === 1) {
      this.gameState.currentInput += event.key;
      this.inputDisplay.setText(this.gameState.currentInput);
    }
  }

  castSpell() {
    const spellText = this.gameState.currentInput.trim().toLowerCase();
    if (!spellText) return;

    let spellCast = false;
    let allyHelped = false;

    // Check allies first for bonuses
    this.allyGroup.getChildren().forEach((ally) => {
      const allyWord = ally.getData('word').toLowerCase();

      if (allyWord === spellText && !ally.getData('matched')) {
        allyHelped = true;
        spellCast = true;
        this.helpAlly(ally);
      }
    });

    // Then check enemies
    if (!allyHelped) {
      this.enemyGroup.getChildren().forEach((enemy) => {
        const enemyWord = enemy.getData('word').toLowerCase();
        const isBoss = enemy.getData('isBoss');

        if (enemyWord === spellText && !enemy.getData('matched')) {
          spellCast = true;
          const damage = isBoss ? 1 : enemy.getData('hp'); // Bosses take 1 damage per correct spell

          this.damageEnemy(enemy, damage);
        }
      });
    }

    if (spellCast) {
      this.gameState.wordsTyped++;
      this.gameState.correctWords++;
      
      // Track character accuracy - add the length of correctly typed word
      this.gameState.totalCharactersTyped += spellText.length;
      this.gameState.correctCharacters += spellText.length;

      if (!allyHelped) {
        // Increase combo for enemy defeats
        this.gameState.comboCount++;
        this.gameState.comboMultiplier = Math.min(5, Math.floor(this.gameState.comboCount / 3) + 1);
        this.gameState.maxCombo = Math.max(this.gameState.maxCombo, this.gameState.comboCount);
        this.updateComboDisplay();
      }

      this.updateWPM();

      // Flash input with success color
      this.inputDisplay.setStyle({ backgroundColor: '#00aa44' });
      this.time.delayedCall(200, () => {
        this.inputDisplay.setStyle({ backgroundColor: '#2d3436' });
      });
    } else {
      // Track failed word attempt
      this.gameState.wordsTyped++;
      this.gameState.totalCharactersTyped += spellText.length;
      this.gameState.errorCharacters += spellText.length;
      
      // Reset combo on miss
      this.gameState.comboCount = 0;
      this.gameState.comboMultiplier = 1;
      this.updateComboDisplay();

      // Flash input with failure color
      this.inputDisplay.setStyle({ backgroundColor: '#aa0044' });
      this.time.delayedCall(200, () => {
        this.inputDisplay.setStyle({ backgroundColor: '#2d3436' });
      });
    }
  }

  helpAlly(ally) {
    ally.setData('matched', true);

    // Stop movement
    const tween = ally.getData('tween');
    if (tween) {
      tween.stop();
    }

    const benefit = ally.getData('benefit');
    const message = ally.getData('message');

    // Apply ally benefit
    switch (benefit) {
      case 'extra_life':
        this.gameState.lives = Math.min(5, this.gameState.lives + 1);
        this.livesText.setText(`Lives: ${this.gameState.lives}`);
        break;

      case 'combo_multiplier':
        this.gameState.comboMultiplier = Math.min(5, this.gameState.comboMultiplier + 2);
        break;

      case 'time_slow':
        this.activateTimeSlow();
        break;

      case 'shield':
        this.gameState.shield = true;
        break;
    }

    // Show benefit message
    this.showNotification(message, '#00ff88', 2000);
    this.createMagicalExplosion(ally.x, ally.y, '#00ff88', 'ally_help');

    // Destroy ally with magical effect
    const wordText = ally.getData('wordText');

    this.tweens.add({
      targets: [ally, wordText],
      alpha: 0,
      scale: 1.3,
      y: ally.y - 50,
      duration: 800,
      ease: 'Back.easeOut',
      onComplete: () => {
        ally.destroy();
        wordText.destroy();
      }
    });

    this.updateStatusDisplay();
  }

  activateTimeSlow() {
    if (this.gameState.timeSlowActive) return;

    this.gameState.timeSlowActive = true;

    // Slow down all existing enemies
    this.enemyGroup.getChildren().forEach((enemy) => {
      const tween = enemy.getData('tween');
      if (tween && tween.isPlaying()) {
        const progress = tween.progress;
        tween.stop();

        // Create new slower tween
        const wordText = enemy.getData('wordText');
        const remainingDistance = (1 - progress) * 650;
        const newTween = this.tweens.add({
          targets: [enemy, wordText],
          y: `+=${remainingDistance}`,
          duration: (1 - progress) * this.gameState.enemySpeed * 1.8,
          ease: 'Linear',
          onComplete: tween.onComplete
        });
        enemy.setData('tween', newTween);
      }
    });

    // Auto-disable after 8 seconds
    this.time.delayedCall(8000, () => {
      this.gameState.timeSlowActive = false;
      this.updateStatusDisplay();
    });
  }

  updateComboDisplay() {
    this.comboText.setText(`Combo: x${this.gameState.comboMultiplier}`);

    // Add combo visual effect
    if (this.gameState.comboMultiplier > 1) {
      this.tweens.add({
        targets: this.comboText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 150,
        yoyo: true,
        ease: 'Back.easeOut'
      });
    }
  }

  updateStatusDisplay() {
    let statusText = "";

    if (this.gameState.shield) {
      statusText += "🛡️ Shield Active ";
    }

    if (this.gameState.timeSlowActive) {
      statusText += "⏰ Time Slowed ";
    }

    this.statusText.setText(statusText);
  }

  damageEnemy(enemy, damage) {
    const currentHp = enemy.getData('hp');
    const newHp = currentHp - damage;
    const isBoss = enemy.getData('isBoss');

    enemy.setData('hp', newHp);

    

    if (newHp <= 0) {
      // Enemy defeated!
      enemy.setData('matched', true);

      // Stop movement
      const tween = enemy.getData('tween');
      if (tween) {
        tween.stop();
        const wordText = enemy.getData('wordText');
        wordText.setText('');  
      }

      // Destroy enemy with magical effect
      const points = enemy.getData('points') * this.gameState.comboMultiplier;
      this.updateScore(points);

      if (isBoss) {
        this.gameState.bossActive = false;
        this.gameState.enemiesKilled = 0;
        this.createMagicalExplosion(enemy.x, enemy.y, '#ffaa00', 'boss_death');
        this.showNotification("🎉 BOSS DEFEATED! 🎉", '#ffaa00', 1500);

        // Clean up boss UI elements
        
      } else {
        this.gameState.enemiesKilled++;
        this.createMagicalExplosion(enemy.x, enemy.y, '#00ff88', 'enemy_death');
      }

      // Show combo bonus if active
      if (this.gameState.comboMultiplier > 1) {
        this.showNotification(`${points} pts (x${this.gameState.comboMultiplier} combo!)`, '#ffaa00', 1000);
      }

      // Destroy enemy and word text
      const wordText = enemy.getData('wordText');

      this.tweens.add({
        targets: [enemy, wordText],
        alpha: 0,
        scale: 1.5,
        duration: 300,
        onComplete: () => {
          enemy.destroy();
          wordText.destroy();
        }
      });

    } else if (isBoss) {
      // Boss took damage but not defeated - animate knockback and respawn
      this.createMagicalExplosion(enemy.x, enemy.y, '#ff4444', 'boss_hit');
      this.showNotification(`Boss HP: ${newHp}/${enemy.getData('maxHp')}`, '#ff0088', 1000);

      // Prevent player from hitting the boss again while it's retreating
      enemy.setData('matched', true);
      // Stop current movement
      const tween = enemy.getData('tween');
      if (tween) {
        tween.stop();
      }

      const wordText = enemy.getData('wordText');
      // Hide the old text instead of clearing it
      wordText.setAlpha(0);

      // Animate boss getting knocked back up
      this.tweens.add({
        targets: [enemy, wordText], // Animate both together to keep them in sync
        y: -100, // Move back to the top of the screen
        duration: 1500,
        ease: 'Back.easeOut',
        onComplete: () => {
          // Give a new sentence
          const newLine = this.generateBossSentence(this.gameState.level);

          enemy.setData('word', newLine);
          wordText.setText(newLine);
          // Make the new text visible
          wordText.setAlpha(1);
          // Allow the player to type the new sentence
          enemy.setData('matched', false);

          // Start falling again
          const newTween = this.tweens.add({
            targets: [enemy, wordText],
            y: `+=${700}`, // Fall from the new position
            duration: enemyTypes.boss.speed,
            ease: 'Linear',
            onComplete: () => {
              if (!enemy.getData('matched') && !this.gameState.gameOver) {
                if (!this.gameState.shield) {
                  this.loseLife();
                  this.loseLife();
                  this.createMagicalExplosion(enemy.x, enemy.y, '#ff0088', 'boss_miss');
                } else {
                  this.gameState.shield = false;
                  this.updateStatusDisplay();
                  this.showNotification("🛡️ Shield absorbed boss damage!", '#ffaa00', 1500);
                }
              }
              this.gameState.bossActive = false;
              enemy.destroy();
              wordText.destroy();
            }
          });
          enemy.setData('tween', newTween);
        }
      });
      // --- END OF FIX ---

      return; // Don't continue to normal enemy destruction
    }
     else if (!isBoss) {
      // Regular enemy took damage but not defeated
      this.createMagicalExplosion(enemy.x, enemy.y, '#ffaa00', 'hit');
    }

    this.updateBossProgress();
  }

  createMagicalExplosion(x, y, color, type) {
    const colorValue = Phaser.Display.Color.HexStringToColor(color).color;

    // Different particle effects for different events
    switch (type) {
      case 'boss_death':
        this.hitParticles.setPosition(x, y);
        this.hitParticles.setConfig({
          tint: colorValue,
          speed: { min: 150, max: 300 },
          quantity: 20,
          lifespan: 1500
        });
        this.hitParticles.explode(20);

        this.magicParticles.setPosition(x, y);
        this.magicParticles.explode(15);
        break;

      case 'boss_hit':
        this.magicParticles.setPosition(x, y);
        this.magicParticles.setConfig({
          tint: colorValue,
          quantity: 8
        });
        this.magicParticles.explode(8);
        break;

      case 'ally_help':
        this.magicParticles.setPosition(x, y);
        this.magicParticles.setConfig({
          tint: colorValue,
          speed: { min: 80, max: 150 },
          quantity: 12,
          lifespan: 1500
        });
        this.magicParticles.explode(12);
        break;

      default:
        this.hitParticles.setPosition(x, y);
        this.hitParticles.setConfig({
          tint: colorValue,
          speed: { min: 100, max: 200 },
          quantity: 8
        });
        this.hitParticles.explode(8);
    }
  }

  updateScore(points) {
    this.gameState.score += points;
    this.scoreText.setText(`Score: ${this.gameState.score}`);

    // Check for level up
    const newLevel = Math.floor(this.gameState.score / 600) + 1; // Slower level progression
    if (newLevel > this.gameState.level && newLevel <= 5) {
      this.levelUp(newLevel);
    }
  }

  updateWPM() {
    const timeElapsed = (Date.now() - this.gameState.startTime) / 60000; // minutes
    if (timeElapsed < 0.0167) return; // Wait at least 1 second before calculating
    
    // Standard WPM calculation: (characters typed / 5) / minutes
    const grossWPM = Math.round((this.gameState.totalCharactersTyped / 5) / timeElapsed) || 0;
    const netWPM = Math.round(((this.gameState.totalCharactersTyped - this.gameState.errorCharacters) / 5) / timeElapsed) || 0;
    
    // Use net WPM for display (more accurate for typing tests)
    const displayWPM = Math.max(0, netWPM);
    this.wpmText.setText(`WPM: ${displayWPM}`);
    
    // Store current WPM for game session tracking
    this.gameState.currentWPM = displayWPM;
  }

  updateBossProgress() {
    const remaining = this.gameState.enemiesPerBoss - this.gameState.enemiesKilled;
    if (remaining > 0 && !this.gameState.bossActive) {
      this.bossProgressText.setText(`⚔️ ${remaining} enemies until boss appears`);
    } else if (this.gameState.bossActive) {
      this.bossProgressText.setText("🔥 BOSS BATTLE 🔥");
    } else {
      this.bossProgressText.setText("");
    }
  }

  levelUp(newLevel) {
    this.gameState.level = newLevel;
    this.levelText.setText(`Level: ${this.gameState.level}`);
    this.backgroundManager.updateBackground(newLevel);

    // Increase difficulty more gradually
    this.gameState.enemySpeed = Math.max(2500, 4200 - (this.gameState.level * 300));
    this.gameState.spawnRate = Math.max(1800, 2700 - (this.gameState.level * 150));

    // Increase ally spawn chance slightly each level
    this.gameState.allySpawnChance = Math.min(0.25, 0.15 + (this.gameState.level * 0.02));

    // Update spawn timer
    this.enemyTimer.delay = this.gameState.spawnRate;

    // Show level up with magical effect
    this.showNotification(`🌟 Level ${this.gameState.level}! 🌟`, '#ffaa00', 2000);
    this.gameState.healerSpawnedThisLevel = false;

    // Reset boss progress for new level
    this.gameState.enemiesKilled = 0;
    this.updateBossProgress();
  }

  loseLife() {
    this.gameState.lives--;
    this.livesText.setText(`Lives: ${this.gameState.lives}`);

    // Spawn a healer if one hasn't been spawned this level
  if (this.gameState.lives > 0 && !this.gameState.healerSpawnedThisLevel) {
    this.spawnHealerAlly();
    this.gameState.healerSpawnedThisLevel = true;
  }

    // Reset combo on life lost
    this.gameState.comboCount = 0;
    this.gameState.comboMultiplier = 1;
    this.updateComboDisplay();

    if (this.gameState.lives <= 0) {
      this.gameOver();
    } else {
      this.cameras.main.shake(400, 0.03);
      this.showNotification('💀 Life Lost! 💀', '#ff4444', 1000);
    }
  }

  gameOver() {
    this.gameState.gameOver = true;

    // Stop spawning
    if (this.enemyTimer) {
      this.enemyTimer.remove();
    }
    if (this.allyTimer) {
      this.allyTimer.remove();
    }

    // Clear remaining enemies and allies
    this.enemyGroup.clear(true, true);
    this.allyGroup.clear(true, true);

    // Trigger game session save if callback exists
    if (this.onGameComplete) {
      const gameSessionData = this.getGameSessionData();
      this.onGameComplete(gameSessionData);
    }

    this.showGameOverScreen();
  }

  getGameSessionData() {
    const timeElapsed = (Date.now() - this.gameState.startTime) / 1000;
    const timeElapsedMinutes = timeElapsed / 60;
    
    const finalWPM = timeElapsedMinutes > 0 ? 
      Math.round(((this.gameState.totalCharactersTyped - this.gameState.errorCharacters) / 5) / timeElapsedMinutes) : 0;
    
    const charAccuracy = this.gameState.totalCharactersTyped > 0 ?
      Math.round((this.gameState.correctCharacters / this.gameState.totalCharactersTyped) * 100) : 0;

    return {
      score: this.gameState.score,
      levelReached: this.gameState.level,
      wpm: Math.max(0, finalWPM),
      accuracy: Math.max(0, charAccuracy),
      wordsTyped: this.gameState.totalCharactersTyped,
      durationSeconds: Math.round(timeElapsed),
      gameMode: 'normal',
      gameStats: {
        enemiesDefeated: this.gameState.correctWords,
        bossesDefeated: Math.floor(this.gameState.level - 1), // Approximate based on level
        alliesHelped: this.allyGroup.children.entries.filter(ally => ally.getData('matched')).length || 0,
        livesLost: 3 - this.gameState.lives
      }
    };
  }

  showGameOverScreen() {
    // Dramatic overlay
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.85);

    // Game over title
    this.add.text(400, 120, 'QUEST FAILED', {
      fontSize: '64px',
      fontFamily: 'Courier New, monospace',
      fill: '#ff4444',
      stroke: '#000033',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Final stats
    const timeElapsed = (Date.now() - this.gameState.startTime) / 1000;
    const timeElapsedMinutes = timeElapsed / 60;
    
    // Use proper WPM calculation: (correct characters / 5) / minutes
    const finalWPM = timeElapsedMinutes > 0 ? 
      Math.round(((this.gameState.totalCharactersTyped - this.gameState.errorCharacters) / 5) / timeElapsedMinutes) : 0;
    
    // Calculate both word accuracy and character accuracy
    const wordAccuracy = this.gameState.wordsTyped > 0 ?
      Math.round((this.gameState.correctWords / this.gameState.wordsTyped) * 100) : 0;
    const charAccuracy = this.gameState.totalCharactersTyped > 0 ?
      Math.round((this.gameState.correctCharacters / this.gameState.totalCharactersTyped) * 100) : 0;

    const statsText = [
      `🏆 Final Score: ${this.gameState.score}`,
      `⭐ Level Reached: ${this.gameState.level}`,
      `⚔️ Enemies Defeated: ${this.gameState.correctWords}`,
      `⚡ Final WPM: ${finalWPM}`,
      `🎯 Accuracy: ${charAccuracy}%`,
      `🔥 Max Combo: x${this.gameState.maxCombo}`,
      `⏱️ Quest Duration: ${Math.round(timeElapsed)}s`
    ].join('\n');

    this.add.text(400, 320, statsText, {
      fontSize: '18px',
      fontFamily: 'Courier New, monospace',
      fill: '#ffffff',
      align: 'center',
      lineSpacing: 10
    }).setOrigin(0.5);

    // Restart instruction
    this.add.text(400, 480, 'Press SPACE or ENTER to return to the mystical realm', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#a8e6cf',
      fontStyle: 'italic'
    }).setOrigin(0.5);
  }

  showNotification(text, color, duration = 1500) {
    const notification = this.add.text(400, 200, text, {
      fontSize: '28px',
      fontFamily: 'Courier New, monospace',
      fill: color,
      stroke: '#000033',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.tweens.add({
      targets: notification,
      y: notification.y - 30,
      alpha: 0,
      duration: duration,
      ease: 'Power2',
      onComplete: () => notification.destroy()
    });
  }

  update() {
    // Update WPM and status displays periodically
    if (!this.gameState.gameOver) {
      this.updateWPM();
      this.updateStatusDisplay();
    }
  }
}

// Game configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#1a0a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [MenuScene, PlayScene]
};

// Initialize game when DOM is ready
let game = null;

export function initializeGame(parentElement, onGameComplete) {
  if (game) {
    game.destroy(true);
  }

  const gameConfig = {
    ...config,
    parent: parentElement
  };

  game = new Phaser.Game(gameConfig);
  
  // Set the game complete callback on the PlayScene
  if (onGameComplete) {
    game.events.on('ready', () => {
      const playScene = game.scene.getScene('PlayScene');
      if (playScene) {
        playScene.onGameComplete = onGameComplete;
      }
    });
  }
  
  return game;
}

export function destroyGame() {
  if (game) {
    game.destroy(true);
    game = null;
  }
}
