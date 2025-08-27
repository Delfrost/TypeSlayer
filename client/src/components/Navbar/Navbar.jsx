import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ 
  currentView, 
  onNavigate, 
  onShowLeaderboard, 
  onShowLogin, 
  onShowRegister, 
  onRestartGame 
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    if (currentView === 'game') {
      onNavigate('welcome');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div 
          className="navbar-logo" 
          onClick={() => onNavigate('welcome')}
        >
          ⚔️ TypeSlayer
        </div>

        {/* Navigation Links */}
        <div className="navbar-nav">
          <button 
            className="nav-link"
            onClick={() => onNavigate('welcome')}
          >
            Home
          </button>
          
          <button 
            className="nav-link"
            onClick={onShowLeaderboard}
          >
            🏆 Leaderboard
          </button>

          {/* Game Controls - only show when in game and authenticated */}
          {currentView === 'game' && isAuthenticated && (
            <>
              <button 
                className="nav-link game-control"
                onClick={onRestartGame}
              >
                🔄 Restart
              </button>
            </>
          )}
        </div>

        {/* User Section */}
        <div className="navbar-user">
          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-avatar">👤</span>
                <span className="user-name">{user?.username}</span>
                <span className="user-dropdown">▼</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown-menu">
                  <div className="user-stats-preview">
                    <div className="stat-preview">
                      <span className="stat-label">Best Score</span>
                      <span className="stat-value">{user?.stats?.bestScore || 0}</span>
                    </div>
                    <div className="stat-preview">
                      <span className="stat-label">Best WPM</span>
                      <span className="stat-value">{user?.stats?.bestWPM || 0}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="auth-btn login"
                onClick={onShowLogin}
              >
                Sign In
              </button>
              <button 
                className="auth-btn register"
                onClick={onShowRegister}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;