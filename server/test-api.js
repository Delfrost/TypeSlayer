const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';
let authToken = '';
let userId = '';

async function testAPI() {
  console.log('🧪 Testing TypeSlayer API endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health:', health.data);
    console.log();

    // Test 2: User Registration
    console.log('2️⃣ Testing User Registration...');
    const registerData = {
      username: 'testplayer',
      email: 'test@example.com',
      password: 'password123'
    };
    const register = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration successful');
    authToken = register.data.token;
    userId = register.data.user.id;
    console.log(`📝 User ID: ${userId}`);
    console.log();

    // Test 3: User Profile
    console.log('3️⃣ Testing User Profile...');
    const profile = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile:', profile.data.user.username);
    console.log();

    // Test 4: Save Game Session
    console.log('4️⃣ Testing Game Session Save...');
    const gameSessionData = {
      score: 1500,
      levelReached: 3,
      wpm: 65,
      accuracy: 92.5,
      wordsTyped: 120,
      durationSeconds: 180,
      gameMode: 'normal',
      gameStats: {
        enemiesDefeated: 15,
        bossesDefeated: 2,
        alliesHelped: 3,
        livesLost: 1
      }
    };
    const gameSession = await axios.post(`${BASE_URL}/games/session`, gameSessionData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Game session saved');
    console.log(`📊 Updated stats:`, gameSession.data.updatedStats);
    console.log();

    // Test 5: Another Game Session for better leaderboard data
    console.log('5️⃣ Adding another game session...');
    const gameSession2Data = {
      score: 2200,
      levelReached: 4,
      wpm: 78,
      accuracy: 94.2,
      wordsTyped: 180,
      durationSeconds: 240,
      gameMode: 'boss_battle',
      gameStats: {
        enemiesDefeated: 22,
        bossesDefeated: 4,
        alliesHelped: 5,
        livesLost: 2
      }
    };
    await axios.post(`${BASE_URL}/games/session`, gameSession2Data, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Second game session saved');
    console.log();

    // Test 6: Get Game History
    console.log('6️⃣ Testing Game History...');
    const history = await axios.get(`${BASE_URL}/games/history?limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Game History:', `${history.data.sessions.length} sessions found`);
    console.log(`📈 Best session: ${Math.max(...history.data.sessions.map(s => s.score))} points`);
    console.log();

    // Test 7: Get User Stats
    console.log('7️⃣ Testing User Stats...');
    const stats = await axios.get(`${BASE_URL}/games/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ User Stats:');
    console.log(`   Games Played: ${stats.data.overallStats.gamesPlayed}`);
    console.log(`   Best Score: ${stats.data.overallStats.bestScore}`);
    console.log(`   Best WPM: ${stats.data.overallStats.bestWPM}`);
    console.log(`   Best Level: ${stats.data.overallStats.bestLevel}`);
    console.log();

    // Test 8: Top Scores Leaderboard
    console.log('8️⃣ Testing Top Scores Leaderboard...');
    const topScores = await axios.get(`${BASE_URL}/leaderboard/top-scores?limit=5`);
    console.log('✅ Top Scores:', `${topScores.data.leaderboard.length} entries`);
    topScores.data.leaderboard.forEach(entry => {
      console.log(`   ${entry.rank}. ${entry.username}: ${entry.score} points (Level ${entry.level})`);
    });
    console.log();

    // Test 9: Top WPM Leaderboard
    console.log('9️⃣ Testing Top WPM Leaderboard...');
    const topWPM = await axios.get(`${BASE_URL}/leaderboard/top-wpm?limit=5`);
    console.log('✅ Top WPM:', `${topWPM.data.leaderboard.length} entries`);
    topWPM.data.leaderboard.forEach(entry => {
      console.log(`   ${entry.rank}. ${entry.username}: ${entry.wpm} WPM (${entry.accuracy}% accuracy)`);
    });
    console.log();

    // Test 10: User Rank
    console.log('🔟 Testing User Rank...');
    const userRank = await axios.get(`${BASE_URL}/leaderboard/user-rank/${userId}?category=score`);
    console.log('✅ User Rank:', `#${userRank.data.rank} out of ${userRank.data.totalUsers} players`);
    console.log();

    // Test 11: Login (existing user)
    console.log('1️⃣1️⃣ Testing User Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    const login = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ Login successful');
    console.log(`🎮 Welcome back, ${login.data.user.username}!`);

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📋 API Endpoint Summary:');
    console.log('Auth: /api/auth/register, /api/auth/login, /api/auth/profile');
    console.log('Games: /api/games/session, /api/games/history, /api/games/stats');
    console.log('Leaderboards: /api/leaderboard/top-scores, /api/leaderboard/top-wpm, /api/leaderboard/user-rank');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();