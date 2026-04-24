// js/navigation.js
// --- SPA Navigation Helper ---
function switchSection(targetSectionId) {
    document.querySelectorAll('.app-section').forEach(section => {
        section.classList.remove('active');
    });
    const target = document.getElementById(targetSectionId);
    if (target) target.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
    // --- Terms and Conditions Slide-Up Logic ---
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

    // --- Sign Out / Update Flow ---
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            localStorage.removeItem('vridhiUser');
            if (window.location.pathname.includes('learn.html')) {
                window.location.href = 'index.html';
            } else {
                window.location.reload();
            }
        });
    });

    document.querySelectorAll('.update-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.location.pathname.includes('learn.html')) {
                window.location.href = 'index.html';
            } else {
                switchSection('userinfo-section');
            }
        });
    });
});
