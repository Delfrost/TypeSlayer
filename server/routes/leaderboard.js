const express = require('express');
const GameSession = require('../models/GameSession');
const User = require('../models/User');

const router = express.Router();

// Main leaderboard route that frontend uses
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const period = req.query.period || 'all'; // all, week, month
    
    // Calculate date filter based on period
    let dateFilter = {};
    const now = new Date();
    
    if (period === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: oneWeekAgo } };
    } else if (period === 'month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: oneMonthAgo } };
    }
    // 'all' means no date filter

    // Get top players based on WPM (primary metric) with accuracy as tiebreaker
    const topPlayers = await GameSession.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$user',
          bestWPM: { $max: '$wpm' },
          bestScore: { $max: '$score' },
          bestLevel: { $max: '$levelReached' },
          averageAccuracy: { $avg: '$accuracy' },
          gamesPlayed: { $sum: 1 },
          recentGame: { $last: '$$ROOT' }
        }
      },
      { 
        $sort: { 
          bestWPM: -1, 
          averageAccuracy: -1, 
          bestScore: -1 
        } 
      },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          _id: 0,
          username: '$userInfo.username',
          wpm: '$bestWPM',
          accuracy: { $round: ['$averageAccuracy', 1] },
          score: '$bestScore',
          level: '$bestLevel',
          gamesPlayed: '$gamesPlayed',
          lastPlayed: '$recentGame.createdAt'
        }
      }
    ]);

    res.json({
      success: true,
      topPlayers,
      period,
      totalPlayers: topPlayers.length
    });

  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error fetching leaderboard',
      topPlayers: []
    });
  }
});

router.get('/top-scores', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const timeframe = req.query.timeframe || 'all'; // all, daily, weekly, monthly

    let dateFilter = {};
    if (timeframe === 'daily') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
    } else if (timeframe === 'weekly') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (timeframe === 'monthly') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const topScores = await GameSession.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$user',
          bestScore: { $max: '$score' },
          bestLevel: { $max: '$levelReached' },
          bestWPM: { $max: '$wpm' },
          gamesPlayed: { $sum: 1 },
          sessionDetails: { $first: '$$ROOT' }
        }
      },
      { $sort: { bestScore: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          rank: { $add: [{ $indexOfArray: [[], null] }, 1] },
          username: '$user.username',
          score: '$bestScore',
          level: '$bestLevel',
          wpm: '$bestWPM',
          gamesPlayed: 1,
          createdAt: '$sessionDetails.createdAt'
        }
      }
    ]);

    topScores.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.json({
      success: true,
      leaderboard: topScores,
      timeframe
    });
  } catch (error) {
    console.error('Top scores fetch error:', error);
    res.status(500).json({ error: 'Server error fetching top scores' });
  }
});

router.get('/top-wpm', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const timeframe = req.query.timeframe || 'all';

    let dateFilter = {};
    if (timeframe === 'daily') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
    } else if (timeframe === 'weekly') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (timeframe === 'monthly') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const topWPM = await GameSession.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$user',
          bestWPM: { $max: '$wpm' },
          bestScore: { $max: '$score' },
          averageAccuracy: { $avg: '$accuracy' },
          sessionDetails: { $first: '$$ROOT' }
        }
      },
      { $sort: { bestWPM: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          username: '$user.username',
          wpm: '$bestWPM',
          score: '$bestScore',
          accuracy: { $round: ['$averageAccuracy', 2] },
          createdAt: '$sessionDetails.createdAt'
        }
      }
    ]);

    topWPM.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.json({
      success: true,
      leaderboard: topWPM,
      timeframe
    });
  } catch (error) {
    console.error('Top WPM fetch error:', error);
    res.status(500).json({ error: 'Server error fetching top WPM' });
  }
});

router.get('/top-levels', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topLevels = await GameSession.aggregate([
      {
        $group: {
          _id: '$user',
          bestLevel: { $max: '$levelReached' },
          bestScore: { $max: '$score' },
          bestWPM: { $max: '$wpm' },
          gamesPlayed: { $sum: 1 }
        }
      },
      { $sort: { bestLevel: -1, bestScore: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          username: '$user.username',
          level: '$bestLevel',
          score: '$bestScore',
          wpm: '$bestWPM',
          gamesPlayed: 1
        }
      }
    ]);

    topLevels.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.json({
      success: true,
      leaderboard: topLevels
    });
  } catch (error) {
    console.error('Top levels fetch error:', error);
    res.status(500).json({ error: 'Server error fetching top levels' });
  }
});

router.get('/user-rank/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const category = req.query.category || 'score'; // score, wpm, level

    let sortField;
    let groupField;
    
    switch (category) {
      case 'wpm':
        sortField = { bestWPM: -1 };
        groupField = { bestWPM: { $max: '$wpm' } };
        break;
      case 'level':
        sortField = { bestLevel: -1, bestScore: -1 };
        groupField = { bestLevel: { $max: '$levelReached' }, bestScore: { $max: '$score' } };
        break;
      default:
        sortField = { bestScore: -1 };
        groupField = { bestScore: { $max: '$score' } };
    }

    const rankings = await GameSession.aggregate([
      {
        $group: {
          _id: '$user',
          ...groupField
        }
      },
      { $sort: sortField }
    ]);

    const userRank = rankings.findIndex(entry => entry._id.toString() === userId) + 1;

    res.json({
      success: true,
      rank: userRank || 'Unranked',
      totalUsers: rankings.length,
      category
    });
  } catch (error) {
    console.error('User rank fetch error:', error);
    res.status(500).json({ error: 'Server error fetching user rank' });
  }
});

module.exports = router;