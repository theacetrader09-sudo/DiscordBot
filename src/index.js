require('dotenv').config();
const DiscordBot = require('./bot');
const PayoutDatabase = require('./database/db');
const WebServer = require('./server');

// Main application entry point
async function main() {
    console.log('🚀 Starting Discord Payout Bot System...\n');

    // Validate environment variables
    const requiredEnvVars = ['DISCORD_BOT_TOKEN', 'DISCORD_CHANNEL_ID', 'ADMIN_PASSWORD'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(varName => console.error(`   - ${varName}`));
        console.error('\nPlease create a .env file based on .env.example');
        process.exit(1);
    }

    try {
        // Initialize database
        console.log('Initializing database...');
        const database = new PayoutDatabase('./payouts.db');

        // Initialize Discord bot
        console.log('Connecting Discord bot...');
        const bot = new DiscordBot(
            process.env.DISCORD_BOT_TOKEN,
            process.env.DISCORD_CHANNEL_ID
        );
        await bot.connect();

        // Wait a moment for the bot to be fully ready
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Initialize web server
        console.log('Starting web server...');
        const port = process.env.PORT || 3000;
        const server = new WebServer(bot, database, port);
        await server.start();

        console.log('\n✨ System is fully operational!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 Admin Panel: http://localhost:${port}`);
        console.log(`🤖 Discord Bot: Connected and ready`);
        console.log(`💾 Database: Initialized`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\n🛑 Shutting down gracefully...');
            await server.stop();
            await bot.disconnect();
            database.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Failed to start application:', error);
        process.exit(1);
    }
}

// Run the application
main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
