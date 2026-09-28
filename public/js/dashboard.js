// js/dashboard.js
// This file fetches real data from the backend and renders the Vridhi dashboard + Personalized Financial Tips (Phase 1)

window.loadDashboard = async function() {
    try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        if (data.success) {
            renderDashboard(data.data);
            // Render the allocation pie chart after dashboard is drawn
            if (window.renderAllocationChart) {
                window.renderAllocationChart(data.data);
            }
            // Switch to the dashboard section
            if (window.switchSection) {
                window.switchSection('dashboard-section');
            }
        }
    } catch (err) {
        console.error("Dashboard fetch error", err);
    }
};

function generatePersonalizedTips(user, profile, goalsSummary) {
window.generatePersonalizedTips = generatePersonalizedTips;
    const inc = parseFloat(profile.monthly_income) || 0;
    const exp = parseFloat(profile.essential_expenses) || 0;
    const sav = parseFloat(profile.current_savings) || 0;
    const debt = parseFloat(profile.existing_debt) || 0;
    const goalsCount = goalsSummary.count || 0;

    const emergencyCoverage = exp > 0 ? (sav / exp) : 0;
    const savingsRate = inc > 0 ? ((inc - exp) / inc) : 0;
    const debtRatio = inc > 0 ? (debt / inc) : 0;

    const tips = [];

    // 1. Emergency Fund Rule
    if (emergencyCoverage < 3) {
        const minTarget = Math.round(exp * 3);
        tips.push({
            icon: '🛡️',
            title: window.t('tip_emergency_low_title') || 'Build Your Emergency Fund',
            desc: `Your current savings cover ${emergencyCoverage.toFixed(1)} months of essential expenses. Consider building a 3-month buffer (₹${minTarget.toLocaleString('en-IN')}) before higher-risk commitments.`
        });
    } else if (emergencyCoverage >= 6) {
        tips.push({
            icon: '🛡️',
            title: window.t('tip_emergency_good_title') || 'Strong Emergency Reserve',
            desc: `Excellent! Your emergency savings comfortably cover ${emergencyCoverage.toFixed(1)} months of expenses. Your safety net is well established.`
        });
    }

    // 2. Debt Management Rule
    if (debtRatio > 0.3 || debt > 0) {
        tips.push({
            icon: '💳',
            title: window.t('tip_debt_high_title') || 'Review & Accelerate Debt Payoff',
            desc: `You have existing debt of ₹${Math.round(debt).toLocaleString('en-IN')}. Prioritize clearing high-interest obligations to reduce monthly interest drag.`
        });
    } else if (debt === 0) {
        tips.push({
            icon: '🌟',
            title: window.t('tip_debt_free_title') || 'Debt-Free Momentum',
            desc: 'You have zero existing debt! You can direct more of your 30% Wealth Generation allocation into compounding assets.'
        });
    }

    // 3. Savings / Expense Rate Rule
    if (savingsRate < 0.2 && inc > 0) {
        const expPct = Math.round((exp / inc) * 100);
        tips.push({
            icon: '💰',
            title: window.t('tip_savings_low_title') || 'Strengthen Monthly Savings Buffer',
            desc: `Essential expenses consume ${expPct}% of your monthly income. Aim to optimize non-essentials to retain at least 20% for Secure Savings.`
        });
    } else if (savingsRate >= 0.35 && inc > 0) {
        const savPct = Math.round(savingsRate * 100);
        tips.push({
            icon: '🌱',
            title: window.t('tip_savings_good_title') || 'Great Savings Discipline',
            desc: `Your savings rate is strong (${savPct}% retained)! Consider setting up automated SIP transfers to compound your surplus wealth systematically.`
        });
    }

    // 4. Goal Progress Rule
    if (goalsCount === 0) {
        tips.push({
            icon: '🎯',
            title: window.t('tip_goals_none_title') || 'Set Your First Milestone',
            desc: "You don't have an active goal yet. Use Vridhi's Goal Planner to set a clear milestone (like an Emergency Fund or Skill Upgrade)."
        });
    } else {
        tips.push({
            icon: '🎯',
            title: window.t('tip_goals_progress_title') || 'Goal Progress on Track',
            desc: `You have ${goalsCount} active goal(s) with ₹${Math.round(goalsSummary.totalSaved || 0).toLocaleString('en-IN')} saved toward ₹${Math.round(goalsSummary.totalTarget || 0).toLocaleString('en-IN')}. Keep it up!`
        });
    }

    // Limit to 2–4 most relevant tips
    return tips.slice(0, 3);
}

function renderDashboard(data) {
    const dashboardContent = document.getElementById('dashboard-content');
    if (!dashboardContent) return;

    // Extract data from backend response
    const user = data.user || {};
    const profile = data.profile || {};
    const allocation = data.allocation || null;
    const goalsSummary = data.goals || { count: 0, totalTarget: 0, totalSaved: 0 };

    // Income from financial profile
    const inc = parseFloat(profile.monthly_income) || 0;

    // Calculate allocation amounts (20-20-30-30 framework)
    const secureAmt = allocation ? parseFloat(allocation.secureSavings) : inc * 0.20;
    const emergencyAmt = allocation ? parseFloat(allocation.emergencyShield) : inc * 0.20;
    const homeAmt = allocation ? parseFloat(allocation.homeEssentials) : inc * 0.30;
    const wealthAmt = allocation ? parseFloat(allocation.wealthGeneration) : inc * 0.30;

    // Category-specific suggestions
    let suggestionsHTML = `<div class="suggestion-pill">Update your profile to get tailored suggestions</div>`;
    switch (user.category) {
        case 'Student':
            suggestionsHTML = `<div class="suggestion-pill">📚 Micro-Investments</div> <div class="suggestion-pill">🎓 Education Goal Tracker</div>`;
            break;
        case 'Employee':
            suggestionsHTML = `<div class="suggestion-pill">🏢 Tax Saver (80C) Ideas</div> <div class="suggestion-pill">📈 Automated SIP Planner</div>`;
            break;
        case 'Business':
            suggestionsHTML = `<div class="suggestion-pill">💼 Business Reserve Fund</div> <div class="suggestion-pill">📊 Working Capital Tracker</div>`;
            break;
        case 'Housewife':
            suggestionsHTML = `<div class="suggestion-pill">🪙 Digital Gold & FDs</div> <div class="suggestion-pill">🛒 Household Expense Buffer</div>`;
            break;
        case 'Farmer':
            suggestionsHTML = `<div class="suggestion-pill">🌾 Seasonal Income Allocator</div> <div class="suggestion-pill">📜 Govt. Schemes Info</div>`;
            break;
    }

    // Generate Personalized Financial Tips (Phase 1)
    const personalizedTips = generatePersonalizedTips(user, profile, goalsSummary);
    let tipsHTML = '';
    personalizedTips.forEach(tip => {
        tipsHTML += `
            <div class="tip-card">
                <div class="tip-icon">${tip.icon}</div>
                <div class="tip-content">
                    <h5>${tip.title}</h5>
                    <p>${tip.desc}</p>
                </div>
            </div>
        `;
    });

    dashboardContent.innerHTML = `
        <div class="dashboard-header">
            <h2>Hello, ${user.full_name || 'User'}!</h2>
            <div class="total-income">Monthly Income: ₹${inc.toLocaleString('en-IN')}</div>
            <p style="font-size: 0.85rem; color: gray; margin-top: 5px;">Vridhi's 20-20-30-30 Educational Allocation Framework</p>
        </div>
        
        <div class="dashboard-allocation-layout">
            <div class="allocation-grid">
                <div class="allocation-card" style="border-top-color: #4CAF50;">
                    <h4>Secure Savings (20%)</h4>
                    <div class="amount">₹${secureAmt.toLocaleString('en-IN')}</div>
                    <div style="font-size: 0.8rem; color: gray; margin-top: 5px;">Short-term goals & planned purchases</div>
                </div>
                <div class="allocation-card" style="border-top-color: #FF9800;">
                    <h4>Emergency Shield (20%)</h4>
                    <div class="amount">₹${emergencyAmt.toLocaleString('en-IN')}</div>
                    <div style="font-size: 0.8rem; color: gray; margin-top: 5px;">Liquid safety net for emergencies</div>
                </div>
                <div class="allocation-card" style="border-top-color: #2196F3;">
                    <h4>Home & Essentials (30%)</h4>
                    <div class="amount">₹${homeAmt.toLocaleString('en-IN')}</div>
                    <div style="font-size: 0.8rem; color: gray; margin-top: 5px;">Rent, bills, groceries, EMIs</div>
                </div>
                <div class="allocation-card" style="border-top-color: #9C27B0;">
                    <h4>Wealth Generation (30%)</h4>
                    <div class="amount">₹${wealthAmt.toLocaleString('en-IN')}</div>
                    <div style="font-size: 0.8rem; color: gray; margin-top: 5px;">Investments, SIPs, growth</div>
                </div>
            </div>

            <div class="chart-container allocation-chart-container">
                <h3>Allocation Breakdown</h3>
                <div class="chart-wrapper">
                    <canvas id="allocationPieChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Personalized Financial Tips Section (Phase 1) -->
        <div class="personalized-tips-container">
            <h3 class="tips-section-title" data-i18n="personalized_tips_title">💡 Personalized Financial Tips</h3>
            <div class="tips-grid">
                ${tipsHTML}
            </div>
        </div>

        <!-- 📊 My Financial Report Card (Phase 3) -->
        <div class="financial-report-card">
            <div class="report-card-left">
                <div class="report-card-icon">📊</div>
                <div class="report-card-text">
                    <h3 data-i18n="report_card_title">${window.t('report_card_title')}</h3>
                    <p data-i18n="report_card_desc">${window.t('report_card_desc')}</p>
                </div>
            </div>
            <div class="report-card-actions">
                <button type="button" class="report-btn-primary" onclick="window.openFinancialReport()">
                    <span data-i18n="view_report">${window.t('view_report')}</span>
                </button>
                <button type="button" class="report-btn-secondary" onclick="window.downloadFinancialPlanPDF()">
                    <span data-i18n="download_plan">${window.t('download_plan')}</span>
                </button>
            </div>
        </div>

        <div class="dashboard-layout" style="margin-top: 20px;">
            <div class="category-widget" style="flex: 1;">
                <h3>Goals Summary</h3>
                <p>Active Goals: <strong>${goalsSummary.count}</strong></p>
                <p>Total Target: <strong>₹${(goalsSummary.totalTarget || 0).toLocaleString('en-IN')}</strong></p>
                <p>Total Saved: <strong>₹${(goalsSummary.totalSaved || 0).toLocaleString('en-IN')}</strong></p>
            </div>
            
            <div class="category-widget" style="flex: 1;">
                <h3>Suggestions for ${user.category || 'you'}</h3>
                <div class="widget-suggestions">${suggestionsHTML}</div>
            </div>
        </div>
    `;
}
