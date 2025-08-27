import { levelData } from './level-data.js';

/**
 * Manages loading, creating, and updating the game's background images.
 */
export class BackgroundManager {
  /**
   * @param {Phaser.Scene} scene The Phaser scene that this manager will control.
   */
  constructor(scene) {
    this.scene = scene;
    this.currentBg = null;
  }

  /**
   * Preloads all necessary background image assets.
   * This should be called from the scene's preload() method.
   * @param {Phaser.Scene} scene The scene calling the preload function.
   */
  static preload(scene) {
    console.log('🖼️ Preloading backgrounds...');
    // The keys 'bg2', 'bg3', etc., match the data in level-data.js
    scene.load.image('bg2', '/bg2.jpg');
    scene.load.image('bg3', '/bg3.jpg');
    scene.load.image('bg4', '/bg4.jpg');
    scene.load.image('img', '/img.jpg'); // Used for level 5
  }

  /**
   * Creates the initial background for the start of the game.
   * This should be called from the scene's create() method.
   */
  create() {
    // Get the background key for level 1 from our level data
    const bgKey = levelData[1].background;

    this.currentBg = this.scene.add.image(400, 300, bgKey);
    this.currentBg.setDisplaySize(800, 600);
    // Set depth to -1 to ensure it's behind all other game objects
    this.currentBg.setDepth(-1);
  }

  /**
   * Updates the background to match the new level with a smooth fade transition.
   * This should be called from the scene's levelUp() method.
   * @param {number} newLevel The new level to display the background for.
   */
  updateBackground(newLevel) {
    const levelInfo = levelData[newLevel];

    // Safety check in case level data doesn't exist
    if (!levelInfo || !levelInfo.background) {
      console.warn(`No background found in levelData for level ${newLevel}`);
      return;
    }

    const newBgKey = levelInfo.background;

    // Don't do anything if the new background is the same as the current one
    if (this.currentBg && this.currentBg.texture.key === newBgKey) {
      return;
    }

    const oldBg = this.currentBg;

    // Create the new background, but make it invisible and place it behind the old one
    this.currentBg = this.scene.add.image(400, 300, newBgKey);
    this.currentBg.setDisplaySize(800, 600);
    this.currentBg.setDepth(-2); // Place it behind the current background
    this.currentBg.setAlpha(0); // Start fully transparent

    console.log(`✨ Transitioning to background: ${newBgKey}`);

    // Create a tween to fade in the new background
    this.scene.tweens.add({
      targets: this.currentBg,
      alpha: 1,
      duration: 800, // Duration of the fade in milliseconds
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // Once the fade is complete, destroy the old background to free up memory
        if (oldBg) {
          oldBg.destroy();
        }
        // Bring the new background to the correct depth
        this.currentBg.setDepth(-1);
      }
    });
  }
}