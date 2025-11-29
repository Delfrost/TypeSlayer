import Phaser from "phaser";

export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player-sword');
    
    this.scene = scene;
    this.setScale(1.5);
    this.setDepth(10); 
    
    scene.add.existing(this);
    
    // Face down by default
    this.play('walk-down');
    this.stop(); 
    
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
        if (onComplete) onComplete();
      }
    });
  }

  attack(targetX, targetY) {
    const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);

    // If close -> Slash. If far -> Cast Spell.
    if (dist < this.slashRadius) {
      this.slash();
      return 'slash';
    } else {
      this.cast();
      return 'cast';
    }
  }

  slash() {
    this.play('slash-up', true);
    this.once('animationcomplete', () => {
      this.play('walk-up');
      this.stop();
    });
  }

  // REPLACED: shoot() is now cast()
  cast() {
    this.play('cast-up', true);
    this.once('animationcomplete', () => {
      this.play('walk-up');
      this.stop();
    });
  }
}