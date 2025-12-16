-- Payouts table for tracking all payout distributions
CREATE TABLE IF NOT EXISTS payouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient_name TEXT NOT NULL,
    amount TEXT NOT NULL,
    transaction_id TEXT NOT NULL,
    transaction_link TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    posted_by TEXT DEFAULT 'admin'
);

-- Custom messages table for tracking all custom bot messages
CREATE TABLE IF NOT EXISTS custom_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    posted_by TEXT DEFAULT 'admin'
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payouts_created_at ON payouts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_messages_created_at ON custom_messages(created_at DESC);
