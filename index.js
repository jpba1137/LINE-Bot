const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('受信:', req.body); // サーバーログ確認用（何か来たか見るだけ）
  res.status(200).end(); // 必ず200を返す。ここが最重要！
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('サーバー起動: ', PORT);
});
