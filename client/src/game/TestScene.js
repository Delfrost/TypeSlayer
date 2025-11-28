import Phaser from "phaser";

export class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: "TestScene" });
  }

  preload() {
    // Load the 3 files. 
    // IMPORTANT: Ensure these files are actually inside client/public/assets/
    // and that they are truly .png files (even if you uploaded jpgs here).
    this.load.spritesheet('player-sword', '/assets/player-sword.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    
    this.load.spritesheet('player-bow', '/assets/bow-shooting.png', {
      frameWidth: 64,
      frameHeight: 64
    });

    this.load.spritesheet('villain', '/assets/villian.png', {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    // --- INSTRUCTIONS ---
    this.add.text(20, 20, "Sprite Inspector Mode", { fontSize: '24px', fill: '#00ff88' });
    this.add.text(20, 50, "Press LEFT/RIGHT to change Frame", { fontSize: '16px', fill: '#ffffff' });
    this.add.text(20, 70, "Press 1, 2, 3 to switch Character", { fontSize: '16px', fill: '#ffffff' });

    // --- SETUP VARIABLES ---
    this.currentSpriteIndex = 1; // 1=Sword, 2=Bow, 3=Villain
    this.currentFrame = 0;
    
    // Create the sprites (center screen, scaled up so you can see)
    this.swordChar = this.add.sprite(400, 300, 'player-sword', 0).setScale(4);
    this.bowChar = this.add.sprite(400, 300, 'player-bow', 0).setScale(4).setVisible(false);
    this.villainChar = this.add.sprite(400, 300, 'villain', 0).setScale(4).setVisible(false);

    // Text to show current frame number
    this.infoText = this.add.text(400, 450, "Frame: 0", { 
      fontSize: '32px', 
      fill: '#ffff00', 
      backgroundColor: '#000000' 
    }).setOrigin(0.5);

    // --- INPUTS ---
    this.input.keyboard.on('keydown-RIGHT', () => {
      this.changeFrame(1);
    });

    this.input.keyboard.on('keydown-LEFT', () => {
      this.changeFrame(-1);
    });

    // Switch Characters
    this.input.keyboard.on('keydown-ONE', () => this.switchChar(1));
    this.input.keyboard.on('keydown-TWO', () => this.switchChar(2));
    this.input.keyboard.on('keydown-THREE', () => this.switchChar(3));
  }

  changeFrame(delta) {
    this.currentFrame += delta;
    if (this.currentFrame < 0) this.currentFrame = 0;

    // Update the active character
    this.getActiveChar().setFrame(this.currentFrame);
    
    // Update text
    this.infoText.setText(`Frame: ${this.currentFrame}`);
    console.log(`Current Character: ${this.getCharName()} | Frame: ${this.currentFrame}`);
  }

  switchChar(index) {
    this.currentSpriteIndex = index;
    this.currentFrame = 0; // Reset frame to 0 for new char

    // Hide all
    this.swordChar.setVisible(false);
    this.bowChar.setVisible(false);
    this.villainChar.setVisible(false);

    // Show active and reset frame
    const active = this.getActiveChar();
    active.setVisible(true);
    active.setFrame(0);
    
    this.infoText.setText(`Frame: 0`);
  }

  getActiveChar() {
    if (this.currentSpriteIndex === 1) return this.swordChar;
    if (this.currentSpriteIndex === 2) return this.bowChar;
    return this.villainChar;
  }

  getCharName() {
    if (this.currentSpriteIndex === 1) return 'Player Sword';
    if (this.currentSpriteIndex === 2) return 'Player Bow';
    return 'Villain';
  }
}