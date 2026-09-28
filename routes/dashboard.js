const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const requireAuth = require('../middleware/auth');
const emailService = require('../services/emailService');

// Apply auth middleware to all routes in this file
router.use(requireAuth);

// GET /
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;

        // Fetch user info
        const [users] = await pool.query('SELECT full_name, email, category FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const user = users[0];

        // Fetch financial profile
        const [profiles] = await pool.query('SELECT * FROM financial_profiles WHERE user_id = ?', [userId]);
        const profile = profiles.length > 0 ? profiles[0] : null;

        // Fetch goals count
        const [goalsCountResult] = await pool.query('SELECT COUNT(*) as count FROM goals WHERE user_id = ?', [userId]);
        const goalsCount = goalsCountResult[0].count;

        // Fetch goals summary
        const [goalsSummaryResult] = await pool.query('SELECT SUM(target_amount) as total_target, SUM(saved_amount) as total_saved FROM goals WHERE user_id = ?', [userId]);
        const goalsSummary = goalsSummaryResult[0];

        // Calculate 20-20-30-30 allocation from monthly_income
        let allocation = null;
        if (profile && profile.monthly_income) {
            const income = parseFloat(profile.monthly_income);
            allocation = {
                secureSavings: (income * 0.20).toFixed(2),
                emergencyShield: (income * 0.20).toFixed(2),
                homeEssentials: (income * 0.30).toFixed(2),
                wealthGeneration: (income * 0.30).toFixed(2)
            };
        }

        // Return all dashboard data
        return res.status(200).json({
            success: true,
            data: {
                user,
                profile,
                goals: {
                    count: goalsCount,
                    totalTarget: goalsSummary.total_target || 0,
                    totalSaved: goalsSummary.total_saved || 0
                },
                allocation
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /email-report (Phase 6 - Send Monthly Financial Report by email)
router.post('/email-report', async (req, res) => {
    try {
        const userId = req.session.userId;

        // Debounce spam / repeated rapid clicks (minimum 10 seconds between manual sends)
        const now = Date.now();
        if (req.session.lastReportEmailSent && (now - req.session.lastReportEmailSent < 10000)) {
            return res.status(429).json({
                success: false,
                error: 'Please wait a few seconds before requesting another email report.'
            });
        }

        const [users] = await pool.query('SELECT id, full_name, email, category FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const user = users[0];

        // Fetch user financial profile
        const [profiles] = await pool.query('SELECT * FROM financial_profiles WHERE user_id = ?', [userId]);
        const profile = profiles.length > 0 ? profiles[0] : { monthly_income: 0, essential_expenses: 0, current_savings: 0, existing_debt: 0 };

        // Fetch user goals
        const [goals] = await pool.query('SELECT name, target_amount, saved_amount, deadline FROM goals WHERE user_id = ? ORDER BY created_at DESC', [userId]);

        const income = parseFloat(profile.monthly_income) || 0;
        const expenses = parseFloat(profile.essential_expenses) || 0;
        const savings = parseFloat(profile.current_savings) || 0;
        const debt = parseFloat(profile.existing_debt) || 0;

        const allocation = {
            secureSavings: (income * 0.20).toFixed(2),
            emergencyShield: (income * 0.20).toFixed(2),
            homeEssentials: (income * 0.30).toFixed(2),
            wealthGeneration: (income * 0.30).toFixed(2)
        };

        // Calculate simple health score
        let healthScore = 0;
        if (income > 0) healthScore += 20;
        if (savings > 0) healthScore += 20;
        if (expenses > 0 && savings >= (expenses * 3)) healthScore += 30;
        if (income > 0 && debt < (income * 0.30)) healthScore += 20;
        if (goals.length > 0) healthScore += 10;
        healthScore = Math.min(100, Math.max(10, healthScore));

        const monthYear = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

        const emailResult = await emailService.sendMonthlyReportEmail({
            user,
            profile,
            goals,
            allocation,
            healthScore,
            monthYear
        });

        if (emailResult && emailResult.success) {
            req.session.lastReportEmailSent = now;
            return res.status(200).json({
                success: true,
                message: `Monthly report for ${monthYear} has been sent to ${user.email}.`
            });
        } else {
            return res.status(500).json({
                success: false,
                error: emailResult.error || 'Failed to send email. Please ensure SMTP credentials are configured.'
            });
        }

    } catch (error) {
        console.error('Email report error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
