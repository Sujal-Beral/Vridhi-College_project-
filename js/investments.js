// js/investments.js
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Navigation Logic for Investments View ---
    const navDashboard = document.getElementById("nav-dashboard");
    const navGoals = document.getElementById("nav-goals");
    const navInvestments = document.getElementById("nav-investments");
    const dashboardView = document.getElementById("dashboard-view");
    const goalsView = document.getElementById("goals-view");
    const investmentsView = document.getElementById("investments-view");

    if (navInvestments) {
        navInvestments.addEventListener("click", (e) => {
            if (window.location.pathname.includes('learn.html')) return;
            e.preventDefault();
            navInvestments.classList.add("active-link");
            if(navDashboard) navDashboard.classList.remove("active-link");
            if(navGoals) navGoals.classList.remove("active-link");

            if(dashboardView) dashboardView.classList.remove("active");
            if(goalsView) goalsView.classList.remove("active");
            if(investmentsView) investmentsView.classList.add("active");
        });

        // Ensure clicking dashboard from investments view works
        navDashboard?.addEventListener("click", () => {
            if(investmentsView) investmentsView.classList.remove("active");
            navInvestments.classList.remove("active-link");
        });

        // Ensure clicking goals from investments view works
        navGoals?.addEventListener("click", () => {
            if(investmentsView) investmentsView.classList.remove("active");
            navInvestments.classList.remove("active-link");
        });
    }

    // --- Dummy Data Mapping ---
    const dummyFunds = {
        "Large Cap": {
            desc: "Large Cap funds invest in top 100 established companies. They offer stable returns with lower risk compared to mid and small caps.",
            funds: [
                { name: "Bluechip Equity Fund", category: "Large Cap", returns: "14.50%" },
                { name: "Top 100 Leaders Fund", category: "Large Cap", returns: "13.20%" },
                { name: "Stable Growth Fund", category: "Large Cap", returns: "15.10%" }
            ]
        },
        "Mid Cap": {
            desc: "Mid Cap funds invest in 101st to 250th companies. They offer high growth potential with moderate risk.",
            funds: [
                { name: "Emerging Leaders Fund", category: "Mid Cap", returns: "22.40%" },
                { name: "Midcap Opportunities", category: "Mid Cap", returns: "24.15%" }
            ]
        },
        "Multi Cap": {
            desc: "Multi Cap funds invest across large, mid, and small-cap stocks, offering diversified growth.",
            funds: [
                { name: "Flexi Cap Fund", category: "Multi Cap", returns: "16.01%" },
                { name: "Diversified Equity Fund", category: "Multi Cap", returns: "18.30%" }
            ]
        },
        "Index Funds": {
            desc: "Index funds replicate market indices like Nifty 50. They have low fees and follow market trends.",
            funds: [
                { name: "Nifty 50 Index Fund", category: "Index", returns: "12.19%" },
                { name: "Nifty Next 50 Index Fund", category: "Index", returns: "22.81%" },
                { name: "Sensex Index Fund", category: "Index", returns: "-2.22%" }
            ]
        },
        "Industrial": {
            desc: "Industrial funds focus on companies in the manufacturing, construction, and infrastructure sectors.",
            funds: [
                { name: "Infrastructure Build Fund", category: "Sectoral", returns: "28.50%" },
                { name: "Manufacturing Growth Fund", category: "Sectoral", returns: "30.12%" }
            ]
        },
        "Debt Funds": {
            desc: "Debt funds invest in bonds and government securities, offering safe and steady returns with minimal volatility.",
            funds: [
                { name: "Liquid Savings Fund", category: "Debt", returns: "7.10%" },
                { name: "Corporate Bond Fund", category: "Debt", returns: "8.40%" },
                { name: "Gilt Fund", category: "Debt", returns: "6.80%" }
            ]
        }
    };

    // --- UI Interaction Logic ---
    const categoryCards = document.querySelectorAll('.inv-category-card');
    const fundListContainer = document.getElementById('fund-list-container');
    const fundListItems = document.getElementById('fund-list-items');
    const fundListTitle = document.getElementById('fund-list-title');
    const accordionTitle = document.getElementById('accordion-title');
    const accordionDesc = document.getElementById('accordion-desc');
    const accordionToggle = document.getElementById('info-accordion-toggle');
    const accordionContent = document.getElementById('info-accordion-content');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            const data = dummyFunds[category];

            if (data) {
                // Set titles and descriptions
                fundListTitle.innerText = `Top ${category} Funds`;
                accordionTitle.innerText = `What is a ${category} fund?`;
                accordionDesc.innerText = data.desc;

                // Reset accordion state
                accordionContent.classList.remove('expanded');
                accordionToggle.querySelector('.accordion-icon').style.transform = 'rotate(0deg)';

                // Generate HTML for funds
                let fundsHTML = '';
                data.funds.forEach(fund => {
                    const isNegative = fund.returns.includes('-');
                    const returnClass = isNegative ? 'returns-negative' : 'returns-positive';
                    
                    fundsHTML += `
                        <div class="fund-item">
                            <div class="fund-info">
                                <h5>${fund.name}</h5>
                                <span>${fund.category}</span>
                            </div>
                            <div class="fund-returns ${returnClass}">
                                ${isNegative ? '' : '+'}${fund.returns}
                            </div>
                        </div>
                    `;
                });

                fundListItems.innerHTML = fundsHTML;
                fundListContainer.style.display = 'block';
                
                // Smooth scroll to container
                fundListContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // Accordion Toggle
    accordionToggle?.addEventListener('click', () => {
        const icon = accordionToggle.querySelector('.accordion-icon');
        if (accordionContent.classList.contains('expanded')) {
            accordionContent.classList.remove('expanded');
            icon.style.transform = 'rotate(0deg)';
        } else {
            accordionContent.classList.add('expanded');
            icon.style.transform = 'rotate(180deg)';
        }
    });

});
