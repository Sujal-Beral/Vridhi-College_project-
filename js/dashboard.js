// js/dashboard.js
// --- Dashboard Generator Function ---
function renderDashboard(userData) {
    const dashboardContent = document.getElementById('dashboard-content');
    if (!dashboardContent) return; // Exit if on learn.html

    const inc = userData.income;
    const secureSavings = inc * 0.20;
    const emergencyShield = inc * 0.20;
    const homeEssentials = inc * 0.30;
    const wealthGen = inc * 0.30;

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
            <div class="allocation-card">
                <h4>Secure Savings (20%)</h4>
                <div class="amount">₹${secureSavings.toLocaleString('en-IN')}</div>
            </div>
            <div class="allocation-card">
                <h4>Emergency Shield (20%)</h4>
                <div class="amount">₹${emergencyShield.toLocaleString('en-IN')}</div>
            </div>
            <div class="allocation-card">
                <h4>Home & Essentials (30%)</h4>
                <div class="amount">₹${homeEssentials.toLocaleString('en-IN')}</div>
            </div>
            <div class="allocation-card" style="border-top-color: var(--accent);">
                <h4>Wealth Generation (30%)</h4>
                <div class="amount">₹${wealthGen.toLocaleString('en-IN')}</div>
            </div>
        </div>
        <div class="category-widget">
            <h3>Recommended for ${userData.category}s</h3>
            <div class="widget-suggestions">${specialSuggestionsHTML}</div>
        </div>
    `;
}
