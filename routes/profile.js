const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const requireAuth = require('../middleware/auth');
const alertService = require('../services/alertService');

// Apply auth middleware to all routes
router.use(requireAuth);

// GET /profile
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;

        // Fetch combined user and profile data
        const query = `
            SELECT u.full_name, u.email, u.age, u.mobile, u.category, fp.* 
            FROM users u 
            JOIN financial_profiles fp ON u.id = fp.user_id 
            WHERE u.id = ?
        `;
        const [results] = await pool.query(query, [userId]);
        
        if (results.length === 0) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }
        
        const profile = results[0];

        // Calculate emergency fund range
        const essentialExpenses = parseFloat(profile.essential_expenses || 0);
        const emergencyFundMin = essentialExpenses * 3;
        const emergencyFundMax = essentialExpenses * 6;

        // Calculate financial health score
        let healthScore = 0;
        const strengths = [];
        const improvements = [];
        
        const monthlyIncome = parseFloat(profile.monthly_income || 0);
        const currentSavings = parseFloat(profile.current_savings || 0);
        const existingDebt = parseFloat(profile.existing_debt || 0);

        // Has income set (10 pts)
        if (monthlyIncome > 0) {
            healthScore += 10;
            strengths.push('Regular income established');
        } else {
            improvements.push('Set your monthly income');
        }

        // Savings ratio > 0 (15 pts) - Assumes current_savings > 0
        if (currentSavings > 0) {
            healthScore += 15;
            strengths.push('Active savings habit');
        } else {
            improvements.push('Start saving a portion of your income');
        }

        // Has emergency fund (20 pts)
        if (essentialExpenses > 0 && currentSavings >= emergencyFundMin) {
            healthScore += 20;
            strengths.push('Healthy emergency fund');
        } else {
            improvements.push(`Build emergency fund to at least ₹${emergencyFundMin}`);
        }

        // Low debt burden (20 pts)
        if (monthlyIncome > 0 && existingDebt < (0.30 * monthlyIncome)) {
            healthScore += 20;
            strengths.push('Manageable debt levels');
        } else if (monthlyIncome > 0) {
            improvements.push('Work on reducing existing debt');
        } else if (existingDebt > 0) {
            improvements.push('High debt without steady income');
        } else {
            healthScore += 20;
            strengths.push('No reported debt');
        }

        // Goal metrics
        const [goalsResult] = await pool.query('SELECT COUNT(*) as count FROM goals WHERE user_id = ?', [userId]);
        const goalCount = goalsResult[0].count;

        // Has financial goals (15 pts)
        if (goalCount > 0) {
            healthScore += 15;
            strengths.push('Active financial goals');
            
            // Goal progress (20 pts)
            const [goalProgressResult] = await pool.query('SELECT AVG(saved_amount/target_amount) as avg_progress FROM goals WHERE user_id = ? AND target_amount > 0', [userId]);
            const avgProgress = parseFloat(goalProgressResult[0].avg_progress || 0);
            
            healthScore += Math.min(20, avgProgress * 20); // up to 20 pts based on progress
            if (avgProgress > 0.5) strengths.push('Strong progress on goals');
        } else {
            improvements.push('Set up clear financial goals');
        }

        // Return comprehensive profile response
        return res.status(200).json({
            success: true,
            data: {
                profile,
                emergencyFund: {
                    min: emergencyFundMin,
                    max: emergencyFundMax
                },
                healthScore: Math.round(healthScore),
                strengths,
                improvements
            }
        });

    } catch (error) {
        console.error('Profile GET error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// PATCH /profile
router.patch('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        const { monthly_income, essential_expenses, current_savings, existing_debt, risk_preference, age, mobile, category } = req.body;

        // Validate monetary values to ensure no negatives
        const monetaryFields = { monthly_income, essential_expenses, current_savings, existing_debt };
        for (const [key, val] of Object.entries(monetaryFields)) {
            if (val !== undefined && val !== null && parseFloat(val) < 0) {
                return res.status(400).json({ success: false, error: `${key} cannot be negative` });
            }
        }

        // Update financial profile if fields provided
        let fpUpdateFields = [];
        let fpValues = [];
        
        if (monthly_income !== undefined) { fpUpdateFields.push('monthly_income=?'); fpValues.push(monthly_income); }
        if (essential_expenses !== undefined) { fpUpdateFields.push('essential_expenses=?'); fpValues.push(essential_expenses); }
        if (current_savings !== undefined) { fpUpdateFields.push('current_savings=?'); fpValues.push(current_savings); }
        if (existing_debt !== undefined) { fpUpdateFields.push('existing_debt=?'); fpValues.push(existing_debt); }
        if (risk_preference !== undefined) { fpUpdateFields.push('risk_preference=?'); fpValues.push(risk_preference); }

        if (fpUpdateFields.length > 0) {
            fpValues.push(userId);
            const updateQuery = `UPDATE financial_profiles SET ${fpUpdateFields.join(', ')} WHERE user_id = ?`;
            await pool.query(updateQuery, fpValues);
        }

        // Update user info if fields provided
        let userUpdateFields = [];
        let userValues = [];

        if (age !== undefined) { userUpdateFields.push('age=?'); userValues.push(age); }
        if (mobile !== undefined) { userUpdateFields.push('mobile=?'); userValues.push(mobile); }
        if (category !== undefined) { userUpdateFields.push('category=?'); userValues.push(category); }

        if (userUpdateFields.length > 0) {
            userValues.push(userId);
            const userQuery = `UPDATE users SET ${userUpdateFields.join(', ')} WHERE id = ?`;
            await pool.query(userQuery, userValues);
        }

        // Trigger asynchronous alert check
        alertService.checkAndTriggerUserAlerts(userId).catch(err => {
            console.error('[Profile] Alert check error:', err.message);
        });

        return res.status(200).json({ success: true, data: { message: 'Profile updated successfully' } });

    } catch (error) {
        console.error('Profile PATCH error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /email-preferences (Phase 11)
router.get('/email-preferences', async (req, res) => {
    try {
        const userId = req.session.userId;
        const [rows] = await pool.query('SELECT * FROM user_email_preferences WHERE user_id = ?', [userId]);
        if (rows.length > 0) {
            return res.status(200).json({ success: true, data: rows[0] });
        }
        return res.status(200).json({
            success: true,
            data: {
                goal_notifications: 1,
                milestone_emails: 1,
                deadline_reminders: 1,
                monthly_reports: 1,
                quiz_emails: 1,
                financial_alerts: 1
            }
        });
    } catch (error) {
        console.error('Email preferences GET error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// PATCH /email-preferences (Phase 11)
router.patch('/email-preferences', async (req, res) => {
    try {
        const userId = req.session.userId;
        const { goal_notifications, milestone_emails, deadline_reminders, monthly_reports, quiz_emails, financial_alerts } = req.body;

        const [existing] = await pool.query('SELECT user_id FROM user_email_preferences WHERE user_id = ?', [userId]);
        const toBoolNum = (v, defaultVal = 1) => (v !== undefined ? (v ? 1 : 0) : defaultVal);

        if (existing.length > 0) {
            const updates = [];
            const values = [];
            if (goal_notifications !== undefined) { updates.push('goal_notifications = ?'); values.push(toBoolNum(goal_notifications)); }
            if (milestone_emails !== undefined) { updates.push('milestone_emails = ?'); values.push(toBoolNum(milestone_emails)); }
            if (deadline_reminders !== undefined) { updates.push('deadline_reminders = ?'); values.push(toBoolNum(deadline_reminders)); }
            if (monthly_reports !== undefined) { updates.push('monthly_reports = ?'); values.push(toBoolNum(monthly_reports)); }
            if (quiz_emails !== undefined) { updates.push('quiz_emails = ?'); values.push(toBoolNum(quiz_emails)); }
            if (financial_alerts !== undefined) { updates.push('financial_alerts = ?'); values.push(toBoolNum(financial_alerts)); }

            if (updates.length > 0) {
                values.push(userId);
                await pool.query(`UPDATE user_email_preferences SET ${updates.join(', ')} WHERE user_id = ?`, values);
            }
        } else {
            await pool.query(
                `INSERT INTO user_email_preferences (user_id, goal_notifications, milestone_emails, deadline_reminders, monthly_reports, quiz_emails, financial_alerts) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    toBoolNum(goal_notifications),
                    toBoolNum(milestone_emails),
                    toBoolNum(deadline_reminders),
                    toBoolNum(monthly_reports),
                    toBoolNum(quiz_emails),
                    toBoolNum(financial_alerts)
                ]
            );
        }

        return res.status(200).json({ success: true, message: 'Email preferences updated successfully.' });

    } catch (error) {
        console.error('Email preferences PATCH error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
