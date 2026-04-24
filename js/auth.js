// js/auth.js
document.addEventListener("DOMContentLoaded", () => {
    // Restore Session
    if (document.getElementById('dashboard-section') && localStorage.getItem('vridhiUser')) {
        renderDashboard(JSON.parse(localStorage.getItem('vridhiUser')));
        switchSection('dashboard-section');
    }

    // Login Form Submit
    const loginForm = document.getElementById("login-form");
    loginForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        switchSection('userinfo-section');
    });

    // Category Selection Logic
    const categoryCards = document.querySelectorAll('.category-card');
    const dynamicContainer = document.getElementById('dynamic-input-container');
    const hiddenCategoryInput = document.getElementById('selected_category');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            hiddenCategoryInput.value = card.getAttribute('data-category');

            dynamicContainer.style.display = 'flex';
            dynamicContainer.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <label for="exact_income">Total Monthly Income (₹)</label>
                    <input type="number" id="exact_income" placeholder="E.g. 50000" min="0" style="width: 100%;" required>
                </div>
                <label>Customize Budget Rule (Default: 65-20-15)</label>
                <div style="display: flex; gap: 10px; margin-top: 5px;">
                    <div style="flex: 1; display: flex; flex-direction: column;">
                        <label for="rule_needs" style="font-size: 0.8rem; font-weight: normal; margin-bottom: 3px;">Needs %</label>
                        <input type="number" id="rule_needs" value="65" min="0" max="100" style="padding: 8px;" required>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column;">
                        <label for="rule_wants" style="font-size: 0.8rem; font-weight: normal; margin-bottom: 3px;">Wants %</label>
                        <input type="number" id="rule_wants" value="20" min="0" max="100" style="padding: 8px;" required>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column;">
                        <label for="rule_savings" style="font-size: 0.8rem; font-weight: normal; margin-bottom: 3px;">Future %</label>
                        <input type="number" id="rule_savings" value="15" min="0" max="100" style="padding: 8px;" required>
                    </div>
                </div>
                <div id="rule-error" style="color: #ff4d4d; font-size: 0.85rem; margin-top: 8px; display: none; text-align: center;">Percentages must add up to 100%</div>
            `;
        });
    });

    // Submit User Info & Build Dashboard
    const userInfoForm = document.getElementById("userinfo-form");
    userInfoForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!hiddenCategoryInput.value) {
            alert("Please select a category before continuing!");
            return;
        }

        let needs = 65, wants = 20, savings = 15;
        const needsInput = document.getElementById('rule_needs');
        const wantsInput = document.getElementById('rule_wants');
        const savingsInput = document.getElementById('rule_savings');

        if (needsInput && wantsInput && savingsInput) {
            needs = Number(needsInput.value);
            wants = Number(wantsInput.value);
            savings = Number(savingsInput.value);

            if (needs + wants + savings !== 100) {
                document.getElementById('rule-error').style.display = 'block';
                return;
            } else {
                document.getElementById('rule-error').style.display = 'none';
            }
        }

        const userData = {
            name: document.getElementById('full_name').value,
            category: hiddenCategoryInput.value,
            income: Number(document.getElementById('exact_income').value),
            budgetRule: { needs, wants, savings }
        };

        localStorage.setItem('vridhiUser', JSON.stringify(userData));
        renderDashboard(userData);
        switchSection('dashboard-section');
    });
});
