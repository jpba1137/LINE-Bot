// 必要モジュールの読み込み
const express = require('express');
const line = require('@line/bot-sdk');

// 環境変数からキーを読み込み
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// LINEクライアントを生成
const client = new line.Client(config);

// Expressアプリ生成
const app = express();

// Webhook受信エンドポイント
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// イベントごとの処理
function handleEvent(event) {
  // メッセージイベント以外は無視
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  // 受け取ったメッセージをそのまま返す
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text,
  });
}

// ポート番号（Renderは自動指定）
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
