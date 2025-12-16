const bcrypt = require('bcryptjs');

// Simple authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized. Please login first.' });
    }
}

// Verify password
async function verifyPassword(inputPassword, correctPassword) {
    // If the stored password doesn't look like a hash, do direct comparison
    // This allows for simple password setup during development
    if (!correctPassword.startsWith('$2')) {
        return inputPassword === correctPassword;
    }

    // Otherwise use bcrypt
    return await bcrypt.compare(inputPassword, correctPassword);
}

// Hash password (optional, for future enhancement)
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

module.exports = {
    requireAuth,
    verifyPassword,
    hashPassword
};
