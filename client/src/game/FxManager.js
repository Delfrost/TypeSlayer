import Phaser from 'phaser';

/**
 * Manages PixelFX animations and visual effects in TypeSlayer.
 * Loads lightweight Aseprite-format sprite sheets and controls playback,
 * positioning, rotation, and lifecycle.
 */
export class FxManager {
  /**
   * @param {Phaser.Scene} scene The Phaser scene controlling this manager.
   */
  constructor(scene) {
    this.scene = scene;
    this.activeFx = new Set();
  }

  /**
   * Preload all PixelFX sprite sheets and metadata.
   * @param {Phaser.Scene} scene
   */
  static preload(scene) {
    console.log('✨ Preloading PixelFX assets...');
    scene.load.aseprite('sword-slash', '/assets/fx/sword-slash.png', '/assets/fx/sword-slash.json');
    scene.load.aseprite('hit-spark', '/assets/fx/hit-spark.png', '/assets/fx/hit-spark.json');
    scene.load.aseprite('poof', '/assets/fx/poof.png', '/assets/fx/poof.json');
    scene.load.aseprite('crit-hit', '/assets/fx/crit-hit.png', '/assets/fx/crit-hit.json');
    scene.load.aseprite('plasma-explosion', '/assets/fx/plasma-explosion.png', '/assets/fx/plasma-explosion.json');
    scene.load.aseprite('combo-counter', '/assets/fx/combo-counter.png', '/assets/fx/combo-counter.json');
    scene.load.aseprite('collect-burst', '/assets/fx/collect-burst.png', '/assets/fx/collect-burst.json');
  }

  /**
   * Initialize animations from loaded Aseprite files.
   */
  create() {
    const keys = [
      'sword-slash',
      'hit-spark',
      'poof',
      'crit-hit',
      'plasma-explosion',
      'combo-counter',
      'collect-burst'
    ];

    for (const key of keys) {
      if (this.scene.cache.json.exists(key)) {
        try {
          this.scene.anims.createFromAseprite(key);
        } catch (err) {
          console.warn(`Failed to create animation for ${key}:`, err);
        }
      }
    }

    // Clean up all active FX sprites if scene shuts down
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroyAll();
    });
  }

  /**
   * Internal helper to spawn and track a one-shot FX sprite.
   * Ensures automatic destruction on animation complete to prevent memory leaks.
   */
  _spawnFx(key, x, y, originX, originY, scale = 1.0, depth = 15, rotation = 0) {
    if (!this.scene.anims.exists(key)) {
      return null;
    }

    const fx = this.scene.add.sprite(x, y, key);
    fx.setOrigin(originX, originY);
    fx.setRotation(rotation);
    fx.setScale(scale);
    fx.setDepth(depth);

    this.activeFx.add(fx);

    fx.play(key);
    fx.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.activeFx.delete(fx);
      fx.destroy();
    });

    return fx;
  }

  /**
   * Plays a sword-slash effect slicing across the target position.
   * Rotates towards the target direction from the source (e.g. player).
   */
  playSwordSlash(targetX, targetY, sourceX, sourceY) {
    const sX = sourceX ?? (this.scene.player ? this.scene.player.x : 400);
    const sY = sourceY ?? (this.scene.player ? this.scene.player.y : 520);
    const angle = Phaser.Math.Angle.Between(sX, sY, targetX, targetY);

    // Pivot/crescent center inside 136x104 frame is at ~(74, 57)
    return this._spawnFx('sword-slash', targetX, targetY, 0.54, 0.55, 1.2, 15, angle);
  }

  /**
   * Plays a snappy hit-spark cross flare on physical or arrow impact.
   */
  playHitSpark(x, y) {
    // Pivot/core diamond inside 136x80 frame is at ~(44, 44)
    return this._spawnFx('hit-spark', x, y, 0.32, 0.55, 1.1, 16);
  }

  /**
   * Plays a magical sparkle burst on successful word typing or ally help.
   */
  playCollectBurst(x, y) {
    // Pivot/core inside 112x108 frame is at ~(56, 64)
    return this._spawnFx('collect-burst', x, y, 0.5, 0.59, 1.0, 16);
  }

  /**
   * Plays a cartoon death poof with smoke and stars when an enemy is defeated.
   */
  playEnemyDeath(x, y) {
    // Pivot/core inside 112x92 frame is at ~(56, 56)
    return this._spawnFx('poof', x, y, 0.5, 0.61, 1.2, 14);
  }

  /**
   * Plays a dramatic critical hit starburst and shock ring when boss takes damage.
   */
  playBossHit(x, y) {
    // Pivot/star inside 216x136 frame is at ~(84, 80)
    return this._spawnFx('crit-hit', x, y, 0.39, 0.59, 1.2, 18);
  }

  /**
   * Plays a massive blue-violet plasma explosion when boss is defeated.
   */
  playBossDeath(x, y) {
    // Center inside 224x200 frame is at (112, 100)
    return this._spawnFx('plasma-explosion', x, y, 0.5, 0.5, 1.6, 18);
  }

  /**
   * Plays a combo banner celebration near the combo HUD.
   */
  playCombo(x = 650, y = 95) {
    // Center inside 208x100 frame is at (104, 50)
    return this._spawnFx('combo-counter', x, y, 0.5, 0.5, 0.85, 25);
  }

  /**
   * Destroys all active FX sprites.
   */
  destroyAll() {
    for (const fx of this.activeFx) {
      if (fx && fx.destroy) {
        fx.destroy();
      }
    }
    this.activeFx.clear();
  }
}
