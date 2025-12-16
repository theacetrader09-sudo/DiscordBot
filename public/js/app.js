// Admin Panel JavaScript Application

// ===== STATE MANAGEMENT =====
let isAuthenticated = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupEventListeners();
});

// ===== AUTHENTICATION =====
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth-status');
        const data = await response.json();

        if (data.authenticated) {
            isAuthenticated = true;
            showDashboard();
            loadStats();
            loadHistory();
            updateBotStatus(data.botReady);
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        showLogin();
    }
}

async function login(password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            isAuthenticated = true;
            showDashboard();
            loadStats();
            loadHistory();
            showToast('Login successful! Welcome to the admin panel.', 'success');
        } else {
            throw new Error(data.error || 'Login failed');
        }
    } catch (error) {
        throw error;
    }
}

async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        isAuthenticated = false;
        showLogin();
        showToast('Logged out successfully', 'success');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// ===== UI MANAGEMENT =====
function showLogin() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('dashboardScreen').classList.remove('active');
}

function showDashboard() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('dashboardScreen').classList.add('active');
}

function updateBotStatus(isReady) {
    const statusIndicator = document.getElementById('botStatus');
    const statusText = document.getElementById('botStatusText');

    if (isReady) {
        statusIndicator.classList.remove('offline');
        statusText.textContent = 'Online';
    } else {
        statusIndicator.classList.add('offline');
        statusText.textContent = 'Offline';
    }
}

// ===== TAB MANAGEMENT =====
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// ===== DATA LOADING =====
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();

        document.getElementById('totalPayouts').textContent = stats.totalPayouts || 0;
        document.getElementById('totalMessages').textContent = stats.totalMessages || 0;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadHistory() {
    try {
        const response = await fetch('/api/history/payouts');
        const data = await response.json();

        const tbody = document.getElementById('historyTableBody');

        if (!data.payouts || data.payouts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <div class="empty-icon">📭</div>
                        <p>No payout history yet</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.payouts.map(payout => `
            <tr>
                <td>${formatDate(payout.created_at)}</td>
                <td>${escapeHtml(payout.recipient_name)}</td>
                <td>${escapeHtml(payout.amount)}</td>
                <td><code>${escapeHtml(payout.transaction_id)}</code></td>
                <td>${escapeHtml(payout.notes || '-')}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading history:', error);
        showToast('Failed to load history', 'error');
    }
}

// ===== FORM HANDLERS =====
async function handlePayoutSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        recipientName: formData.get('recipientName'),
        amount: formData.get('amount'),
        transactionId: formData.get('transactionId'),
        transactionLink: formData.get('transactionLink'),
        notes: formData.get('notes')
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/payout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast('✅ Payout message sent to Discord!', 'success');
            e.target.reset();
            loadStats();
            loadHistory();
        } else {
            throw new Error(result.error || 'Failed to send payout');
        }
    } catch (error) {
        showToast(`❌ Error: ${error.message}`, 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

async function handleCustomMessageSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        content: formData.get('messageContent'),
        useEmbed: formData.get('useEmbed') === 'on',
        embedTitle: formData.get('embedTitle'),
        embedColor: formData.get('embedColor')
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/custom-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast('✅ Message sent to Discord!', 'success');
            e.target.reset();
            document.getElementById('embedOptions').style.display = 'none';
            loadStats();
        } else {
            throw new Error(result.error || 'Failed to send message');
        }
    } catch (error) {
        showToast(`❌ Error: ${error.message}`, 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

async function handleAnnouncementSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        content: formData.get('announcementContent')
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/announcement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast('✅ Announcement sent to Discord!', 'success');
            e.target.reset();
            loadStats();
        } else {
            throw new Error(result.error || 'Failed to send announcement');
        }
    } catch (error) {
        showToast(`❌ Error: ${error.message}`, 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

async function handleLoginSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const password = formData.get('password');

    const errorDiv = document.getElementById('loginError');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    errorDiv.textContent = '';
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        await login(password);
    } catch (error) {
        errorDiv.textContent = error.message || 'Invalid password';
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });

    // Forms
    document.getElementById('payoutForm').addEventListener('submit', handlePayoutSubmit);
    document.getElementById('customMessageForm').addEventListener('submit', handleCustomMessageSubmit);
    document.getElementById('announcementForm').addEventListener('submit', handleAnnouncementSubmit);

    // Refresh history button
    document.getElementById('refreshHistory').addEventListener('click', loadHistory);

    // Custom message embed toggle
    document.getElementById('useEmbed').addEventListener('change', (e) => {
        const embedOptions = document.getElementById('embedOptions');
        embedOptions.style.display = e.target.checked ? 'block' : 'none';
    });
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? '✅' : '❌';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${escapeHtml(message)}</div>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== PERIODIC UPDATES =====
setInterval(() => {
    if (isAuthenticated) {
        loadStats();
        checkAuthStatus();
    }
}, 30000); // Update every 30 seconds
