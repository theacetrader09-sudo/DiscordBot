# 🚀 Deployment Guide - Making Your Bot Live

This guide covers multiple deployment options for your Discord Payout Bot, from simple to production-grade.

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure you have:

- ✅ Discord bot token from [Discord Developer Portal](https://discord.com/developers/applications)
- ✅ Discord channel ID where bot will post
- ✅ A strong admin password chosen
- ✅ All dependencies installed (`npm install`)
- ✅ Tested locally and confirmed it works

---

## 🎯 Deployment Options

### Option 1: Local Machine (Simplest)
**Best for**: Testing, personal use, small scale  
**Cost**: Free  
**Uptime**: Only when your computer is on

### Option 2: VPS (Recommended for Production)
**Best for**: 24/7 uptime, full control  
**Cost**: $5-20/month  
**Uptime**: 99.9%+

### Option 3: Cloud Platforms
**Best for**: Easy deployment, auto-scaling  
**Cost**: Free tier available or $5-15/month  
**Uptime**: 99.9%+

---

## 🖥️ Option 1: Deploy on Local Machine

### Step 1: Configure Environment

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DISCORD_BOT_TOKEN=your_actual_bot_token_here
DISCORD_CHANNEL_ID=123456789012345678
ADMIN_PASSWORD=YourSecurePassword123!
SESSION_SECRET=random-secret-key-here
PORT=3000
```

### Step 2: Start with PM2 (Keeps it Running)

Install PM2 globally:
```bash
npm install -g pm2
```

Start the bot:
```bash
pm2 start src/index.js --name payout-bot
```

Useful PM2 commands:
```bash
pm2 status              # Check status
pm2 logs payout-bot     # View logs
pm2 restart payout-bot  # Restart bot
pm2 stop payout-bot     # Stop bot
pm2 delete payout-bot   # Remove from PM2
```

### Step 3: Make it Start on Boot

```bash
pm2 startup
pm2 save
```

### Step 4: Access Admin Panel

- **Locally**: http://localhost:3000
- **From other devices**: http://YOUR_LOCAL_IP:3000
  - Find your IP: `ifconfig | grep inet` (Mac/Linux) or `ipconfig` (Windows)

> ⚠️ **Note**: Your computer must stay on for the bot to work!

---

## ☁️ Option 2: Deploy on VPS (Digital Ocean, AWS, etc.)

### Recommended VPS Providers:
- **DigitalOcean** - $6/month droplet
- **Vultr** - $5/month instance
- **AWS EC2** - Free tier available
- **Linode** - $5/month nanode

### Step-by-Step for DigitalOcean:

#### 1. Create a Droplet

1. Sign up at [DigitalOcean](https://www.digitalocean.com/)
2. Create new Droplet
3. Choose:
   - **OS**: Ubuntu 22.04 LTS
   - **Plan**: Basic $6/month (1GB RAM)
   - **Region**: Closest to you
4. Add your SSH key (or use password)
5. Click "Create Droplet"

#### 2. Connect to Your Server

```bash
ssh root@YOUR_DROPLET_IP
```

#### 3. Install Node.js

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### 4. Install Git (if needed)

```bash
apt install -y git
```

#### 5. Upload Your Project

**Option A: Using Git**
```bash
# On your local machine, push to GitHub first
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/discord-payout-bot.git
git push -u origin main

# On VPS
cd /opt
git clone https://github.com/yourusername/discord-payout-bot.git
cd discord-payout-bot
```

**Option B: Using SCP (Direct Upload)**
```bash
# On your local machine
cd /Users/apple/.gemini/antigravity/scratch
tar -czf payout-bot.tar.gz discord-payout-bot/
scp payout-bot.tar.gz root@YOUR_DROPLET_IP:/opt/

# On VPS
cd /opt
tar -xzf payout-bot.tar.gz
cd discord-payout-bot
```

#### 6. Configure Environment

```bash
# Create .env file
nano .env
```

Add your configuration:
```env
DISCORD_BOT_TOKEN=your_actual_bot_token_here
DISCORD_CHANNEL_ID=123456789012345678
ADMIN_PASSWORD=YourSecurePassword123!
SESSION_SECRET=random-secret-key-here
PORT=3000
```

Save with `Ctrl+X`, `Y`, `Enter`

#### 7. Install Dependencies

```bash
npm install --production
```

#### 8. Install PM2 and Start

```bash
npm install -g pm2

# Start the bot
pm2 start src/index.js --name payout-bot

# Configure PM2 to start on boot
pm2 startup systemd
pm2 save
```

#### 9. Configure Firewall

```bash
# Allow SSH, HTTP, and your app port
ufw allow 22
ufw allow 80
ufw allow 3000
ufw enable
```

#### 10. Access Your Admin Panel

Open browser to: `http://YOUR_DROPLET_IP:3000`

### Optional: Setup Domain & HTTPS

#### A. Point Domain to VPS

1. Buy a domain (Namecheap, Google Domains, etc.)
2. Add A record pointing to your VPS IP
3. Wait for DNS propagation (5-60 minutes)

#### B. Install Nginx as Reverse Proxy

```bash
# Install Nginx
apt install -y nginx

# Create config
nano /etc/nginx/sites-available/payout-bot
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
ln -s /etc/nginx/sites-available/payout-bot /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### C. Install SSL Certificate (HTTPS)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

Now access via: `https://your-domain.com` 🎉

---

## 🌐 Option 3: Deploy on Cloud Platforms

### A. Railway.app (Easiest!)

1. **Sign up**: Go to [Railway.app](https://railway.app/)
2. **New Project**: Click "New Project" → "Deploy from GitHub"
3. **Connect Repository**: 
   - Push your code to GitHub first
   - Select the repository
4. **Add Environment Variables**:
   - Click on your service
   - Go to "Variables" tab
   - Add all your `.env` variables
5. **Deploy**: Railway will auto-deploy!
6. **Get URL**: Railway provides a public URL automatically

**Pros**: Free $5/month credit, auto-deploys, very easy  
**Cons**: Requires GitHub, limited free tier

---

### B. Render.com

1. **Sign up**: Go to [Render.com](https://render.com/)
2. **New Web Service**: Click "New +" → "Web Service"
3. **Connect GitHub**: Link your repository
4. **Configure**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables**: Add your `.env` variables
6. **Create Web Service**: Click create and wait for deploy

**Pros**: Free tier available, easy SSL  
**Cons**: Free tier sleeps after 15 mins of inactivity

---

### C. Heroku

1. **Install Heroku CLI**:
```bash
brew tap heroku/brew && brew install heroku  # Mac
```

2. **Login**:
```bash
heroku login
```

3. **Create Heroku App**:
```bash
cd /Users/apple/.gemini/antigravity/scratch/discord-payout-bot
heroku create your-payout-bot
```

4. **Add Environment Variables**:
```bash
heroku config:set DISCORD_BOT_TOKEN=your_token
heroku config:set DISCORD_CHANNEL_ID=your_channel_id
heroku config:set ADMIN_PASSWORD=your_password
heroku config:set SESSION_SECRET=random_secret
```

5. **Create Procfile**:
```bash
echo "web: node src/index.js" > Procfile
```

6. **Deploy**:
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

7. **Scale Up**:
```bash
heroku ps:scale web=1
```

**Pros**: Very reliable, add-ons available  
**Cons**: No free tier anymore ($7/month minimum)

---

## 🔒 Production Security Checklist

Before going live, ensure:

- [ ] Strong admin password set
- [ ] `.env` file is in `.gitignore` (already done)
- [ ] Bot token is kept secret
- [ ] HTTPS enabled (if using domain)
- [ ] Firewall configured properly
- [ ] Regular backups of database
- [ ] PM2 process monitoring enabled
- [ ] Server updates scheduled

---

## 📊 Monitoring Your Bot

### Check if Bot is Running

**PM2**:
```bash
pm2 status
pm2 logs payout-bot --lines 50
```

**Check Process**:
```bash
# Linux/Mac
ps aux | grep node

# Check port
lsof -i :3000
```

### Monitor Resources

Install htop:
```bash
apt install htop  # Ubuntu
brew install htop  # Mac
```

Run:
```bash
htop
```

---

## 🐛 Troubleshooting

### Bot Not Connecting to Discord

1. Check bot token is correct
2. Verify bot is added to server
3. Check internet connection on server
4. View logs: `pm2 logs payout-bot`

### Admin Panel Not Accessible

1. Check firewall settings
2. Verify port 3000 is open
3. Check if process is running: `pm2 status`
4. Try accessing locally first: `curl http://localhost:3000`

### Database Errors

1. Check file permissions: `ls -la payouts.db`
2. Ensure directory is writable
3. Restart the application

### Environmental Variables Not Loading

1. Verify `.env` file exists in root directory
2. Check file permissions: `ls -la .env`
3. Restart PM2: `pm2 restart payout-bot`

---

## 🔄 Updating Your Live Bot

### On VPS:

```bash
# Connect to server
ssh root@YOUR_SERVER_IP

# Navigate to project
cd /opt/discord-payout-bot

# Pull latest changes (if using git)
git pull

# Or upload new files via SCP
# On local: scp -r discord-payout-bot/ root@SERVER_IP:/opt/

# Install new dependencies if any
npm install --production

# Restart bot
pm2 restart payout-bot

# Check status
pm2 logs payout-bot
```

### On Cloud Platforms:

Most platforms auto-deploy when you push to GitHub!

---

## 💰 Cost Comparison

| Option | Monthly Cost | Uptime | Ease | Recommendation |
|--------|-------------|--------|------|----------------|
| Local Machine | $0 | 50-90% | Easy | Testing only |
| DigitalOcean VPS | $6 | 99.9% | Medium | **Best for production** |
| Railway | $5 credit free | 99.9% | Very Easy | Good start |
| Render | Free tier | 95% (sleeps) | Very Easy | Good for low traffic |
| Heroku | $7 | 99.9% | Easy | Good but pricey |

---

## 🎯 Recommended Setup

**For beginners**: Start with Railway.app (easiest)  
**For serious use**: DigitalOcean VPS with PM2 (best value)  
**For enterprise**: AWS/Google Cloud with load balancing

---

## 📝 Quick Start Commands

### Start Bot Locally:
```bash
npm start
```

### Start Bot with PM2:
```bash
pm2 start src/index.js --name payout-bot
pm2 save
```

### View Logs:
```bash
pm2 logs payout-bot
```

### Restart Bot:
```bash
pm2 restart payout-bot
```

---

## ✅ You're Live!

Once deployed, you can:
- Access admin panel from anywhere
- Send payout messages 24/7
- Keep full history in database
- Manage everything remotely

**Need help?** Check the logs first with `pm2 logs` or console output!
