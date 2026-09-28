const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// GET /impact (public)
router.get('/impact', async (req, res) => {
    try {
        // Total registered users
        const [usersCountResult] = await pool.query('SELECT COUNT(*) as count FROM users');
        const totalUsers = usersCountResult[0].count;

        // Total goals created
        const [goalsCountResult] = await pool.query('SELECT COUNT(*) as count FROM goals');
        const totalGoals = goalsCountResult[0].count;

        // Total surveys
        const [surveysCountResult] = await pool.query('SELECT COUNT(*) as count FROM community_surveys');
        const totalSurveys = surveysCountResult[0].count;

        // Total feedback
        const [feedbackCountResult] = await pool.query('SELECT COUNT(*) as count FROM feedback');
        const totalFeedback = feedbackCountResult[0].count;

        // Average feedback rating
        const [avgFeedbackResult] = await pool.query('SELECT AVG(ease_of_use) as avg_ease, AVG(usefulness) as avg_usefulness FROM feedback');
        const avgFeedback = avgFeedbackResult[0] || { avg_ease: 0, avg_usefulness: 0 };

        // Users with income set
        const [incomeUsersResult] = await pool.query('SELECT COUNT(*) as count FROM financial_profiles WHERE monthly_income > 0');
        const usersWithIncome = incomeUsersResult[0].count;

        // Average goals per user
        const [avgGoalsResult] = await pool.query('SELECT AVG(goal_count) as avg_goals FROM (SELECT COUNT(*) as goal_count FROM goals GROUP BY user_id) as t');
        const avgGoalsPerUser = avgGoalsResult[0]?.avg_goals || 0;

        // Before/after survey comparison
        const groupedQuery = `
            SELECT 
                survey_type,
                COUNT(*) as total_responses,
                (SUM(maintains_budget) / COUNT(*)) * 100 as budget_pct,
                (SUM(saves_regularly) / COUNT(*)) * 100 as saving_pct,
                (SUM(has_emergency_fund) / COUNT(*)) * 100 as emergency_pct,
                (SUM(has_financial_goal) / COUNT(*)) * 100 as goal_pct,
                (SUM(understands_investing) / COUNT(*)) * 100 as investing_pct,
                AVG(awareness_rating) as avg_awareness
            FROM community_surveys
            GROUP BY survey_type
        `;
        const [surveyComparison] = await pool.query(groupedQuery);

        // Quiz aggregate metrics
        const quizQuery = `
            SELECT
                COUNT(DISTINCT user_id) as quiz_participants,
                COUNT(CASE WHEN quiz_score IS NOT NULL AND survey_type = 'before' THEN 1 END) as before_count,
                AVG(CASE WHEN quiz_score IS NOT NULL AND survey_type = 'before' THEN score_percentage END) as avg_before_score,
                COUNT(CASE WHEN quiz_score IS NOT NULL AND survey_type = 'after' THEN 1 END) as after_count,
                AVG(CASE WHEN quiz_score IS NOT NULL AND survey_type = 'after' THEN score_percentage END) as avg_after_score
            FROM community_surveys
            WHERE quiz_score IS NOT NULL
        `;
        const [quizRows] = await pool.query(quizQuery);
        const q = quizRows[0] || {};
        
        let avgImprovement = null;
        if (q.avg_before_score !== null && q.avg_after_score !== null) {
            avgImprovement = parseFloat((parseFloat(q.avg_after_score) - parseFloat(q.avg_before_score)).toFixed(1));
        }

        return res.status(200).json({
            success: true,
            data: {
                metrics: {
                    totalUsers,
                    totalGoals,
                    totalSurveys,
                    totalFeedback,
                    usersWithIncome,
                    avgGoalsPerUser: parseFloat(avgGoalsPerUser).toFixed(2),
                    avgEaseRating: parseFloat(avgFeedback.avg_ease || 0).toFixed(2),
                    avgUsefulnessRating: parseFloat(avgFeedback.avg_usefulness || 0).toFixed(2),
                    quizParticipants: q.quiz_participants || 0,
                    avgBeforeQuizScore: q.avg_before_score ? parseFloat(q.avg_before_score).toFixed(1) : null,
                    avgAfterQuizScore: q.avg_after_score ? parseFloat(q.avg_after_score).toFixed(1) : null,
                    avgQuizImprovementPoints: avgImprovement
                },
                surveyComparison
            }
        });

    } catch (error) {
        console.error('Community impact GET error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
