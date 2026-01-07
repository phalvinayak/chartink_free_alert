# Chartink Free Scan Alert

Automated stock scanning and Telegram notification system using Chartink data.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Create `.env` file:
   ```
   BOT_TOKEN=your_telegram_bot_token
   CHANNEL_ID=your_telegram_channel_id
   ```

3. **Add scan files**
   Place your scan queries in `src/scans/` as `.txt` files.

## Run

```bash
npm start
```

The application runs every 5 minutes and sends Telegram alerts when stocks match your scans.

## Project Structure

```
src/
├── index.js          # Main application
├── utils/
│   ├── chartink.js   # Chartink API integration
│   └── telegram.js   # Telegram messaging
└── scans/            # Scan query files (.txt)
```