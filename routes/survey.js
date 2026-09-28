const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const requireAuth = require('../middleware/auth');
const emailService = require('../services/emailService');

// Auto-ensure quiz_attempts table exists
(async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS quiz_attempts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                quiz_type ENUM('before', 'after') NOT NULL,
                score INT NOT NULL,
                total_questions INT NOT NULL DEFAULT 10,
                percentage DECIMAL(5,2) NOT NULL,
                attempt_number INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user_quiz (user_id, quiz_type, created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    } catch (e) {
        console.error("quiz_attempts init table warning:", e.message);
    }
})();

// GET /status (checks authenticated user's quiz & survey completion status)
router.get('/status', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(200).json({
                success: true,
                data: {
                    authenticated: false,
                    beforeQuiz: null,
                    afterQuiz: null,
                    improvementPoints: null
                }
            });
        }

        const query = `
            SELECT id, user_id, survey_type, quiz_score, quiz_total, score_percentage, awareness_rating, created_at 
            FROM community_surveys 
            WHERE user_id = ? AND quiz_score IS NOT NULL 
            ORDER BY id DESC, created_at DESC
        `;
        const [rows] = await pool.query(query, [userId]);

        const beforeQuiz = rows.find(r => r.survey_type === 'before') || null;
        const afterQuiz = rows.find(r => r.survey_type === 'after') || null;

        let improvementPoints = null;
        if (beforeQuiz && afterQuiz && beforeQuiz.score_percentage !== null && afterQuiz.score_percentage !== null) {
            improvementPoints = parseFloat((parseFloat(afterQuiz.score_percentage) - parseFloat(beforeQuiz.score_percentage)).toFixed(2));
        }

        return res.status(200).json({
            success: true,
            data: {
                authenticated: true,
                beforeQuiz,
                afterQuiz,
                improvementPoints
            }
        });
    } catch (error) {
        console.error('Survey status error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /history (protected - returns user's chronological quiz attempt history & improvement)
router.get('/history', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;

        const query = `
            SELECT id, quiz_type, score, total_questions, percentage, attempt_number, created_at 
            FROM quiz_attempts 
            WHERE user_id = ? 
            ORDER BY created_at ASC, id ASC
        `;
        const [rows] = await pool.query(query, [userId]);

        const beforeAttempts = rows.filter(r => r.quiz_type === 'before');
        const afterAttempts = rows.filter(r => r.quiz_type === 'after');

        const maxAttempts = Math.max(beforeAttempts.length, afterAttempts.length);
        const pairs = [];

        for (let i = 0; i < maxAttempts; i++) {
            const b = beforeAttempts[i] || null;
            const a = afterAttempts[i] || null;
            let impPoints = null;
            if (b && a && b.percentage !== null && a.percentage !== null) {
                impPoints = parseFloat((parseFloat(a.percentage) - parseFloat(b.percentage)).toFixed(2));
            }

            pairs.push({
                attemptNumber: i + 1,
                before: b ? {
                    id: b.id,
                    score: b.score,
                    total: b.total_questions,
                    percentage: parseFloat(b.percentage),
                    attemptNumber: b.attempt_number,
                    createdAt: b.created_at
                } : null,
                after: a ? {
                    id: a.id,
                    score: a.score,
                    total: a.total_questions,
                    percentage: parseFloat(a.percentage),
                    attemptNumber: a.attempt_number,
                    createdAt: a.created_at
                } : null,
                improvementPoints: impPoints
            });
        }

        const latestBefore = beforeAttempts.length > 0 ? beforeAttempts[beforeAttempts.length - 1] : null;
        const latestAfter = afterAttempts.length > 0 ? afterAttempts[afterAttempts.length - 1] : null;
        let latestImprovement = null;
        if (latestBefore && latestAfter) {
            latestImprovement = parseFloat((parseFloat(latestAfter.percentage) - parseFloat(latestBefore.percentage)).toFixed(2));
        }

        return res.status(200).json({
            success: true,
            data: {
                attempts: pairs,
                summary: {
                    totalBeforeAttempts: beforeAttempts.length,
                    totalAfterAttempts: afterAttempts.length,
                    totalPairs: pairs.length,
                    latestBeforeScore: latestBefore ? parseFloat(latestBefore.percentage) : null,
                    latestAfterScore: latestAfter ? parseFloat(latestAfter.percentage) : null,
                    latestImprovementPoints: latestImprovement
                }
            }
        });
    } catch (error) {
        console.error('Quiz history error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /quiz (protected - submit financial literacy quiz, save historical attempt, and update latest result)
router.post('/quiz', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { 
            survey_type, 
            quiz_score, 
            quiz_total = 10, 
            maintains_budget, 
            saves_regularly, 
            has_emergency_fund, 
            has_financial_goal, 
            understands_investing, 
            biggest_difficulty = ''
        } = req.body;

        // Validation
        if (!['before', 'after'].includes(survey_type)) {
            return res.status(400).json({ success: false, error: 'survey_type must be "before" or "after"' });
        }

        const score = parseInt(quiz_score, 10);
        const total = parseInt(quiz_total, 10) || 10;
        if (isNaN(score) || score < 0 || score > total) {
            return res.status(400).json({ success: false, error: `quiz_score must be an integer between 0 and ${total}` });
        }

        const percentage = parseFloat(((score / total) * 100).toFixed(2));
        const awarenessRating = Math.max(1, Math.min(10, Math.round(percentage / 10)));

        // 1. Calculate next attempt number for this user & quiz_type
        const [attemptRows] = await pool.query(
            'SELECT COALESCE(MAX(attempt_number), 0) + 1 AS next_attempt FROM quiz_attempts WHERE user_id = ? AND quiz_type = ?',
            [userId, survey_type]
        );
        const nextAttemptNumber = attemptRows[0]?.next_attempt || 1;

        // 2. Record historical attempt in quiz_attempts
        const [attemptInsert] = await pool.query(`
            INSERT INTO quiz_attempts (user_id, quiz_type, score, total_questions, percentage, attempt_number, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `, [userId, survey_type, score, total, percentage, nextAttemptNumber]);

        // 3. Update or maintain latest canonical result in community_surveys
        const [existing] = await pool.query(
            'SELECT id FROM community_surveys WHERE user_id = ? AND survey_type = ? AND quiz_score IS NOT NULL ORDER BY id DESC',
            [userId, survey_type]
        );

        let resultId;
        if (existing.length > 0) {
            resultId = existing[0].id;
            const updateQuery = `
                UPDATE community_surveys 
                SET maintains_budget = ?, saves_regularly = ?, has_emergency_fund = ?, has_financial_goal = ?, 
                    understands_investing = ?, biggest_difficulty = ?, awareness_rating = ?, 
                    quiz_score = ?, quiz_total = ?, score_percentage = ?, created_at = NOW()
                WHERE id = ?
            `;
            await pool.query(updateQuery, [
                maintains_budget ? 1 : (score >= 6 ? 1 : 0),
                saves_regularly ? 1 : (score >= 5 ? 1 : 0),
                has_emergency_fund ? 1 : (score >= 7 ? 1 : 0),
                has_financial_goal ? 1 : 1,
                understands_investing ? 1 : (score >= 6 ? 1 : 0),
                biggest_difficulty,
                awarenessRating,
                score,
                total,
                percentage,
                resultId
            ]);
        } else {
            const insertQuery = `
                INSERT INTO community_surveys 
                (user_id, maintains_budget, saves_regularly, has_emergency_fund, has_financial_goal, understands_investing, biggest_difficulty, awareness_rating, survey_type, quiz_score, quiz_total, score_percentage) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const [result] = await pool.query(insertQuery, [
                userId,
                maintains_budget ? 1 : (score >= 6 ? 1 : 0),
                saves_regularly ? 1 : (score >= 5 ? 1 : 0),
                has_emergency_fund ? 1 : (score >= 7 ? 1 : 0),
                has_financial_goal ? 1 : 1,
                understands_investing ? 1 : (score >= 6 ? 1 : 0),
                biggest_difficulty,
                awarenessRating,
                survey_type,
                score,
                total,
                percentage
            ]);
        }

        // Phase 7: Send Quiz Result Email
        (async () => {
            try {
                const [prefs] = await pool.query(
                    'SELECT quiz_emails FROM user_email_preferences WHERE user_id = ?',
                    [userId]
                );
                if (prefs.length === 0 || prefs[0].quiz_emails !== 0) {
                    const [users] = await pool.query('SELECT id, full_name, email FROM users WHERE id = ?', [userId]);
                    if (users.length > 0) {
                        const user = users[0];
                        let improvementPoints = null;

                        if (survey_type === 'after') {
                            const [befores] = await pool.query(
                                "SELECT score, total_questions, percentage FROM quiz_attempts WHERE user_id = ? AND quiz_type = 'before' ORDER BY id DESC LIMIT 1",
                                [userId]
                            );
                            if (befores.length > 0) {
                                improvementPoints = parseFloat((percentage - parseFloat(befores[0].percentage)).toFixed(2));
                            }
                        }

                        await emailService.sendQuizResultEmail({
                            user,
                            survey_type,
                            score,
                            total,
                            percentage,
                            improvementPoints
                        });
                    }
                }
            } catch (qErr) {
                console.error('[Quiz Email] Error sending quiz result email:', qErr.message);
            }
        })();

        return res.status(200).json({
            success: true,
            data: {
                id: resultId,
                attemptId: attemptInsert.insertId,
                attemptNumber: nextAttemptNumber,
                survey_type,
                quiz_score: score,
                quiz_total: total,
                score_percentage: percentage,
                awareness_rating: awarenessRating,
                message: `${survey_type === 'before' ? 'Before' : 'After'} Quiz (Attempt #${nextAttemptNumber}) submitted successfully!`
            }
        });

    } catch (error) {
        console.error('Quiz POST error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST / (protected - general survey submission)
router.post('/', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { 
            maintains_budget, 
            saves_regularly, 
            has_emergency_fund, 
            has_financial_goal, 
            understands_investing, 
            biggest_difficulty, 
            awareness_rating, 
            survey_type 
        } = req.body;

        // Validation
        if (awareness_rating !== undefined && (awareness_rating < 1 || awareness_rating > 10)) {
            return res.status(400).json({ success: false, error: 'Awareness rating must be between 1 and 10' });
        }
        if (!['before', 'after'].includes(survey_type)) {
            return res.status(400).json({ success: false, error: 'survey_type must be "before" or "after"' });
        }

        const query = `
            INSERT INTO community_surveys 
            (user_id, maintains_budget, saves_regularly, has_emergency_fund, has_financial_goal, understands_investing, biggest_difficulty, awareness_rating, survey_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await pool.query(query, [
            userId, 
            maintains_budget ? 1 : 0, 
            saves_regularly ? 1 : 0, 
            has_emergency_fund ? 1 : 0, 
            has_financial_goal ? 1 : 0, 
            understands_investing ? 1 : 0, 
            biggest_difficulty, 
            awareness_rating, 
            survey_type
        ]);

        return res.status(201).json({ success: true, data: { message: 'Survey submitted successfully' } });

    } catch (error) {
        console.error('Survey POST error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /results (public)
router.get('/results', async (req, res) => {
    try {
        // Overall Aggregate
        const aggQuery = `
            SELECT 
                COUNT(*) as total_responses,
                (SUM(maintains_budget) / COUNT(*)) * 100 as budget_pct,
                (SUM(saves_regularly) / COUNT(*)) * 100 as saving_pct,
                (SUM(has_emergency_fund) / COUNT(*)) * 100 as emergency_pct,
                (SUM(has_financial_goal) / COUNT(*)) * 100 as goal_pct,
                (SUM(understands_investing) / COUNT(*)) * 100 as investing_pct,
                AVG(awareness_rating) as avg_awareness
            FROM community_surveys
        `;
        const [overall] = await pool.query(aggQuery);

        // Grouped by survey_type
        const groupedQuery = `
            SELECT 
                survey_type,
                COUNT(*) as total_responses,
                (SUM(maintains_budget) / COUNT(*)) * 100 as budget_pct,
                (SUM(saves_regularly) / COUNT(*)) * 100 as saving_pct,
                (SUM(has_emergency_fund) / COUNT(*)) * 100 as emergency_pct,
                (SUM(has_financial_goal) / COUNT(*)) * 100 as goal_pct,
                (SUM(understands_investing) / COUNT(*)) * 100 as investing_pct,
                AVG(awareness_rating) as avg_awareness,
                COUNT(CASE WHEN quiz_score IS NOT NULL THEN 1 END) as quiz_count,
                AVG(score_percentage) as avg_quiz_score
            FROM community_surveys
            GROUP BY survey_type
        `;
        const [grouped] = await pool.query(groupedQuery);

        // Quiz aggregate metrics
        const quizQuery = `
            SELECT
                COUNT(CASE WHEN quiz_score IS NOT NULL AND survey_type = 'before' THEN 1 END) as before_participants,
                AVG(CASE WHEN quiz_score IS NOT NULL AND survey_type = 'before' THEN score_percentage END) as avg_before_score,
                COUNT(CASE WHEN quiz_score IS NOT NULL AND survey_type = 'after' THEN 1 END) as after_participants,
                AVG(CASE WHEN quiz_score IS NOT NULL AND survey_type = 'after' THEN score_percentage END) as avg_after_score
            FROM community_surveys
        `;
        const [quizRows] = await pool.query(quizQuery);
        const quizStats = quizRows[0] || {};

        let avgImprovement = null;
        if (quizStats.avg_before_score !== null && quizStats.avg_after_score !== null) {
            avgImprovement = parseFloat((parseFloat(quizStats.avg_after_score) - parseFloat(quizStats.avg_before_score)).toFixed(2));
        }

        // Common difficulties
        const diffQuery = `
            SELECT biggest_difficulty, COUNT(*) as count 
            FROM community_surveys 
            WHERE biggest_difficulty IS NOT NULL AND biggest_difficulty != '' 
            GROUP BY biggest_difficulty 
            ORDER BY count DESC 
            LIMIT 10
        `;
        const [difficulties] = await pool.query(diffQuery);

        return res.status(200).json({
            success: true,
            data: {
                overall: overall[0] || {},
                byType: grouped,
                quizMetrics: {
                    beforeParticipants: quizStats.before_participants || 0,
                    avgBeforeScore: quizStats.avg_before_score ? parseFloat(quizStats.avg_before_score).toFixed(1) : null,
                    afterParticipants: quizStats.after_participants || 0,
                    avgAfterScore: quizStats.avg_after_score ? parseFloat(quizStats.avg_after_score).toFixed(1) : null,
                    avgImprovementPoints: avgImprovement
                },
                commonDifficulties: difficulties
            }
        });

    } catch (error) {
        console.error('Survey GET results error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
