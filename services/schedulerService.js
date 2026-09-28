const { checkAndSendGoalDeadlines } = require('../routes/goals');
const pool = require('../db/connection');
const alertService = require('./alertService');

let schedulerInterval = null;

/**
 * Runs all scheduled tasks:
 * 1. Goal Deadline Reminders (goals with deadlines within 7 days)
 * 2. User Financial Health & Emergency Alerts
 */
async function runScheduledTasks() {
    console.log('[Scheduler] Running scheduled background financial notification checks...');
    try {
        // 1. Goal deadline reminders
        const deadlineResult = await checkAndSendGoalDeadlines();
        console.log(`[Scheduler] Goal deadline reminders checked: ${deadlineResult.remindersSent} sent out of ${deadlineResult.totalFound} eligible.`);

        // 2. Financial health alerts for active users
        const [activeUsers] = await pool.query('SELECT id FROM users LIMIT 100');
        let totalAlerts = 0;
        for (const u of activeUsers) {
            const aRes = await alertService.checkAndTriggerUserAlerts(u.id);
            if (aRes && aRes.alertsTriggered) totalAlerts += aRes.alertsTriggered;
        }
        console.log(`[Scheduler] Financial alerts checked: ${totalAlerts} alerts dispatched.`);

    } catch (err) {
        console.error('[Scheduler] Error running scheduled tasks:', err.message);
    }
}

/**
 * Start the background scheduler.
 * Runs on startup (after 5 seconds initial delay) and repeats every 12 hours.
 */
function startScheduler(intervalMs = 12 * 60 * 60 * 1000) {
    if (schedulerInterval) return;

    // Initial run after short delay to let server initialize
    setTimeout(() => {
        runScheduledTasks().catch(err => console.error('[Scheduler] Initial run error:', err));
    }, 5000);

    schedulerInterval = setInterval(() => {
        runScheduledTasks().catch(err => console.error('[Scheduler] Interval run error:', err));
    }, intervalMs);

    // Unref so test harnesses or process exits are not blocked
    if (schedulerInterval.unref) {
        schedulerInterval.unref();
    }

    console.log('[Scheduler] Background notification scheduler started.');
}

function stopScheduler() {
    if (schedulerInterval) {
        clearInterval(schedulerInterval);
        schedulerInterval = null;
        console.log('[Scheduler] Background scheduler stopped.');
    }
}

module.exports = {
    startScheduler,
    stopScheduler,
    runScheduledTasks
};
