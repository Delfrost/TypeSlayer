import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import Game from './components/Game.jsx';
//import TestAnimation from './components/TestAnimation.jsx';
import axios from 'axios';
import './index.css';

function App() {
  const { user, loading, login, register, logout, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [playerHistory, setPlayerHistory] = useState(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardFilter, setLeaderboardFilter] = useState('all'); // all, week, month
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Disable body scroll when game is active
  useEffect(() => {
    if (showGame) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showGame]);
  
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        color: 'white'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(0, 255, 136, 0.3)',
          borderTop: '3px solid #00ff88',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p style={{ color: '#b0b0b0', fontSize: '1.1rem' }}>Loading TypeSlayer...</p>
      </div>
    );
  }
  
  console.log('App rendering with states:', { showLogin, showRegister, showLeaderboard, isAuthenticated, user });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      setShowLogin(false);
      setLoginData({ email: '', password: '' });
    } else {
      setError(result.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(registerData.username, registerData.email, registerData.password);
    if (result.success) {
      setShowRegister(false);
      setRegisterData({ username: '', email: '', password: '' });
    } else {
      setError(result.error);
    }
  };

  const fetchLeaderboardData = async (filter = 'all') => {
    setLeaderboardLoading(true);
    try {
      const leaderboardResponse = await axios.get(`/leaderboard?period=${filter}`);
      setLeaderboardData(leaderboardResponse.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard data:', error);
      // Set empty data instead of fallback
      setLeaderboardData({
        topPlayers: []
      });
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const fetchPlayerHistory = async () => {
    if (!isAuthenticated) {
      console.log('🔐 User not authenticated, skipping history fetch');
      setPlayerHistory([]);
      return;
    }
    
    console.log('📊 Fetching player history...');
    try {
      const historyResponse = await axios.get('/games/history');
      console.log('📈 History response:', historyResponse.data);
      
      // Handle both old format (sessions) and new format (games)
      const rawData = historyResponse.data.games || historyResponse.data.sessions || [];
      console.log('🎯 Raw data:', rawData);
      
      // Transform sessions to games format if needed
      const games = rawData.map(item => ({
        _id: item._id,
        score: item.score,
        level: item.levelReached,
        wpm: item.wpm,
        accuracy: Math.round(item.accuracy),
        wordsTyped: item.wordsTyped,
        playedAt: item.createdAt,
        gameMode: item.gameMode || 'normal',
        gameStats: item.gameStats
      }));
      
      console.log('🎯 Transformed games:', games);
      setPlayerHistory(games);
    } catch (error) {
      console.error('❌ Failed to fetch player history:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setPlayerHistory([]);
    }
  };

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
    fetchLeaderboardData(leaderboardFilter);
  };

  const handleShowProfile = () => {
    setShowProfile(true);
    fetchPlayerHistory();
  };

  // return (
  //   <div className="App">
  //      <TestAnimation />
  //   </div>
  // );
  
  return (
    <div className="App">
      //{/* Simple Navbar */}
      <nav style={{
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '2px solid rgba(0, 255, 136, 0.6)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          fontFamily: 'Courier New, monospace',
          fontSize: '1.6rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #ff6b9d 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          cursor: 'pointer',
          letterSpacing: '1px'
        }}>
          ⚔️ TypeSlayer
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleShowLeaderboard}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.8)',
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          >
            🏆 Leaderboard
          </button>
          
          {showGame && (
            <>
              <button 
                onClick={() => setShowGame(false)}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 170, 255, 0.12) 0%, rgba(0, 255, 136, 0.08) 100%)',
                  border: '1px solid rgba(0, 170, 255, 0.4)',
                  color: '#00aaff',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                🏠 Home
              </button>
              <button 
                onClick={() => {
                  setShowGame(false);
                  setTimeout(() => setShowGame(true), 100);
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.12) 0%, rgba(255, 235, 59, 0.08) 100%)',
                  border: '1px solid rgba(255, 193, 7, 0.4)',
                  color: '#ffc107',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                🔄 Restart
              </button>
            </>
          )}
          
          {isAuthenticated ? (
            <>
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <div 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.2rem',
                    background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 170, 255, 0.05) 100%)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: '12px',
                    color: '#00ff88',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>👋</span>
                  <span>{user?.username}</span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    marginLeft: '0.2rem',
                    transform: showUserDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}>▼</span>
                </div>
                
                {showUserDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: '12px',
                    padding: '0.5rem',
                    minWidth: '180px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    zIndex: 1000
                  }}>
                    <button
                      onClick={() => {
                        handleShowProfile();
                        setShowUserDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#da70d6',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(138, 43, 226, 0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      👤 Profile
                    </button>
                    <div style={{ 
                      height: '1px', 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      margin: '0.5rem 0' 
                    }}></div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#ff6b9d',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 68, 68, 0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button 
                onClick={() => setShowLogin(true)}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                Sign In
              </button>
              
              <button 
                onClick={() => setShowRegister(true)}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.12) 0%, rgba(0, 170, 255, 0.08) 100%)',
                  border: '1px solid rgba(0, 255, 136, 0.4)',
                  color: '#00ff88',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content - Show Game or Welcome Screen */}
      {showGame ? (
        <div style={{ 
          height: 'calc(100vh - 80px)', 
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Game onRestart={() => {
            setShowGame(false);
            setTimeout(() => setShowGame(true), 100);
          }} />
        </div>
      ) : (
        <div style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '4rem', 
              marginBottom: '1rem', 
              background: 'linear-gradient(45deg, #00ff88, #00aaff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              TypeSlayer
            </h1>
            
            {isAuthenticated ? (
              <>
                <div style={{
                  background: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  margin: '2rem 0',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#00ff88', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                    Welcome back, {user?.username}! ⚔️
                  </p>
                  <div style={{ color: '#b2bec3', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>Best WPM: {user?.stats?.bestWPM || 0}</span>
                    <span>•</span>
                    <span>Games Played: {user?.stats?.gamesPlayed || 0}</span>
                    <span>•</span>
                    <span>Accuracy: {user?.stats?.averageAccuracy || 0}%</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowGame(true)}
                  style={{
                    background: 'linear-gradient(135deg, #00ff88, #00aaff)',
                    color: '#1a1a1a',
                    border: 'none',
                    padding: '1.2rem 2.5rem',
                    fontSize: '1.2rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)',
                    marginBottom: '1rem'
                  }}
                >
                  🎮 Start New Game
                </button>
              </>
            ) : (
              <>
                <p style={{ fontSize: '1.4rem', marginBottom: '2rem', color: '#b2bec3' }}>
                  Master the Art of Speed Typing
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  <div style={{ padding: '1rem', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '8px' }}>
                    ⚡ Real-time WPM tracking
                  </div>
                  <div style={{ padding: '1rem', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '8px' }}>
                    🏆 Global leaderboards
                  </div>
                  <div style={{ padding: '1rem', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '8px' }}>
                    📊 Progress tracking
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  borderRadius: '12px',
                  padding: '1rem',
                  margin: '2rem 0',
                  fontSize: '1rem'
                }}>
                  🔒 Sign in required to play and save your progress!
                </div>
                
                <button 
                  onClick={() => setShowLogin(true)}
                  style={{
                    background: 'linear-gradient(135deg, #00ff88, #00aaff)',
                    color: '#1a1a1a',
                    border: 'none',
                    padding: '1.2rem 2.5rem',
                    fontSize: '1.2rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)'
                  }}
                >
                  Sign In to Play
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Simple Modal Overlays */}
      {showLogin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '2px solid #00ff88',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            color: 'white',
            position: 'relative'
          }}>
            <button 
              onClick={() => {setShowLogin(false); setError(''); setLoginData({ email: '', password: '' });}}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#00ff88',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <h2 style={{ color: '#00ff88', marginBottom: '1.5rem' }}>Welcome Back!</h2>
            
            {error && (
              <div style={{
                background: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid rgba(255, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1rem',
                color: '#ff6b9d'
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                required
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '0.8rem',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                required
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '0.8rem',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <button 
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #00ff88, #00aaff)',
                  color: '#1a1a2e',
                  border: 'none',
                  padding: '0.8rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginTop: '0.5rem'
                }}
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {showRegister && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '2px solid #00ff88',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            color: 'white',
            position: 'relative'
          }}>
            <button 
              onClick={() => {setShowRegister(false); setError(''); setRegisterData({ username: '', email: '', password: '' });}}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#00ff88',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <h2 style={{ color: '#00ff88', marginBottom: '1.5rem' }}>Join the Quest!</h2>
            
            {error && (
              <div style={{
                background: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid rgba(255, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1rem',
                color: '#ff6b9d'
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Username"
                value={registerData.username}
                onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                required
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '0.8rem',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                required
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '0.8rem',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                required
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '0.8rem',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <button 
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #00ff88, #00aaff)',
                  color: '#1a1a2e',
                  border: 'none',
                  padding: '0.8rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginTop: '0.5rem'
                }}
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}

      {showLeaderboard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '2px solid #00ff88',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            color: 'white',
            position: 'relative'
          }}>
            <button 
              onClick={() => {
                setShowLeaderboard(false);
                setLeaderboardData(null);
                setPlayerHistory(null);
              }}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#00ff88',
                fontSize: '1.5rem',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              ×
            </button>
            
            <h2 style={{ color: '#00ff88', marginBottom: '1.5rem', textAlign: 'center' }}>🏆 Hall of Champions</h2>
            
            {leaderboardLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid rgba(0, 255, 136, 0.3)',
                  borderTop: '3px solid #00ff88',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                <p>Loading leaderboard...</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                {/* Leaderboard Filters */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    {[
                      { key: 'all', label: '🏆 All Time', desc: 'Best overall scores' },
                      { key: 'week', label: '📅 This Week', desc: 'Weekly champions' },
                      { key: 'month', label: '📊 This Month', desc: 'Monthly leaders' }
                    ].map(filter => (
                      <button
                        key={filter.key}
                        onClick={() => {
                          setLeaderboardFilter(filter.key);
                          fetchLeaderboardData(filter.key);
                        }}
                        style={{
                          background: leaderboardFilter === filter.key 
                            ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 170, 255, 0.2) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                          border: leaderboardFilter === filter.key
                            ? '2px solid rgba(0, 255, 136, 0.5)'
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          color: leaderboardFilter === filter.key ? '#00ff88' : 'rgba(255, 255, 255, 0.8)',
                          padding: '0.8rem 1.5rem',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: leaderboardFilter === filter.key ? 600 : 500,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div>{filter.label}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.2rem' }}>{filter.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Global Leaderboard */}
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <h3 style={{ color: '#00aaff', marginBottom: '1rem', fontSize: '1.3rem' }}>
                    🌟 {leaderboardFilter === 'week' ? 'Weekly' : leaderboardFilter === 'month' ? 'Monthly' : 'All-Time'} Champions
                  </h3>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '12px',
                    padding: '1.5rem'
                  }}>
                    {leaderboardData?.topPlayers && leaderboardData.topPlayers.length > 0 ? (
                      leaderboardData.topPlayers.map((player, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          marginBottom: '0.8rem',
                          background: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 
                                     index === 1 ? 'rgba(192, 192, 192, 0.1)' : 
                                     index === 2 ? 'rgba(205, 127, 50, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '10px',
                          border: `2px solid ${index === 0 ? 'rgba(255, 215, 0, 0.3)' : 
                                              index === 1 ? 'rgba(192, 192, 192, 0.3)' : 
                                              index === 2 ? 'rgba(205, 127, 50, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ 
                              fontSize: '1.5rem',
                              minWidth: '3rem',
                              color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#00ff88'
                            }}>
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                            </span>
                            <div>
                              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff' }}>{player.username}</div>
                              <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>{player.gamesPlayed} games played</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#00ff88', fontSize: '1.2rem', fontWeight: '700' }}>{player.wpm} WPM</div>
                            <div style={{ color: '#00aaff', fontSize: '0.95rem' }}>{player.accuracy}% accuracy</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '3rem', color: '#b0b0b0' }}>
                        <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>🏆</span>
                        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No players yet for this period</p>
                        <p>Be the first to set a record!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button 
                onClick={() => {
                  setShowLeaderboard(false);
                  setLeaderboardData(null);
                  setPlayerHistory(null);
                }}
                style={{
                  background: 'linear-gradient(135deg, #00ff88, #00aaff)',
                  color: '#1a1a2e',
                  border: 'none',
                  padding: '0.8rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '2px solid #da70d6',
            borderRadius: '16px',
            padding: '1.5rem',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            color: 'white',
            position: 'relative'
          }}>
            <button 
              onClick={() => {
                setShowProfile(false);
                setPlayerHistory(null);
              }}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#da70d6',
                fontSize: '1.5rem',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              ×
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#da70d6', marginBottom: '1rem', fontSize: '1.6rem' }}>
                👤 {user?.username}'s Profile
              </h2>
              
              {/* User Stats Overview */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '0.8rem',
                marginBottom: '1.5rem' 
              }}>
                <div style={{
                  background: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: '10px',
                  padding: '0.8rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#00ff88' }}>
                    {user?.stats?.bestWPM || 0}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#b0b0b0' }}>Best WPM</div>
                </div>
                
                <div style={{
                  background: 'rgba(0, 170, 255, 0.1)',
                  border: '1px solid rgba(0, 170, 255, 0.3)',
                  borderRadius: '10px',
                  padding: '0.8rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#00aaff' }}>
                    {user?.stats?.gamesPlayed || 0}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#b0b0b0' }}>Games Played</div>
                </div>
                
                <div style={{
                  background: 'rgba(138, 43, 226, 0.1)',
                  border: '1px solid rgba(138, 43, 226, 0.3)',
                  borderRadius: '10px',
                  padding: '0.8rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#da70d6' }}>
                    {user?.stats?.averageAccuracy || 0}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#b0b0b0' }}>Average Accuracy</div>
                </div>
              </div>
            </div>

            {/* Game History */}
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#da70d6', marginBottom: '0.8rem', fontSize: '1.2rem' }}>
                🎮 Recent Game History
              </h3>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '10px',
                padding: '1rem',
                minHeight: '200px',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {playerHistory && playerHistory.length > 0 ? (
                  <div style={{ display: 'grid', gap: '0.6rem' }}>
                    {playerHistory.slice(0, 6).map((game, index) => (
                      <div key={game._id || index} style={{
                        padding: '0.8rem',
                        background: 'linear-gradient(135deg, rgba(218, 112, 214, 0.05) 0%, rgba(138, 43, 226, 0.05) 100%)',
                        borderRadius: '8px',
                        border: '1px solid rgba(218, 112, 214, 0.2)',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto auto',
                        alignItems: 'center',
                        gap: '0.8rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.2rem' }}>
                            Level {game.level} • Score {game.score?.toLocaleString() || 0}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#b0b0b0' }}>
                            {new Date(game.playedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#00ff88', fontSize: '1rem', fontWeight: '700' }}>
                            {game.wpm}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#b0b0b0' }}>WPM</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#00aaff', fontSize: '1rem', fontWeight: '700' }}>
                            {game.accuracy}%
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#b0b0b0' }}>ACC</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#b0b0b0' }}>
                    <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>🎮</span>
                    <p style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>No games played yet</p>
                    <p style={{ fontSize: '0.9rem' }}>Start playing to see your history here!</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button 
                onClick={() => {
                  setShowProfile(false);
                  setPlayerHistory(null);
                }}
                style={{
                  background: 'linear-gradient(135deg, #da70d6, #8a2be2)',
                  color: '#1a1a2e',
                  border: 'none',
                  padding: '0.7rem 1.8rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 

export default App;