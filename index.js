const express = require('express');
const line = require('@line/bot-sdk');

// 環境変数からLINEの認証情報を取得
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

const app = express();
app.use(express.json()); // これがないとPOSTでbodyが取れず500エラーになることが多い

// webhookエンドポイント
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err); // エラー内容をログに出す
      res.status(500).end();
    });
});

// イベント処理
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

// サーバ起動
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
