// Mock Phaser for tests
global.Phaser = {
  GameObjects: {
    Sprite: class {
      constructor() {
        this.scene = {
          anims: {
            generateFrameNumbers: () => []
          }
        };
      }
      on() {}
      once() {}
      play() {}
      setScale() {}
      setDepth() {}
      stop() {}
    }
  }
};

// Mock the distance calculation
global.Phaser.Math = {
  Distance: {
    Between: (x1, y1, x2, y2) => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
  }
};