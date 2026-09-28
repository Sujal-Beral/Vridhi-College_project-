// js/survey.js — Handles community survey submission and results display
document.addEventListener('DOMContentLoaded', () => {

    // Wire up the survey form
    // The HTML has id="community-survey-form" (will be fixed in index.html)
    const surveyForm = document.getElementById('community-survey-form');

    surveyForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const surveyType = document.getElementById('survey_type')?.value || 'before';
        const awarenessRating = Number(document.getElementById('q7')?.value || 5);

        // Collect yes/no answers as 1/0
        const maintains_budget = document.getElementById('q1')?.value === '1' ? 1 : 0;
        const saves_regularly = document.getElementById('q2')?.value === '1' ? 1 : 0;
        const has_emergency_fund = document.getElementById('q3')?.value === '1' ? 1 : 0;
        const has_financial_goal = document.getElementById('q4')?.value === '1' ? 1 : 0;
        const understands_investing = document.getElementById('q5')?.value === '1' ? 1 : 0;
        const biggest_difficulty = document.getElementById('q6')?.value || '';

        const payload = {
            survey_type: surveyType,
            maintains_budget,
            saves_regularly,
            has_emergency_fund,
            has_financial_goal,
            understands_investing,
            biggest_difficulty,
            awareness_rating: awarenessRating
        };

        try {
            const res = await fetch('/api/survey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (result.success) {
                alert(window.t ? window.t('submit_survey') + ' ✓' : 'Survey submitted! Thank you.');
                surveyForm.reset();
            } else {
                alert('Error: ' + (result.error || 'Failed to submit survey'));
            }
        } catch (err) {
            console.error('Survey submission error:', err);
            alert('Network error. Please try again.');
        }
    });

    // Load and render survey results
    window.loadSurveyResults = async function() {
        try {
            const res = await fetch('/api/survey/results', { credentials: 'same-origin' });
            const result = await res.json();
            if (result.success && result.data) {
                renderSurveyResults(result.data);
            }
        } catch (err) {
            console.error('Error loading survey results:', err);
        }
    };

    function renderSurveyResults(data) {
        const container = document.getElementById('com-results');
        if (!container) return;

        const overall = data.overall || {};
        const byType = data.byType || [];
        const difficulties = data.commonDifficulties || [];

        // Check for no data
        if (!overall.total_responses || overall.total_responses === 0) {
            container.innerHTML = `<div class="chart-container"><h3>Survey Results</h3><p style="color:gray;text-align:center;">Not enough data yet. Submit a survey to see results.</p></div>`;
            return;
        }

        // Build before/after table
        let beforeRow = byType.find(r => r.survey_type === 'before') || {};
        let afterRow = byType.find(r => r.survey_type === 'after') || {};

        const pct = v => v ? Math.round(parseFloat(v)) + '%' : 'N/A';

        let comparisonHTML = '';
        if (beforeRow.total_responses || afterRow.total_responses) {
            comparisonHTML = `
                <h4 style="margin-top:20px;">Before vs After Vridhi Comparison</h4>
                <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
                    <thead>
                        <tr style="background:var(--secondary);color:white;">
                            <th style="padding:8px;text-align:left;">Question</th>
                            <th style="padding:8px;">Before</th>
                            <th style="padding:8px;">After</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td style="padding:8px;">Maintains Budget</td><td style="text-align:center;">${pct(beforeRow.budget_pct)}</td><td style="text-align:center;color:var(--primary);">${pct(afterRow.budget_pct)}</td></tr>
                        <tr style="background:#f9f9f9;"><td style="padding:8px;">Saves Regularly</td><td style="text-align:center;">${pct(beforeRow.saving_pct)}</td><td style="text-align:center;color:var(--primary);">${pct(afterRow.saving_pct)}</td></tr>
                        <tr><td style="padding:8px;">Has Emergency Fund</td><td style="text-align:center;">${pct(beforeRow.emergency_pct)}</td><td style="text-align:center;color:var(--primary);">${pct(afterRow.emergency_pct)}</td></tr>
                        <tr style="background:#f9f9f9;"><td style="padding:8px;">Has Financial Goal</td><td style="text-align:center;">${pct(beforeRow.goal_pct)}</td><td style="text-align:center;color:var(--primary);">${pct(afterRow.goal_pct)}</td></tr>
                        <tr><td style="padding:8px;">Understands Investing</td><td style="text-align:center;">${pct(beforeRow.investing_pct)}</td><td style="text-align:center;color:var(--primary);">${pct(afterRow.investing_pct)}</td></tr>
                        <tr style="background:#f9f9f9;"><td style="padding:8px;">Avg. Awareness (1-10)</td><td style="text-align:center;">${beforeRow.avg_awareness ? parseFloat(beforeRow.avg_awareness).toFixed(1) : 'N/A'}</td><td style="text-align:center;color:var(--primary);">${afterRow.avg_awareness ? parseFloat(afterRow.avg_awareness).toFixed(1) : 'N/A'}</td></tr>
                    </tbody>
                </table>
                <p style="font-size:0.75rem;color:gray;margin-top:8px;">Based on ${overall.total_responses} real survey response(s) from Vridhi users.</p>
            `;
        }

        // Difficulties list
        let difficultiesHTML = '';
        if (difficulties.length > 0) {
            difficultiesHTML = `<h4 style="margin-top:20px;">Common Financial Difficulties</h4><ul style="margin-top:8px;">${difficulties.map(d => `<li>${d.biggest_difficulty} (${d.count} responses)</li>`).join('')}</ul>`;
        }

        container.innerHTML = `
            <div class="chart-container">
                <h3>Survey Results</h3>
                <p><strong>Total Responses:</strong> ${overall.total_responses}</p>
                <p><strong>Average Awareness Rating:</strong> ${overall.avg_awareness ? parseFloat(overall.avg_awareness).toFixed(1) : 'N/A'}/10</p>
                ${comparisonHTML}
                ${difficultiesHTML}
            </div>
        `;
    }

});
