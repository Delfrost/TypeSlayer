import Phaser from "phaser";

/**
 * Represents a single enemy in the game. Uses the villain spritesheet
 * instead of emojis for proper animated enemies.
 */
export class Enemy extends Phaser.GameObjects.Sprite {
  /**
   * @param {Phaser.Scene} scene The scene this enemy belongs to.
   * @param {Phaser.Curves.Path} path The path this enemy must follow.
   * @param {object} enemyType The configuration object for the enemy (e.g., minion, warrior).
   * @param {string} word The word the player must type to defeat this enemy.
   */
  constructor(scene, path, enemyType, word) {
    // Get the starting coordinates from the path object
    const startPoint = path.getStartPoint();

    // Call the Sprite constructor using the villain spritesheet
    super(scene, startPoint.x, startPoint.y, 'villain');
    this.setOrigin(0.5);
    this.setScale(enemyType.scale || 1.0);

    this.scene = scene;
    this.path = path;
    this.enemyType = enemyType;
    this.word = word;
    this.wordText = null;

    // --- Set up data for the main game logic ---
    this.setData({
      word: this.word,
      hp: this.enemyType.hp,
      maxHp: this.enemyType.hp,
      type: this.enemyType.name,
      points: this.enemyType.points,
      matched: false,
      isBoss: false,
      isAlly: false,
    });

    // Create the text object that displays the word to be typed
    this.createWordText();

    // Add to scene and enemy group
    scene.add.existing(this);
    scene.enemyGroup.add(this);

    // Play walk-down animation (enemy walks toward the player)
    this.play('villain-walk-down');
  }

  /**
   * Creates the text object that hovers above the enemy.
   */
  createWordText() {
    this.wordText = this.scene.add.text(this.x, this.y - 40, this.word, {
      fontSize: "20px",
      fontFamily: "Courier New, monospace",
      fill: this.enemyType.color,
      backgroundColor: "#000033",
      padding: { x: 8, y: 4 },
      stroke: "#ffffff",
      strokeThickness: 1
    }).setOrigin(0.5);

    // Link the wordText to this enemy object in the data manager
    this.setData('wordText', this.wordText);
  }

  /**
   * Starts the enemy's movement along its path.
   * @param {function} onCompleteCallback The function to call when the enemy reaches the end.
   */
  startFollow(onCompleteCallback) {
    const tween = this.scene.tweens.add({
      targets: { t: 0 },
      t: 1,
      duration: this.enemyType.speed,
      ease: 'Linear',
      onUpdate: (tween) => {
        const position = this.path.getPoint(tween.targets[0].t);
        this.setPosition(position.x, position.y);
        this.wordText.setPosition(position.x, position.y - 40);
      },
      onComplete: () => {
        onCompleteCallback(this);
        this.destroy();
      }
    });

    this.setData('tween', tween);
  }

  destroy(fromScene) {
    if (this.wordText) {
      this.wordText.destroy();
    }
    super.destroy(fromScene);
  }
}