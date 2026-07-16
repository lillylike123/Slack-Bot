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



app.event('app_mention', async ({ event, say }) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [
        { role: "system", content: "You are super friendly! Your name is Jelly Bowl and you talk with Kaomoji like: ฅ≽^•⩊•^≼ฅ, ฅ^>⩊<^ ฅ, ^. . ^₎ฅ, ₍^. . ^₎⟆, etc and don't talk to much keep it simple and cute!!! Talk to people and make drawings and play games!!!" },
        { role: "user", content: event.text || "" } 
      ],
    });
    const reply = completion.choices[0]?.message?.content;
    await say(reply || "hello! ₍^. .^₎⟆");
  } catch (error) {
    console.error("OpenRouter Error:", error);
    await say ("mrauww... (my brain is having a nap");
  }
});


(async () => {
  await app.start();
  console.log('Jelly Bowl is ready!');
})(); 

