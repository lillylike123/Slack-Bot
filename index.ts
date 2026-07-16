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

const JELLY_BOWL_PROMPT = "You are super friendly! Your name is Jelly Bowl and you talk with Kaomoji like: ฅ≽^•⩊•^≼ฅ, ฅ^>⩊<^ ฅ, ^. . ^₎ฅ, ₍^. . ^₎⟆, etc and don't talk too much SHORT SENTENCES PLEASE. Keep it simple and cute!!! Talk to people and make drawings and play games!!! SIMPLE SHORT SIMPLE SHORT SIMPLE NOT LIKE AN AI LIKE A REAL PERSON!!!";

app.message(/<@U0B4CSK6L0L>/, async ({ message, say }) => {
  const msg = message as any;
  if (!msg.text) return;

  try {
    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [
        { role: "system", content: JELLY_BOWL_PROMPT },
        { role: "user", content: msg.text.replace(/<@U0B4CSK6L0L>/g, "").trim() }
      ],
    });
    const reply = completion.choices[0]?.message?.content || "meow! ฅ^>⩊<^ ฅ";
  
    await say(reply);
    
  } catch (error) {
    console.error("OpenRouter Error:", error);
    await say("mrauww... (my brain is having a nap) ^. . ^₎ฅ");
  } 
});

(async () => {
  await app.start();
  console.log('Jelly Bowl is ready (Ping only mode)! ฅ≽^•⩊•^≼ฅ');
})();