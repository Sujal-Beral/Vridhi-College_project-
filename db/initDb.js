const pool = require('./connection');

/**
 * Ensures all required tables and schema columns exist in MySQL.
 * Fully idempotent and safe on existing data.
 */
async function initDb() {
    try {
        // 1. Ensure required columns in users table
        const [userCols] = await pool.query("SHOW COLUMNS FROM users");
        const existingUserCols = userCols.map(c => c.Field);

        if (!existingUserCols.includes('email_verified')) {
            await pool.query("ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE");
        }
        if (!existingUserCols.includes('email_verification_token')) {
            await pool.query("ALTER TABLE users ADD COLUMN email_verification_token VARCHAR(255) DEFAULT NULL");
        }
        if (!existingUserCols.includes('email_verification_expires')) {
            await pool.query("ALTER TABLE users ADD COLUMN email_verification_expires DATETIME DEFAULT NULL");
        }
        if (!existingUserCols.includes('reset_password_token')) {
            await pool.query("ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255) DEFAULT NULL");
        }
        if (!existingUserCols.includes('reset_password_expires')) {
            await pool.query("ALTER TABLE users ADD COLUMN reset_password_expires DATETIME DEFAULT NULL");
        }

        // 2. User Email Preferences table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_email_preferences (
                user_id INT PRIMARY KEY,
                goal_notifications BOOLEAN DEFAULT TRUE,
                milestone_emails BOOLEAN DEFAULT TRUE,
                deadline_reminders BOOLEAN DEFAULT TRUE,
                monthly_reports BOOLEAN DEFAULT TRUE,
                quiz_emails BOOLEAN DEFAULT TRUE,
                financial_alerts BOOLEAN DEFAULT TRUE,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // 3. Goal Milestones table (tracks 25%, 50%, 75% progress emails)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS goal_milestones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                goal_id INT NOT NULL,
                milestone_pct INT NOT NULL,
                email_sent BOOLEAN DEFAULT FALSE,
                sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY uq_goal_milestone (goal_id, milestone_pct),
                FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // 4. Goal Deadline Reminders table (tracks ~7 days reminders)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS goal_deadline_reminders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                goal_id INT NOT NULL,
                reminder_type VARCHAR(50) DEFAULT '7_days',
                email_sent BOOLEAN DEFAULT FALSE,
                sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY uq_goal_reminder (goal_id, reminder_type),
                FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // 5. Financial Alerts Log table (prevents spamming users with repeated alerts)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS financial_alerts_log (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                alert_type VARCHAR(50) NOT NULL,
                sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user_alert (user_id, alert_type, sent_at),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log('[Database] Schema initialized and verified successfully.');
        return true;
    } catch (err) {
        console.error('[Database] Schema init error:', err.message);
        return false;
    }
}

module.exports = initDb;
