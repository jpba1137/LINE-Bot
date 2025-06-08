// index.js
import express from "express";
import { Client, middleware } from "@line/bot-sdk";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);

app.post("/webhook", middleware(config), async (req, res) => {
  const events = req.body.events;
  for (const event of events) {
    if (event.type === "message" && event.message.type === "text") {
      const userMessage = event.message.text;

      const openaiRes = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "あなたはプロショップ・バーティカルラボのAIスタッフです。営業時間、予約、ドリル、取扱商品に関する質問に親切・丁寧に答えてください。",
            },
            { role: "user", content: userMessage },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const replyText = openaiRes.data.choices[0].message.content;

      await client.replyMessage(event.replyToken, {
        type: "text",
        text: replyText,
      });
    }
  }

  res.send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LINE Bot is running on port ${PORT}`);
});
