const express = require('express');
const GameSession = require('../models/GameSession');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { validateGameSession } = require('../middleware/validation');

const router = express.Router();

router.post('/session', protect, validateGameSession, async (req, res) => {
  try {
    const gameSession = new GameSession({
      user: req.user.id,
      ...req.body
    });

    await gameSession.save();

    const user = await User.findById(req.user.id);
    user.updateStats(gameSession);
    await user.save();

    res.status(201).json({
      success: true,
      gameSession,
      updatedStats: user.stats
    });
  } catch (error) {
    console.error('Game session save error:', error);
    res.status(500).json({ error: 'Server error saving game session' });
  }
});

router.get('/history', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const sessions = await GameSession.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('score levelReached wpm accuracy wordsTyped createdAt gameMode gameStats');

    const total = await GameSession.countDocuments({ user: req.user.id });

    // Format the sessions to match frontend expectations
    const games = sessions.map(session => ({
      _id: session._id,
      score: session.score,
      level: session.levelReached,
      wpm: session.wpm,
      accuracy: Math.round(session.accuracy),
      wordsTyped: session.wordsTyped,
      playedAt: session.createdAt,
      gameMode: session.gameMode || 'normal',
      gameStats: session.gameStats
    }));

    res.json({
      success: true,
      games,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalGames: total,
        hasMore: page < Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Game history fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error fetching game history',
      games: []
    });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const recentSessions = await GameSession.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    const monthlyStats = await GameSession.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: null,
          gamesPlayed: { $sum: 1 },
          averageScore: { $avg: '$score' },
          averageWPM: { $avg: '$wpm' },
          averageAccuracy: { $avg: '$accuracy' },
          totalWordsTyped: { $sum: '$wordsTyped' }
        }
      }
    ]);

    res.json({
      success: true,
      overallStats: user.stats,
      recentSessions,
      monthlyStats: monthlyStats[0] || {
        gamesPlayed: 0,
        averageScore: 0,
        averageWPM: 0,
        averageAccuracy: 0,
        totalWordsTyped: 0
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

router.delete('/session/:id', protect, async (req, res) => {
  try {
    const session = await GameSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ error: 'Game session not found' });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this session' });
    }

    await GameSession.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Game session deleted successfully'
    });
  } catch (error) {
    console.error('Session delete error:', error);
    res.status(500).json({ error: 'Server error deleting session' });
  }
});

module.exports = router;