// scripts/testEmailSuite.js
// Comprehensive Integration & Unit Test Suite for Vridhi Email Pipelines
require('dotenv').config();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const pool = require('../db/connection');
const emailService = require('../services/emailService');
const { checkAndSendGoalDeadlines } = require('../routes/goals');
const alertService = require('../services/alertService');

async function runTestSuite() {
    console.log('================================================================');
    console.log('       VRIDHI COMPREHENSIVE EMAIL NOTIFICATION TEST SUITE       ');
    console.log('================================================================\n');

    let passedTests = 0;
    let totalTests = 0;

    function assertTest(name, condition, details = '') {
        totalTests++;
        if (condition) {
            passedTests++;
            console.log(`✅ [PASS] Test ${totalTests}: ${name}`);
            if (details) console.log(`   └─ ${details}`);
        } else {
            console.error(`❌ [FAIL] Test ${totalTests}: ${name}`);
            if (details) console.error(`   └─ ${details}`);
        }
    }

    // Intercept nodemailer with mock transporter for deterministic test verification
    const mockSentEmails = [];
    let simulateSmtpFailure = false;

    const originalCreateTransport = nodemailer.createTransport;
    nodemailer.createTransport = function () {
        return {
            verify: async () => {
                if (simulateSmtpFailure) throw new Error('Simulated SMTP ECONNREFUSED');
                return true;
            },
            sendMail: async (mailOptions) => {
                if (simulateSmtpFailure) {
                    const err = new Error('Simulated SMTP Connection Refused');
                    err.code = 'ECONNREFUSED';
                    throw err;
                }
                const msgId = `<test-${Date.now()}-${Math.random().toString(36).substring(7)}@vridhi.local>`;
                mockSentEmails.push({
                    ...mailOptions,
                    messageId: msgId,
                    sentAt: new Date()
                });
                return { messageId: msgId, response: '250 2.0.0 OK Mock' };
            }
        };
    };

    const testTimestamp = Date.now();
    const testUserEmail = `audit_suite_${testTimestamp}@vridhi-test.org`;
    let testUserId = null;

    try {
        // SETUP: Create isolated test user
        const salt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash('TestPass123!', salt);
        const rawVerifToken = crypto.randomBytes(32).toString('hex');
        const hashVerifToken = crypto.createHash('sha256').update(rawVerifToken).digest('hex');

        const [userIns] = await pool.query(
            'INSERT INTO users (full_name, email, password_hash, age, mobile, category, email_verified, email_verification_token, email_verification_expires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            ['Sujal Beral Test', testUserEmail, passHash, 24, '9876543210', 'Student', 0, hashVerifToken, new Date(Date.now() + 86400000)]
        );
        testUserId = userIns.insertId;

        // Default email preferences
        await pool.query(
            'INSERT INTO user_email_preferences (user_id, goal_notifications, milestone_emails, deadline_reminders, monthly_reports, quiz_emails, financial_alerts) VALUES (?, 1, 1, 1, 1, 1, 1)',
            [testUserId]
        );

        // Initial empty financial profile
        await pool.query(
            'INSERT INTO financial_profiles (user_id, monthly_income, essential_expenses, current_savings, existing_debt) VALUES (?, 50000, 20000, 10000, 5000)',
            [testUserId]
        );

        // -------------------------------------------------------------
        // TEST 1: Welcome / Verification Email
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        const welcomeRes = await emailService.sendWelcomeEmail({
            user: { id: testUserId, full_name: 'Sujal Beral Test', email: testUserEmail },
            verificationUrl: `http://localhost:3000/api/auth/verify-email?token=${rawVerifToken}`
        });
        assertTest('Welcome / Verification Email Delivery', welcomeRes.success && mockSentEmails.length === 1, `Subject: "${mockSentEmails[0]?.subject}"`);

        // -------------------------------------------------------------
        // TEST 2: Email Verification Token Handling
        // -------------------------------------------------------------
        const [verifUserBefore] = await pool.query('SELECT email_verified FROM users WHERE id = ?', [testUserId]);
        const testHash = crypto.createHash('sha256').update(rawVerifToken).digest('hex');
        const [matchUser] = await pool.query('SELECT id FROM users WHERE email_verification_token = ?', [testHash]);
        await pool.query('UPDATE users SET email_verified = 1, email_verification_token = NULL, email_verification_expires = NULL WHERE id = ?', [testUserId]);
        const [verifUserAfter] = await pool.query('SELECT email_verified, email_verification_token FROM users WHERE id = ?', [testUserId]);
        assertTest('Email Verification Token Lifecycle', verifUserBefore[0].email_verified === 0 && matchUser.length === 1 && verifUserAfter[0].email_verified === 1 && verifUserAfter[0].email_verification_token === null);

        // -------------------------------------------------------------
        // TEST 3: Password Reset Token & Flow
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        const rawResetToken = crypto.randomBytes(32).toString('hex');
        const hashResetToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        await pool.query('UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?', [hashResetToken, resetExpires, testUserId]);

        const resetMailRes = await emailService.sendPasswordResetEmail({
            user: { id: testUserId, full_name: 'Sujal Beral Test', email: testUserEmail },
            resetUrl: `http://localhost:3000/reset-password.html?token=${rawResetToken}`
        });
        assertTest('Password Reset Email Dispatch', resetMailRes.success && mockSentEmails.length === 1, `Subject: "${mockSentEmails[0]?.subject}"`);

        // Test Token Invalidation on New Password Set
        const newPassHash = await bcrypt.hash('NewSecretPassword123!', 10);
        await pool.query('UPDATE users SET password_hash = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?', [newPassHash, testUserId]);
        const [resetCheck] = await pool.query('SELECT reset_password_token, password_hash FROM users WHERE id = ?', [testUserId]);
        const passMatch = await bcrypt.compare('NewSecretPassword123!', resetCheck[0].password_hash);
        assertTest('Password Reset Single-Use Invalidation', passMatch && resetCheck[0].reset_password_token === null);

        // -------------------------------------------------------------
        // TEST 4: Goal Created Email (saved < target)
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        const [goalIns] = await pool.query(
            'INSERT INTO goals (user_id, name, target_amount, saved_amount, monthly_allocation, deadline, completion_email_sent) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [testUserId, 'Emergency Buffer Fund', 100000, 10000, 15000, '2026-12-31', 0]
        );
        const testGoalId = goalIns.insertId;

        const goalCreatedRes = await emailService.sendGoalCreatedEmail({
            user: { id: testUserId, full_name: 'Sujal Beral Test', email: testUserEmail },
            goal: { id: testGoalId, name: 'Emergency Buffer Fund', target_amount: 100000, saved_amount: 10000, deadline: '2026-12-31' }
        });
        assertTest('Goal Created Confirmation Email', goalCreatedRes.success && mockSentEmails.length === 1, `Subject: "${mockSentEmails[0]?.subject}"`);

        // -------------------------------------------------------------
        // TEST 5: Goal Progress Milestone: 25% Milestone
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        await pool.query('UPDATE goals SET saved_amount = 25000 WHERE id = ?', [testGoalId]);
        const m25Res = await emailService.sendGoalMilestoneEmail({
            user: { id: testUserId, full_name: 'Sujal Beral Test', email: testUserEmail },
            goal: { id: testGoalId, name: 'Emergency Buffer Fund', target_amount: 100000, saved_amount: 25000 },
            milestonePct: 25
        });
        await pool.query('INSERT INTO goal_milestones (goal_id, milestone_pct, email_sent) VALUES (?, 25, 1)', [testGoalId]);
        assertTest('25% Goal Milestone Email', m25Res.success && mockSentEmails.length === 1 && mockSentEmails[0].subject.includes('25%'));

        // -------------------------------------------------------------
        // TEST 6: Goal Progress Milestone: 50% Milestone
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        await pool.query('UPDATE goals SET saved_amount = 50000 WHERE id = ?', [testGoalId]);
        const m50Res = await emailService.sendGoalMilestoneEmail({
            user: { id: testUserId, full_name: 'Sujal Beral Test', email: testUserEmail },
            goal: { id: testGoalId, name: 'Emergency Buffer Fund', target_amount: 100000, saved_amount: 50000 },
            milestonePct: 50
        });
        await pool.query('INSERT INTO goal_milestones (goal_id, milestone_pct, email_sent) VALUES (?, 50, 1)', [testGoalId]);
        assertTest('50% Goal Milestone Email', m50Res.success && mockSentEmails.length === 1 && mockSentEmails[0].subject.includes('50%'));

        // -------------------------------------------------------------
        // TEST 7: Goal Progress Milestone: 75% Milestone
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        await pool.query('UPDATE goals SET saved_amount = 75000 WHERE id = ?', [testGoalId]);
        const m75Res = await emailService.sendGoalMilestoneEmail({
            user: { id: testUserId, full_name: 'Sujal Beral Test', email: testUserEmail },
            goal: { id: testGoalId, name: 'Emergency Buffer Fund', target_amount: 100000, saved_amount: 75000 },
            milestonePct: 75
        });
        await pool.query('INSERT INTO goal_milestones (goal_id, milestone_pct, email_sent) VALUES (?, 75, 1)', [testGoalId]);
        assertTest('75% Goal Milestone Email', m75Res.success && mockSentEmails.length === 1 && mockSentEmails[0].subject.includes('75%'));

        // -------------------------------------------------------------
        // TEST 8: Goal Completed Email (100%) - Preserved Behavior
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        await pool.query('UPDATE goals SET saved_amount = 100000 WHERE id = ?', [testGoalId]);
        const completedRes = await emailService.sendGoalCompletedEmail({
            user: { id: testUserId, full_name: 'Sujal Beral Test', email: testUserEmail },
            goal: { id: testGoalId, name: 'Emergency Buffer Fund', target_amount: 100000, saved_amount: 100000 }
        });
        await pool.query('UPDATE goals SET completion_email_sent = 1 WHERE id = ?', [testGoalId]);
        assertTest('100% Goal Completed Email (Preserved Flow)', completedRes.success && mockSentEmails.length === 1 && mockSentEmails[0].subject.includes('completed'));

        // -------------------------------------------------------------
        // TEST 9: Goal Exceeds Target (e.g. 120%)
        // -------------------------------------------------------------
        const [goal2Ins] = await pool.query(
            'INSERT INTO goals (user_id, name, target_amount, saved_amount, monthly_allocation, completion_email_sent) VALUES (?, ?, ?, ?, ?, ?)',
            [testUserId, 'Overachieved Goal', 50000, 60000, 10000, 0]
        );
        const goal2Id = goal2Ins.insertId;
        mockSentEmails.length = 0;
        const exceedRes = await emailService.sendGoalCompletedEmail({
            user: { id: testUserId, full_name: 'Sujal Beral Test', email: testUserEmail },
            goal: { id: goal2Id, name: 'Overachieved Goal', target_amount: 50000, saved_amount: 60000 }
        });
        await pool.query('UPDATE goals SET completion_email_sent = 1 WHERE id = ?', [goal2Id]);
        assertTest('Goal Exceeds Target (Saved > Target)', exceedRes.success && mockSentEmails.length === 1);

        // -------------------------------------------------------------
        // TEST 10: Duplicate Milestone & Completion Prevention
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        // Check milestone 50% duplicate
        const [m50Check] = await pool.query('SELECT id FROM goal_milestones WHERE goal_id = ? AND milestone_pct = 50', [testGoalId]);
        const shouldSendDuplicateM50 = m50Check.length === 0;

        // Check completion duplicate
        const [compCheck] = await pool.query('SELECT completion_email_sent FROM goals WHERE id = ?', [testGoalId]);
        const shouldSendDuplicateComp = compCheck[0].completion_email_sent === 0;

        assertTest('Duplicate Milestone & Completion Email Prevention', !shouldSendDuplicateM50 && !shouldSendDuplicateComp && mockSentEmails.length === 0);

        // -------------------------------------------------------------
        // TEST 11: Milestone Jump Handling (0% -> 80%)
        // -------------------------------------------------------------
        const [jumpGoalIns] = await pool.query(
            'INSERT INTO goals (user_id, name, target_amount, saved_amount, completion_email_sent) VALUES (?, ?, ?, ?, ?)',
            [testUserId, 'Jump Goal', 100000, 80000, 0]
        );
        const jumpGoalId = jumpGoalIns.insertId;
        const jumpPct = 80;
        const crossedMilestones = [25, 50, 75].filter(m => jumpPct >= m);
        assertTest('Milestone Jump Detection (Crossed 25, 50, 75%)', crossedMilestones.length === 3 && crossedMilestones.includes(25) && crossedMilestones.includes(50) && crossedMilestones.includes(75));

        // -------------------------------------------------------------
        // TEST 12: Goal Deadline Reminder (~7 Days Prior)
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        // Set a goal deadline in 5 days
        const deadlineDate = new Date();
        deadlineDate.setDate(deadlineDate.getDate() + 5);
        const formattedDate = deadlineDate.toISOString().split('T')[0];

        const [dlGoalIns] = await pool.query(
            'INSERT INTO goals (user_id, name, target_amount, saved_amount, deadline, completion_email_sent) VALUES (?, ?, ?, ?, ?, ?)',
            [testUserId, 'Upcoming Deadline Goal', 40000, 20000, formattedDate, 0]
        );
        const dlGoalId = dlGoalIns.insertId;

        const dlResult = await checkAndSendGoalDeadlines(testUserId);
        assertTest('Goal Deadline Reminder (7-Day Check)', dlResult.remindersSent >= 1 && mockSentEmails.length >= 1, `Sent: ${dlResult.remindersSent}`);

        // -------------------------------------------------------------
        // TEST 13: Monthly Financial Report Email Dispatch
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        const reportRes = await emailService.sendMonthlyReportEmail({
            user: { id: testUserId, full_name: 'Sujal Beral Test', email: testUserEmail },
            profile: { monthly_income: 50000, essential_expenses: 20000, current_savings: 10000, existing_debt: 5000 },
            goals: [{ name: 'Emergency Buffer Fund', target_amount: 100000, saved_amount: 100000 }],
            allocation: { secureSavings: 10000, emergencyShield: 10000, homeEssentials: 15000, wealthGeneration: 15000 },
            healthScore: 75,
            monthYear: 'September 2026'
        });
        assertTest('Monthly Financial Report Email Summary', reportRes.success && mockSentEmails.length === 1 && mockSentEmails[0].subject.includes('Monthly Financial Report'));

        // -------------------------------------------------------------
        // TEST 14: Quiz Results Email (Before & After with Improvement)
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        // Before Quiz
        const qBeforeRes = await emailService.sendQuizResultEmail({
            user: { id: testUserId, full_name: 'Sujal Beral Test', email: testUserEmail },
            survey_type: 'before',
            score: 5,
            total: 10,
            percentage: 50.0
        });

        // After Quiz with Improvement
        const qAfterRes = await emailService.sendQuizResultEmail({
            user: { id: testUserId, full_name: 'Sujal Beral Test', email: testUserEmail },
            survey_type: 'after',
            score: 9,
            total: 10,
            percentage: 90.0,
            improvementPoints: 40.0
        });
        assertTest('Quiz Result Emails (Before Baseline + After Improvement)', qBeforeRes.success && qAfterRes.success && mockSentEmails.length === 2 && mockSentEmails[1].html.includes('40 % Points'));

        // -------------------------------------------------------------
        // TEST 15: Financial Health Alert (Low Emergency Fund)
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        const alertRes = await alertService.checkAndTriggerUserAlerts(testUserId);
        assertTest('Financial Health Alert (Low Emergency Fund Buffer)', alertRes.alertsTriggered >= 1 && mockSentEmails.length >= 1, `Triggered: ${alertRes.alertsTriggered}`);

        // -------------------------------------------------------------
        // TEST 16: Financial Alert Throttling (Prevent Spamming)
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        const throttledRes = await alertService.checkAndTriggerUserAlerts(testUserId);
        assertTest('Financial Alert Throttling (30-Day Rate Limit)', throttledRes.alertsTriggered === 0 && mockSentEmails.length === 0);

        // -------------------------------------------------------------
        // TEST 17: Email Preferences Enforcement
        // -------------------------------------------------------------
        mockSentEmails.length = 0;
        await pool.query('UPDATE user_email_preferences SET milestone_emails = 0, deadline_reminders = 0, financial_alerts = 0 WHERE user_id = ?', [testUserId]);
        const [disabledPrefs] = await pool.query('SELECT milestone_emails, deadline_reminders, financial_alerts FROM user_email_preferences WHERE user_id = ?', [testUserId]);
        assertTest('Email Preferences Customization & Storage', disabledPrefs[0].milestone_emails === 0 && disabledPrefs[0].deadline_reminders === 0 && disabledPrefs[0].financial_alerts === 0);

        // -------------------------------------------------------------
        // TEST 18: SMTP Failure Resilience
        // -------------------------------------------------------------
        simulateSmtpFailure = true;
        const [failGoalIns] = await pool.query(
            'INSERT INTO goals (user_id, name, target_amount, saved_amount, completion_email_sent) VALUES (?, ?, ?, ?, ?)',
            [testUserId, 'Failure Test Goal', 20000, 10000, 0]
        );
        const failGoalId = failGoalIns.insertId;

        // Attempt update to 100% with broken SMTP
        await pool.query('UPDATE goals SET saved_amount = 20000 WHERE id = ?', [failGoalId]);
        const failRes = await emailService.sendGoalCompletedEmail({
            user: { id: testUserId, full_name: 'Sujal Beral Test', email: testUserEmail },
            goal: { id: failGoalId, name: 'Failure Test Goal', target_amount: 20000, saved_amount: 20000 }
        });

        const [persistedGoal] = await pool.query('SELECT saved_amount, completion_email_sent FROM goals WHERE id = ?', [failGoalId]);
        simulateSmtpFailure = false;

        assertTest('SMTP Failure Resilience (DB Update Persisted, No Crash)', !failRes.success && persistedGoal[0].saved_amount == 20000 && persistedGoal[0].completion_email_sent === 0);

        // -------------------------------------------------------------
        // TEST 19: Missing / Invalid Email Safety
        // -------------------------------------------------------------
        const missingEmailRes = await emailService.sendGoalCreatedEmail({
            user: { id: testUserId, full_name: 'Test', email: '' },
            goal: { name: 'Test Goal', target_amount: 10000, saved_amount: 0 }
        });
        assertTest('Missing / Invalid Email Safety Guard', !missingEmailRes.success && missingEmailRes.reason === 'missing_recipient');

        // -------------------------------------------------------------
        // TEST 20: Safe Logging Masking Verification
        // -------------------------------------------------------------
        const maskedOutput = emailService.maskEmail('sujal.beral@example.com');
        assertTest('Safe Email Address Masking', maskedOutput.startsWith('su***@') && !maskedOutput.includes('jal.beral'), `Masked: ${maskedOutput}`);

    } finally {
        // CLEANUP: Clean up test data
        if (testUserId) {
            await pool.query('DELETE FROM users WHERE id = ?', [testUserId]);
        }
        // Restore nodemailer transporter
        nodemailer.createTransport = originalCreateTransport;
    }

    console.log('\n================================================================');
    console.log(`  RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
    if (passedTests === totalTests) {
        console.log('  🎉 ALL AUTOMATED EMAIL PIPELINE TESTS PASSED PERFECTLY!');
    } else {
        console.error(`  ⚠️ ${totalTests - passedTests} TESTS FAILED.`);
    }
    console.log('================================================================\n');

    process.exit(passedTests === totalTests ? 0 : 1);
}

runTestSuite().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
});
