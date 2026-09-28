const pool = require('../db/connection');
const emailService = require('./emailService');

/**
 * Check and trigger financial health alerts for a user.
 * Strictly checks real database records and throttles duplicate alerts to at most once per 30 days.
 */
async function checkAndTriggerUserAlerts(userId) {
    if (!userId) return { alertsTriggered: 0 };

    try {
        // 1. Check user email preferences
        const [prefs] = await pool.query(
            'SELECT financial_alerts FROM user_email_preferences WHERE user_id = ?',
            [userId]
        );
        if (prefs.length > 0 && prefs[0].financial_alerts === 0) {
            return { alertsTriggered: 0, reason: 'preferences_disabled' };
        }

        // 2. Fetch user and profile
        const [users] = await pool.query('SELECT id, full_name, email FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return { alertsTriggered: 0 };
        const user = users[0];

        const [profiles] = await pool.query('SELECT * FROM financial_profiles WHERE user_id = ?', [userId]);
        const profile = profiles.length > 0 ? profiles[0] : null;

        let triggered = 0;

        // 3. Alert 1: Low Emergency Fund (< 3 months)
        if (profile) {
            const expenses = parseFloat(profile.essential_expenses) || 0;
            const savings = parseFloat(profile.current_savings) || 0;
            const minBuffer = expenses * 3;

            if (expenses > 0 && savings < minBuffer) {
                const canSend = await checkAlertThrottle(userId, 'low_emergency_fund');
                if (canSend) {
                    const coverageMonths = (savings / expenses).toFixed(1);
                    const res = await emailService.sendFinancialAlertEmail({
                        user,
                        alertType: 'low_emergency_fund',
                        alertData: {
                            currentSavings: savings,
                            coverageMonths,
                            target3mo: minBuffer
                        }
                    });
                    if (res && res.success) {
                        await logAlertSent(userId, 'low_emergency_fund');
                        triggered++;
                    }
                }
            }
        }

        // 4. Alert 2: Overdue Goals (deadline passed and saved < target)
        const [overdueGoals] = await pool.query(`
            SELECT id, name, target_amount, saved_amount, deadline,
                   DATE_FORMAT(deadline, '%d %b %Y') as formatted_deadline
            FROM goals
            WHERE user_id = ?
              AND deadline IS NOT NULL
              AND deadline < CURDATE()
              AND saved_amount < target_amount
            LIMIT 1
        `, [userId]);

        if (overdueGoals.length > 0) {
            const goal = overdueGoals[0];
            const canSend = await checkAlertThrottle(userId, 'overdue_goal');
            if (canSend) {
                const remaining = Math.max(0, Number(goal.target_amount) - Number(goal.saved_amount));
                const res = await emailService.sendFinancialAlertEmail({
                    user,
                    alertType: 'overdue_goal',
                    alertData: {
                        goalName: goal.name,
                        deadline: goal.formatted_deadline,
                        remaining
                    }
                });
                if (res && res.success) {
                    await logAlertSent(userId, 'overdue_goal');
                    triggered++;
                }
            }
        }

        return { alertsTriggered: triggered };

    } catch (err) {
        console.error(`[AlertService] Error checking alerts for user ${userId}:`, err.message);
        return { alertsTriggered: 0, error: err.message };
    }
}

/**
 * Checks whether an alert of alertType was already sent to userId in the last 30 days
 */
async function checkAlertThrottle(userId, alertType) {
    const [rows] = await pool.query(`
        SELECT id FROM financial_alerts_log
        WHERE user_id = ? 
          AND alert_type = ? 
          AND sent_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        LIMIT 1
    `, [userId, alertType]);

    return rows.length === 0;
}

/**
 * Record alert sent
 */
async function logAlertSent(userId, alertType) {
    await pool.query(
        'INSERT INTO financial_alerts_log (user_id, alert_type, sent_at) VALUES (?, ?, NOW())',
        [userId, alertType]
    );
}

module.exports = {
    checkAndTriggerUserAlerts,
    checkAlertThrottle
};
