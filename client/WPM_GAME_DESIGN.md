# Game-Based WPM Calculation System Design

## Problem with Traditional WPM in Games

Traditional WPM calculation: `(characters typed / 5) / minutes`

**Issues for TypeSlayer:**
1. **Inactive Time**: Includes time between enemies, pause screens, menus
2. **Variable Word Difficulty**: "fire" vs "transcendence" shouldn't be weighted equally  
3. **No Burst Recognition**: Fast completion of hard words not rewarded
4. **Game Mechanics**: Boss battles, power-ups, and special events affect flow

## Proposed Multi-Metric WPM System

### 1. Active Typing Time (ATT)
Only count time when user is actively typing:
- Start timer when first key is pressed for an enemy
- Pause timer when enemy is defeated
- Resume on next enemy
- Exclude: menu time, pause time, boss intro animations

### 2. Per-Enemy Burst WPM
Calculate WPM for each individual enemy:
```javascript
enemyWPM = (word.length / 5) / (timeToComplete / 60)
```
Track best bursts for leaderboard highlights.

### 3. Difficulty-Weighted WPM
Different enemies have different base difficulties:
```javascript
difficultyMultipliers = {
  level1: 1.0,    // "fire", "ice" 
  level2: 1.2,    // "blaze", "frost"
  level3: 1.5,    // "inferno", "blizzard"
  level4: 2.0,    // "pyroblast", "absolute"
  level5: 2.5,    // "cataclysm", "devastation"
  boss: 3.0       // Full sentences
}

weightedWPM = rawWPM * difficultyMultiplier
```

### 4. Sustained Game WPM
The primary metric for leaderboards:
```javascript
sustainedWPM = (totalWeightedCharacters / 5) / (activeTypingMinutes)
```

### 5. Accuracy-Adjusted Final Score
```javascript
finalScore = sustainedWPM * (accuracy / 100) * gameCompletionBonus
```

## Implementation Plan

### Phase 1: Active Time Tracking
- Add `activeTypingTime` to gameState
- Start/stop timer on enemy engagement
- Update existing WPM display to use active time

### Phase 2: Burst WPM Tracking  
- Calculate per-enemy WPM
- Store best bursts in session
- Add burst highlights to UI

### Phase 3: Difficulty Weighting
- Add difficulty multipliers to word data
- Calculate weighted character counts
- Update leaderboard scoring

### Phase 4: Enhanced Statistics
- Track multiple WPM metrics simultaneously
- Add detailed post-game statistics
- Implement advanced leaderboard categories

## Benefits

1. **Fair Comparison**: Players compared on actual typing time
2. **Skill Recognition**: Difficult words properly weighted  
3. **Engagement**: Multiple metrics create different goals
4. **Accuracy**: True representation of typing speed in game context
5. **Progression**: Players can improve specific aspects (bursts vs sustained)

## Leaderboard Categories

1. **Overall Score**: Difficulty-weighted sustained WPM with accuracy
2. **Pure Speed**: Raw active WPM for speed demons  
3. **Accuracy Master**: Highest accuracy with minimum WPM threshold
4. **Burst Champion**: Highest single-enemy WPM
5. **Endurance King**: Best sustained WPM in longest sessions