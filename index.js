// 必要なモジュール
const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

console.log('Token:', process.env.LINE_ACCESS_TOKEN);  // ←デバッグ用
console.log('Secret:', process.env.LINE_CHANNEL_SECRET); // ←デバッグ用

const app = express();
app.use(express.json());

// Webhookエンドポイント
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

// メインイベント処理
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

const client = new line.Client(config);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
