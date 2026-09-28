const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const requireAuth = require('../middleware/auth');

// POST / (protected)
router.post('/', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { ease_of_use, usefulness, most_useful_feature, suggestions, problems } = req.body;

        // Validation
        if (ease_of_use !== undefined && (ease_of_use < 1 || ease_of_use > 5)) {
            return res.status(400).json({ success: false, error: 'Ease of use rating must be between 1 and 5' });
        }
        if (usefulness !== undefined && (usefulness < 1 || usefulness > 5)) {
            return res.status(400).json({ success: false, error: 'Usefulness rating must be between 1 and 5' });
        }

        const query = `
            INSERT INTO feedback (user_id, ease_of_use, usefulness, most_useful_feature, suggestions, problems) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        await pool.query(query, [userId, ease_of_use, usefulness, most_useful_feature, suggestions, problems]);

        return res.status(201).json({ success: true, data: { message: 'Feedback submitted successfully' } });

    } catch (error) {
        console.error('Feedback POST error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /results (public)
router.get('/results', async (req, res) => {
    try {
        // Aggregate metrics
        const aggQuery = `
            SELECT 
                COUNT(*) as total_responses,
                AVG(ease_of_use) as avg_ease,
                AVG(usefulness) as avg_usefulness
            FROM feedback
        `;
        const [overall] = await pool.query(aggQuery);

        // Most common useful feature
        const featureQuery = `
            SELECT most_useful_feature, COUNT(*) as count 
            FROM feedback 
            WHERE most_useful_feature IS NOT NULL AND most_useful_feature != '' 
            GROUP BY most_useful_feature 
            ORDER BY count DESC
        `;
        const [features] = await pool.query(featureQuery);

        return res.status(200).json({
            success: true,
            data: {
                overall: overall[0] || {},
                topFeatures: features
            }
        });

    } catch (error) {
        console.error('Feedback GET results error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
