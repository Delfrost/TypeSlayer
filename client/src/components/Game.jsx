import React, { useEffect, useRef, useState, useCallback } from "react";
import { initializeGame, destroyGame } from "../game/main.js";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Game = ({ onRestart }) => {
  const gameRef = useRef(null);
  const inputRef = useRef(null);
  const bridgeRef = useRef({});

  // Layout preference: 'left' = Game Left / Typing Right, 'right' = Game Right / Typing Left
  const [layoutSide, setLayoutSide] = useState(() => {
    try {
      return localStorage.getItem('typeslayer_side') || 'left';
    } catch {
      return 'left';
    }
  });

  const [activeWords, setActiveWords] = useState([]);
  const [bossState, setBossState] = useState({ active: false, sentence: '', typedCount: 0, retreating: false });
  const [bossError, setBossError] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const { user, isAuthenticated, updateUserStats } = useAuth();

  const handleGameComplete = async (gameSessionData) => {
    if (!isAuthenticated) return;
    try {
      const response = await axios.post('/games/session', gameSessionData);
      if (response.data.success) {
        updateUserStats(response.data.updatedStats);
      }
    } catch (error) {
      console.error('❌ Failed to save game session:', error);
    }
  };

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const toggleLayout = (e) => {
    e.stopPropagation();
    const next = layoutSide === 'left' ? 'right' : 'left';
    setLayoutSide(next);
    try {
      localStorage.setItem('typeslayer_side', next);
    } catch {
      // ignore storage error
    }
    setTimeout(focusInput, 50);
  };

  useEffect(() => {
    if (gameRef.current) {
      bridgeRef.current = {
        onWordsUpdate: (words) => {
          setActiveWords(words);
        },
        onBossUpdate: (boss) => {
          setBossState(boss);
          if (boss.active) {
            setCurrentInput('');
          }
        }
      };

      initializeGame(gameRef.current, handleGameComplete, bridgeRef.current);
      focusInput();
    }

    return () => {
      destroyGame();
    };
  }, [focusInput]);

  const handleRestartGame = () => {
    if (gameRef.current) {
      destroyGame();
      setActiveWords([]);
      setBossState({ active: false, sentence: '', typedCount: 0 });
      setCurrentInput('');
      initializeGame(gameRef.current, handleGameComplete, bridgeRef.current);
      focusInput();
    }
  };

  useEffect(() => {
    if (onRestart) {
      window.gameRestartHandler = handleRestartGame;
    }
    return () => {
      delete window.gameRestartHandler;
    };
  }, [onRestart]);

  // Keep input focused automatically on any typing action
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' && e.target !== inputRef.current) return;
      if (e.target.tagName === 'TEXTAREA') return;
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Regular typing: Instant auto-slay on complete match
  const handleInputChange = (e) => {
    if (bossState.active) return;
    const val = e.target.value;
    const trimmed = val.trim().toLowerCase();

    const matched = activeWords.find(w => w.word.toLowerCase() === trimmed);
    if (matched) {
      bridgeRef.current.typeWord?.(trimmed);
      setCurrentInput('');
    } else {
      setCurrentInput(val);
    }
  };

  // Boss mode typing: character-by-character live progress with backspace support
  const handleKeyDown = (e) => {
    if (bossState.active) {
      if (e.key === 'Backspace') {
        e.preventDefault();
        bridgeRef.current.backspaceBossChar?.();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const ok = bridgeRef.current.typeBossChar?.(e.key);
        if (ok === false) {
          setBossError(true);
          setTimeout(() => setBossError(false), 220);
        }
      }
    } else {
      if (e.key === 'Escape') {
        setCurrentInput('');
      }
    }
  };

  return (
    <div className={`game-split-layout layout-${layoutSide}`} onClick={focusInput}>
      {/* Game Canvas Panel (800x600) */}
      <div className="game-canvas-panel">
        <div 
          ref={gameRef} 
          id="game-container"
          className="game-canvas"
          style={{
            width: '800px',
            height: '600px',
            border: '2px solid #333333',
            borderRadius: '12px',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)',
            background: '#0a0a0a',
            overflow: 'hidden' 
          }}
        />
      </div>

      {/* Side-by-Side Typing Console Panel (Matches 600px height) */}
      <div className="typing-console-panel">
        {/* Console Header & Layout Swap Button */}
        <div className="console-header">
          <div className="console-title">
            <span className="console-icon">⚔️</span>
            <span>SLAYER CONSOLE</span>
          </div>
          <button 
            type="button" 
            className="layout-swap-btn" 
            onClick={toggleLayout}
            title="Click to switch sides between Game Screen and Typing Console"
          >
            ⇄ Screen: {layoutSide === 'left' ? 'Left' : 'Right'}
          </button>
        </div>

        {/* Console Content: Boss Mode vs Minion Mode */}
        {bossState.active ? (
          <div className="console-boss-card">
            <div className="boss-alert-header">
              <span className="boss-flame">🔥</span>
              <span className="boss-heading">
                {bossState.retreating ? 'BOSS RETREATING' : 'DARK LORD APPROACHES'}
              </span>
              <span className="boss-flame">🔥</span>
            </div>

            <div className="boss-instruction">
              {bossState.retreating 
                ? 'Strike landed! Prepare for the next attack...' 
                : 'Type the exact sentence below to strike the boss!'}
            </div>

            <div className={`boss-sentence-box ${bossError ? 'box-error' : ''} ${bossState.retreating ? 'box-retreating' : ''}`}>
              <span className="boss-char-typed">{bossState.sentence.slice(0, bossState.typedCount)}</span>
              {!bossState.retreating && <span className="boss-char-cursor">|</span>}
              <span className="boss-char-remaining">{bossState.sentence.slice(bossState.typedCount)}</span>
            </div>

            <div className="boss-progress-bar-bg">
              <div 
                className="boss-progress-bar-fill"
                style={{ 
                  width: `${bossState.sentence.length > 0 ? (bossState.typedCount / bossState.sentence.length) * 100 : 0}%` 
                }}
              />
            </div>

            <div className="boss-counter-row">
              <span>PROGRESS</span>
              <span>{bossState.typedCount} / {bossState.sentence.length} CHARS</span>
            </div>

            <input
              ref={inputRef}
              type="text"
              className="game-typing-input-hidden"
              onKeyDown={handleKeyDown}
              autoFocus
              readOnly
            />
          </div>
        ) : (
          <div className="console-minions-card">
            <div className="minions-header-row">
              <span className="minions-count-label">
                DEMONS ON PATH ({activeWords.length})
              </span>
              <span className="minions-closest-hint">Closest demon first!</span>
            </div>

            {/* Scrollable list of approaching words */}
            <div className="minions-scroll-rack">
              {activeWords.length === 0 ? (
                <div className="minions-empty-state">
                  <span>🛡️ Stone road is clear...</span>
                  <small>Prepare for the next wave!</small>
                </div>
              ) : (
                activeWords.map((item, index) => {
                  const lowerWord = item.word.toLowerCase();
                  const isMatch = currentInput && lowerWord.startsWith(currentInput.toLowerCase());
                  const matchLen = isMatch ? currentInput.length : 0;
                  const isClosest = index === 0;

                  return (
                    <div
                      key={item.id}
                      className={`minion-word-row ${isMatch ? 'row-matched' : ''} ${item.isAlly ? 'row-ally' : ''} ${isClosest ? 'row-closest' : ''}`}
                      style={{ borderLeftColor: item.color || '#00ff88' }}
                    >
                      <div className="minion-row-left">
                        <span className="minion-icon">{item.isAlly ? '✨' : '👹'}</span>
                        <div className="minion-word-text">
                          <span className="matched-chars">{item.word.slice(0, matchLen)}</span>
                          <span className="remaining-chars">{item.word.slice(matchLen)}</span>
                        </div>
                      </div>

                      <div className="minion-row-right">
                        {isClosest && !item.isAlly && (
                          <span className="danger-tag">NEAREST</span>
                        )}
                        {item.isAlly && (
                          <span className="ally-tag">ALLY</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Dedicated typing input */}
            <div className="console-input-section">
              <input
                ref={inputRef}
                type="text"
                className="console-typing-input"
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type demon word to slay..."
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
              <div className="input-instant-hint">
                ⚡ Auto-slay on word completion — No Enter needed!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;