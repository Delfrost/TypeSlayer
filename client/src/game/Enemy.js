/**
 * Represents a single enemy in the game. It handles its own appearance,
 * data, and movement along a predefined path.
 */
export class Enemy extends Phaser.GameObjects.Text {
  /**
   * @param {Phaser.Scene} scene The scene this enemy belongs to.
   * @param {Phaser.Curves.Path} path The path this enemy must follow.
   * @param {object} enemyType The configuration object for the enemy (e.g., minion, warrior).
   * @param {string} word The word the player must type to defeat this enemy.
   */
  constructor(scene, path, enemyType, word) {
    // Get the starting coordinates from the path object
    const startPoint = path.getStartPoint();

    // Call the constructor of the parent class (Phaser.GameObjects.Text)
    // This creates the emoji-like sprite for the enemy
    super(scene, startPoint.x, startPoint.y, enemyType.sprite, {
      fontSize: `${32 * enemyType.scale}px`
    });
    this.setOrigin(0.5);

    this.scene = scene;
    this.path = path;
    this.enemyType = enemyType;
    this.word = word;
    this.wordText = null; // This will hold the text object displayed above the enemy

    // --- Set up data for the main game logic ---
    this.setData({
      word: this.word,
      hp: this.enemyType.hp,
      maxHp: this.enemyType.hp,
      type: this.enemyType.name,
      points: this.enemyType.points,
      matched: false,
      isBoss: false, // This class is for regular enemies
      isAlly: false,
      // We will set wordText and tween later
    });

    // Create the text object that displays the word to be typed
    this.createWordText();

    // Finally, add this completed enemy object to the scene and its enemy group
    scene.add.existing(this);
    scene.enemyGroup.add(this);
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
    // A tween is an animation of a value over time. Here, we animate a value 't'
    // from 0 (the start of the path) to 1 (the end of the path).
    const tween = this.scene.tweens.add({
      targets: { t: 0 },
      t: 1,
      duration: this.enemyType.speed,
      ease: 'Linear',
      onUpdate: (tween) => {
        // For each step of the animation, get the (x, y) position on the path
        const position = this.path.getPoint(tween.targets[0].t);
        // Update the position of the enemy sprite and its word text
        this.setPosition(position.x, position.y);
        this.wordText.setPosition(position.x, position.y - 40);
      },
      onComplete: () => {
        // When the path is finished, call the provided callback function
        onCompleteCallback(this); // We pass `this` (the enemy instance) to the callback
        this.destroy(); // The enemy destroys itself after the callback
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