# 🤖 Discord Payout Bot with Admin Panel

A complete Discord bot system featuring automated payout distribution announcements with a beautiful web-based admin panel for easy management.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-green)
![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2)

## ✨ Features

### 🎯 **Discord Bot**
- ✅ Automated payout distribution announcements
- ✅ Rich Discord embeds with professional formatting
- ✅ Custom message posting capabilities
- ✅ Special announcement formatting
- ✅ All messages appear as sent by the bot automatically

### 💻 **Web Admin Panel**
- ✅ Beautiful dark-themed responsive interface
- ✅ Secure password-based authentication
- ✅ Easy payout form (name, amount, transaction ID, notes)
- ✅ Custom message composer with embed options
- ✅ Announcement sender with special formatting
- ✅ Complete payout history viewer
- ✅ Real-time statistics dashboard
- ✅ Toast notifications for actions

### 💾 **Database**
- ✅ SQLite database for persistent storage
- ✅ Complete payout history tracking
- ✅ Custom message logging
- ✅ Search and filter capabilities

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- A Discord account with server admin access
- Discord bot token (see Setup Guide below)

### Installation

1. **Clone or download this project**
   ```bash
   cd discord-payout-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   DISCORD_BOT_TOKEN=your_bot_token_here
   DISCORD_CHANNEL_ID=your_channel_id_here
   ADMIN_PASSWORD=your_secure_password_here
   SESSION_SECRET=random_secret_key_here
   PORT=3000
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the admin panel**
   
   Open your browser and go to: `http://localhost:3000`

## 🔧 Discord Bot Setup

### Step 1: Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name (e.g., "Payout Bot")
4. Click "Create"

### Step 2: Create a Bot

1. In your application, go to the "Bot" section
2. Click "Add Bot"
3. Click "Reset Token" and copy your bot token
4. **Important:** Save this token in your `.env` file as `DISCORD_BOT_TOKEN`

### Step 3: Configure Bot Permissions

1. In the "Bot" section, enable these **Privileged Gateway Intents**:
   - ❌ Presence Intent (not needed)
   - ❌ Server Members Intent (not needed)
   - ❌ Message Content Intent (not needed)

2. Scroll down to "Bot Permissions" and select:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Read Messages/View Channels

### Step 4: Invite Bot to Your Server

1. Go to the "OAuth2" → "URL Generator" section
2. Select **Scopes**: `bot`
3. Select **Bot Permissions**: 
   - Send Messages
   - Embed Links
   - Read Messages/View Channels
4. Copy the generated URL and open it in your browser
5. Select your server and authorize the bot

### Step 5: Get Your Channel ID

1. Enable Developer Mode in Discord:
   - Settings → Advanced → Enable Developer Mode
2. Right-click on the channel where you want the bot to post
3. Click "Copy ID"
4. Save this in your `.env` file as `DISCORD_CHANNEL_ID`

## 📖 Usage

### Logging In

1. Open `http://localhost:3000` in your browser
2. Enter the password you set in `.env`
3. Click "Login"

### Sending a Payout

1. Click the **"💰 Send Payout"** tab
2. Fill in the form:
   - **Recipient Name**: Person receiving the payout
   - **Amount**: Payment amount (e.g., $500.00)
   - **Transaction ID**: Unique transaction identifier
   - **Notes** (optional): Additional information
3. Click "📤 Send to Discord"
4. The message will appear in your Discord channel!

### Sending Custom Messages

1. Click the **"✉️ Custom Message"** tab
2. Type your message
3. (Optional) Enable "Use Rich Embed" for formatted messages
4. Click "📤 Send to Discord"

### Sending Announcements

1. Click the **"📢 Announcement"** tab
2. Type your announcement
3. Click "📢 Send Announcement"
4. The announcement will appear with special gold formatting!

### Viewing History

1. Click the **"📊 History"** tab
2. View all past payouts with details
3. Click "🔄 Refresh" to update

## 📁 Project Structure

```
discord-payout-bot/
├── src/
│   ├── bot/
│   │   ├── index.js           # Discord bot main file
│   │   └── embedBuilder.js    # Discord embed utilities
│   ├── database/
│   │   ├── db.js              # Database wrapper
│   │   └── schema.sql         # Database schema
│   ├── server/
│   │   ├── index.js           # Express server
│   │   ├── routes.js          # API routes
│   │   └── middleware/
│   │       └── auth.js        # Authentication middleware
│   └── index.js               # Application entry point
├── public/
│   ├── index.html             # Admin panel HTML
│   ├── css/
│   │   └── styles.css         # Admin panel styles
│   └── js/
│       └── app.js             # Admin panel JavaScript
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🎨 Discord Embed Preview

When you send a payout, it will appear in Discord like this:

```
🤖 Payout Bot
━━━━━━━━━━━━━━━
💰 Payout Distribution
A new payout has been processed successfully!

👤 Recipient: John Doe
💵 Amount: $500.00
🔖 Transaction ID: TXN-12345-ABCDEF
📝 Notes: Monthly reward payout

Automated Payout System • Today at 2:30 PM
```

## 🔒 Security

- Passwords are compared securely
- Session management for admin panel
- Environment variables for sensitive data
- Input validation and sanitization
- SQL injection protection via parameterized queries

## 🌐 Deployment Options

### Local Development
```bash
npm start
```

### Production (PM2)
```bash
npm install -g pm2
pm2 start src/index.js --name payout-bot
pm2 save
pm2 startup
```

### Docker (Optional)
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Support

For issues or questions:
1. Check that your bot token and channel ID are correct
2. Ensure the bot has proper permissions in Discord
3. Check the console for error messages

## 📝 License

MIT License - Feel free to use and modify!

## 🎉 Credits

Built with ❤️ using:
- [Discord.js](https://discord.js.org/) - Discord API library
- [Express](https://expressjs.com/) - Web framework
- [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) - SQLite database
