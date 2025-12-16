# 📚 Discord Bot Setup Guide

This detailed guide will walk you through setting up your Discord bot from scratch.

## Table of Contents
- [Creating the Discord Application](#creating-the-discord-application)
- [Configuring the Bot](#configuring-the-bot)
- [Inviting the Bot to Your Server](#inviting-the-bot-to-your-server)
- [Getting Your Channel ID](#getting-your-channel-id)
- [Setting Up Environment Variables](#setting-up-environment-variables)

---

## Creating the Discord Application

### Step 1: Access Discord Developer Portal

1. Open your web browser
2. Go to https://discord.com/developers/applications
3. Log in with your Discord account

### Step 2: Create New Application

1. Click the **"New Application"** button (top right)
2. Enter a name for your bot (e.g., "Payout Bot", "Payment Announcer")
3. Read and accept Discord's Developer Terms of Service
4. Click **"Create"**

### Step 3: Customize Your Application (Optional)

1. Add an **App Icon** - Upload an image for your bot
2. Add a **Description** - Describe what your bot does
3. Click **"Save Changes"**

---

## Configuring the Bot

### Step 1: Create the Bot User

1. In your application page, click **"Bot"** in the left sidebar
2. Click **"Add Bot"**
3. Confirm by clicking **"Yes, do it!"**
4. Your bot is now created!

### Step 2: Get Your Bot Token

⚠️ **IMPORTANT: Keep this token secret! Never share it publicly!**

1. Under the bot's username, find the **TOKEN** section
2. Click **"Reset Token"**
3. Click **"Yes, do it!"** to confirm
4. Click **"Copy"** to copy your bot token
5. **Save this token** - you'll need it for your `.env` file

### Step 3: Configure Bot Settings

1. **Public Bot**: Turn OFF if you only want to use it on your servers
2. **Require OAuth2 Code Grant**: Leave OFF
3. **Presence Intent**: Leave OFF (not needed)
4. **Server Members Intent**: Leave OFF (not needed)
5. **Message Content Intent**: Leave OFF (not needed)

### Step 4: Set Bot Permissions

Scroll down to **"Bot Permissions"** and enable:
- ✅ **Send Messages**
- ✅ **Embed Links**
- ✅ **Read Messages/View Channels**

---

## Inviting the Bot to Your Server

### Step 1: Generate Invite Link

1. Click **"OAuth2"** in the left sidebar
2. Click **"URL Generator"**
3. Under **SCOPES**, select:
   - ✅ `bot`
4. Under **BOT PERMISSIONS**, select:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Read Messages/View Channels

### Step 2: Copy and Use the URL

1. Scroll down and copy the **Generated URL**
2. Open the URL in a new browser tab
3. Select the server you want to add the bot to
4. Click **"Continue"**
5. Review the permissions and click **"Authorize"**
6. Complete the CAPTCHA if prompted

Your bot is now in your server! 🎉

---

## Getting Your Channel ID

### Step 1: Enable Developer Mode

1. Open Discord
2. Click the ⚙️ (User Settings) icon
3. Go to **"Advanced"** (under "App Settings")
4. Enable **"Developer Mode"**

### Step 2: Copy Channel ID

1. Go to your server
2. Find the channel where you want payout messages to be posted
3. **Right-click** on the channel name
4. Click **"Copy ID"** (or "Copy Channel ID")
5. **Save this ID** - you'll need it for your `.env` file

---

## Setting Up Environment Variables

### Step 1: Create `.env` File

1. In your project folder, find the `.env.example` file
2. Copy it and rename to `.env`
   ```bash
   cp .env.example .env
   ```

### Step 2: Fill in Your Credentials

Open `.env` in a text editor and update:

```env
# Your Discord bot token from Step "Get Your Bot Token"
DISCORD_BOT_TOKEN=your_bot_token_here

# Your channel ID from Step "Copy Channel ID"
DISCORD_CHANNEL_ID=123456789012345678

# Choose a secure password for the admin panel
ADMIN_PASSWORD=MySecurePassword123!

# Generate a random secret for sessions
SESSION_SECRET=random-secret-string-here-abc123xyz

# Port for the admin panel (default: 3000)
PORT=3000
```

### Example Configuration

```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CHANNEL_ID=987654321098765432
ADMIN_PASSWORD=SuperSecure2024!
SESSION_SECRET=a8f3k2j9d0s1m4n7b6v5c8x2z1q3w4e5r6t7y8
PORT=3000
```

---

## Testing Your Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start the Bot

```bash
npm start
```

You should see:
```
🚀 Starting Discord Payout Bot System...

Initializing database...
✓ Database initialized successfully
Connecting Discord bot...
✓ Discord Bot logged in as YourBot#1234
✓ Bot is ready to send messages!
Starting web server...
✓ Web server running on http://localhost:3000
✓ Admin panel available at http://localhost:3000

✨ System is fully operational!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Admin Panel: http://localhost:3000
🤖 Discord Bot: Connected and ready
💾 Database: Initialized
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 3: Access Admin Panel

1. Open http://localhost:3000
2. Login with your `ADMIN_PASSWORD`
3. Try sending a test payout!

---

## Troubleshooting

### Bot doesn't connect
- ✅ Check your bot token is correct
- ✅ Ensure no extra spaces in `.env`
- ✅ Verify the bot is created in Discord Developer Portal

### Bot can't send messages
- ✅ Check channel ID is correct
- ✅ Verify bot has permissions in that channel
- ✅ Make sure bot role is above other roles if needed

### Can't login to admin panel
- ✅ Check your password in `.env`
- ✅ Restart the application after changing `.env`

### "Channel not found" error
- ✅ Verify channel ID is correct
- ✅ Ensure bot is in the server
- ✅ Check bot can see the channel

---

## Security Recommendations

1. **Never commit `.env` to git** - It's in `.gitignore` by default
2. **Use a strong password** - For the admin panel
3. **Keep your bot token secret** - Regenerate if exposed
4. **Limit bot permissions** - Only give necessary permissions
5. **Use HTTPS in production** - For the admin panel

---

## Next Steps

✅ Bot is set up and running
✅ Admin panel is accessible
✅ Ready to send payout messages!

Try these:
1. Send a test payout from the admin panel
2. Send a custom message
3. View the history tab
4. Explore announcement features

Need help? Check the main [README.md](./README.md) for more information!
