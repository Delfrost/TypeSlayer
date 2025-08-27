const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  stats: {
    gamesPlayed: {
      type: Number,
      default: 0
    },
    bestScore: {
      type: Number,
      default: 0
    },
    bestWPM: {
      type: Number,
      default: 0
    },
    bestLevel: {
      type: Number,
      default: 1
    },
    totalWordsTyped: {
      type: Number,
      default: 0
    },
    averageAccuracy: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateStats = function(gameSession) {
  this.stats.gamesPlayed += 1;
  this.stats.bestScore = Math.max(this.stats.bestScore, gameSession.score);
  this.stats.bestWPM = Math.max(this.stats.bestWPM, gameSession.wpm);
  this.stats.bestLevel = Math.max(this.stats.bestLevel, gameSession.levelReached);
  this.stats.totalWordsTyped += gameSession.wordsTyped;
  
  const totalAccuracy = (this.stats.averageAccuracy * (this.stats.gamesPlayed - 1) + gameSession.accuracy) / this.stats.gamesPlayed;
  this.stats.averageAccuracy = Math.round(totalAccuracy * 100) / 100;
};

module.exports = mongoose.model('User', userSchema);