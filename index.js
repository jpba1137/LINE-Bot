const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');

// 環境変数から値を取得
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const app = express();

// webhookエンドポイント
app.post('/webhook', middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

// メッセージのハンドラ
function handleEvent(event) {
  // テキストメッセージ以外は無視
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // オウム返し（送られた内容をそのまま返す）
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

// LINE Botクライアントの生成
const client = new Client(config);

// ポート指定（Renderの場合は process.env.PORT 推奨）
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
