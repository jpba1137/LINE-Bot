// 必要なモジュール読み込み
const express = require('express');
const line = require('@line/bot-sdk');
const dotenv = require('dotenv');

dotenv.config(); // .envファイルの読み込み

// LINEの設定
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// LINEクライアント作成
const client = new line.Client(config);

// Express アプリ作成
const app = express();
app.use(express.json());

// Webhookエンドポイント
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// イベント処理
function handleEvent(event) {
  // テキストメッセージ以外は無視
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // 同じメッセージを返すだけ
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `「${event.message.text}」ですね。了解しました！`,
  });
}

// ポート番号設定
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
