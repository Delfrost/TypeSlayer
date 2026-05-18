import { Player } from './Player.js';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Player', () => {
  let player;
  let scene;
  
  beforeEach(() => {
    // Mock the scene object for testing
    scene = {
      anims: {
        generateFrameNumbers: () => [],
        create: () => {}
      },
      add: {
        existing: () => {},
        tween: () => ({ stop: () => {} })
      }
    };
    
    // Mock the player object
    player = new Player(scene, 0, 0);
  });

  describe('attack method should select correct attack based on distance', () => {
    it('should return slash when enemy is within slashRadius', () => {
      // This would test that close enemies trigger slash
      const closeResult = player.attack(400, 300); // if enemy is at (400, 300) which is within 250px radius
      expect(closeResult).toBe('slash');
    });

    it('should return cast when enemy is beyond slashRadius', () => {
      // This would test that far enemies trigger cast/bow
      const farResult = player.attack(700, 100); // if enemy is at (700, 100) which is beyond 250px radius
      expect(farResult).toBe('cast');
    });
  });
});