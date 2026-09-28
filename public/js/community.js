// js/community.js — Handles feedback and impact dashboard
document.addEventListener('DOMContentLoaded', () => {

    // === FEEDBACK FORM ===
    const feedbackForm = document.getElementById('feedback-form');

    feedbackForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const ease_of_use = Number(document.getElementById('f_ease')?.value);
        const usefulness = Number(document.getElementById('f_useful')?.value);
        const most_useful_feature = document.getElementById('f_feature')?.value || '';
        const suggestions = document.getElementById('f_suggestions')?.value || '';
        const problems = document.getElementById('f_problems')?.value || '';

        // Validation
        if (!ease_of_use || ease_of_use < 1 || ease_of_use > 5) {
            alert('Please enter an ease of use rating between 1 and 5.');
            return;
        }
        if (!usefulness || usefulness < 1 || usefulness > 5) {
            alert('Please enter a usefulness rating between 1 and 5.');
            return;
        }

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ ease_of_use, usefulness, most_useful_feature, suggestions, problems })
            });
            const result = await res.json();
            if (result.success) {
                alert('Feedback submitted! Thank you.');
                feedbackForm.reset();
            } else {
                alert('Error: ' + (result.error || 'Failed to submit feedback'));
            }
        } catch (err) {
            console.error('Feedback error:', err);
            alert('Network error. Please try again.');
        }
    });

    // === IMPACT DASHBOARD ===
    window.loadImpactData = async function() {
        const container = document.getElementById('impact-dashboard');
        if (!container) return;

        container.innerHTML = '<p style="color:gray;text-align:center;">Loading...</p>';

        try {
            const res = await fetch('/api/community/impact', { credentials: 'same-origin' });
            const result = await res.json();
            if (result.success && result.data) {
                renderImpactDashboard(result.data);
            } else {
                container.innerHTML = '<p style="color:gray;text-align:center;">Could not load impact data.</p>';
            }
        } catch (err) {
            console.error('Impact load error:', err);
            container.innerHTML = '<p style="color:red;text-align:center;">Error loading data.</p>';
        }
    };

    function renderImpactDashboard(data) {
        const container = document.getElementById('impact-dashboard');
        if (!container) return;

        const m = data.metrics || {};
        const comparison = data.surveyComparison || [];
        const beforeData = comparison.find(r => r.survey_type === 'before') || {};
        const afterData = comparison.find(r => r.survey_type === 'after') || {};

        // Check if any real data exists
        const hasRealData = m.totalUsers > 0 || m.totalSurveys > 0;
        if (!hasRealData) {
            container.innerHTML = '<p style="color:gray;text-align:center;padding:20px;">Not enough data yet. Register users and complete surveys to see impact data.</p>';
            return;
        }

        let compHTML = '';
        if (comparison.length > 0) {
            compHTML = `
                <h4 style="margin-top:24px;">Before vs After Vridhi — Awareness</h4>
                <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:12px;">
                    <div style="flex:1;min-width:140px;background:#fff3e0;padding:14px;border-radius:8px;text-align:center;">
                        <div style="font-size:1.4rem;font-weight:bold;">${beforeData.avg_awareness ? parseFloat(beforeData.avg_awareness).toFixed(1) : '—'}/10</div>
                        <div style="font-size:0.85rem;color:gray;">Avg. Awareness Before</div>
                        <div style="font-size:0.8rem;color:gray;">(${beforeData.total_responses || 0} responses)</div>
                    </div>
                    <div style="flex:1;min-width:140px;background:#e8f5e9;padding:14px;border-radius:8px;text-align:center;">
                        <div style="font-size:1.4rem;font-weight:bold;color:var(--primary)">${afterData.avg_awareness ? parseFloat(afterData.avg_awareness).toFixed(1) : '—'}/10</div>
                        <div style="font-size:0.85rem;color:gray;">Avg. Awareness After</div>
                        <div style="font-size:0.8rem;color:gray;">(${afterData.total_responses || 0} responses)</div>
                    </div>
                </div>
            `;
        }

        let quizImpactHTML = '';
        if (m.quizParticipants > 0 || m.avgBeforeQuizScore !== null || m.avgAfterQuizScore !== null) {
            const beforeScoreStr = m.avgBeforeQuizScore ? `${m.avgBeforeQuizScore}%` : '—';
            const afterScoreStr = m.avgAfterQuizScore ? `${m.avgAfterQuizScore}%` : '—';
            let diffBadge = '';
            if (m.avgQuizImprovementPoints !== null) {
                const sign = m.avgQuizImprovementPoints >= 0 ? '+' : '';
                diffBadge = `<span style="color:#16a34a;font-weight:bold;">${sign}${m.avgQuizImprovementPoints} percentage points</span>`;
            } else {
                diffBadge = `<span style="color:gray;">Assessment in progress</span>`;
            }

            quizImpactHTML = `
                <h4 style="margin-top:28px;">📚 Community Financial Literacy Quiz Impact</h4>
                <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:12px;">
                    <div style="flex:1;min-width:140px;background:#f8fafc;border:1px solid #e2e8f0;padding:14px;border-radius:8px;text-align:center;">
                        <div style="font-size:1.4rem;font-weight:bold;color:var(--secondary);">${m.quizParticipants || 0}</div>
                        <div style="font-size:0.85rem;color:gray;">Quiz Participants</div>
                    </div>
                    <div style="flex:1;min-width:140px;background:#fff7ed;border:1px solid #ffedd5;padding:14px;border-radius:8px;text-align:center;">
                        <div style="font-size:1.4rem;font-weight:bold;color:#c2410c;">${beforeScoreStr}</div>
                        <div style="font-size:0.85rem;color:gray;">Avg. Before Score</div>
                    </div>
                    <div style="flex:1;min-width:140px;background:#f0fdf4;border:1px solid #bbf7d0;padding:14px;border-radius:8px;text-align:center;">
                        <div style="font-size:1.4rem;font-weight:bold;color:#15803d;">${afterScoreStr}</div>
                        <div style="font-size:0.85rem;color:gray;">Avg. After Score</div>
                    </div>
                    <div style="flex:1;min-width:160px;background:#ffffff;border:1px solid #e2e8f0;padding:14px;border-radius:8px;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,0.04);">
                        <div style="font-size:1.2rem;margin-bottom:2px;">${diffBadge}</div>
                        <div style="font-size:0.85rem;color:gray;">Avg. Score Improvement</div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:20px;">
                <div style="flex:1;min-width:130px;background:white;border:1px solid #eee;border-radius:12px;padding:16px;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
                    <div style="font-size:2rem;">👥</div>
                    <div style="font-size:2rem;font-weight:bold;color:var(--secondary)">${m.totalUsers || 0}</div>
                    <div style="color:gray;font-size:0.85rem;">Registered Users</div>
                </div>
                <div style="flex:1;min-width:130px;background:white;border:1px solid #eee;border-radius:12px;padding:16px;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
                    <div style="font-size:2rem;">🎯</div>
                    <div style="font-size:2rem;font-weight:bold;color:var(--secondary)">${m.totalGoals || 0}</div>
                    <div style="color:gray;font-size:0.85rem;">Goals Created</div>
                </div>
                <div style="flex:1;min-width:130px;background:white;border:1px solid #eee;border-radius:12px;padding:16px;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
                    <div style="font-size:2rem;">📋</div>
                    <div style="font-size:2rem;font-weight:bold;color:var(--secondary)">${m.totalSurveys || 0}</div>
                    <div style="color:gray;font-size:0.85rem;">Surveys Submitted</div>
                </div>
                <div style="flex:1;min-width:130px;background:white;border:1px solid #eee;border-radius:12px;padding:16px;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
                    <div style="font-size:2rem;">⭐</div>
                    <div style="font-size:2rem;font-weight:bold;color:var(--secondary)">${m.totalFeedback > 0 ? (parseFloat(m.avgEaseRating) + parseFloat(m.avgUsefulnessRating) / 2).toFixed(1) + '/5' : '—'}</div>
                    <div style="color:gray;font-size:0.85rem;">Avg. Feedback Rating</div>
                </div>
            </div>
            ${quizImpactHTML}
            ${compHTML}
            <p style="font-size:0.75rem;color:gray;margin-top:16px;">All data sourced from real Vridhi user activity. No artificial numbers.</p>
        `;
    }

});
