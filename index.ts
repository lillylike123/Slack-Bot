import 'dotenv/config';
import { App, LogLevel, SocketModeReceiver } from "@slack/bolt";
import OpenAI  from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const  receiver = new SocketModeReceiver({
  appToken: process.env.SLACK_APP_TOKEN || '',
  logLevel:   LogLevel.INFO,
});

const app = new App({
  token: process.env.SLACK_TOKEN,
  receiver: receiver,
});

    const JELLY_BOWL_PROMPT ="You are Jelly Bowl. You are super friendly and cute. ONLY talk as Jelly Bowl. NEVER output technical labels, system logs, or security labels like 'user: safe'. Use Kaomoji like ฅ≽^•⩊•^≼ฅ and ฅ^>⩊<^ ฅ. Keep it simple, cute, and play games!(REMEMBER SIMPLE SIMPLE SIMPLE)";

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

    let reply = completion.choices[0]?.message?.content || "meow! ฅ^>⩊<^ ฅ";
    
    
    reply = reply.replace(/user: safe/gi, "").replace(/system: safe/gi, "").trim();

    await say(reply);
    
  } catch (error) {
    console.error("OpenRouter Error:", error);
        await say("Zzzzz :) ... (my brain is having a nap) ^. . ^₎ฅ");
  } 
});

(async () => {
  await app.start();
  console.log('Jelly Bowl is  super ready!!! ฅ≽^•⩊•^≼ฅ');
})();