# TypeSlayer Backend API

A comprehensive Node.js backend for the TypeSlayer typing game with MongoDB integration.

## Features

- 🔐 **Authentication System**: JWT-based user registration and login
- 📊 **Game Session Tracking**: Store and analyze player performance data
- 🏆 **Leaderboards**: Multiple ranking systems (score, WPM, levels)
- 🛡️ **Security**: Rate limiting, input validation, CORS protection
- 📈 **Analytics**: Player statistics and progress tracking

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)

### Game Sessions (`/api/games`)
- `POST /session` - Save game session (protected)
- `GET /history` - Get user's game history (protected)
- `GET /stats` - Get user's statistics (protected)
- `DELETE /session/:id` - Delete specific session (protected)

### Leaderboards (`/api/leaderboard`)
- `GET /top-scores` - Global high scores
- `GET /top-wpm` - Fastest WPM rankings
- `GET /top-levels` - Highest levels reached
- `GET /user-rank/:userId` - Get user's rank position

### System
- `GET /api/health` - Health check endpoint

## Database Schema

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  stats: {
    gamesPlayed: Number,
    bestScore: Number,
    bestWPM: Number,
    bestLevel: Number,
    totalWordsTyped: Number,
    averageAccuracy: Number
  },
  timestamps: true
}
```

### GameSession Model
```javascript
{
  user: ObjectId (ref: User),
  score: Number,
  levelReached: Number,
  wpm: Number,
  accuracy: Number,
  wordsTyped: Number,
  durationSeconds: Number,
  gameMode: String (normal/boss_battle/practice),
  gameStats: {
    enemiesDefeated: Number,
    bossesDefeated: Number,
    alliesHelped: Number,
    livesLost: Number
  },
  timestamps: true
}
```

## Environment Variables

Create a `.env` file in the server directory:

```env
MONGODB_URI=mongodb://localhost:27017/typeslayer
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
PORT=5001
CLIENT_URL=http://localhost:3000
```

## Installation & Setup

1. **Install MongoDB** (if running locally):
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb/brew/mongodb-community
   
   # Ubuntu
   sudo apt install mongodb
   sudo systemctl start mongod
   ```

2. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Start Server**:
   ```bash
   npm start
   ```

   Server will run at `http://localhost:5001`

## Testing

Run the comprehensive API test suite:

```bash
node test-api.js
```

This will test all endpoints and demonstrate the complete functionality.

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Short-lived access tokens
- **Rate Limiting**: Protection against spam/abuse
- **Input Validation**: Joi schema validation
- **CORS Configuration**: Secure cross-origin requests
- **Helmet**: Security headers

## Game Integration

The backend is designed to integrate with the existing Phaser-based TypeSlayer game:

1. **User Registration/Login**: Players create accounts and authenticate
2. **Session Tracking**: Game sends session data after each playthrough
3. **Statistics**: Real-time stat updates and historical tracking
4. **Leaderboards**: Competitive rankings across multiple metrics

## Sample Game Session Data

```javascript
{
  "score": 2200,
  "levelReached": 4,
  "wpm": 78,
  "accuracy": 94.2,
  "wordsTyped": 180,
  "durationSeconds": 240,
  "gameMode": "boss_battle",
  "gameStats": {
    "enemiesDefeated": 22,
    "bossesDefeated": 4,
    "alliesHelped": 5,
    "livesLost": 2
  }
}
```

## Development

- **MongoDB Connection**: Auto-connects on server start
- **Error Handling**: Comprehensive error middleware
- **Logging**: Console logging for development
- **CORS**: Configured for frontend development

## Production Deployment

1. Set up MongoDB Atlas or production MongoDB instance
2. Update `MONGODB_URI` in production environment
3. Generate secure `JWT_SECRET`
4. Configure production `CLIENT_URL`
5. Enable MongoDB connection security
6. Set up process manager (PM2, Docker, etc.)

The backend is ready for production deployment and scales well with the gaming application's needs.