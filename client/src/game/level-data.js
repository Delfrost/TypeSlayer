// Level path definitions aligned to actual stone roads on backgrounds
import Phaser from 'phaser';

export const levelData = {
  // Level 1: bg2.jpg - Cobblestone road running vertically down center
  1: {
    background: 'bg2',
    paths: [
      new Phaser.Curves.Path(400, -50).lineTo(400, 500),
      new Phaser.Curves.Path(375, -50).lineTo(380, 500),
      new Phaser.Curves.Path(425, -50).lineTo(420, 500)
    ]
  },
  // Level 2: bg2.jpg - Stone road lanes + upper stone fork merging onto main road
  2: {
    background: 'bg2',
    paths: [
      new Phaser.Curves.Path(400, -50).lineTo(400, 500),
      new Phaser.Curves.Path(375, -50).lineTo(380, 500),
      new Phaser.Curves.Path(425, -50).lineTo(420, 500),
      new Phaser.Curves.Path(270, -50)
        .lineTo(320, 160)
        .lineTo(385, 300)
        .lineTo(400, 500)
    ]
  },
  // Level 3: bg3.jpg - Stone / dirt trails from gate and right passage
  3: {
    background: 'bg3',
    paths: [
      new Phaser.Curves.Path(280, -50)
        .lineTo(280, 150)
        .lineTo(340, 260)
        .lineTo(390, 360)
        .lineTo(400, 500),
      new Phaser.Curves.Path(650, -50)
        .lineTo(580, 160)
        .lineTo(500, 280)
        .lineTo(420, 400)
        .lineTo(400, 500)
    ]
  },
  // Level 4: bg4.jpg - Grand stone archway gate and courtyard road
  4: {
    background: 'bg4',
    paths: [
      new Phaser.Curves.Path(400, -50).lineTo(400, 130).lineTo(400, 500),
      new Phaser.Curves.Path(360, -50).lineTo(370, 130).lineTo(380, 500),
      new Phaser.Curves.Path(440, -50).lineTo(430, 130).lineTo(420, 500)
    ]
  },
  // Level 5: img.jpg - Stone corridors leading into central arena
  5: {
    background: 'img',
    paths: [
      new Phaser.Curves.Path(180, -50)
        .lineTo(280, 140)
        .lineTo(380, 300)
        .lineTo(400, 500),
      new Phaser.Curves.Path(640, -50)
        .lineTo(530, 140)
        .lineTo(420, 300)
        .lineTo(400, 500)
    ]
  }
};