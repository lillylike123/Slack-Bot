import 'dotenv/config';
import { App, LogLevel, SocketModeReceiver } from "@slack/bolt";
import OpenAI from "openai";

const openai = new OpenAI ({
  baseURL: "hppts://openrouter"
})