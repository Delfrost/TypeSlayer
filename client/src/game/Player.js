import Phaser from "phaser";

export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player-sword');
    
    this.scene = scene;
    this.setScale(1.5); // [Fixed] Smaller size (was 2.0)
    this.setDepth(10); 
    
    scene.add.existing(this);
    
    // Start facing down (towards the camera/player)
    this.play('walk-down');
    this.stop(); 
    
    this.currentWeapon = 'sword'; 
    // Define the "Slash Zone" radius
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
        this.setFrame(240); // Face down
        if (onComplete) onComplete();
      }
    });
  }

  attack(targetX, targetY) {
    // 1. Calculate distance
    const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);

    // 2. Determine direction
    const direction = this.getDirection(targetX, targetY);

    // 3. Choose Attack based on Range
    // Inside the circle -> Slash. Outside -> Shoot.
    if (dist < this.slashRadius) {
      this.slash(direction);
    } else {
      this.shoot(direction);
    }
  }

  slash(direction) {
    if (this.currentWeapon !== 'sword') {
      this.setTexture('player-sword');
      this.currentWeapon = 'sword';
    }
    
    this.play(`slash-${direction}`, true);
    
    this.once('animationcomplete', () => {
      // Stay facing that direction
      this.play(`walk-${direction}`);
      this.stop();
    });
  }

  shoot(direction) {
    if (this.currentWeapon !== 'bow') {
      this.setTexture('player-bow');
      this.currentWeapon = 'bow';
    }

    this.play(`shoot-${direction}`, true);
    
    this.once('animationcomplete', () => {
      this.play(`walk-${direction}`);
      this.stop();
    });
  }

  getDirection(tx, ty) {
    const dx = tx - this.x;
    const dy = ty - this.y;

    // Standard 4-way direction check
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  }
}