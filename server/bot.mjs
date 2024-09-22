import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import admin from 'firebase-admin';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://client-one-orcin.vercel.app',
  credentials: true
}));
app.use(express.json());


// Firebase初期化
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

// Telegramボット初期化
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// ゲームのURL（実際のフロントエンドのURLに更新してください）
const GAME_URL = 'https://client-one-orcin.vercel.app';
console.log('Game URL:', GAME_URL); // デバッグ用

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome to Alien Tap Game! Type /play to start a new game.');
});

bot.onText(/\/play/, (msg) => {
  bot.sendGame(msg.chat.id, 'alien_tap');
});

bot.on('callback_query', (query) => {
  if (query.game_short_name === 'alien_tap') {
    const gameUrl = `${GAME_URL}?userId=${query.from.id}`;
    console.log('Answering callback query with URL:', gameUrl); // デバッグ用
    bot.answerCallbackQuery(query.id, {
      url: gameUrl,
    }).catch(error => {
      console.error('Error answering callback query:', error);
    });
  }
});

bot.on('inline_query', async (query) => {
  const userId = query.from.id;
  const userRef = db.ref(`users/${userId}`);
  const userSnapshot = await userRef.once('value');
  const userData = userSnapshot.val() || {};
  const highScore = userData.highScore || 0;

  const result = [{
    type: 'article',
    id: '1',
    title: 'Share Your Alien Tap Game Score',
    input_message_content: {
      message_text: `My high score in Alien Tap Game is ${highScore}! Can you beat it? Play now: t.me/AlienTapBot?game=alien_tap`
    },
    description: `Your high score: ${highScore}`,
    thumb_url: 'https://example.com/alien_tap_thumbnail.jpg' // 実際のサムネイル画像URLに更新してください
  }];

  bot.answerInlineQuery(query.id, result);
});

app.post('/update-score', async (req, res) => {
  const { userId, score } = req.body;
  
  try {
    await db.ref('scores').push({
      userId,
      score,
      timestamp: admin.database.ServerValue.TIMESTAMP
    });

    const userRef = db.ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    const userData = userSnapshot.val() || {};
    
    if (!userData.highScore || score > userData.highScore) {
      await userRef.update({ highScore: score });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ success: false, error: 'Failed to update score' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Alien Tap Game Server!' });
});

app.get('/leaderboard', async (req, res) => {
  try {
    const snapshot = await db.ref('users')
      .orderByChild('highScore')
      .limitToLast(10)
      .once('value');
    
    const leaderboard = [];
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      leaderboard.unshift({
        userId: childSnapshot.key,
        highScore: userData.highScore
      });
    });

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

const PORT = process.env.PORT || 3020;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});