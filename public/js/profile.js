// js/profile.js
document.addEventListener("DOMContentLoaded", () => {
    const profileForm = document.getElementById("profile-form");
    const emergencyFundDisplay = document.getElementById("emergency-fund-display");
    const healthScoreDisplay = document.getElementById("health-score-display");
    const allocationSuggestion = document.getElementById("allocation-suggestion");

    // Load profile data from API
    window.loadProfile = async function() {
        try {
            const res = await fetch('/api/profile', {
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await res.json();
            if (result.success && result.data) {
                // Backend returns: { profile: {...}, emergencyFund: {...}, healthScore, strengths, improvements }
                const profileData = result.data.profile || {};
                populateProfileForm(profileData);
                
                // Update displays with profile data AND backend-calculated scores
                updateDisplays(profileData, result.data);

                // Load email preferences
                loadEmailPreferences();
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    async function loadEmailPreferences() {
        try {
            const res = await fetch('/api/profile/email-preferences');
            const data = await res.json();
            if (data.success && data.data) {
                const p = data.data;
                const setChecked = (id, val) => {
                    const el = document.getElementById(id);
                    if (el) el.checked = Boolean(val);
                };
                setChecked('pref_goal_notifications', p.goal_notifications !== 0);
                setChecked('pref_milestone_emails', p.milestone_emails !== 0);
                setChecked('pref_deadline_reminders', p.deadline_reminders !== 0);
                setChecked('pref_monthly_reports', p.monthly_reports !== 0);
                setChecked('pref_quiz_emails', p.quiz_emails !== 0);
                setChecked('pref_financial_alerts', p.financial_alerts !== 0);
            }
        } catch (err) {
            console.error('Error loading email preferences:', err);
        }
    }

    // Email preferences form submit handler
    const prefForm = document.getElementById('email-preferences-form');
    prefForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const prefMsg = document.getElementById('pref-msg');
        const saveBtn = document.getElementById('save-pref-btn');

        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Updating...';
        }

        const payload = {
            goal_notifications: document.getElementById('pref_goal_notifications')?.checked,
            milestone_emails: document.getElementById('pref_milestone_emails')?.checked,
            deadline_reminders: document.getElementById('pref_deadline_reminders')?.checked,
            monthly_reports: document.getElementById('pref_monthly_reports')?.checked,
            quiz_emails: document.getElementById('pref_quiz_emails')?.checked,
            financial_alerts: document.getElementById('pref_financial_alerts')?.checked
        };

        try {
            const res = await fetch('/api/profile/email-preferences', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (prefMsg) {
                prefMsg.style.color = data.success ? '#15803d' : '#b91c1c';
                prefMsg.textContent = data.message || (data.success ? 'Preferences updated!' : 'Failed to update preferences.');
            }
        } catch (err) {
            if (prefMsg) {
                prefMsg.style.color = '#b91c1c';
                prefMsg.textContent = 'Network error. Please try again.';
            }
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Update Preferences';
            }
        }
    });

    function populateProfileForm(profile) {
        if (!profileForm) return;
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el && val !== undefined && val !== null && parseFloat(val) >= 0) el.value = val;
        };
        setVal('prof_income', profile.monthly_income);
        setVal('prof_expenses', profile.essential_expenses);
        setVal('prof_savings', profile.current_savings);
        setVal('prof_debt', profile.existing_debt);
        // Risk preference
        const riskEl = document.getElementById('prof_risk');
        if (riskEl && profile.risk_preference) {
            riskEl.value = profile.risk_preference.toLowerCase();
        }
    }

    // Save profile data
    profileForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const monthly_income = Number(document.getElementById('prof_income')?.value) || 0;
        const essential_expenses = Number(document.getElementById('prof_expenses')?.value) || 0;
        const current_savings = Number(document.getElementById('prof_savings')?.value) || 0;
        const existing_debt = Number(document.getElementById('prof_debt')?.value) || 0;
        const risk_preference = document.getElementById('prof_risk')?.value || 'Medium';
        
        // Capitalize risk_preference to match ENUM: Low, Medium, High
        const riskMap = { 'low': 'Low', 'medium': 'Medium', 'high': 'High', 'Low': 'Low', 'Medium': 'Medium', 'High': 'High' };
        const risk = riskMap[risk_preference] || 'Medium';
        
        if (monthly_income < 0 || essential_expenses < 0 || current_savings < 0 || existing_debt < 0) {
            alert('Values cannot be negative.');
            return;
        }

        const btn = profileForm.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }
        
        try {
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ monthly_income, essential_expenses, current_savings, existing_debt, risk_preference: risk })
            });
            const result = await res.json();
            if (result.success) {
                alert('Profile saved successfully!');
                loadProfile(); // Reload to recalculate health score
            } else {
                alert('Error: ' + (result.error || 'Failed to save profile'));
            }
        } catch (err) {
            console.error('Profile save error:', err);
            alert('Network error. Please try again.');
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Save Profile'; }
        }
    });

    function formatINR(val) {
        return '₹' + Number(val || 0).toLocaleString('en-IN');
    }

    function calculateEmergencyFund(expenses, savings) {
        return {
            min: expenses * 3,
            max: expenses * 6,
            coverage: expenses > 0 ? (savings / expenses).toFixed(1) : 0
        };
    }

    function renderHealthScore(score, strengths, improvements) {
        if(!healthScoreDisplay) return;
        let color = "var(--primary)";
        if(score < 40) color = "red";
        else if (score < 70) color = "orange";

        healthScoreDisplay.innerHTML = `
            <div class="health-score-circle" style="background: conic-gradient(${color} ${score}%, #eee 0);">
                <span>${score}/100</span>
            </div>
            <div class="health-details">
                <h4>Strengths</h4>
                <ul>${(strengths && strengths.length) ? strengths.map(s => `<li>${s}</li>`).join('') : '<li>Profile in progress</li>'}</ul>
                <h4>Areas to Improve</h4>
                <ul>${(improvements && improvements.length) ? improvements.map(i => `<li>${i}</li>`).join('') : '<li>Keep updating your monthly data</li>'}</ul>
            </div>
        `;
    }

    function renderPersonalizedAllocation(profile) {
        if (!allocationSuggestion) return;
        const { monthly_income, essential_expenses, existing_debt, current_savings } = profile;
        let suggestion = "The default 20-20-30-30 allocation is recommended for you.";
        
        const emergency = calculateEmergencyFund(essential_expenses || 0, current_savings || 0);
        if (emergency.coverage < 3) {
            suggestion = "⚠️ Your emergency fund is low. Consider temporarily increasing your 'Emergency Shield' allocation to 30% and reducing 'Wealth Generation' to 20% until you build a 3-month safety net.";
        } else if (existing_debt > (monthly_income * 0.3)) {
            suggestion = "⚠️ Your debt payments are high (over 30% of income). Consider redirecting part of your 'Wealth Generation' allocation toward debt repayment.";
        } else if (emergency.coverage >= 6) {
            suggestion = "✅ Great job! Your emergency fund is strong. You can confidently follow the 20-20-30-30 framework and focus on your Wealth Generation goals.";
        }

        allocationSuggestion.innerHTML = `
            <div class="suggestion-card">
                <h4>Personalized Allocation Suggestion</h4>
                <p>${suggestion}</p>
                <small><i>Disclaimer: Vridhi is an educational planning tool, not a professional financial advisor.</i></small>
            </div>
        `;
    }

    function renderFinancialSnapshot(income, expenses, savings, debt, surplus, savingsRate) {
        const el = document.getElementById("financial-snapshot-display");
        if (!el) return;

        el.innerHTML = `
            <div class="snapshot-grid">
                <div class="snapshot-row">
                    <span class="snapshot-label">Monthly Income</span>
                    <span class="snapshot-val">${formatINR(income)}</span>
                </div>
                <div class="snapshot-row">
                    <span class="snapshot-label">Essential Expenses</span>
                    <span class="snapshot-val">${formatINR(expenses)}</span>
                </div>
                <div class="snapshot-row ${surplus > 0 ? 'highlight-surplus' : ''}">
                    <span class="snapshot-label">Monthly Surplus</span>
                    <span class="snapshot-val" style="color: ${surplus > 0 ? '#16a34a' : (surplus < 0 ? '#dc2626' : '#0A2342')}">${formatINR(surplus)}</span>
                </div>
                <div class="snapshot-row">
                    <span class="snapshot-label">Current Savings</span>
                    <span class="snapshot-val">${formatINR(savings)}</span>
                </div>
                <div class="snapshot-row">
                    <span class="snapshot-label">Existing Debt</span>
                    <span class="snapshot-val" style="color: ${debt > 0 ? '#dc2626' : '#0A2342'}">${formatINR(debt)}</span>
                </div>
                <div class="snapshot-row ${savingsRate >= 20 ? 'highlight-rate' : ''}">
                    <span class="snapshot-label">Savings Rate</span>
                    <span class="snapshot-val" style="color: ${savingsRate >= 20 ? '#16a34a' : (savingsRate >= 10 ? '#d97706' : '#dc2626')}">${savingsRate}%</span>
                </div>
            </div>
        `;
    }

    function renderEmergencyFundProgress(savings, efMin, efMax, coverage) {
        const el = document.getElementById("ef-progress-display");
        if (!el) return;

        const target3Mo = efMin || 0;
        const progressPct = target3Mo > 0 ? Math.min(100, Math.round((savings / target3Mo) * 100)) : (savings > 0 ? 100 : 0);
        const shortfall = Math.max(0, target3Mo - savings);

        let statusMsg = "";
        if (coverage >= 6) {
            statusMsg = `🛡️ <strong>Full 6-month safety reserve achieved!</strong> Your financial safety net is well secured (${coverage.toFixed(1)} months coverage).`;
        } else if (coverage >= 3) {
            statusMsg = `🎉 <strong>3-month target reached (${progressPct}%)!</strong> Continue building toward your 6-month resilience target of ${formatINR(efMax)}.`;
        } else if (shortfall > 0) {
            statusMsg = `⏳ <strong>${formatINR(shortfall)}</strong> more needed to reach your 3-month basic emergency reserve (${progressPct}% completed).`;
        } else {
            statusMsg = `Update your expenses to calculate emergency target.`;
        }

        el.innerHTML = `
            <div class="ef-progress-box">
                <div class="ef-progress-header">
                    <div class="ef-progress-amounts">
                        <span>${formatINR(savings)}</span> <span style="font-size: 0.85rem; font-weight: 500; color: #64748b;">/ ${formatINR(target3Mo)} (3 Mo)</span>
                    </div>
                    <div class="ef-progress-pct">${progressPct}%</div>
                </div>
                <div class="ef-progress-track">
                    <div class="ef-progress-fill" style="width: ${progressPct}%;"></div>
                </div>
                <div class="ef-status-msg">${statusMsg}</div>
            </div>
        `;
    }

    function renderFinancialPriorities(income, expenses, savings, debt, risk, coverage, efMin, surplus) {
        const el = document.getElementById("financial-priorities-display");
        if (!el) return;

        const priorities = [];

        // Priority 1: Emergency Fund
        if (coverage < 3) {
            priorities.push({
                title: "🛡️ Build Emergency Safety Net",
                desc: `Your current savings cover ${coverage.toFixed(1)} months of expenses. Target at least 3 months (${formatINR(efMin)}) in a liquid account before aggressive investing.`
            });
        } else if (coverage < 6) {
            priorities.push({
                title: "📈 Strengthen Emergency Shield",
                desc: `Great progress reaching 3 months of buffer! Work steadily toward the recommended 6-month safety net (${formatINR(expenses * 6)}).`
            });
        } else {
            priorities.push({
                title: "✅ Emergency Shield Fully Funded",
                desc: `Excellent discipline! With ${coverage.toFixed(1)} months of coverage, your emergency fund is secure. Maintain it in high-liquidity instruments.`
            });
        }

        // Priority 2: Debt Management
        const debtRatio = income > 0 ? (debt / income) : 0;
        if (debt > 0 && debtRatio >= 0.3) {
            priorities.push({
                title: "⚠️ Accelerate Debt Repayment",
                desc: `Your total debt (${formatINR(debt)}) represents ${Math.round(debtRatio * 100)}% of monthly income. Focus surplus cash on paying off high-interest debt first.`
            });
        } else if (debt > 0) {
            priorities.push({
                title: "💳 Maintain Timely Debt Payments",
                desc: `Keep up regular payments on your ${formatINR(debt)} debt to protect creditworthiness while continuing to save.`
            });
        } else {
            priorities.push({
                title: "🎉 Zero Debt Advantage",
                desc: `No active debt burdens your budget. Channel your available surplus directly into compounding wealth generators and goal savings.`
            });
        }

        // Priority 3: Wealth Generation & Allocation
        const riskPref = (risk || 'Medium').toLowerCase();
        if (surplus <= 0 && income > 0) {
            priorities.push({
                title: "🔍 Optimize Discretionary Expenses",
                desc: `Expenses currently match or exceed income. Review variable spending to generate at least 10–20% monthly investable surplus.`
            });
        } else if (riskPref === 'high') {
            priorities.push({
                title: "🚀 Long-Term Equity Compounding",
                desc: `Given your high risk tolerance, allocate your ${formatINR(surplus)} monthly surplus into diversified index funds and equity mutual fund SIPs.`
            });
        } else if (riskPref === 'low') {
            priorities.push({
                title: "🛡️ Capital-Preserving Growth",
                desc: `With a conservative profile, focus on sovereign-backed instruments like PPF, SGBs, and high-quality debt funds.`
            });
        } else {
            priorities.push({
                title: "⚖️ Balanced 20-20-30-30 Strategy",
                desc: `Follow the balanced framework: split surplus evenly across SIP equity investments, debt safety, and goal milestones.`
            });
        }

        el.innerHTML = `
            <div class="priorities-list">
                ${priorities.map(p => `
                    <div class="priority-item">
                        <div class="priority-title">${p.title}</div>
                        <p class="priority-desc">${p.desc}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderHealthBreakdown(backendResult, coverage, debt, income, savingsRate) {
        const el = document.getElementById("health-breakdown-display");
        if (!el) return;

        // Emergency Buffer component
        let efBadge = "danger";
        let efText = "Needs Attention (<3 Mo)";
        if (coverage >= 6) {
            efBadge = "good";
            efText = "Excellent (≥6 Mo)";
        } else if (coverage >= 3) {
            efBadge = "good";
            efText = "Adequate (3–6 Mo)";
        } else if (coverage >= 1) {
            efBadge = "warning";
            efText = "Building (1–3 Mo)";
        }

        // Debt component
        const debtRatio = income > 0 ? (debt / income) : 0;
        let debtBadge = "good";
        let debtText = "Optimal (0 Debt)";
        if (debt > 0) {
            if (debtRatio <= 0.3) {
                debtBadge = "good";
                debtText = "Manageable (≤30%)";
            } else if (debtRatio <= 0.6) {
                debtBadge = "warning";
                debtText = "Moderate (30-60%)";
            } else {
                debtBadge = "danger";
                debtText = "High (>60%)";
            }
        }

        // Savings Habit component
        let srBadge = "danger";
        let srText = "Low (<10%)";
        if (savingsRate >= 20) {
            srBadge = "good";
            srText = "Strong (≥20%)";
        } else if (savingsRate >= 10) {
            srBadge = "warning";
            srText = "Moderate (10–19%)";
        }

        // Profile Completion
        const isComplete = income > 0 && backendResult;
        const compBadge = isComplete ? "good" : "warning";
        const compText = isComplete ? "Active & Scored" : "Partial Details";

        el.innerHTML = `
            <div class="health-breakdown-grid">
                <div class="breakdown-item">
                    <span class="breakdown-label">Emergency Buffer</span>
                    <span class="breakdown-badge ${efBadge}">${efText}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">Debt Ratio</span>
                    <span class="breakdown-badge ${debtBadge}">${debtText}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">Savings Rate</span>
                    <span class="breakdown-badge ${srBadge}">${srText}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">Profile Status</span>
                    <span class="breakdown-badge ${compBadge}">${compText}</span>
                </div>
            </div>
        `;
    }

    function updateDisplays(profileData, backendResult) {
        const income = parseFloat(profileData.monthly_income) || 0;
        const expenses = parseFloat(profileData.essential_expenses) || 0;
        const savings = parseFloat(profileData.current_savings) || 0;
        const debt = parseFloat(profileData.existing_debt) || 0;
        const risk = profileData.risk_preference || 'Medium';
        
        // Calculated derived metrics
        const surplus = Math.max(0, income - expenses);
        const savingsRate = income > 0 ? Math.max(0, Math.round(((income - expenses) / income) * 100)) : 0;

        // 1. Emergency Fund (use backend data if available, else calculate locally)
        const ef = backendResult && backendResult.emergencyFund 
            ? backendResult.emergencyFund 
            : calculateEmergencyFund(expenses, savings);
        
        const coverage = expenses > 0 ? (savings / expenses) : 0;
        let status = "Needs Attention";
        let statusColor = "red";
        if (coverage >= 6) { status = "Sufficient"; statusColor = "green"; }
        else if (coverage >= 3) { status = "Partial"; statusColor = "orange"; }
        
        // Left Column Displays
        if (emergencyFundDisplay) {
            emergencyFundDisplay.innerHTML = `
                <div class="ef-card" style="border-left: 5px solid ${statusColor}">
                    <h4>Emergency Fund Calculator</h4>
                    <p>Essential Monthly Expenses: ₹${expenses.toLocaleString('en-IN')}</p>
                    <p>3 Months Reserve: ₹${(ef.min || 0).toLocaleString('en-IN')}</p>
                    <p>6 Months Reserve: ₹${(ef.max || 0).toLocaleString('en-IN')}</p>
                    <p>Current Savings: ₹${savings.toLocaleString('en-IN')}</p>
                    <p>Coverage: <strong>${coverage.toFixed(1)} months</strong></p>
                    <p>Status: <strong style="color: ${statusColor}">${status}</strong></p>
                    <small><i>This is an educational planning estimate, not professional financial advice.</i></small>
                </div>
            `;
        }

        // Health Score (use backend-calculated score)
        const score = backendResult ? (backendResult.healthScore || 0) : 50;
        const strengths = backendResult ? (backendResult.strengths || []) : [];
        const improvements = backendResult ? (backendResult.improvements || []) : [];
        renderHealthScore(score, strengths, improvements);

        // Personalized Allocation (if present)
        renderPersonalizedAllocation({ monthly_income: income, essential_expenses: expenses, existing_debt: debt, current_savings: savings });

        // Right Column Displays
        renderFinancialSnapshot(income, expenses, savings, debt, surplus, savingsRate);
        renderEmergencyFundProgress(savings, ef.min || (expenses * 3), ef.max || (expenses * 6), coverage);
        renderFinancialPriorities(income, expenses, savings, debt, risk, coverage, ef.min || (expenses * 3), surplus);
        renderHealthBreakdown(backendResult, coverage, debt, income, savingsRate);
    }

    // Auto-load profile when profile view becomes visible
    const profileViewObserver = new MutationObserver(() => {
        const profileView = document.getElementById('profile-view');
        if (profileView && profileView.classList.contains('active')) {
            loadProfile();
        }
    });
    const profileView = document.getElementById('profile-view');
    if (profileView) {
        profileViewObserver.observe(profileView, { attributes: true, attributeFilter: ['class'] });
    }
});
