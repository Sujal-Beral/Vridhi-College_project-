document.addEventListener("DOMContentLoaded", () => {

    //  1. Terms and Conditions Slide-Up Logic 
    const openTermsBtn = document.getElementById("open-terms");
    const closeTermsBtn = document.getElementById("close-terms");
    const termsPanel = document.getElementById("terms-panel");
    const overlay = document.getElementById("overlay");

    openTermsBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        termsPanel.classList.add("active");
        overlay.classList.add("active");
    });

    closeTermsBtn?.addEventListener("click", () => {
        termsPanel.classList.remove("active");
        overlay.classList.remove("active");
    });

    overlay?.addEventListener("click", () => {
        termsPanel.classList.remove("active");
        overlay.classList.remove("active");
    });

    //  2. SPA Navigation Helper 
    function switchSection(targetSectionId) {
        document.querySelectorAll('.app-section').forEach(section => {
            section.classList.remove('active');
        });
        const target = document.getElementById(targetSectionId);
        if (target) target.classList.add('active');
    }

    // Restore Session if on index.html
    if (document.getElementById('dashboard-section') && localStorage.getItem('vridhiUser')) {
        renderDashboard(JSON.parse(localStorage.getItem('vridhiUser')));
        switchSection('dashboard-section');
    }

    //  3. Login to User Info 
    const loginForm = document.getElementById("login-form");
    loginForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        switchSection('userinfo-section');
    });

    //  4. User Info: Category Selection & Dynamic Inputs 
    const categoryCards = document.querySelectorAll('.category-card');
    const dynamicContainer = document.getElementById('dynamic-input-container');
    const hiddenCategoryInput = document.getElementById('selected_category');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const categoryValue = card.getAttribute('data-category');
            hiddenCategoryInput.value = categoryValue;

            // Display an Exact Income Input for accurate 20-20-30-30 math
            dynamicContainer.style.display = 'flex';
            dynamicContainer.innerHTML = `
                <label for="exact_income">Total Monthly Income (₹)</label>
                <input type="number" id="exact_income" placeholder="E.g. 50000" min="0" required>
            `;
        });
    });

    //  5. Submit User Info & Build Dashboard UI
    const userInfoForm = document.getElementById("userinfo-form");
    userInfoForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!hiddenCategoryInput.value) {
            alert("Please select a category before continuing!");
            return;
        }

        const userData = {
            name: document.getElementById('full_name').value,
            category: hiddenCategoryInput.value,
            income: Number(document.getElementById('exact_income').value)
        };

        localStorage.setItem('vridhiUser', JSON.stringify(userData));
        renderDashboard(userData);
        switchSection('dashboard-section');
    });

    // 6. Dashboard Generator Function 
    function renderDashboard(userData) {
        const dashboardContent = document.getElementById('dashboard-content');
        if (!dashboardContent) return; // Exit if on learn.html

        // Calculate 20-20-30-30 Logic
        const inc = userData.income;
        const secureSavings = inc * 0.20;
        const emergencyShield = inc * 0.20;
        const homeEssentials = inc * 0.30;
        const wealthGen = inc * 0.30;

        // Generate Dynamic Widget based on User Category
        let specialSuggestionsHTML = "";
        switch (userData.category) {
            case "Student":
                specialSuggestionsHTML = `<div class="suggestion-pill">📚 Micro-Investments</div> <div class="suggestion-pill">🎓 Education Goal Tracker</div>`;
                break;
            case "Employee":
                specialSuggestionsHTML = `<div class="suggestion-pill">🏢 Tax Saver (80C) Ideas</div> <div class="suggestion-pill">📈 Automated SIP Planner</div>`;
                break;
            case "Business":
                specialSuggestionsHTML = `<div class="suggestion-pill">💼 Business Reserve Fund</div> <div class="suggestion-pill">📊 Working Capital Tracker</div>`;
                break;
            case "Housewife":
                specialSuggestionsHTML = `<div class="suggestion-pill">🪙 Digital Gold & FDs</div> <div class="suggestion-pill">🛒 Household Expense Buffer</div>`;
                break;
            case "Farmer":
                specialSuggestionsHTML = `<div class="suggestion-pill">🌾 Seasonal Income Allocator</div> <div class="suggestion-pill">📜 Govt. Schemes Info</div>`;
                break;
        }

        // Injecting the Dashboard Layout
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
                <div class="widget-suggestions">
                    ${specialSuggestionsHTML}
                </div>
            </div>
        `;
    }

    // 7. Goals Management Logic
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

    // Goal View Navigation
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

        // Check for view=goals query param
        if (window.location.search.includes("view=goals")) {
            setTimeout(() => navGoals.click(), 100);
        }
    }

    // Modal Handlers
    openAddGoalBtn?.addEventListener("click", () => {
        goalModalOverlay.classList.add("active");
        smartSuggestion.style.display = "none";
    });

    closeGoalModalBtn?.addEventListener("click", () => {
        goalModalOverlay.classList.remove("active");
        addGoalForm.reset();
    });

    // Real-time suggestion logic
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

                // Adjust advice by category
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

    // Add Goal Submit
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

        const newGoal = {
            id: Date.now(),
            name,
            target,
            monthlyAmount,
            saved: 0 // Default starting saved amount
        };

        goals.push(newGoal);
        saveGoalsToStorage();
        renderGoals();

        goalModalOverlay.classList.remove("active");
        addGoalForm.reset();
    });

    // Render Goals
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

            // Trigger animation
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

    // 8. Sign Out / Update Flow 
    // Handling multiple buttons across pages by querying all with the class
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            localStorage.removeItem('vridhiUser');
            if (window.location.pathname.includes('learn.html')) {
                window.location.href = 'index.html'; // Redirect to home if on Learn page
            } else {
                window.location.reload(); // Refresh index.html to show login
            }
        });
    });

    document.querySelectorAll('.update-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.location.pathname.includes('learn.html')) {
                window.location.href = 'index.html'; // Needs to go to index to update
            } else {
                switchSection('userinfo-section'); // Go back to info section
            }
        });
    });

});