// js/auth.js

document.addEventListener("DOMContentLoaded", () => {

    // Register Handler
    const registerForm = document.getElementById("register-form");
    registerForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const full_name = document.getElementById('reg_name').value;
        const email = document.getElementById('reg_email').value;
        const password = document.getElementById('reg_password').value;
        const confirm_password = document.getElementById('reg_confirm_password').value;
        const msgDiv = document.getElementById('reg-error-msg');

        if(password !== confirm_password) {
            msgDiv.innerText = "Passwords do not match!";
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name, email, password })
            });
            const data = await res.json();
            if(data.success) {
                // Show userinfo section
                switchSection('userinfo-section');
            } else {
                msgDiv.innerText = data.error || "Registration failed";
            }
        } catch(err) {
            msgDiv.innerText = "An error occurred";
        }
    });

    // Login Handler
    const loginForm = document.getElementById("login-form");
    loginForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById('login_email').value;
        const password = document.getElementById('login_password').value;
        const msgDiv = document.getElementById('error-msg');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if(data.success) {
                if(window.loadDashboard) {
                    await window.loadDashboard();
                } else {
                    switchSection('dashboard-section');
                }
            } else {
                msgDiv.innerText = data.error || "Login failed";
            }
        } catch(err) {
            msgDiv.innerText = "An error occurred";
        }
    });

    // Forgot Password Handlers
    const forgotLink = document.getElementById("forgot-password-link");
    const forgotModal = document.getElementById("forgot-password-modal");
    const closeForgotBtn = document.getElementById("close-forgot-modal");
    const forgotForm = document.getElementById("forgot-password-form");
    const forgotMsg = document.getElementById("forgot-msg");
    const sendResetBtn = document.getElementById("send-reset-btn");

    forgotLink?.addEventListener("click", (e) => {
        e.preventDefault();
        if (forgotModal) {
            forgotModal.style.display = "flex";
            forgotMsg.innerText = "";
            forgotMsg.style.color = "";
        }
    });

    closeForgotBtn?.addEventListener("click", () => {
        if (forgotModal) forgotModal.style.display = "none";
    });

    forgotForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("forgot_email")?.value;
        if (!email) return;

        if (sendResetBtn) {
            sendResetBtn.disabled = true;
            sendResetBtn.innerText = "Sending...";
        }

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (forgotMsg) {
                forgotMsg.style.color = "#15803d";
                forgotMsg.innerText = data.message || "If that email is registered, a password reset link has been sent.";
            }
            forgotForm.reset();
        } catch (err) {
            if (forgotMsg) {
                forgotMsg.style.color = "#b91c1c";
                forgotMsg.innerText = "Error sending request. Please try again.";
            }
        } finally {
            if (sendResetBtn) {
                sendResetBtn.disabled = false;
                sendResetBtn.innerText = "Send Reset Link";
            }
        }
    });

    // Category Logic
    const categoryCards = document.querySelectorAll('.category-card');
    const dynamicContainer = document.getElementById('dynamic-input-container');
    const hiddenCategoryInput = document.getElementById('selected_category');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            hiddenCategoryInput.value = card.getAttribute('data-category');
            dynamicContainer.style.display = 'block';
        });
    });

    // Setup User Info Handler
    const userInfoForm = document.getElementById("userinfo-form");
    userInfoForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        if (!hiddenCategoryInput.value) {
            alert("Please select a category");
            return;
        }

        const secure = Number(document.getElementById('rule_secure').value);
        const emergency = Number(document.getElementById('rule_emergency').value);
        const home = Number(document.getElementById('rule_home').value);
        const wealth = Number(document.getElementById('rule_wealth').value);
        
        if (secure + emergency + home + wealth !== 100) {
            document.getElementById('rule-error').style.display = 'block';
            return;
        }

        const payload = {
            category: hiddenCategoryInput.value,
            monthly_income: Number(document.getElementById('exact_income').value)
        };

        try {
            // First update user category
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success && window.loadDashboard) {
                await window.loadDashboard();
            }
        } catch(err) {
            console.error(err);
        }
    });

    // Update income modal handler
    document.getElementById('update-income-btn')?.addEventListener('click', () => {
        document.getElementById('income-modal-overlay').classList.add('active');
    });

    document.getElementById('close-income-modal')?.addEventListener('click', () => {
        document.getElementById('income-modal-overlay').classList.remove('active');
    });

    document.getElementById('update-income-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const monthly_income = document.getElementById('new_income').value;
        try {
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ monthly_income })
            });
            if (res.ok && window.loadDashboard) {
                document.getElementById('income-modal-overlay').classList.remove('active');
                await window.loadDashboard();
            }
        } catch(err) {
            console.error(err);
        }
    });
});
