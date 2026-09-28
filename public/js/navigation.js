// js/navigation.js
// Handles SPA Section & View Switching, Session Checking, Account Dropdown, and Responsive Navigation

// Global SPA Section Switcher (login-section vs userinfo-section vs dashboard-section)
window.switchSection = function(targetSectionId) {
    document.querySelectorAll('.app-section').forEach(section => {
        section.classList.remove('active');
    });
    const target = document.getElementById(targetSectionId);
    if (target) {
        target.classList.add('active');
    }
};

// Global SPA View Switcher (inside dashboard-section: dashboard, investments, goals, profile, community)
window.switchView = function(viewId, navLink) {
    // Ensure dashboard-section is active
    const dashboardSection = document.getElementById('dashboard-section');
    if (dashboardSection && !dashboardSection.classList.contains('active')) {
        window.switchSection('dashboard-section');
    }

    // Deactivate all view sections
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    
    // Activate target view section
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
    }
    
    // Update active nav link styling
    if (navLink) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-link'));
        navLink.classList.add('active-link');
    } else {
        // Find corresponding link if not passed directly
        const linkMap = {
            'dashboard-view': 'nav-dashboard',
            'report-view': 'nav-dashboard',
            'simulator-view': 'nav-simulator',
            'investments-view': 'nav-investments',
            'goals-view': 'nav-goals',
            'profile-view': 'nav-profile',
            'community-view': 'nav-community'
        };
        const linkId = linkMap[viewId];
        if (linkId) {
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-link'));
            document.getElementById(linkId)?.classList.add('active-link');
        }
    }
    
    // Close mobile nav menu if open
    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer) {
        navLinksContainer.classList.remove('nav-open');
    }

    // Close account dropdown if open
    const accountMenu = document.getElementById("account-dropdown-menu");
    if (accountMenu) {
        accountMenu.classList.remove("show");
        document.getElementById("account-dropdown-toggle")?.setAttribute("aria-expanded", "false");
    }

    // Trigger specific data loads for the activated view
    if (viewId === 'report-view' && typeof window.loadFinancialReport === 'function') window.loadFinancialReport();
    if (viewId === 'simulator-view' && typeof window.initSimulator === 'function') window.initSimulator();
    if (viewId === 'goals-view' && typeof window.loadGoals === 'function') window.loadGoals();
    if (viewId === 'profile-view' && typeof window.loadProfile === 'function') window.loadProfile();
    if (viewId === 'community-view' && typeof window.loadImpactData === 'function') window.loadImpactData();
    
    // Scroll to top of content smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Handle URL Hash navigation (e.g., #simulator, #investments, #goals, #profile, #community, #report)
function handleHashRoute() {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#report' || hash === '#financial-report') {
        window.switchView('report-view');
    } else if (hash === '#simulator' || hash === '#what-if') {
        window.switchView('simulator-view', document.getElementById('nav-simulator'));
    } else if (hash === '#investments' || hash === '#smart-investments') {
        window.switchView('investments-view', document.getElementById('nav-investments'));
    } else if (hash === '#goals') {
        window.switchView('goals-view', document.getElementById('nav-goals'));
    } else if (hash === '#profile') {
        window.switchView('profile-view', document.getElementById('nav-profile'));
    } else if (hash === '#community') {
        window.switchView('community-view', document.getElementById('nav-community'));
    } else if (hash === '#dashboard' || hash === '') {
        const dashView = document.getElementById('dashboard-view');
        if (dashView && !dashView.classList.contains('active')) {
            window.switchView('dashboard-view', document.getElementById('nav-dashboard'));
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    
    // Check Session - verify if user is already logged in
    try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        // Backend returns { success: true, data: { id, full_name, ... } }
        if (data.success && data.data && data.data.id) {
            if (window.loadDashboard) {
                await window.loadDashboard();
            }
            // Check if user navigated with a hash anchor
            handleHashRoute();
        } else {
            // Not authenticated - show login page
            if (!window.location.pathname.includes('learn.html')) {
                window.switchSection('login-section');
            }
        }
    } catch(err) {
        console.error("Auth check failed", err);
        if (!window.location.pathname.includes('learn.html')) {
            window.switchSection('login-section');
        }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashRoute);

    // Terms & Conditions Modal
    document.getElementById("open-terms")?.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("terms-panel")?.classList.add("active");
        document.getElementById("overlay")?.classList.add("active");
    });

    document.getElementById("close-terms")?.addEventListener("click", () => {
        document.getElementById("terms-panel")?.classList.remove("active");
        document.getElementById("overlay")?.classList.remove("active");
    });

    document.getElementById("overlay")?.addEventListener("click", () => {
        document.getElementById("terms-panel")?.classList.remove("active");
        document.getElementById("overlay")?.classList.remove("active");
    });

    // Account Dropdown Toggle
    const accountToggleBtn = document.getElementById("account-dropdown-toggle");
    const accountMenu = document.getElementById("account-dropdown-menu");

    if (accountToggleBtn && accountMenu) {
        accountToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = accountMenu.classList.toggle("show");
            accountToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        // Close when clicking anywhere outside
        document.addEventListener("click", (e) => {
            if (!accountMenu.contains(e.target) && !accountToggleBtn.contains(e.target)) {
                accountMenu.classList.remove("show");
                accountToggleBtn.setAttribute("aria-expanded", "false");
            }
        });

        // Close dropdown when Update Income or Logout button inside is clicked
        document.getElementById("update-income-btn")?.addEventListener("click", () => {
            accountMenu.classList.remove("show");
            accountToggleBtn.setAttribute("aria-expanded", "false");
        });
        document.getElementById("logout-btn")?.addEventListener("click", () => {
            accountMenu.classList.remove("show");
            accountToggleBtn.setAttribute("aria-expanded", "false");
        });
    }

    // Mobile Hamburger Menu Toggle
    const navToggleBtn = document.getElementById("nav-toggle-btn");
    const navLinks = document.querySelector(".nav-links");
    if (navToggleBtn && navLinks) {
        navToggleBtn.addEventListener("click", () => {
            navLinks.classList.toggle("nav-open");
        });
    }

    // Logout Action
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
            } catch(e) {
                console.error("Logout error", e);
            }
            window.location.href = '/index.html';
        });
    });

    // Footer Links SPA Routing & Modal Triggers
    document.querySelectorAll('.footer-nav-link, .footer-support-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const route = link.getAttribute('data-route');
            if (route && typeof window.switchView === 'function' && document.getElementById(route)) {
                e.preventDefault();
                window.switchView(route);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    document.querySelectorAll('.footer-terms-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById("terms-panel")?.classList.add("active");
            document.getElementById("overlay")?.classList.add("active");
        });
    });

});
