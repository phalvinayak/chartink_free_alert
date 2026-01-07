import axios from "axios";
import https from "https";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

function getTelegramAPI() {
  const botToken = process.env.BOT_TOKEN;
  if (!botToken || !/^\d+:[A-Za-z0-9_-]+$/.test(botToken)) {
    throw new Error("Invalid or missing BOT_TOKEN");
  }
  return `https://api.telegram.org/bot${botToken}/sendMessage`;
}

export async function sendTelegramMessage(text) {
  return axios.post(getTelegramAPI(), {
    chat_id: process.env.CHANNEL_ID,
    text,
    parse_mode: "Markdown",
  }, {
    httpsAgent
  });
}
