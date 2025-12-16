const express = require('express');
const session = require('express-session');
const path = require('path');
const createRouter = require('./routes');

class WebServer {
    constructor(bot, database, port = 3000) {
        this.bot = bot;
        this.database = database;
        this.port = port;
        this.app = express();

        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        // Parse JSON bodies
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Session management
        this.app.use(session({
            secret: process.env.SESSION_SECRET || 'default-secret-change-this',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false, // Set to true if using HTTPS
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            }
        }));

        // Serve static files from public directory
        this.app.use(express.static(path.join(__dirname, '../../public')));

        // Log requests
        this.app.use((req, res, next) => {
            console.log(`${req.method} ${req.path}`);
            next();
        });
    }

    setupRoutes() {
        // API routes
        const apiRouter = createRouter(this.bot, this.database);
        this.app.use('/api', apiRouter);

        // Serve admin panel on root
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../../public/index.html'));
        });

        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                botReady: this.bot.isReady(),
                timestamp: new Date().toISOString()
            });
        });

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({ error: 'Not found' });
        });

        // Error handler
        this.app.use((err, req, res, next) => {
            console.error('Server error:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
    }

    async start() {
        return new Promise((resolve) => {
            this.server = this.app.listen(this.port, () => {
                console.log(`✓ Web server running on http://localhost:${this.port}`);
                console.log(`✓ Admin panel available at http://localhost:${this.port}`);
                resolve();
            });
        });
    }

    async stop() {
        if (this.server) {
            return new Promise((resolve) => {
                this.server.close(() => {
                    console.log('Web server stopped');
                    resolve();
                });
            });
        }
    }
}

module.exports = WebServer;
