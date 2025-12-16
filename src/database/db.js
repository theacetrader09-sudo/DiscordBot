const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

class PayoutDatabase {
    constructor(dbPath = './payouts.db') {
        this.db = new Database(dbPath);
        this.initializeDatabase();
    }

    initializeDatabase() {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        this.db.exec(schema);
        console.log('✓ Database initialized successfully');
    }

    // Insert a new payout record
    insertPayout(recipientName, amount, transactionId, transactionLink = '', notes = '') {
        const stmt = this.db.prepare(`
            INSERT INTO payouts (recipient_name, amount, transaction_id, transaction_link, notes)
            VALUES (?, ?, ?, ?, ?)
        `);
        const result = stmt.run(recipientName, amount, transactionId, transactionLink, notes);
        return result.lastInsertRowid;
    }

    // Insert a custom message record
    insertCustomMessage(messageContent) {
        const stmt = this.db.prepare(`
            INSERT INTO custom_messages (message_content)
            VALUES (?)
        `);
        const result = stmt.run(messageContent);
        return result.lastInsertRowid;
    }

    // Get all payouts with optional limit
    getAllPayouts(limit = 100) {
        const stmt = this.db.prepare(`
            SELECT * FROM payouts
            ORDER BY created_at DESC
            LIMIT ?
        `);
        return stmt.all(limit);
    }

    // Get recent payouts for a specific recipient
    getPayoutsByRecipient(recipientName) {
        const stmt = this.db.prepare(`
            SELECT * FROM payouts
            WHERE recipient_name LIKE ?
            ORDER BY created_at DESC
        `);
        return stmt.all(`%${recipientName}%`);
    }

    // Get payout by transaction ID
    getPayoutByTransactionId(transactionId) {
        const stmt = this.db.prepare(`
            SELECT * FROM payouts
            WHERE transaction_id = ?
        `);
        return stmt.get(transactionId);
    }

    // Get all custom messages
    getAllCustomMessages(limit = 100) {
        const stmt = this.db.prepare(`
            SELECT * FROM custom_messages
            ORDER BY created_at DESC
            LIMIT ?
        `);
        return stmt.all(limit);
    }

    // Get statistics
    getStats() {
        const totalPayouts = this.db.prepare('SELECT COUNT(*) as count FROM payouts').get();
        const totalMessages = this.db.prepare('SELECT COUNT(*) as count FROM custom_messages').get();

        return {
            totalPayouts: totalPayouts.count,
            totalMessages: totalMessages.count
        };
    }

    close() {
        this.db.close();
    }
}

module.exports = PayoutDatabase;
