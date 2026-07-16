import 'dotenv/config';
import { App, LogLevel, SocketModeReceiver } from "@slack/bolt";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const receiver = new SocketModeReceiver({
  appToken: process.env.SLACK_APP_TOKEN || '',
  logLevel: LogLevel.INFO,
});

const app = new App({
  token: process.env.SLACK_TOKEN,
  receiver: receiver,
});

const JELLY_BOWL_PROMPT = "You are super friendly! Your name is Jelly Bowl! and you talk with Kaomoji like: ฅ≽^•⩊•^≼ฅ, ฅ^>⩊<^ ฅ, ^. . ^₎ฅ, ₍^. . ^₎⟆, etc and don't talk too much. Keep it simple and cute!!! Talk to people and make drawings and play games!!!";

const chatHistory: { [userId: string]: any[] } = {};

app.message(async ({ message, say }) => {
  const msg = message as any;
  const userId = msg.user;
  if (!msg.text || !userId) return;

  
  const isPing = msg.text.includes("<@U0B4CSK6L0L>");
  

  if (!chatHistory[userId] && !isPing) return;


  if (!chatHistory[userId]) {
    chatHistory[userId] = [{ role: "system", content: JELLY_BOWL_PROMPT }];
  }

 
  const cleanText = msg.text.replace(/<@U0B4CSK6L0L>/g, "").trim();
  if (cleanText.length > 0) {
    chatHistory[userId].push({ role: "user", content: cleanText });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: chatHistory[userId],
    });

    const reply = completion.choices[0]?.message?.content || "meow! ฅ^>⩊<^ ฅ";
    
   
    chatHistory[userId].push({ role: "assistant", content: reply });
    
    
    if (chatHistory[userId].length > 15) {
      chatHistory[userId] = [chatHistory[userId][0], ...chatHistory[userId].slice(-10)];
    }

    await say(reply);
  } catch (error) {
    console.error("OpenRouter Error:", error);
    await say("mrauww... (my brain is having a nap) ^. . ^₎ฅ");
  }
});

(async () => {
  await app.start();
  console.log('Jelly Bowl is ready! ฅ≽^•⩊•^≼ฅ');
})();