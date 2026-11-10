import { vi } from 'vitest';

// Mock Phaser for tests
const MockPhaser = {
  GameObjects: {
    Sprite: class {
      constructor(scene, x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.scene = scene || {
          anims: {
            generateFrameNumbers: () => []
          }
        };
      }
      on() { return this; }
      once() { return this; }
      play() { return this; }
      setScale() { return this; }
      setDepth() { return this; }
      setFrame() { return this; }
      setPosition(x, y) { this.x = x; this.y = y; return this; }
      setTexture() { return this; }
      stop() { return this; }
    }
  },
  Math: {
    Distance: {
      Between: (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      }
    },
    Angle: {
      Between: (x1, y1, x2, y2) => {
        return Math.atan2(y2 - y1, x2 - x1);
      }
    }
  },
  Animations: {
    Events: {
      ANIMATION_COMPLETE: 'animationcomplete'
    }
  },
  Scenes: {
    Events: {
      SHUTDOWN: 'shutdown'
    }
  }
};

globalThis.Phaser = MockPhaser;

vi.mock('phaser', () => ({
  default: MockPhaser,
  ...MockPhaser
}));