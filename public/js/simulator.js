// js/simulator.js
// What-If Financial Simulator (Phase 1)
// Pure client-side hypothetical simulation using logged-in user's real financial data

let simulatorBaseline = {
    income: 30000,
    expenses: 15000,
    savings: 40000,
    debt: 10000,
    goals: []
};

window.initSimulator = async function() {
    try {
        // Fetch user's real financial profile and goals
        const [profileRes, goalsRes] = await Promise.all([
            fetch('/api/profile'),
            fetch('/api/goals')
        ]);
        
        const profileData = await profileRes.json();
        const goalsData = await goalsRes.json();

        if (profileData.success && profileData.data) {
            const prof = profileData.data.profile || {};
            simulatorBaseline.income = parseFloat(prof.monthly_income) || 0;
            simulatorBaseline.expenses = parseFloat(prof.essential_expenses) || 0;
            simulatorBaseline.savings = parseFloat(prof.current_savings) || 0;
            simulatorBaseline.debt = parseFloat(prof.existing_debt) || 0;
        }

        if (goalsData.success && Array.isArray(goalsData.data)) {
            simulatorBaseline.goals = goalsData.data;
        }

        // Populate baseline displays and initial simulator inputs
        populateSimulatorInputs(simulatorBaseline);
        calculateAndRenderSimulation();
        setupSimulatorEventListeners();
    } catch (err) {
        console.error("Simulator init error:", err);
    }
};

function populateSimulatorInputs(data) {
    // Baseline displays
    const setElem = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = `₹${Math.round(val).toLocaleString('en-IN')}`;
    };

    setElem('sim-base-income', data.income);
    setElem('sim-base-expenses', data.expenses);
    setElem('sim-base-savings', data.savings);
    setElem('sim-base-debt', data.debt);

    // Editable Inputs
    const setInput = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = Math.round(val);
    };

    setInput('sim_income', data.income);
    setInput('sim_expenses', data.expenses);
    setInput('sim_savings', data.savings);
    setInput('sim_debt', data.debt);
}

function calculateAndRenderSimulation() {
    const simIncome = Math.max(0, parseFloat(document.getElementById('sim_income')?.value) || 0);
    const simExpenses = Math.max(0, parseFloat(document.getElementById('sim_expenses')?.value) || 0);
    const simSavings = Math.max(0, parseFloat(document.getElementById('sim_savings')?.value) || 0);
    const simDebt = Math.max(0, parseFloat(document.getElementById('sim_debt')?.value) || 0);

    const baseIncome = simulatorBaseline.income;
    const baseExpenses = simulatorBaseline.expenses;
    const baseSavings = simulatorBaseline.savings;
    const baseDebt = simulatorBaseline.debt;

    // Monthly Available
    const simAvailable = Math.max(0, simIncome - simExpenses);
    const baseAvailable = Math.max(0, baseIncome - baseExpenses);
    const monthlyDiff = simAvailable - baseAvailable;

    // Emergency Fund Targets
    const sim3Mo = simExpenses * 3;
    const sim6Mo = simExpenses * 6;
    const simCoverage = simExpenses > 0 ? (simSavings / simExpenses).toFixed(1) : 0;
    const baseCoverage = baseExpenses > 0 ? (baseSavings / baseExpenses).toFixed(1) : 0;

    // Render Monthly Financial Position
    const elSimIncome = document.getElementById('sim-res-income');
    const elSimExpenses = document.getElementById('sim-res-expenses');
    const elSimAvailable = document.getElementById('sim-res-available');
    const elMonthlyDiff = document.getElementById('sim-res-diff');

    if (elSimIncome) elSimIncome.textContent = `₹${simIncome.toLocaleString('en-IN')}`;
    if (elSimExpenses) elSimExpenses.textContent = `₹${simExpenses.toLocaleString('en-IN')}`;
    if (elSimAvailable) elSimAvailable.textContent = `₹${simAvailable.toLocaleString('en-IN')}`;
    
    if (elMonthlyDiff) {
        const sign = monthlyDiff >= 0 ? '+' : '-';
        elMonthlyDiff.textContent = `${sign}₹${Math.abs(monthlyDiff).toLocaleString('en-IN')} / mo`;
        elMonthlyDiff.className = monthlyDiff >= 0 ? 'sim-diff-positive' : 'sim-diff-negative';
    }

    // Render Emergency Fund Impact
    const el3Mo = document.getElementById('sim-ef-3mo');
    const el6Mo = document.getElementById('sim-ef-6mo');
    const elCoverage = document.getElementById('sim-ef-coverage');
    const elCoverageBadge = document.getElementById('sim-ef-badge');

    if (el3Mo) el3Mo.textContent = `₹${sim3Mo.toLocaleString('en-IN')}`;
    if (el6Mo) el6Mo.textContent = `₹${sim6Mo.toLocaleString('en-IN')}`;
    if (elCoverage) elCoverage.textContent = `${simCoverage} Months`;

    if (elCoverageBadge) {
        if (parseFloat(simCoverage) >= 6) {
            elCoverageBadge.textContent = 'Sufficient (6+ mo)';
            elCoverageBadge.className = 'sim-badge badge-success';
        } else if (parseFloat(simCoverage) >= 3) {
            elCoverageBadge.textContent = 'Building (3-6 mo)';
            elCoverageBadge.className = 'sim-badge badge-warning';
        } else {
            elCoverageBadge.textContent = 'Needs Attention (<3 mo)';
            elCoverageBadge.className = 'sim-badge badge-danger';
        }
    }

    // Render Comparison Table
    const setComp = (baseId, simId, baseVal, simVal) => {
        const b = document.getElementById(baseId);
        const s = document.getElementById(simId);
        if (b) b.textContent = `₹${Math.round(baseVal).toLocaleString('en-IN')}`;
        if (s) {
            s.textContent = `₹${Math.round(simVal).toLocaleString('en-IN')}`;
            if (simVal > baseVal) s.className = 'comp-higher';
            else if (simVal < baseVal) s.className = 'comp-lower';
            else s.className = 'comp-neutral';
        }
    };

    setComp('comp-base-income', 'comp-sim-income', baseIncome, simIncome);
    setComp('comp-base-expenses', 'comp-sim-expenses', baseExpenses, simExpenses);
    setComp('comp-base-available', 'comp-sim-available', baseAvailable, simAvailable);
    setComp('comp-base-savings', 'comp-sim-savings', baseSavings, simSavings);
    setComp('comp-base-debt', 'comp-sim-debt', baseDebt, simDebt);

    // Render Goal Impact
    renderSimulatedGoals(simAvailable, baseAvailable);
}

function renderSimulatedGoals(simAvailable, baseAvailable) {
    const container = document.getElementById('sim-goals-impact-container');
    if (!container) return;

    const goals = simulatorBaseline.goals || [];
    if (goals.length === 0) {
        container.innerHTML = `<p style="color: #888; font-size: 0.9rem; text-align: center; padding: 10px 0;" data-i18n="no_goals_to_simulate">No active goals found. Create goals in My Goals to see timeline simulation.</p>`;
        return;
    }

    // Proportional ratio of change in available monthly savings
    const multiplier = baseAvailable > 0 ? (simAvailable / baseAvailable) : (simAvailable > 0 ? 1.5 : 1);

    let html = '<div class="sim-goals-grid">';
    goals.forEach(g => {
        const target = parseFloat(g.target_amount) || 0;
        const saved = parseFloat(g.saved_amount) || 0;
        const remaining = Math.max(0, target - saved);
        const baseAlloc = parseFloat(g.monthly_allocation) || 0;

        if (remaining <= 0) {
            html += `
                <div class="sim-goal-item completed">
                    <div class="sim-goal-name">🎯 ${g.name}</div>
                    <div class="sim-goal-timeline"><strong>Status:</strong> Goal Completed! 🎉</div>
                </div>
            `;
            return;
        }

        const baseMonths = baseAlloc > 0 ? Math.ceil(remaining / baseAlloc) : 0;
        // Simulated monthly allocation adjusted by multiplier (clamped to remaining)
        const simAlloc = Math.max(100, Math.round(baseAlloc * multiplier));
        const simMonths = simAlloc > 0 ? Math.ceil(remaining / simAlloc) : 0;
        const diffMonths = baseMonths - simMonths;

        let diffText = '';
        if (diffMonths > 0) {
            diffText = `<span style="color: #2e7d32; font-weight: 600;">⚡ ${diffMonths} months faster!</span>`;
        } else if (diffMonths < 0) {
            diffText = `<span style="color: #c62828; font-weight: 600;">⚠️ +${Math.abs(diffMonths)} months longer</span>`;
        } else {
            diffText = `<span style="color: #555;">No change in timeline</span>`;
        }

        html += `
            <div class="sim-goal-item">
                <div class="sim-goal-header">
                    <h4>🎯 ${g.name}</h4>
                    <span class="sim-goal-target">Target: ₹${target.toLocaleString('en-IN')} (Saved: ₹${saved.toLocaleString('en-IN')})</span>
                </div>
                <div class="sim-goal-details">
                    <div><strong>Baseline Timeline:</strong> ${baseMonths > 0 ? baseMonths + ' months' : 'N/A'} (₹${baseAlloc.toLocaleString('en-IN')}/mo)</div>
                    <div><strong>Simulated Timeline:</strong> ${simMonths > 0 ? simMonths + ' months' : 'N/A'} (₹${simAlloc.toLocaleString('en-IN')}/mo)</div>
                    <div class="sim-goal-diff">${diffText}</div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

let listenersAttached = false;
function setupSimulatorEventListeners() {
    if (listenersAttached) return;
    listenersAttached = true;

    // Real-time input changes
    ['sim_income', 'sim_expenses', 'sim_savings', 'sim_debt'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', calculateAndRenderSimulation);
            el.addEventListener('change', calculateAndRenderSimulation);
        }
    });

    // Preset Buttons
    document.getElementById('preset-income')?.addEventListener('click', () => {
        const el = document.getElementById('sim_income');
        if (el) {
            el.value = Math.round(simulatorBaseline.income * 1.10);
            calculateAndRenderSimulation();
        }
    });

    document.getElementById('preset-expenses')?.addEventListener('click', () => {
        const el = document.getElementById('sim_expenses');
        if (el) {
            el.value = Math.round(simulatorBaseline.expenses * 0.90);
            calculateAndRenderSimulation();
        }
    });

    document.getElementById('preset-savings')?.addEventListener('click', () => {
        const el = document.getElementById('sim_savings');
        if (el) {
            el.value = Math.round(simulatorBaseline.savings + 5000);
            calculateAndRenderSimulation();
        }
    });

    document.getElementById('preset-debt')?.addEventListener('click', () => {
        const el = document.getElementById('sim_debt');
        if (el) {
            el.value = Math.round(simulatorBaseline.debt + 20000);
            calculateAndRenderSimulation();
        }
    });

    // Reset Simulation Button
    document.getElementById('btn-reset-simulator')?.addEventListener('click', () => {
        populateSimulatorInputs(simulatorBaseline);
        calculateAndRenderSimulation();
    });
}
