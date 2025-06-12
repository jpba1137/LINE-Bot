const express = require('express');
const line    = require('@line/bot-sdk');

const config = {
  channelAccessToken : process.env.LINE_ACCESS_TOKEN,
  channelSecret      : process.env.LINE_CHANNEL_SECRET,
};

const app    = express();
const client = new line.Client(config);

// Webhook エンドポイント
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    // すべてのイベントを並列処理
    .all(req.body.events.map(handleEvent))
    .then(() => res.status(200).end())
    .catch(err => {
      console.error('[ERROR]', err);
      res.status(500).end();
    });
});

// 1 件のイベント処理
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // テキスト以外は無視
    return Promise.resolve(null);
  }

  // 受け取ったテキストをそのまま返す
  const replyText = `Echo: ${event.message.text}`;
  return client.replyMessage(event.replyToken, { type: 'text', text: replyText });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
