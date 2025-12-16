# 🔒 Security Guide for Discord Payout Bot

This guide covers how to secure your bot when deployed to a datacenter or VPS to prevent unauthorized access.

---

## 🛡️ Critical Security Measures

### 1. **Discord Bot Security**

#### A. Keep Bot Token Secret ⚠️

Your bot token (`YOUR_BOT_TOKEN_HERE`) is like a password. **NEVER share it publicly!**

**What to do:**
- ✅ Keep it in `.env` file (already done)
- ✅ Never commit `.env` to Git (already in `.gitignore`)
- ❌ Never share it in Discord, screenshots, or public repos
- ❌ If exposed, regenerate it immediately in Discord Developer Portal

#### B. Restrict Bot to Your Server Only

1. Go to [Discord Developer Portal](https://discord.com/developers/applications/1449640413051883684/bot)
2. In "Bot" settings, turn **OFF** "Public Bot"
3. This prevents others from adding your bot to their servers

#### C. Limit Bot Permissions

Only give the bot these permissions:
- ✅ View Channels
- ✅ Send Messages
- ✅ Embed Links
- ❌ Administrator (never enable this)

---

### 2. **Admin Panel Security**

#### A. Strong Password

Your current password: `Markus@72`

**Recommendations:**
- Use at least 16 characters
- Mix uppercase, lowercase, numbers, symbols
- Example: `Mg7$bK9#pL2@vN4&xR8!`

**To change password:**
Edit `.env` file:
```env
ADMIN_PASSWORD=YourNewSecurePassword123!@#
```

#### B. IP Address Restriction (Recommended)

**Block access from all IPs except yours**

Add this to `src/server/index.js`:

```javascript
// Add after line 24 (after session middleware)
// IP Whitelist - only allow specific IPs
const allowedIPs = [
    '127.0.0.1',           // Localhost
    '::1',                 // Localhost IPv6
    'YOUR_HOME_IP',        // Your home IP
    'YOUR_OFFICE_IP'       // Your office IP
];

this.app.use((req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // Skip IP check for health endpoint
    if (req.path === '/health') {
        return next();
    }
    
    // Check if IP is allowed
    const isAllowed = allowedIPs.some(ip => clientIP.includes(ip));
    
    if (!isAllowed) {
        console.log(`🚫 Blocked access from IP: ${clientIP}`);
        return res.status(403).json({ error: 'Access denied' });
    }
    
    next();
});
```

**Find your IP address:**
- Google: "what is my ip"
- Or visit: https://whatismyipaddress.com

#### C. Change Default Port

Instead of port 3000, use a random port:

In `.env`:
```env
PORT=47583  # Use any random port 10000-65000
```

#### D. HTTPS Only (Production)

**Never run without HTTPS in production!**

See [DEPLOYMENT.md](file:///Users/apple/.gemini/antigravity/scratch/discord-payout-bot/DEPLOYMENT.md) section on Nginx + Let's Encrypt for free SSL.

---

### 3. **Server Security (VPS/Datacenter)**

#### A. Firewall Configuration

```bash
# On your VPS, allow only necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22        # SSH
sudo ufw allow 80        # HTTP (for SSL renewal)
sudo ufw allow 443       # HTTPS
sudo ufw allow 47583     # Your custom app port (change as needed)
sudo ufw enable
```

#### B. SSH Key Authentication Only

```bash
# Disable password login
sudo nano /etc/ssh/sshd_config

# Set these values:
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes

# Restart SSH
sudo systemctl restart sshd
```

#### C. Fail2Ban (Block Brute Force Attacks)

```bash
# Install
sudo apt install fail2ban

# Enable
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

#### D. Regular Updates

```bash
# Update system weekly
sudo apt update && sudo apt upgrade -y
```

---

### 4. **Application-Level Security**

#### A. Rate Limiting (Prevent Spam)

Install rate limiter:
```bash
npm install express-rate-limit
```

Add to `src/server/index.js`:
```javascript
const rateLimit = require('express-rate-limit');

// Add after line 20 (before session middleware)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

this.app.use(limiter);

// Stricter limit for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 login attempts per 15 minutes
    message: 'Too many login attempts, please try again later.'
});

// Apply to login route in routes.js
router.post('/login', loginLimiter, async (req, res) => {
    // existing login code...
});
```

#### B. Session Security

In `.env`, use a strong session secret:
```env
SESSION_SECRET=fK9$mL2#pN7&xR4!vW8@bC3%yD6^zA1*qE5+
```

Generate random: https://randomkeygen.com/

#### C. Hide Technology Stack

Add to `src/server/index.js` after middleware setup:
```javascript
// Hide Express/Node.js version
this.app.disable('x-powered-by');
```

---

### 5. **Database Security**

#### A. Protect Database File

```bash
# On your server, restrict access to database
chmod 600 payouts.db
```

#### B. Regular Backups

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp payouts.db backups/payouts_$DATE.db
# Keep only last 30 days
find backups/ -name "payouts_*.db" -mtime +30 -delete
EOF

chmod +x backup.sh

# Run daily via cron
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

---

### 6. **Environment Variables Security**

#### A. Never Commit `.env`

Already in `.gitignore` ✅

#### B. Server-Side .env Permissions

```bash
# On VPS, restrict .env file access
chmod 600 .env
chown your_user:your_user .env
```

---

### 7. **Monitoring & Alerts**

#### A. Monitor Login Attempts

Check logs regularly:
```bash
pm2 logs payout-bot | grep "Login"
```

#### B. Set Up Log Rotation

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

---

## 🔐 Complete Security Checklist

Before deploying to datacenter:

### Discord Bot
- [ ] Set bot to "Private" (not public)
- [ ] Bot token is in `.env`, not hardcoded
- [ ] Limited bot permissions (no admin)
- [ ] Bot only in your server

### Admin Panel
- [ ] Strong password (16+ characters)
- [ ] IP whitelist enabled
- [ ] Custom port (not 3000)
- [ ] HTTPS enabled
- [ ] Rate limiting active
- [ ] Login attempts limited

### Server
- [ ] Firewall configured (ufw)
- [ ] SSH key auth only (no password)
- [ ] Fail2Ban installed
- [ ] Regular security updates scheduled
- [ ] Non-root user running app

### Application
- [ ] `.env` file permissions set to 600
- [ ] Database file protected (chmod 600)
- [ ] Automatic backups configured
- [ ] PM2 process manager running
- [ ] Logs being monitored

### Network
- [ ] Domain with SSL certificate
- [ ] Reverse proxy (Nginx) configured
- [ ] HTTP redirects to HTTPS
- [ ] Security headers enabled

---

## 🚨 If Compromised

If you suspect unauthorized access:

1. **Immediately:**
   - Change admin password
   - Regenerate Discord bot token
   - Change session secret
   - Restart application

2. **Check:**
   - Review payout history for unauthorized entries
   - Check server logs: `pm2 logs payout-bot`
   - Review firewall logs: `sudo tail -f /var/log/ufw.log`

3. **Strengthen:**
   - Enable IP whitelist
   - Add 2FA to Discord account
   - Review all security measures above

---

## 📞 Quick Security Commands

```bash
# Check who's logged in
w

# Check failed login attempts
sudo grep "Failed password" /var/log/auth.log

# Check app logs
pm2 logs payout-bot

# Check firewall status
sudo ufw status

# Check open ports
sudo netstat -tulpn

# Check running processes
ps aux | grep node
```

---

## 🎯 Recommended Security Stack

**Minimal Security (Good for Testing):**
- Strong password
- Firewall enabled
- Bot set to private

**Production Security (Recommended):**
- All of above +
- IP whitelist
- HTTPS with SSL
- Rate limiting
- Fail2Ban
- Regular backups

**Maximum Security (Enterprise):**
- All of above +
- VPN access only
- 2FA authentication
- Database encryption
- Intrusion detection (OSSEC)
- DDoS protection (Cloudflare)

---

## 💡 Best Practices

1. **Never share your bot token or admin password**
2. **Always use HTTPS in production**
3. **Keep your server updated**
4. **Monitor logs regularly**
5. **Backup database daily**
6. **Use strong, unique passwords**
7. **Limit access to trusted IPs only**
8. **Run bot as non-root user**
9. **Enable all security measures before going live**
10. **Test security before deploying**

---

## 🔗 Additional Resources

- [Discord Bot Security Best Practices](https://discord.com/developers/docs/topics/oauth2#bot-authorization-flow)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [Linux Server Security](https://www.linode.com/docs/guides/securing-your-server/)

---

**Remember: Security is not a one-time setup, it's an ongoing process!**
