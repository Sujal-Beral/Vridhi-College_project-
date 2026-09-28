const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const requireAuth = require('../middleware/auth');
const emailService = require('../services/emailService');

router.use(requireAuth);

// Helper: Get user email preferences
async function getUserEmailPreferences(userId) {
    try {
        const [rows] = await pool.query('SELECT * FROM user_email_preferences WHERE user_id = ?', [userId]);
        if (rows.length > 0) return rows[0];
        return {
            goal_notifications: 1,
            milestone_emails: 1,
            deadline_reminders: 1,
            monthly_reports: 1,
            quiz_emails: 1,
            financial_alerts: 1
        };
    } catch (e) {
        return { goal_notifications: 1, milestone_emails: 1, deadline_reminders: 1 };
    }
}

// GET /
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        const [goals] = await pool.query('SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC', [userId]);

        const processedGoals = goals.map(goal => {
            const targetAmount = Number(goal.target_amount) || 0;
            const savedAmount = Number(goal.saved_amount) || 0;
            const monthlyAllocation = Number(goal.monthly_allocation) || 0;
            
            // Calculate progress percentage
            const progressPct = targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;
            
            // Remaining amount
            const remaining = Math.max(0, targetAmount - savedAmount);
            
            // Months to complete
            let monthsToComplete = null;
            if (remaining > 0 && monthlyAllocation > 0) {
                monthsToComplete = Math.ceil(remaining / monthlyAllocation);
            }

            return {
                ...goal,
                progress_percentage: progressPct.toFixed(2),
                remaining_amount: remaining,
                months_to_complete: monthsToComplete
            };
        });

        return res.status(200).json({ success: true, data: processedGoals });
    } catch (error) {
        console.error('Goals GET error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /
router.post('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        const { name, target_amount, saved_amount, monthly_allocation, deadline } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ success: false, error: 'Goal name is required' });
        }

        const targetVal = Number(target_amount);
        if (!Number.isFinite(targetVal) || targetVal <= 0) {
            return res.status(400).json({ success: false, error: 'Target amount must be a valid number greater than 0' });
        }

        const initialSaved = saved_amount !== undefined ? Number(saved_amount) : 0;
        if (!Number.isFinite(initialSaved) || initialSaved < 0) {
            return res.status(400).json({ success: false, error: 'Initial saved amount cannot be negative' });
        }

        const alloc = monthly_allocation !== undefined ? Number(monthly_allocation) : 0;
        if (!Number.isFinite(alloc) || alloc < 0) {
            return res.status(400).json({ success: false, error: 'Monthly allocation cannot be negative' });
        }

        const isCompleted = initialSaved >= targetVal && targetVal > 0;

        console.log('[Goal Create] Session User ID:', userId);
        console.log(`[Goal Create] Name: "${name.trim()}", Target: ${targetVal}, Initial Saved: ${initialSaved}, IsCompleted: ${isCompleted}`);

        const [result] = await pool.query(
            'INSERT INTO goals (user_id, name, target_amount, saved_amount, monthly_allocation, deadline, completion_email_sent) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, name.trim(), targetVal, initialSaved, alloc, deadline || null, 0]
        );

        const goalId = result.insertId;
        let emailSent = false;

        const userPrefs = await getUserEmailPreferences(userId);
        const [users] = await pool.query('SELECT id, full_name, email FROM users WHERE id = ?', [userId]);
        const user = users && users.length > 0 ? users[0] : null;

        if (user) {
            if (isCompleted) {
                // Phase 10: Goal Completed on creation
                try {
                    console.log('[Goal Create] Recipient:', user.email);
                    console.log('[Goal Create] Name:', user.full_name);

                    const emailResult = await emailService.sendGoalCompletedEmail({
                        user: {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email
                        },
                        goal: {
                            id: goalId,
                            name: name.trim(),
                            target_amount: targetVal,
                            saved_amount: initialSaved
                        }
                    });

                    if (emailResult && emailResult.success) {
                        emailSent = true;
                        await pool.query('UPDATE goals SET completion_email_sent = 1 WHERE id = ?', [goalId]);
                    }
                } catch (err) {
                    console.error('[Goals POST] Error sending completion email:', err.message);
                }
            } else if (userPrefs.goal_notifications !== 0) {
                // Phase 3: Goal Created email (< 100%)
                try {
                    const createdResult = await emailService.sendGoalCreatedEmail({
                        user: {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email
                        },
                        goal: {
                            id: goalId,
                            name: name.trim(),
                            target_amount: targetVal,
                            saved_amount: initialSaved,
                            monthly_allocation: alloc,
                            deadline: deadline || null
                        }
                    });
                    if (createdResult && createdResult.success) {
                        emailSent = true;
                    }
                } catch (err) {
                    console.error('[Goals POST] Error sending goal created email:', err.message);
                }
            }
        }

        return res.status(201).json({
            success: true,
            data: {
                id: goalId,
                name: name.trim(),
                target_amount: targetVal,
                saved_amount: initialSaved,
                monthly_allocation: alloc,
                deadline: deadline || null,
                completion_email_sent: emailSent && isCompleted ? 1 : 0
            },
            goalCompleted: isCompleted,
            emailSent
        });

    } catch (error) {
        console.error('Goals POST error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// PATCH /:id
router.patch('/:id', async (req, res) => {
    try {
        const userId = req.session.userId;
        const goalId = req.params.id;

        console.log('[Goal Update] Session User ID:', userId);

        // Verify ownership
        const [existing] = await pool.query('SELECT * FROM goals WHERE id = ? AND user_id = ?', [goalId, userId]);
        if (!existing || existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Goal not found or unauthorized' });
        }

        const prevGoal = existing[0];
        const prevSaved = Number(prevGoal.saved_amount) || 0;
        const prevTarget = Number(prevGoal.target_amount) || 0;
        const completion_email_sent = Number(prevGoal.completion_email_sent) === 1;

        const { name, target_amount, saved_amount, monthly_allocation, deadline } = req.body;

        // Clean numeric casting & validation
        if (saved_amount !== undefined) {
            const numSaved = Number(saved_amount);
            if (!Number.isFinite(numSaved) || numSaved < 0) {
                return res.status(400).json({ success: false, error: 'Saved amount must be a non-negative number' });
            }
        }

        if (target_amount !== undefined) {
            const numTarget = Number(target_amount);
            if (!Number.isFinite(numTarget) || numTarget <= 0) {
                return res.status(400).json({ success: false, error: 'Target amount must be a number greater than 0' });
            }
        }

        if (monthly_allocation !== undefined) {
            const numAlloc = Number(monthly_allocation);
            if (!Number.isFinite(numAlloc) || numAlloc < 0) {
                return res.status(400).json({ success: false, error: 'Monthly allocation cannot be negative' });
            }
        }

        const target = target_amount !== undefined ? Number(target_amount) : prevTarget;
        const newSaved = saved_amount !== undefined ? Number(saved_amount) : prevSaved;

        console.log(`[Goal Update] Prior: ${prevSaved}/${target}, New: ${newSaved}/${target}, Already Sent: ${completion_email_sent}`);

        let updateFields = [];
        let values = [];

        if (name !== undefined) { updateFields.push('name=?'); values.push(name.trim()); }
        if (target_amount !== undefined) { updateFields.push('target_amount=?'); values.push(target); }
        if (saved_amount !== undefined) { updateFields.push('saved_amount=?'); values.push(newSaved); }
        if (monthly_allocation !== undefined) { updateFields.push('monthly_allocation=?'); values.push(Number(monthly_allocation)); }
        if (deadline !== undefined) { updateFields.push('deadline=?'); values.push(deadline || null); }

        if (updateFields.length > 0) {
            values.push(goalId, userId);
            const updateQuery = `UPDATE goals SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`;
            await pool.query(updateQuery, values);
        }

        const [updatedRows] = await pool.query('SELECT * FROM goals WHERE id = ?', [goalId]);
        const updatedGoal = updatedRows[0];

        const isComplete = Number.isFinite(newSaved) && Number.isFinite(target) && target > 0 && newSaved >= target;
        console.log(`[Goal Update] Final numeric values - Saved: ${newSaved}, Target: ${target}, IsComplete: ${isComplete}`);

        let emailSent = false;
        const shouldSendCompletionEmail = isComplete && !completion_email_sent;

        const userPrefs = await getUserEmailPreferences(userId);
        const [users] = await pool.query('SELECT id, full_name, email FROM users WHERE id = ?', [userId]);
        const user = users && users.length > 0 ? users[0] : null;

        if (user) {
            // 1. Goal Completion Check (100%+)
            if (shouldSendCompletionEmail) {
                try {
                    console.log('[Goal Update] Recipient:', user.email);
                    console.log('[Goal Update] Name:', user.full_name);

                    const emailResult = await emailService.sendGoalCompletedEmail({
                        user: {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email
                        },
                        goal: {
                            id: updatedGoal.id,
                            name: updatedGoal.name,
                            target_amount: target,
                            saved_amount: newSaved
                        }
                    });

                    if (emailResult && emailResult.success) {
                        emailSent = true;
                        await pool.query('UPDATE goals SET completion_email_sent = 1 WHERE id = ?', [goalId]);
                        updatedGoal.completion_email_sent = 1;
                    } else {
                        console.warn('[Email] Email delivery did not succeed:', emailResult?.reason || emailResult?.error);
                    }
                } catch (emailErr) {
                    console.error('[Email] Failed to send completion email:', emailErr.message);
                }
            }

            // 2. Partial Milestone Checks (25%, 50%, 75%)
            const pct = target > 0 ? (newSaved / target) * 100 : 0;
            if (userPrefs.milestone_emails !== 0) {
                const milestones = [25, 50, 75];
                for (const m of milestones) {
                    if (pct >= m) {
                        try {
                            const [alreadySent] = await pool.query(
                                'SELECT id FROM goal_milestones WHERE goal_id = ? AND milestone_pct = ?',
                                [goalId, m]
                            );
                            if (alreadySent.length === 0) {
                                const mRes = await emailService.sendGoalMilestoneEmail({
                                    user: { id: user.id, full_name: user.full_name, email: user.email },
                                    goal: updatedGoal,
                                    milestonePct: m
                                });
                                if (mRes && mRes.success) {
                                    await pool.query(
                                        'INSERT INTO goal_milestones (goal_id, milestone_pct, email_sent) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE email_sent = 1',
                                        [goalId, m]
                                    );
                                }
                            }
                        } catch (mErr) {
                            console.error(`[Email] Milestone ${m}% check/send error:`, mErr.message);
                        }
                    }
                }
            }
        }

        return res.status(200).json({
            success: true,
            data: updatedGoal,
            goalCompleted: isComplete,
            goalJustCompleted: isComplete && !completion_email_sent,
            emailSent
        });

    } catch (error) {
        console.error('Goals PATCH error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /check-deadlines (Phase 5 - check upcoming goal deadlines within 7 days)
router.post('/check-deadlines', async (req, res) => {
    try {
        const userId = req.session.userId;
        const result = await checkAndSendGoalDeadlines(userId);
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        console.error('Check deadlines error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Helper: Reusable goal deadline reminder checker
async function checkAndSendGoalDeadlines(targetUserId = null) {
    let query = `
        SELECT g.*, u.full_name, u.email, u.id as user_id,
               DATEDIFF(g.deadline, CURDATE()) as days_left
        FROM goals g
        JOIN users u ON g.user_id = u.id
        WHERE g.deadline IS NOT NULL 
          AND g.saved_amount < g.target_amount
          AND g.deadline >= CURDATE()
          AND DATEDIFF(g.deadline, CURDATE()) <= 7
    `;
    const params = [];
    if (targetUserId) {
        query += ' AND g.user_id = ?';
        params.push(targetUserId);
    }

    const [goals] = await pool.query(query, params);
    let sentCount = 0;

    for (const goal of goals) {
        try {
            // Check if reminder was already sent
            const [reminders] = await pool.query(
                'SELECT id FROM goal_deadline_reminders WHERE goal_id = ? AND reminder_type = ?',
                [goal.id, '7_days']
            );
            if (reminders.length > 0) continue;

            // Check user preferences
            const [prefs] = await pool.query(
                'SELECT deadline_reminders FROM user_email_preferences WHERE user_id = ?',
                [goal.user_id]
            );
            if (prefs.length > 0 && prefs[0].deadline_reminders === 0) continue;

            const sendRes = await emailService.sendGoalDeadlineEmail({
                user: { id: goal.user_id, full_name: goal.full_name, email: goal.email },
                goal,
                daysRemaining: goal.days_left
            });

            if (sendRes && sendRes.success) {
                await pool.query(
                    'INSERT INTO goal_deadline_reminders (goal_id, reminder_type, email_sent) VALUES (?, ?, 1)',
                    [goal.id, '7_days']
                );
                sentCount++;
            }
        } catch (err) {
            console.error(`[Deadline Check] Error processing goal ID ${goal.id}:`, err.message);
        }
    }

    return { totalFound: goals.length, remindersSent: sentCount };
}

// DELETE /:id
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.session.userId;
        const goalId = req.params.id;

        // Verify ownership
        const [existing] = await pool.query('SELECT id FROM goals WHERE id = ? AND user_id = ?', [goalId, userId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Goal not found or unauthorized' });
        }

        await pool.query('DELETE FROM goals WHERE id = ? AND user_id = ?', [goalId, userId]);
        
        return res.status(200).json({ success: true, data: { message: 'Goal deleted successfully' } });

    } catch (error) {
        console.error('Goals DELETE error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
module.exports.checkAndSendGoalDeadlines = checkAndSendGoalDeadlines;
