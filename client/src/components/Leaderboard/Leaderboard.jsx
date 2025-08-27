import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('scores');
  const [timeframe, setTimeframe] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, timeframe]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    
    try {
      let endpoint = '';
      let params = {};
      
      switch (activeTab) {
        case 'scores':
          endpoint = '/leaderboard/top-scores';
          params = { timeframe, limit: 10 };
          break;
        case 'wpm':
          endpoint = '/leaderboard/top-wpm';
          params = { timeframe, limit: 10 };
          break;
        case 'levels':
          endpoint = '/leaderboard/top-levels';
          params = { limit: 10 };
          break;
        default:
          endpoint = '/leaderboard/top-scores';
          params = { timeframe, limit: 10 };
      }
      
      const response = await axios.get(endpoint, { params });
      setLeaderboardData(response.data.leaderboard);
    } catch (err) {
      setError('Failed to load leaderboard data');
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'scores', label: 'Top Scores', icon: '🏆' },
    { id: 'wpm', label: 'Fastest WPM', icon: '⚡' },
    { id: 'levels', label: 'Highest Levels', icon: '⭐' }
  ];

  const timeframes = [
    { id: 'all', label: 'All Time' },
    { id: 'monthly', label: 'This Month' },
    { id: 'weekly', label: 'This Week' },
    { id: 'daily', label: 'Today' }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const formatValue = (entry) => {
    switch (activeTab) {
      case 'scores':
        return `${entry.score.toLocaleString()} pts`;
      case 'wpm':
        return `${entry.wpm} WPM`;
      case 'levels':
        return `Level ${entry.level}`;
      default:
        return entry.score;
    }
  };

  const getSubInfo = (entry) => {
    switch (activeTab) {
      case 'scores':
        return `Level ${entry.level} • ${entry.wpm} WPM`;
      case 'wpm':
        return `${entry.accuracy}% accuracy • ${entry.score} pts`;
      case 'levels':
        return `${entry.score} pts • ${entry.wpm} WPM`;
      default:
        return '';
    }
  };

  return (
    <div className="leaderboard-modal">
      <div className="leaderboard-container">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="leaderboard-header">
          <h2 className="leaderboard-title">⚔️ Hall of Champions</h2>
          <p className="leaderboard-subtitle">The greatest TypeSlayer warriors</p>
        </div>

        <div className="leaderboard-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab !== 'levels' && (
          <div className="timeframe-selector">
            {timeframes.map(tf => (
              <button
                key={tf.id}
                className={`timeframe-btn ${timeframe === tf.id ? 'active' : ''}`}
                onClick={() => setTimeframe(tf.id)}
              >
                {tf.label}
              </button>
            ))}
          </div>
        )}

        <div className="leaderboard-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading champions...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchLeaderboard} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="empty-state">
              <p>No champions yet. Be the first!</p>
            </div>
          ) : (
            <div className="leaderboard-list">
              {leaderboardData.map((entry, index) => (
                <div 
                  key={`${entry.username}-${index}`}
                  className={`leaderboard-entry ${index < 3 ? 'podium' : ''}`}
                >
                  <div className="rank-badge">
                    {getRankIcon(entry.rank || index + 1)}
                  </div>
                  
                  <div className="player-info">
                    <div className="player-name">{entry.username}</div>
                    <div className="player-details">{getSubInfo(entry)}</div>
                  </div>
                  
                  <div className="player-score">
                    <div className="score-value">{formatValue(entry)}</div>
                    {entry.createdAt && (
                      <div className="score-date">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;