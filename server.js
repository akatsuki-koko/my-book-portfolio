// server.js
require('dotenv').config(); // 一番上に！

const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;
const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDBに接続確認
async function startServer() {
  try {
    await client.connect();
    console.log("MongoDBに接続成功！");

    app.listen(port, () => {
      console.log(`サーバーが http://localhost:${port} で起動しました`);
    });
  } catch (err) {
    console.error("MongoDB接続エラー:", err);
  }
}

// POSTリクエストの処理
app.post('/reviews', async (req, res) => {
  const { bookTitle, reviewText, stars } = req.body;

  try {
    const db = client.db('bookSite');
    const collection = db.collection('reviews');

    const result = await collection.insertOne({
      bookTitle,
      reviewText,
      stars,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'レビューを保存しました', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'エラーが発生しました' });
  }
});

console.log("接続文字列：", mongoUri);
startServer();

// server.js の該当箇所に追記
// ─────────────────────────────────────
app.get('/reviews', async (req, res) => {
  try {
    const db = client.db('bookSite');
    const collection = db.collection('reviews');
    // 作成日時の降順で取得（最新が先頭）
    const reviews = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'レビュー取得中にエラーが発生しました' });
  }
});
// ─────────────────────────────────────
