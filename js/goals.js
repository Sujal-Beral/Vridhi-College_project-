// js/goals.js
document.addEventListener("DOMContentLoaded", () => {
    let goals = [];
    const openAddGoalBtn = document.getElementById("open-add-goal-btn");
    const closeGoalModalBtn = document.getElementById("close-goal-modal");
    const goalModalOverlay = document.getElementById("goal-modal-overlay");
    const addGoalForm = document.getElementById("add-goal-form");
    const goalsGrid = document.getElementById("goals-grid");
    const smartSuggestion = document.getElementById("goal-smart-suggestion");
    const goalAllocationInput = document.getElementById("goal_allocation");
    const allocationTypeSelect = document.getElementById("allocation_type");

    function saveGoalsToStorage() {
        const userData = JSON.parse(localStorage.getItem('vridhiUser'));
        if (userData) {
            userData.goals = goals;
            localStorage.setItem('vridhiUser', JSON.stringify(userData));
        }
    }

    function loadGoalsFromStorage() {
        const userData = JSON.parse(localStorage.getItem('vridhiUser'));
        if (userData && userData.goals) {
            goals = userData.goals;
        }
    }

    // Navigation logic for Goals View
    const navDashboard = document.getElementById("nav-dashboard");
    const navGoals = document.getElementById("nav-goals");
    const dashboardView = document.getElementById("dashboard-view");
    const goalsView = document.getElementById("goals-view");

    if (navDashboard && navGoals) {
        navDashboard.addEventListener("click", (e) => {
            if (window.location.pathname.includes('learn.html')) return;
            e.preventDefault();
            navDashboard.classList.add("active-link");
            navGoals.classList.remove("active-link");
            dashboardView.classList.add("active");
            goalsView.classList.remove("active");
        });

        navGoals.addEventListener("click", (e) => {
            if (window.location.pathname.includes('learn.html')) {
                window.location.href = 'index.html?view=goals';
                return;
            }
            e.preventDefault();
            navGoals.classList.add("active-link");
            navDashboard.classList.remove("active-link");
            dashboardView.classList.remove("active");
            goalsView.classList.add("active");
            loadGoalsFromStorage();
            renderGoals();
        });

        if (window.location.search.includes("view=goals")) {
            setTimeout(() => navGoals.click(), 100);
        }
    }

    // Modal Events
    openAddGoalBtn?.addEventListener("click", () => {
        goalModalOverlay.classList.add("active");
        smartSuggestion.style.display = "none";
    });

    closeGoalModalBtn?.addEventListener("click", () => {
        goalModalOverlay.classList.remove("active");
        addGoalForm.reset();
    });

    // Smart Suggestion updates
    function updateSmartSuggestion() {
        if (!smartSuggestion) return;
        const userData = JSON.parse(localStorage.getItem('vridhiUser'));
        if (!userData) return;

        const income = userData.income;
        const target = Number(document.getElementById("goal_target").value) || 0;
        let allocation = Number(goalAllocationInput.value) || 0;
        const type = allocationTypeSelect.value;
        let monthlyAmount = type === "amount" ? allocation : (income * allocation / 100);

        if (monthlyAmount > 0 && target > 0) {
            smartSuggestion.style.display = "block";
            const months = Math.ceil(target / monthlyAmount);
            if (monthlyAmount > income * 0.5) {
                smartSuggestion.className = "smart-suggestion warning";
                smartSuggestion.innerHTML = `⚠️ <b>Warning:</b> This allocation is over 50% of your income (₹${income}). Consider lowering it.`;
            } else {
                smartSuggestion.className = "smart-suggestion";
                let advice = "";
                if (userData.category === "Student") advice = "Great habit! Keep savings high.";
                else if (userData.category === "Business") advice = "Ensure this doesn't affect your working capital.";
                else if (userData.category === "Housewife") advice = "Safe and steady planning.";
                else advice = "Balanced allocation.";
                smartSuggestion.innerHTML = `💡 You will reach your goal in <b>${months} months</b> (${(months / 12).toFixed(1)} years). <br><i>${advice}</i>`;
            }
        } else {
            smartSuggestion.style.display = "none";
        }
    }

    goalAllocationInput?.addEventListener("input", updateSmartSuggestion);
    allocationTypeSelect?.addEventListener("change", updateSmartSuggestion);
    document.getElementById("goal_target")?.addEventListener("input", updateSmartSuggestion);

    // Form Submission
    addGoalForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const userData = JSON.parse(localStorage.getItem('vridhiUser'));
        const income = userData ? userData.income : 0;
        const name = document.getElementById("goal_name").value;
        const target = Number(document.getElementById("goal_target").value);
        let allocation = Number(goalAllocationInput.value);
        const type = allocationTypeSelect.value;
        let monthlyAmount = type === "amount" ? allocation : (income * allocation / 100);

        if (monthlyAmount > income) {
            alert("Allocation cannot be greater than your monthly income!");
            return;
        }

        const newGoal = { id: Date.now(), name, target, monthlyAmount, saved: 0 };
        goals.push(newGoal);
        saveGoalsToStorage();
        renderGoals();
        goalModalOverlay.classList.remove("active");
        addGoalForm.reset();
    });

    window.renderGoals = function () {
        if (!goalsGrid) return;
        goalsGrid.innerHTML = "";
        if (goals.length === 0) {
            goalsGrid.innerHTML = `<p style="color: gray; grid-column: 1/-1; text-align: center;">No goals added yet. Start planning!</p>`;
            return;
        }

        goals.forEach(goal => {
            const progress = Math.min((goal.saved / goal.target) * 100, 100);
            const monthsLeft = Math.ceil((goal.target - goal.saved) / goal.monthlyAmount);
            const etaText = monthsLeft > 0 ? `${monthsLeft} months to go` : "Goal Achieved! 🎉";

            const card = document.createElement("div");
            card.className = "goal-card";
            card.innerHTML = `
                <div class="goal-header">
                    <h4>${goal.name}</h4>
                    <div class="goal-actions">
                        <button onclick="deleteGoal(${goal.id})" class="delete-btn" title="Delete Goal"><i style="font-style: normal;">🗑️</i></button>
                    </div>
                </div>
                <div class="goal-stats">
                    <span>Target: <span class="target">₹${goal.target.toLocaleString('en-IN')}</span></span>
                    <span>Saved: <span style="color: var(--primary);">₹${goal.saved.toLocaleString('en-IN')}</span></span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: 0%" data-target-width="${progress}%"></div>
                </div>
                <div class="goal-eta">${etaText}</div>
                <div style="font-size: 0.8rem; color: gray; margin-top: 10px;">Monthly: ₹${goal.monthlyAmount.toLocaleString('en-IN')}</div>
            `;
            goalsGrid.appendChild(card);

            setTimeout(() => {
                const bar = card.querySelector('.progress-bar');
                if (bar) bar.style.width = bar.getAttribute('data-target-width');
            }, 50);
        });
    };

    window.deleteGoal = function (id) {
        if (confirm("Are you sure you want to delete this goal?")) {
            goals = goals.filter(g => g.id !== id);
            saveGoalsToStorage();
            renderGoals();
        }
    };
});
