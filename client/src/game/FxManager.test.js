import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FxManager } from './FxManager.js';
import Phaser from 'phaser';

describe('FxManager', () => {
  let mockScene;
  let fxManager;
  let createdSprites;

  beforeEach(() => {
    createdSprites = [];

    mockScene = {
      load: {
        aseprite: vi.fn(),
      },
      cache: {
        json: {
          exists: vi.fn((key) => true),
        },
      },
      anims: {
        createFromAseprite: vi.fn(),
        exists: vi.fn((key) => true),
      },
      add: {
        sprite: vi.fn((x, y, key) => {
          const callbacks = {};
          const sprite = {
            x,
            y,
            key,
            originX: 0,
            originY: 0,
            rotation: 0,
            scale: 1,
            depth: 0,
            setOrigin(ox, oy) {
              this.originX = ox;
              this.originY = oy;
              return this;
            },
            setRotation(rot) {
              this.rotation = rot;
              return this;
            },
            setScale(s) {
              this.scale = s;
              return this;
            },
            setDepth(d) {
              this.depth = d;
              return this;
            },
            play: vi.fn(),
            once: vi.fn((event, cb) => {
              callbacks[event] = cb;
            }),
            destroy: vi.fn(),
            triggerComplete() {
              if (callbacks[Phaser.Animations.Events.ANIMATION_COMPLETE]) {
                callbacks[Phaser.Animations.Events.ANIMATION_COMPLETE]();
              }
            },
          };
          createdSprites.push(sprite);
          return sprite;
        }),
      },
      events: {
        once: vi.fn(),
      },
      player: {
        x: 400,
        y: 520,
      },
    };

    fxManager = new FxManager(mockScene);
  });

  describe('Preload & Create', () => {
    it('preloads all required PixelFX aseprite assets', () => {
      FxManager.preload(mockScene);
      expect(mockScene.load.aseprite).toHaveBeenCalledWith(
        'sword-slash',
        '/assets/fx/sword-slash.png',
        '/assets/fx/sword-slash.json'
      );
      expect(mockScene.load.aseprite).toHaveBeenCalledWith(
        'hit-spark',
        '/assets/fx/hit-spark.png',
        '/assets/fx/hit-spark.json'
      );
      expect(mockScene.load.aseprite).toHaveBeenCalledWith(
        'poof',
        '/assets/fx/poof.png',
        '/assets/fx/poof.json'
      );
      expect(mockScene.load.aseprite).toHaveBeenCalledWith(
        'crit-hit',
        '/assets/fx/crit-hit.png',
        '/assets/fx/crit-hit.json'
      );
      expect(mockScene.load.aseprite).toHaveBeenCalledWith(
        'plasma-explosion',
        '/assets/fx/plasma-explosion.png',
        '/assets/fx/plasma-explosion.json'
      );
      expect(mockScene.load.aseprite).toHaveBeenCalledWith(
        'combo-counter',
        '/assets/fx/combo-counter.png',
        '/assets/fx/combo-counter.json'
      );
      expect(mockScene.load.aseprite).toHaveBeenCalledWith(
        'collect-burst',
        '/assets/fx/collect-burst.png',
        '/assets/fx/collect-burst.json'
      );
    });

    it('creates animations from aseprite in create()', () => {
      fxManager.create();
      expect(mockScene.anims.createFromAseprite).toHaveBeenCalledWith('sword-slash');
      expect(mockScene.anims.createFromAseprite).toHaveBeenCalledWith('hit-spark');
      expect(mockScene.anims.createFromAseprite).toHaveBeenCalledWith('poof');
      expect(mockScene.anims.createFromAseprite).toHaveBeenCalledWith('crit-hit');
      expect(mockScene.anims.createFromAseprite).toHaveBeenCalledWith('plasma-explosion');
      expect(mockScene.anims.createFromAseprite).toHaveBeenCalledWith('combo-counter');
      expect(mockScene.anims.createFromAseprite).toHaveBeenCalledWith('collect-burst');
    });
  });

  describe('Combat FX Playback', () => {
    it('plays sword-slash with correct angle from player to target', () => {
      // Enemy is straight above player: player (400, 520) -> enemy (400, 320)
      const fx = fxManager.playSwordSlash(400, 320);
      expect(fx).not.toBeNull();
      expect(fx.x).toBe(400);
      expect(fx.y).toBe(320);
      expect(fx.rotation).toBeCloseTo(-Math.PI / 2, 2);
      expect(fx.originX).toBeCloseTo(0.54, 2);
      expect(fx.originY).toBeCloseTo(0.55, 2);
      expect(fx.play).toHaveBeenCalledWith('sword-slash');
    });

    it('plays hit-spark effect on impacts', () => {
      const fx = fxManager.playHitSpark(300, 200);
      expect(fx).not.toBeNull();
      expect(fx.play).toHaveBeenCalledWith('hit-spark');
      expect(fx.x).toBe(300);
      expect(fx.y).toBe(200);
    });

    it('plays poof effect on enemy death', () => {
      const fx = fxManager.playEnemyDeath(250, 150);
      expect(fx).not.toBeNull();
      expect(fx.play).toHaveBeenCalledWith('poof');
      expect(fx.x).toBe(250);
      expect(fx.y).toBe(150);
    });

    it('plays crit-hit on boss damage', () => {
      const fx = fxManager.playBossHit(400, 100);
      expect(fx).not.toBeNull();
      expect(fx.play).toHaveBeenCalledWith('crit-hit');
      expect(fx.x).toBe(400);
      expect(fx.y).toBe(100);
    });

    it('plays plasma-explosion on boss death', () => {
      const fx = fxManager.playBossDeath(400, 100);
      expect(fx).not.toBeNull();
      expect(fx.play).toHaveBeenCalledWith('plasma-explosion');
      expect(fx.x).toBe(400);
      expect(fx.y).toBe(100);
    });

    it('plays combo-counter for combo achievements', () => {
      const fx = fxManager.playCombo(650, 95);
      expect(fx).not.toBeNull();
      expect(fx.play).toHaveBeenCalledWith('combo-counter');
      expect(fx.x).toBe(650);
      expect(fx.y).toBe(95);
    });

    it('plays collect-burst on typing success', () => {
      const fx = fxManager.playCollectBurst(400, 425);
      expect(fx).not.toBeNull();
      expect(fx.play).toHaveBeenCalledWith('collect-burst');
      expect(fx.x).toBe(400);
      expect(fx.y).toBe(425);
    });
  });

  describe('Lifecycle & Cleanup', () => {
    it('destroys sprite upon animation completion', () => {
      const fx = fxManager.playSwordSlash(400, 320);
      expect(fxManager.activeFx.has(fx)).toBe(true);

      fx.triggerComplete();

      expect(fx.destroy).toHaveBeenCalled();
      expect(fxManager.activeFx.has(fx)).toBe(false);
    });

    it('destroys all active FX when destroyAll() is invoked', () => {
      const fx1 = fxManager.playSwordSlash(400, 320);
      const fx2 = fxManager.playHitSpark(300, 200);

      expect(fxManager.activeFx.size).toBe(2);

      fxManager.destroyAll();

      expect(fx1.destroy).toHaveBeenCalled();
      expect(fx2.destroy).toHaveBeenCalled();
      expect(fxManager.activeFx.size).toBe(0);
    });
  });
});
