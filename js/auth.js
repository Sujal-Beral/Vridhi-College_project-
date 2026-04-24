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
                <label for="exact_income">Total Monthly Income (₹)</label>
                <input type="number" id="exact_income" placeholder="E.g. 50000" min="0" required>
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

        const userData = {
            name: document.getElementById('full_name').value,
            category: hiddenCategoryInput.value,
            income: Number(document.getElementById('exact_income').value)
        };

        localStorage.setItem('vridhiUser', JSON.stringify(userData));
        renderDashboard(userData);
        switchSection('dashboard-section');
    });
});
