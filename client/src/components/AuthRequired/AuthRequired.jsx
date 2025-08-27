import React from 'react';
import './AuthRequired.css';

const AuthRequired = ({ onShowLogin, onShowRegister }) => {
  return (
    <div className="auth-required">
      <div className="auth-required-content">
        <div className="auth-icon">🔒</div>
        <h2 className="auth-title">Authentication Required</h2>
        <p className="auth-message">
          You need to sign in to track your progress, save your scores, and compete on the leaderboards!
        </p>
        
        <div className="auth-benefits">
          <div className="benefit-item">
            <span className="benefit-icon">📊</span>
            <span>Track your typing progress</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🏆</span>
            <span>Compete on leaderboards</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">💾</span>
            <span>Save your game history</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">📈</span>
            <span>View detailed statistics</span>
          </div>
        </div>

        <div className="auth-actions">
          <button 
            className="auth-action-btn primary"
            onClick={onShowRegister}
          >
            Create Free Account
          </button>
          <button 
            className="auth-action-btn secondary"
            onClick={onShowLogin}
          >
            Sign In
          </button>
        </div>

        <div className="auth-note">
          <p>It's completely free and takes less than 30 seconds!</p>
        </div>
      </div>
    </div>
  );
};

export default AuthRequired;