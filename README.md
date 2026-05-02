# Chartink Free Scan Alert

Automated stock scanning and Telegram notification system. It runs Chartink scan queries every 5 minutes and sends matching stock alerts to your Telegram channel.

---

## What This Program Does

1. Reads scan queries (conditions) from `.txt` files you create
2. Sends those queries to Chartink every 5 minutes
3. If any stocks match your conditions, it sends a Telegram message with stock names, prices, and TradingView chart links

---

## Prerequisites

You need the following before starting:

- A computer (Windows / Mac / Linux)
- Internet connection
- A Telegram account
- A GitHub account (free)

---

## Step 1: Install Node.js (includes npm)

Node.js is the software that runs this program. npm (Node Package Manager) comes bundled with it.

### On Windows:

1. Go to https://nodejs.org
2. Click the **LTS** (Long Term Support) download button
3. Run the downloaded `.msi` file
4. Click "Next" through all steps, keep defaults
5. Restart your computer after installation

### On Mac:

1. Go to https://nodejs.org
2. Click the **LTS** download button
3. Run the downloaded `.pkg` file
4. Follow the installer steps

### Verify Installation:

Open **Terminal** (Mac/Linux) or **Command Prompt** (Windows) and type:

```bash
node --version
npm --version
```

If you see version numbers (e.g., `v20.x.x` and `10.x.x`), installation was successful.

---

## Step 2: Install Git

Git is used to download the source code.

### On Windows:

1. Go to https://git-scm.com/download/win
2. Download and run the installer
3. Click "Next" through all steps, keep defaults

### On Mac:

Open Terminal and type:

```bash
xcode-select --install
```

Click "Install" when prompted.

### Verify Installation:

```bash
git --version
```

---

## Step 3: Download the Source Code

Open Terminal / Command Prompt and run:

```bash
git clone https://github.com/phalvinayak/chartink_free_alert.git
cd chartink_free_scan_alert
```

---

## Step 4: Install Project Dependencies

Inside the project folder, run:

```bash
npm install
```

This downloads all required libraries automatically. Wait until it finishes.

---

## Step 5: Create a Telegram Bot and Get Credentials

### Create a Bot:

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Give your bot a name (e.g., "My Stock Alerts")
4. Give your bot a username (must end in `bot`, e.g., `mystockalerts_bot`)
5. BotFather will reply with a **Bot Token** — copy it and save it somewhere safe

### Get Your Channel ID:

1. Create a Telegram channel (or use an existing one)
2. Add your bot as an **Administrator** to the channel
3. To find the Channel ID:
   - Forward any message from your channel to **@userinfobot**
   - It will reply with the channel ID (starts with `-100`)

---

## Step 6: Configure Environment Variables

1. In the project folder, create a file named `.env` (just `.env`, no other name)
2. Open it with any text editor (Notepad, TextEdit, VS Code, etc.)
3. Add the following two lines:

```
BOT_TOKEN=your_telegram_bot_token_here
CHANNEL_ID=your_channel_id_here
```

> ⚠️ Do NOT share your `.env` file or bot token with anyone.

---

## Step 7: Create Scan Files

Scan files tell the program what stock conditions to look for on Chartink.

### How to create a scan file:

1. Go to the folder `src/scans/` inside the project
2. Create a new `.txt` file with any name (e.g., `breakout.txt`, `volume_spike.txt`)
3. Paste your Chartink scan query inside the file

### How to get a scan query from Chartink:

1. Go to https://chartink.com/screener
2. Build your scan conditions using the visual editor
3. Click **"Run Scan"** to verify it works
4. Open your browser's **Developer Tools** (press `F12`)
5. Go to the **Network** tab
6. Click "Run Scan" again
7. Look for a request to `process` — click on it
8. In the **Payload** tab, find `scan_clause` — copy its value
9. Paste that value into your `.txt` file

### Example scan file content:

**File:** `src/scans/10_percent_up.txt`

```
( {cash} (  daily "close - 1 candle ago close / 1 candle ago close * 100" >  10 ) )
```

This scans for stocks that went up more than 10% in a day.

### Rules for scan files:

- Each `.txt` file = one scan query
- The file name becomes the alert title in Telegram (e.g., `breakout.txt` → alert title "breakout")
- You can add as many `.txt` files as you want
- One scan query per file (single line or multi-line, both work)

---

## Step 8: Run the Program

```bash
npm start
```

The program will:

1. Immediately run all your scans once
2. Then repeat every 5 minutes automatically
3. Send Telegram messages only when stocks match your conditions

### To change the scanning interval:

Open `src/index.js` and find the line `cron.schedule("*/5 * * * *", runScans);` — change `5` to your desired minutes (e.g., `*/10` for every 10 minutes, `*/15` for every 15 minutes).

### To stop the program:

Press `Ctrl + C` in the terminal.

---

## Telegram Alert Format

When stocks match, you'll receive a message like:

```
🔔🔔🔔 10_percent_up 🔔🔔🔔

📈 RELIANCE - 💰 2450.5
📈 TCS - 💰 3890.2

⏰ Triggered at 14:35
```

Each stock name links to its TradingView chart.

---

## Project Structure

```
chartink_free_scan_alert/
├── src/
│   ├── index.js          # Main application (runs scans every 5 min)
│   ├── utils/
│   │   ├── chartink.js   # Connects to Chartink and fetches results
│   │   └── telegram.js   # Sends messages to Telegram
│   └── scans/            # Your scan query files go here
│       └── scan1.txt     # Example scan file
├── .env                  # Your secret credentials (never share)
├── package.json          # Project configuration
└── README.md             # This file
```

---

## Troubleshooting

| Problem                              | Solution                                            |
| ------------------------------------ | --------------------------------------------------- |
| `node: command not found`            | Restart terminal after installing Node.js           |
| `npm: command not found`             | Reinstall Node.js from https://nodejs.org           |
| No Telegram messages                 | Check bot is admin in channel, verify `.env` values |
| `Error processing scan`              | Verify your scan query works on chartink.com first  |
| Program stops after closing terminal | Use a process manager like `pm2` (see below)        |

### Keep running in background (optional):

```bash
npm install -g pm2
pm2 start src/index.js
pm2 save
```

To stop: `pm2 stop all`

---

## Updating the Code

If the code is updated on GitHub, pull the latest changes:

```bash
git pull
npm install
npm start
```
