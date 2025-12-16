const express = require('express');
const { requireAuth, verifyPassword } = require('./middleware/auth');

function createRouter(bot, database) {
    const router = express.Router();

    // Login endpoint
    router.post('/login', async (req, res) => {
        try {
            const { password } = req.body;
            const correctPassword = process.env.ADMIN_PASSWORD;

            if (!password) {
                return res.status(400).json({ error: 'Password is required' });
            }

            const isValid = await verifyPassword(password, correctPassword);

            if (isValid) {
                req.session.authenticated = true;
                res.json({ success: true, message: 'Login successful' });
            } else {
                res.status(401).json({ error: 'Invalid password' });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    });

    // Logout endpoint
    router.post('/logout', (req, res) => {
        req.session.destroy();
        res.json({ success: true, message: 'Logged out successfully' });
    });

    // Check authentication status
    router.get('/auth-status', (req, res) => {
        res.json({
            authenticated: req.session && req.session.authenticated === true,
            botReady: bot.isReady()
        });
    });

    // Send payout message (protected)
    router.post('/payout', requireAuth, async (req, res) => {
        try {
            const { recipientName, amount, transactionId, transactionLink, notes } = req.body;

            // Validation
            if (!recipientName || !amount || !transactionId) {
                return res.status(400).json({
                    error: 'Missing required fields: recipientName, amount, transactionId'
                });
            }

            // Send to Discord with error handling
            try {
                await bot.sendPayoutMessage(
                    recipientName,
                    amount,
                    transactionId,
                    transactionLink || '',
                    notes || ''
                );
                console.log(`✓ Successfully sent payout for ${recipientName}`);
            } catch (discordError) {
                console.error('Discord send error:', discordError);
                // Return error to user
                return res.status(500).json({
                    error: 'Failed to send message to Discord. Please check bot permissions.',
                    details: discordError.message
                });
            }

            // Save to database only after successful Discord send
            try {
                const payoutId = database.insertPayout(
                    recipientName,
                    amount,
                    transactionId,
                    transactionLink || '',
                    notes || ''
                );

                res.json({
                    success: true,
                    message: 'Payout message sent successfully to Discord!',
                    payoutId
                });
            } catch (dbError) {
                console.error('Database error:', dbError);
                // Message was sent but not saved - still report success
                res.json({
                    success: true,
                    message: 'Payout sent to Discord (database save failed)',
                    warning: 'History may not be saved'
                });
            }

        } catch (error) {
            console.error('Error in payout route:', error);
            res.status(500).json({ error: 'Failed to process payout request' });
        }
    });

    // Send custom message (protected)
    router.post('/custom-message', requireAuth, async (req, res) => {
        try {
            const { content, useEmbed, embedTitle, embedColor } = req.body;

            if (!content) {
                return res.status(400).json({ error: 'Message content is required' });
            }

            // Send to Discord
            await bot.sendCustomMessage(
                content,
                useEmbed || false,
                embedTitle || '',
                embedColor || '#5865F2'
            );

            // Save to database
            const messageId = database.insertCustomMessage(content);

            res.json({
                success: true,
                message: 'Custom message sent successfully',
                messageId
            });
        } catch (error) {
            console.error('Error sending custom message:', error);
            res.status(500).json({ error: 'Failed to send custom message' });
        }
    });

    // Send announcement (protected)
    router.post('/announcement', requireAuth, async (req, res) => {
        try {
            const { content } = req.body;

            if (!content) {
                return res.status(400).json({ error: 'Announcement content is required' });
            }

            // Send to Discord
            await bot.sendAnnouncement(content);

            // Save to database
            const messageId = database.insertCustomMessage(`[ANNOUNCEMENT] ${content}`);

            res.json({
                success: true,
                message: 'Announcement sent successfully',
                messageId
            });
        } catch (error) {
            console.error('Error sending announcement:', error);
            res.status(500).json({ error: 'Failed to send announcement' });
        }
    });

    // Get payout history (protected)
    router.get('/history/payouts', requireAuth, (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 100;
            const payouts = database.getAllPayouts(limit);
            res.json({ payouts });
        } catch (error) {
            console.error('Error fetching payout history:', error);
            res.status(500).json({ error: 'Failed to fetch payout history' });
        }
    });

    // Get custom message history (protected)
    router.get('/history/messages', requireAuth, (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 100;
            const messages = database.getAllCustomMessages(limit);
            res.json({ messages });
        } catch (error) {
            console.error('Error fetching message history:', error);
            res.status(500).json({ error: 'Failed to fetch message history' });
        }
    });

    // Get statistics (protected)
    router.get('/stats', requireAuth, (req, res) => {
        try {
            const stats = database.getStats();
            res.json(stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
            res.status(500).json({ error: 'Failed to fetch statistics' });
        }
    });

    return router;
}

module.exports = createRouter;
