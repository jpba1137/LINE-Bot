const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret:      process.env.LINE_CHANNEL_SECRET
};

const client = new Client(config);
const app    = express();

/* ❶ Webhook 入口 */
app.post('/webhook', middleware(config), (req, res) => {
  /* LINE 側には 200 を即返す（タイムアウト防止）*/
  res.status(200).end();

  /* 受け取ったイベントをすべて処理 */
  Promise
    .all(req.body.events.map(handleEvent))
    .catch(err => console.error('handleEvent Error:', err));
});

/* ❷ イベント処理 */
function handleEvent(event) {
  // テキストメッセージ以外は無視
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  // そのままオウム返し
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

/* ❸ 起動 */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at port ${port}`));
