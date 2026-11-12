import Phaser from "phaser";

// Base walking speeds in pixels per second calibrated to 9-frame LPC walk cycle (30px/cycle)
const SPEED_BY_KEY = {
  minion: 42,
  warrior: 36,
  mage: 30,
  demon: 26,
  boss: 20
};

/**
 * Represents a single enemy in the game.
 * Walks stone paths at physically matched speeds with progressive letter reveal.
 */
export class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, path, enemyType, word) {
    const startPoint = path.getStartPoint();
    super(scene, startPoint.x, startPoint.y, 'villain');

    this.setOrigin(0.5);
    this.setScale(enemyType.scale || 1.0);

    this.scene = scene;
    this.path = path;
    this.enemyType = enemyType;
    this.word = word;
    this.id = `enemy_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    this.revealedCount = 0;
    this.pathProgress = 0;

    // --- Set up data for main game logic & React bridge ---
    this.setData({
      id: this.id,
      word: this.word,
      hp: this.enemyType.hp,
      maxHp: this.enemyType.hp,
      type: this.enemyType.name,
      points: this.enemyType.points,
      color: this.enemyType.color,
      matched: false,
      isBoss: false,
      isAlly: false,
      revealedCount: 0,
      pathProgress: 0
    });

    this.createWordText();

    scene.add.existing(this);
    scene.enemyGroup.add(this);
  }

  /**
   * Creates the text display hovering above the enemy head.
   * Starts with placeholder dots; letters reveal progressively as enemy approaches.
   */
  createWordText() {
    const initialPlaceholder = '• '.repeat(this.word.length).trim();
    this.wordText = this.scene.add.text(this.x, this.y - 40, initialPlaceholder, {
      fontSize: "18px",
      fontFamily: "Courier New, monospace",
      fill: "#e0e0e0",
      backgroundColor: "#000022cc",
      padding: { x: 6, y: 3 },
      stroke: this.enemyType.color,
      strokeThickness: 1
    }).setOrigin(0.5).setDepth(5);

    this.setData('wordText', this.wordText);
  }

  /**
   * Updates revealed letters based on distance to player along the path (t: 0 to 1).
   */
  updateWordReveal(t) {
    this.pathProgress = t;
    this.setData('pathProgress', t);

    // Progressive reveal: start at 15% path progress, fully visible at 80%
    let count = 0;
    if (t >= 0.8) {
      count = this.word.length;
    } else if (t > 0.15) {
      count = Math.floor(((t - 0.15) / 0.65) * this.word.length);
    }

    if (count !== this.revealedCount) {
      this.revealedCount = count;
      this.setData('revealedCount', count);

      const revealed = this.word.slice(0, count).toUpperCase();
      const hidden = ' •'.repeat(this.word.length - count);
      this.wordText.setText((revealed + hidden).trim());

      if (count === this.word.length) {
        this.wordText.setStyle({ fill: this.enemyType.color });
      }
    }
  }

  /**
   * Starts enemy movement along its path with speed matched to walk animation.
   * shortcut: linear velocity assumes uniform curve spacing; fine for line segments.
   */
  startFollow(onCompleteCallback) {
    const pathLength = this.path.getLength();
    const speedKey = this.enemyType.key || 'minion';
    const baseSpeed = SPEED_BY_KEY[speedKey] || 32;

    // Movement duration (ms)
    const duration = (pathLength / baseSpeed) * 1000;

    // Footfall sync: 1 LPC cycle (9 frames) covers ~30px -> frameRate = speed * 0.3
    const frameRate = Math.max(5, Math.round(baseSpeed * 0.3));
    this.play({ key: 'villain-walk-down', frameRate, repeat: -1 });

    const tween = this.scene.tweens.add({
      targets: { t: 0 },
      t: 1,
      duration: duration,
      ease: 'Linear',
      onUpdate: (tw) => {
        const t = tw.targets[0].t;
        const position = this.path.getPoint(t);
        this.setPosition(position.x, position.y);
        this.wordText.setPosition(position.x, position.y - 40);
        this.updateWordReveal(t);
      },
      onComplete: () => {
        onCompleteCallback(this);
        if (this.active) {
          this.destroy();
        }
      }
    });

    if (this.scene.gameState.timeSlowActive) {
      tween.setTimeScale(0.5);
      if (this.anims) this.anims.setTimeScale(0.5);
    }

    this.setData('tween', tween);
  }

  destroy(fromScene) {
    if (this.wordText) {
      this.wordText.destroy();
    }
    super.destroy(fromScene);
  }
}
