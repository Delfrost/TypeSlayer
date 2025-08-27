// This file stores all the data for our game levels,
// including which background to use and the paths enemies can follow.

export const levelData = {
  // Level 1: Based on bg2.jpg (image_2fe3ee.jpg)
  // Player position is on the stone path at the bottom.
  1: {
    background: 'bg2',
    paths: [
      // Path 1: Follows the dirt path on the far left, then cuts across the grass to the main road.
      new Phaser.Curves.Path(-50, 200)
        .lineTo(80, 200)
        .lineTo(80, 400)
        .lineTo(200, 450)
        .lineTo(380, 500),
      // Path 2: Straight down the center of the main stone path.
      new Phaser.Curves.Path(380, -50)
        .lineTo(380, 500),
      // Path 3: From the top-left, cutting across the grass to join the main path.
      new Phaser.Curves.Path(150, -50)
        .lineTo(250, 150)
        .lineTo(350, 300)
        .lineTo(380, 500)
    ]
  },
  // Level 2: Same map, but introduces a new path from the right.
  2: {
    background: 'bg2',
    paths: [
      new Phaser.Curves.Path(-50, 200)
        .lineTo(80, 200)
        .lineTo(80, 400)
        .lineTo(200, 450)
        .lineTo(380, 500),
      new Phaser.Curves.Path(380, -50)
        .lineTo(380, 500),
      // Path 3: A new path from the top right that avoids the banners.
      new Phaser.Curves.Path(750, 100)
        .lineTo(600, 150)
        .lineTo(550, 300)
        .lineTo(400, 480)
    ]
  },
  // Level 3: Based on bg3.jpg (image_2fdff6.jpg)
  // Player position is in the center of the grass clearing.
  3: {
    background: 'bg3',
    paths: [
      // Path 1: Follows the winding dirt path from the top-left corner.
      new Phaser.Curves.Path(50, -50)
        .lineTo(220, 150)
        .lineTo(350, 250)
        .lineTo(400, 350),
      // Path 2: Follows the dirt path up from the bottom-left corner.
      new Phaser.Curves.Path(150, 650)
        .lineTo(250, 450)
        .lineTo(350, 400)
        .lineTo(400, 350),
      // Path 3: A more direct path from the left edge of the screen.
      new Phaser.Curves.Path(-50, 300)
        .lineTo(200, 320)
        .lineTo(400, 350)
    ]
  },
  // Level 4: Based on bg4.jpg (image_2fdf74.jpg)
  // Player position is on the main path below the gate.
  4: {
    background: 'bg4',
    paths: [
      // Path 1: Straight down the main road from the gate.
      new Phaser.Curves.Path(400, -50)
        .lineTo(400, 480),
      // Path 2: Follows the dirt path from the left, going around the broken cart.
      new Phaser.Curves.Path(-50, 350)
        .lineTo(150, 350)
        .lineTo(250, 400)
        .lineTo(400, 480),
      // Path 3: A winding path from the top-right, avoiding scattered swords.
      new Phaser.Curves.Path(750, 50)
        .lineTo(650, 200)
        .lineTo(500, 350)
        .lineTo(400, 480)
    ]
  },
  // Level 5: Based on img.jpg (image_2fdc2d.jpg) - The final arena
  // Player position is in the very center of the cracked earth.
  5: {
    background: 'img',
    paths: [
       // Path 1: From the top-left, entering between the rocks.
       new Phaser.Curves.Path(100, -50)
        .lineTo(250, 150)
        .lineTo(400, 320),
       // Path 2: From the top-right lava river opening.
       new Phaser.Curves.Path(700, -50)
        .lineTo(550, 150)
        .lineTo(400, 320),
       // Path 3: From the far-left, between rock piles.
       new Phaser.Curves.Path(-50, 350)
        .lineTo(200, 330)
        .lineTo(400, 320),
       // Path 4: From the bottom, winding around the contraption.
       new Phaser.Curves.Path(400, 650)
        .lineTo(450, 450)
        .lineTo(400, 320),
       // Path 5: From the far-right, near the large sword.
       new Phaser.Curves.Path(850, 400)
        .lineTo(600, 350)
        .lineTo(400, 320)
    ]
  }
};