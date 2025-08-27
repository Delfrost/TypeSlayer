const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  levelReached: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  wpm: {
    type: Number,
    required: true,
    min: 0
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  wordsTyped: {
    type: Number,
    required: true,
    min: 0
  },
  durationSeconds: {
    type: Number,
    required: true,
    min: 0
  },
  gameMode: {
    type: String,
    enum: ['normal', 'boss_battle', 'practice'],
    default: 'normal'
  },
  gameStats: {
    enemiesDefeated: {
      type: Number,
      default: 0
    },
    bossesDefeated: {
      type: Number,
      default: 0
    },
    alliesHelped: {
      type: Number,
      default: 0
    },
    livesLost: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

gameSessionSchema.index({ user: 1, createdAt: -1 });
gameSessionSchema.index({ score: -1 });
gameSessionSchema.index({ wpm: -1 });
gameSessionSchema.index({ levelReached: -1 });
gameSessionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('GameSession', gameSessionSchema);