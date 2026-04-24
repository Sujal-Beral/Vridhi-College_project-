// js/dashboard.js
// --- Dashboard Generator Function ---
function renderDashboard(userData) {
    const dashboardContent = document.getElementById('dashboard-content');
    if (!dashboardContent) return; // Exit if on learn.html

    const inc = userData.income;
    const needsPct = userData.budgetRule ? userData.budgetRule.needs : 65;
    const wantsPct = userData.budgetRule ? userData.budgetRule.wants : 20;
    const savingsPct = userData.budgetRule ? userData.budgetRule.savings : 15;

    const fixedExpenses = inc * (needsPct / 100);
    const guiltFreeFun = inc * (wantsPct / 100);
    const savingsInvestments = inc * (savingsPct / 100);

    let specialSuggestionsHTML = "";
    switch (userData.category) {
        case "Student": specialSuggestionsHTML = `<div class="suggestion-pill">📚 Micro-Investments</div> <div class="suggestion-pill">🎓 Education Goal Tracker</div>`; break;
        case "Employee": specialSuggestionsHTML = `<div class="suggestion-pill">🏢 Tax Saver (80C) Ideas</div> <div class="suggestion-pill">📈 Automated SIP Planner</div>`; break;
        case "Business": specialSuggestionsHTML = `<div class="suggestion-pill">💼 Business Reserve Fund</div> <div class="suggestion-pill">📊 Working Capital Tracker</div>`; break;
        case "Housewife": specialSuggestionsHTML = `<div class="suggestion-pill">🪙 Digital Gold & FDs</div> <div class="suggestion-pill">🛒 Household Expense Buffer</div>`; break;
        case "Farmer": specialSuggestionsHTML = `<div class="suggestion-pill">🌾 Seasonal Income Allocator</div> <div class="suggestion-pill">📜 Govt. Schemes Info</div>`; break;
    }

    dashboardContent.innerHTML = `
        <div class="dashboard-header">
            <h2>Hello, ${userData.name}!</h2>
            <div class="total-income">Total Input: ₹${inc.toLocaleString('en-IN')}</div>
        </div>
        <div class="allocation-grid">
            <div class="allocation-card" style="border-top-color: #ff4d4d;">
                <h4>Fixed Expenses (${needsPct}%)</h4>
                <div class="amount">₹${fixedExpenses.toLocaleString('en-IN')}</div>
                <div style="font-size: 0.8rem; color: gray; margin-top: 5px;">Needs (Rent, Bills, Groceries)</div>
            </div>
            <div class="allocation-card" style="border-top-color: var(--accent);">
                <h4>Guilt-Free Fun (${wantsPct}%)</h4>
                <div class="amount">₹${guiltFreeFun.toLocaleString('en-IN')}</div>
                <div style="font-size: 0.8rem; color: gray; margin-top: 5px;">Wants (Movies, Dining, Gadgets)</div>
            </div>
            <div class="allocation-card" style="border-top-color: var(--primary);">
                <h4>Savings & Investments (${savingsPct}%)</h4>
                <div class="amount">₹${savingsInvestments.toLocaleString('en-IN')}</div>
                <div style="font-size: 0.8rem; color: gray; margin-top: 5px;">Future (SIPs, Debt Payoff)</div>
            </div>
        </div>
        <div class="category-widget">
            <h3>Recommended for ${userData.category}s</h3>
            <div class="widget-suggestions">${specialSuggestionsHTML}</div>
        </div>
    `;
}
