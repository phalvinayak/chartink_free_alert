import "dotenv/config";
import fs from "fs";
import cron from "node-cron";
import path from "path";
import { getDataFromChartink } from "./utils/chartink.js";
import { sendTelegramMessage } from "./utils/telegram.js";

async function runScans() {
  const scansDir = path.join(process.cwd(), "src", "scans");
  const scanFiles = fs
    .readdirSync(scansDir)
    .filter((file) => file.endsWith(".txt"));

  for (const file of scanFiles) {
    const payload = fs.readFileSync(path.join(scansDir, file), "utf8").trim();
    console.log(`Processing ${file}...`);

    try {
      const data = await getDataFromChartink(payload);
      console.log(`${file}: ${data.length} results`);

      if (data.length > 0) {
        const currTime = new Date();
        const fileName = file.substring(0, file.lastIndexOf("."));
        let message = `🔔🔔🔔 ${fileName} 🔔🔔🔔\n\n`;
        data.forEach((stock, index) => {
          message += `📈 [${
            stock.nsecode
          }](https://www.tradingview.com/chart/?symbol=NSE:${stock.nsecode.toUpperCase()}&interval=D) - 💰 ${
            stock.close
          }\n`;
        });
        message += `\n⏰ Triggered at ${currTime.getHours()}:${currTime.getMinutes()}`;
        await sendTelegramMessage(message);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
}

cron.schedule("*/5 * * * *", runScans);
runScans();

export { getDataFromChartink };
