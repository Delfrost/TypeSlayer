/**
 * Represents the main player character in the game.
 * It handles its own appearance and animations.
 */
export class Player extends Phaser.GameObjects.Sprite {
  /**
   * @param {Phaser.Scene} scene The scene the player belongs to.
   * @param {number} x The horizontal position of the player.
   * @param {number} y The vertical position of the player.
   */
  constructor(scene, x, y) {
    // We use the 'sword' spritesheet by default for the idle pose
    super(scene, x, y, 'player-sword');

    this.scene = scene;
    this.setScale(2.0); // Make the player sprite a bit larger
    this.setDepth(10); // Ensure the player is in front of enemies

    // Add the player to the scene's display list
    scene.add.existing(this);

    // Set the initial animation to idle
    this.play('player-idle');
  }

  // We will add attack logic here in the next step
  attack(targetEnemy) {
    console.log(`Attacking ${targetEnemy.getData('type')}!`);
    // Placeholder for sword/bow logic
  }
}