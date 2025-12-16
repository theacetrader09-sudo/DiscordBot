# 🚀 How to Deploy to Render.com

Since Vercel doesn't support persistent bots well, **Render** is the best free alternative that works similarly.

## ⚠️ Important Note About Database
On Render's free tier, the **database will reset** every time you redeploy or if the server restarts (about once a day).
- **Good for**: Sending payouts, announcements, custom messages.
- **Bad for**: Keeping long-term history of past payouts (it will get wiped).

*If you need permanent history, you'll need to upgrade to a paid Render plan with a "Disk" ($7/mo) or use a cloud database.*

---

## 🛠️ Step 1: Push Code to GitHub

You need to put this code on your GitHub first.

1. Create a new repository on [GitHub.com](https://github.com/new) named `discord-payout-bot`.
2. Run these commands in your terminal (I can help run them if you're logged in):

```bash
git init
git add .
git commit -m "Ready for Render"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/discord-payout-bot.git
git push -u origin main
```

*(Replace `YOUR_USERNAME` with your actual GitHub username)*

---

## ☁️ Step 2: Deploy on Render

1. Go to [dashboard.render.com](https://dashboard.render.com/) and sign up/login.
2. Click **"New +"** → **"Web Service"**.
3. Connect your GitHub account and select the `discord-payout-bot` repository.
4. Render will detect the `render.yaml` file I created and auto-fill everything!
5. Scroll down to **Environment Variables** and enter your values:
   - `DISCORD_BOT_TOKEN`: (Paste your bot token)
   - `DISCORD_CHANNEL_ID`: (Paste your channel ID)
   - `ADMIN_PASSWORD`: (Choose a strong password)
   - `SESSION_SECRET`: (Type any random long string)
6. Click **"Create Web Service"**.

---

## 🎉 Step 3: Done!

Render will build your bot (takes ~2 minutes).
Once done, it will give you a URL like: `https://discord-payout-bot.onrender.com`

- **Admin Panel**: Go to that URL.
- **Bot**: It will come online in Discord automatically!

### 💡 Keep it Alive (Free Tier)
Render's free tier "sleeps" after 15 minutes of inactivity. To keep your bot running 24/7 for free:
- Use a service like [UptimeRobot](https://uptimerobot.com/) (free).
- Create a new "HTTP Monitor".
- Point it to your Render URL (`https://discord-payout-bot.onrender.com`).
- Set it to ping every 5 minutes.
- This keeps your bot awake forever! 🚀
