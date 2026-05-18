import Phaser from "phaser";

export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player-sword');
    
    this.scene = scene;
    this.setScale(1.5);
    this.setDepth(10); 
    
    scene.add.existing(this);
    
    // Set to idle stance (first frame of walk-up = facing up)
    this.setFrame(192); // Row 8, col 0 of player-sword.png (walk-up idle)
    
    this.currentWeapon = 'sword'; 
    this.slashRadius = 250; 
  }

  playIntroSequence(onComplete) {
    this.setPosition(400, 700); 
    this.play('walk-up');
    
    this.scene.tweens.add({
      targets: this,
      y: 520,
      duration: 2000,
      ease: 'Linear',
      onComplete: () => {
        this.stop(); 
        // Return to sword idle stance
        this.setTexture('player-sword');
        this.setFrame(192);
        if (onComplete) onComplete();
      }
    });
  }

  /**
   * Plays a level transition: player walks off the top of the screen,
   * then walks back in from the bottom to their battle position.
   * @param {function} onExitComplete Called when the player has walked off-screen (time to change bg)
   * @param {function} onEntryComplete Called when the player is back in position
   */
  playLevelTransition(onExitComplete, onEntryComplete) {
    // Ensure we're on the sword texture for walking
    this.setTexture('player-sword');
    // Phase 1: Walk off the top of the screen
    this.play('walk-up');
    
    this.scene.tweens.add({
      targets: this,
      y: -80,
      duration: 1200,
      ease: 'Linear',
      onComplete: () => {
        this.stop();
        // Signal that the player is off-screen — time to change background
        if (onExitComplete) onExitComplete();

        // Phase 2: Reposition at bottom and walk back up
        this.setPosition(400, 700);
        this.play('walk-up');
        
        this.scene.tweens.add({
          targets: this,
          y: 520,
          duration: 1500,
          ease: 'Linear',
          onComplete: () => {
            this.stop();
            this.setFrame(192); // Idle stance
            if (onEntryComplete) onEntryComplete();
          }
        });
      }
    });
  }

  attack(targetX, targetY) {
    const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);

    // If close -> Slash with sword. If far -> Shoot bow.
    if (dist < this.slashRadius) {
      this.slash();
      return 'slash';
    } else {
      this.shootBow();
      return 'bow';
    }
  }

  slash() {
    // Ensure we're on the sword texture for the slash animation
    this.setTexture('player-sword');
    this.play('slash-up', true);
    this.once('animationcomplete', () => {
      // Return to sword idle stance
      this.setTexture('player-sword');
      this.setFrame(192);
    });
  }

  shootBow() {
    // Switch to bow texture for the bow animation
    this.setTexture('player-bow');
    this.play('bow-shoot-up', true);
    this.once('animationcomplete', () => {
      // Return to sword idle stance after shooting
      this.setTexture('player-sword');
      this.setFrame(192);
    });
  }
}