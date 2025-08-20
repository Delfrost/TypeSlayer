import Phaser from "phaser";

// Words by difficulty level for regular enemies
const enemyWordsByLevel = {
  1: ["fire", "ice", "wind", "bolt", "heal", "ward", "mana", "cast"],
  2: ["blaze", "frost", "storm", "shock", "light", "shield", "magic", "power"],
  3: ["inferno", "blizzard", "tempest", "lightning", "radiance", "barrier", "sorcery", "enchant"],
  4: ["pyroblast", "absolute", "hurricane", "thunderbolt", "sanctuary", "mysticism", "spellbound"],
  5: ["cataclysm", "devastation", "apocalypse", "annihilation", "transcendence", "omnipotence", "metamorphosis"]
};

// Boss sentences/incantations by level
const bossLinesByLevel = {
  1: [
    "The shadows whisper your name",
    "Fire burns in the darkness",
    "Ancient magic flows through me"
  ],
  2: [
    "By the power of forgotten realms I strike",
    "Thunder roars across the mystical plains",
    "Ice and fire dance in eternal combat"
  ],
  3: [
    "Behold the fury of a thousand burning stars",
    "The very fabric of reality bends to my will",
    "From the depths of chaos I summon destruction"
  ],
  4: [
    "Witness the convergence of all elemental forces",
    "Time itself trembles before my ancient power",
    "The cosmos shall bow before my supreme authority"
  ],
  5: [
    "I am the alpha and omega of all magical existence",
    "Reality is but a canvas upon which I paint destruction",
    "The universe itself is merely my weapon to wield against you"
  ]
};

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
    hp: 5,
    speed: 7000, // Increased from 6000
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

  create() {
    // Dark magical background with gradient
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x1a0a2e, 0x16213e, 0x0f3460, 0x533483);
    graphics.fillRect(0, 0, 800, 600);
    
    // Create mystical background particles
    this.createMagicalBackground();

    // Title with magical glow effect
    const title = this.add.text(400, 100, "TypeSlayer", {
      fontSize: "80px",
      fontFamily: "Courier New, monospace",
      color: "#ff6b9d",
      stroke: "#000033",
      strokeThickness: 6
    }).setOrigin(0.5);

    // Magical glow animation
    this.tweens.add({
      targets: title,
      alpha: 0.8,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Subtitle with typing animation effect
    this.typeText(400, 180, "Defend the Realm with Your Typing Magic", {
      fontSize: "24px",
      fontFamily: "Arial",
      color: "#a8e6cf",
    }, 50);

    // Game mechanics explanation
    const mechanicsTitle = this.add.text(400, 250, "How to Cast Spells:", {
      fontSize: "20px",
      fontFamily: "Arial",
      color: "#ffd93d",
      fontStyle: "bold"
    }).setOrigin(0.5);

    const instructions = [
      "⚔️ Type words to defeat regular enemies",
      "🔥 Type complete sentences to defeat bosses", 
      "🧙‍♀️ Help friendly allies for special bonuses",
      "🎯 Higher levels = harder words & longer sentences",
      "💀 Don't let enemies reach the bottom!"
    ];

    instructions.forEach((instruction, index) => {
      this.add.text(400, 290 + (index * 25), instruction, {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#ffffff",
      }).setOrigin(0.5);
    });

    // Start Button with magical styling
    const startButton = this.add.text(400, 460, "🌟 Begin Quest 🌟", {
      fontSize: "28px",
      fontFamily: "Courier New, monospace",
      backgroundColor: "#6c5ce7",
      color: "#ffffff",
      padding: { x: 25, y: 12 },
      borderRadius: 10
    }).setOrigin(0.5).setInteractive();

    // Magical button hover effects
    startButton.on("pointerover", () => {
      startButton.setStyle({ backgroundColor: "#a29bfe", color: "#2d3436" });
      this.tweens.add({
        targets: startButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        ease: 'Back.easeOut'
      });
    });

    startButton.on("pointerout", () => {
      startButton.setStyle({ backgroundColor: "#6c5ce7", color: "#ffffff" });
      this.tweens.add({
        targets: startButton,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2'
      });
    });

    startButton.on("pointerdown", () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start("PlayScene");
      });
    });

    // Level preview
    this.add.text(400, 530, "5 Levels • Slower Enemies • Friendly Allies • Epic Boss Battles", {
      fontSize: "14px",
      fontFamily: "Arial", 
      color: "#b2bec3",
      fontStyle: "italic"
    }).setOrigin(0.5);
  }

  typeText(x, y, text, style, speed) {
    let displayText = "";
    const textObject = this.add.text(x, y, "", style).setOrigin(0.5);
    
    for (let i = 0; i < text.length; i++) {
      this.time.delayedCall(speed * i, () => {
        displayText += text[i];
        textObject.setText(displayText);
      });
    }
  }

  createMagicalBackground() {
    // Create floating magical symbols
    const symbols = ["✦", "⋄", "☆", "◇", "○", "△", "♦", "⚡"];
    
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(50, 750);
      const y = Phaser.Math.Between(50, 550);
      const symbol = Phaser.Utils.Array.GetRandom(symbols);
      
      const particle = this.add.text(x, y, symbol, {
        fontSize: Phaser.Math.Between(12, 20) + "px",
        color: Phaser.Utils.Array.GetRandom(["#6c5ce7", "#a29bfe", "#fd79a8", "#fdcb6e"]),
        alpha: Phaser.Math.Between(20, 60) / 100
      });

      this.tweens.add({
        targets: particle,
        y: y - Phaser.Math.Between(100, 200),
        alpha: 0,
        rotation: Phaser.Math.Between(-180, 180),
        duration: Phaser.Math.Between(4000, 8000),
        delay: Phaser.Math.Between(0, 3000),
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }
}

class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayScene" });
  }

  preload() {
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
      allySpawnChance: 0.15 // 15% chance for ally to spawn
    };

    // Create mystical background
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x1a0a2e, 0x16213e, 0x0f3460, 0x533483);
    graphics.fillRect(0, 0, 800, 600);

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
    if (this.gameState.gameOver) return;

    // Check if it's time for a boss
    if (this.gameState.enemiesKilled >= this.gameState.enemiesPerBoss && !this.gameState.bossActive) {
      this.spawnBoss();
      return;
    }

    // Spawn regular enemy with word
    this.spawnRegularEnemy();
  }

  trySpawnAlly() {
    if (this.gameState.gameOver || Math.random() > this.gameState.allySpawnChance) return;

    // Don't spawn ally if there are too many entities on screen
    if (this.allyGroup.getLength() >= 1) return;

    this.spawnAlly();
  }

  spawnAlly() {
    const allyTypeNames = Object.keys(allyTypes);
    const allyTypeName = Phaser.Utils.Array.GetRandom(allyTypeNames);
    const allyType = allyTypes[allyTypeName];

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
    const wordText = this.add.text(startX, startY - 40, word, {
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
    ally.setData('wordText', wordText);
    ally.setData('type', allyTypeName);
    ally.setData('benefit', allyType.benefit);
    ally.setData('message', allyType.message);
    ally.setData('matched', false);
    ally.setData('isAlly', true);

    this.allyGroup.add(ally);

    // Animate ally movement (slower horizontal movement)
    const tween = this.tweens.add({
      targets: [ally, wordText],
      x: -50, // Move left across screen
      duration: 12000, // 12 seconds to cross
      ease: 'Linear',
      onComplete: () => {
        ally.destroy();
        wordText.destroy();
      }
    });

    ally.setData('tween', tween);
    wordText.setData('tween', tween);

    // Show ally notification
    this.showNotification("🧙‍♀️ Friendly ally appeared! 🧙‍♀️", allyType.color, 2000);
  }

  spawnRegularEnemy() {
    const enemyTypeNames = ['minion', 'warrior', 'mage', 'demon'];
    const enemyTypeName = Phaser.Utils.Array.GetRandom(enemyTypeNames);
    const enemyType = enemyTypes[enemyTypeName];

    // Get word for current level
    const currentWords = enemyWordsByLevel[Math.min(this.gameState.level, 5)] || enemyWordsByLevel[1];
    const word = Phaser.Utils.Array.GetRandom(currentWords);

    const startX = Phaser.Math.Between(80, 720);
    const startY = -50;

    // Create enemy with magical appearance
    const enemy = this.add.text(startX, startY, enemyType.sprite, {
      fontSize: `${32 * enemyType.scale}px`
    }).setOrigin(0.5);

    // Create word display above enemy
    const wordText = this.add.text(startX, startY - 40, word, {
      fontSize: "20px",
      fontFamily: "Courier New, monospace",
      fill: enemyType.color,
      backgroundColor: "#000033",
      padding: { x: 8, y: 4 },
      stroke: "#ffffff",
      strokeThickness: 1
    }).setOrigin(0.5);

    // Store enemy data
    enemy.setData('word', word);
    enemy.setData('wordText', wordText);
    enemy.setData('hp', enemyType.hp);
    enemy.setData('maxHp', enemyType.hp);
    enemy.setData('type', enemyTypeName);
    enemy.setData('points', enemyType.points);
    enemy.setData('matched', false);
    enemy.setData('isBoss', false);
    enemy.setData('isAlly', false);

    this.enemyGroup.add(enemy);

    // Apply time slow effect if active
    const currentSpeed = this.gameState.timeSlowActive ? 
      this.gameState.enemySpeed * 1.8 : this.gameState.enemySpeed;

    // Animate enemy descent with magical trail
    const tween = this.tweens.add({
      targets: [enemy, wordText],
      y: `+=${650}`,
      duration: currentSpeed,
      ease: 'Linear',
      onComplete: () => {
        if (!enemy.getData('matched') && !this.gameState.gameOver) {
          if (!this.gameState.shield) {
            this.loseLife();
            this.createMagicalExplosion(enemy.x, enemy.y, '#ff4444', 'miss');
          } else {
            this.gameState.shield = false;
            this.updateStatusDisplay();
            this.showNotification("🛡️ Shield absorbed damage!", '#ffaa00', 1500);
          }
        }
        enemy.destroy();
        wordText.destroy();
      }
    });

    enemy.setData('tween', tween);
    wordText.setData('tween', tween);
  }

  spawnBoss() {
    this.gameState.bossActive = true;
    const bossType = enemyTypes.boss;

    // Get boss line for current level
    const currentLines = bossLinesByLevel[Math.min(this.gameState.level, 5)] || bossLinesByLevel[1];
    const line = Phaser.Utils.Array.GetRandom(currentLines);

    const startX = 400; // Center spawn for boss
    const startY = -50;

    // Create boss with dramatic appearance
    const boss = this.add.text(startX, startY, bossType.sprite, {
      fontSize: `${48 * bossType.scale}px`
    }).setOrigin(0.5);

    // Create boss line display with dramatic styling
    const lineText = this.add.text(startX, startY - 60, line, {
      fontSize: "18px",
      fontFamily: "Courier New, monospace",
      fill: bossType.color,
      backgroundColor: "#000033",
      padding: { x: 12, y: 8 },
      stroke: "#ff0088",
      strokeThickness: 2,
      wordWrap: { width: 400 },
      align: 'center'
    }).setOrigin(0.5);

    // Boss health bar
    const healthBarBg = this.add.rectangle(startX, startY - 100, 200, 12, 0x330000).setOrigin(0.5);
    const healthBar = this.add.rectangle(startX, startY - 100, 200, 10, 0xff0088).setOrigin(0.5);

    // Store boss data
    boss.setData('word', line);
    boss.setData('wordText', lineText);
    boss.setData('hp', bossType.hp);
    boss.setData('maxHp', bossType.hp);
    boss.setData('type', 'boss');
    boss.setData('points', bossType.points);
    boss.setData('matched', false);
    boss.setData('isBoss', true);
    boss.setData('isAlly', false);
    boss.setData('healthBar', healthBar);
    boss.setData('healthBarBg', healthBarBg);

    this.enemyGroup.add(boss);

    // Dramatic boss entrance
    this.showNotification("🔥 BOSS APPROACHES! 🔥", '#ff0088', 2000);

    // Apply time slow effect if active
    const currentSpeed = this.gameState.timeSlowActive ? 
      bossType.speed * 1.8 : bossType.speed;

    // Animate boss descent (slower than regular enemies)
    const tween = this.tweens.add({
      targets: [boss, lineText, healthBarBg, healthBar],
      y: `+=${650}`,
      duration: currentSpeed,
      ease: 'Linear',
      onComplete: () => {
        if (!boss.getData('matched') && !this.gameState.gameOver) {
          if (!this.gameState.shield) {
            this.loseLife();
            this.loseLife(); // Bosses cost 2 lives if they reach bottom
            this.createMagicalExplosion(boss.x, boss.y, '#ff0088', 'boss_miss');
          } else {
            this.gameState.shield = false;
            this.updateStatusDisplay();
            this.showNotification("🛡️ Shield absorbed boss damage!", '#ffaa00', 1500);
          }
        }
        this.gameState.bossActive = false;
        boss.destroy();
        lineText.destroy();
        healthBarBg.destroy();
        healthBar.destroy();
      }
    });

    boss.setData('tween', tween);
  }

  handleKeyInput(event) {
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

    if (isBoss) {
      // Update boss health bar
      const healthBar = enemy.getData('healthBar');
      const maxHp = enemy.getData('maxHp');
      const healthPercentage = Math.max(0, newHp / maxHp);
      healthBar.scaleX = healthPercentage;
      
      // Boss damage effect
      this.createMagicalExplosion(enemy.x, enemy.y, '#ff0088', 'boss_hit');
    }

    if (newHp <= 0) {
      // Enemy defeated!
      enemy.setData('matched', true);
      
      // Stop movement
      const tween = enemy.getData('tween');
      if (tween) {
        tween.stop();
      }

      // Destroy enemy with magical effect
      const points = enemy.getData('points') * this.gameState.comboMultiplier;
      this.updateScore(points);
      
      if (isBoss) {
        this.gameState.bossActive = false;
        this.gameState.enemiesKilled = 0; // Reset counter after boss
        this.createMagicalExplosion(enemy.x, enemy.y, '#ffaa00', 'boss_death');
        this.showNotification("🎉 BOSS DEFEATED! 🎉", '#ffaa00', 1500);
        
        // Clean up boss UI elements
        const healthBar = enemy.getData('healthBar');
        const healthBarBg = enemy.getData('healthBarBg');
        if (healthBar) healthBar.destroy();
        if (healthBarBg) healthBarBg.destroy();
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
    } else if (!isBoss) {
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
    const timeElapsed = (Date.now() - this.gameState.startTime) / 60000;
    const wpm = Math.round(this.gameState.correctWords / timeElapsed) || 0;
    this.wpmText.setText(`WPM: ${wpm}`);
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

    // Increase difficulty more gradually
    this.gameState.enemySpeed = Math.max(2500, 4200 - (this.gameState.level * 300));
    this.gameState.spawnRate = Math.max(1800, 2700 - (this.gameState.level * 150));

    // Increase ally spawn chance slightly each level
    this.gameState.allySpawnChance = Math.min(0.25, 0.15 + (this.gameState.level * 0.02));

    // Update spawn timer
    this.enemyTimer.delay = this.gameState.spawnRate;

    // Show level up with magical effect
    this.showNotification(`🌟 Level ${this.gameState.level}! 🌟`, '#ffaa00', 2000);
    
    // Reset boss progress for new level
    this.gameState.enemiesKilled = 0;
    this.updateBossProgress();
  }

  loseLife() {
    this.gameState.lives--;
    this.livesText.setText(`Lives: ${this.gameState.lives}`);

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

    this.showGameOverScreen();
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
    const finalWPM = Math.round((this.gameState.correctWords / (timeElapsed / 60))) || 0;
    const accuracy = this.gameState.wordsTyped > 0 ? 
      Math.round((this.gameState.correctWords / this.gameState.wordsTyped) * 100) : 0;

    const statsText = [
      `🏆 Final Score: ${this.gameState.score}`,
      `⭐ Level Reached: ${this.gameState.level}`,
      `⚔️ Enemies Defeated: ${this.gameState.correctWords}`,
      `⚡ Final WPM: ${finalWPM}`,
      `🎯 Accuracy: ${accuracy}%`,
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

export function initializeGame(parentElement) {
  if (game) {
    game.destroy(true);
  }
  
  const gameConfig = {
    ...config,
    parent: parentElement
  };
  
  game = new Phaser.Game(gameConfig);
  return game;
}

export function destroyGame() {
  if (game) {
    game.destroy(true);
    game = null;
  }
}