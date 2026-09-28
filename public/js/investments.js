// js/investments.js
// Interactive Educational Investment Explorer for Vridhi's 30% Wealth Generation Pillar

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Educational Dataset for Wealth Generation Instruments ---
    const educationalFunds = {
        "Large Cap": {
            badge: "Equity • Lower Volatility",
            desc: "Large Cap funds invest in India's top 100 established companies (bluechips). They offer stable long-term capital appreciation with relatively lower risk compared to mid and small caps.",
            risk: "Moderate",
            horizon: "3–5+ Years",
            funds: [
                { name: "Top 100 Bluechip Equity Fund", category: "Large Cap", returns: "14.50%", risk: "Moderate" },
                { name: "Leaders Growth Fund", category: "Large Cap", returns: "13.20%", risk: "Moderate" },
                { name: "Stable Advantage Fund", category: "Large Cap", returns: "15.10%", risk: "Moderate" }
            ]
        },
        "Mid Cap": {
            badge: "Equity • High Growth",
            desc: "Mid Cap funds invest in 101st to 250th emerging market companies. They offer significantly higher wealth generation potential over the long term, accompanied by moderate-to-high volatility.",
            risk: "High",
            horizon: "5–7+ Years",
            funds: [
                { name: "Emerging Leaders Midcap Fund", category: "Mid Cap", returns: "22.40%", risk: "High" },
                { name: "Midcap Opportunities Growth Fund", category: "Mid Cap", returns: "24.15%", risk: "High" }
            ]
        },
        "Multi Cap": {
            badge: "Equity • Diversified",
            desc: "Multi Cap & Flexi Cap funds dynamically invest across large, mid, and small-cap companies, providing an all-in-one diversified equity portfolio managed by professional fund managers.",
            risk: "Moderate-High",
            horizon: "5+ Years",
            funds: [
                { name: "Flexi Cap Wealth Creator", category: "Multi Cap", returns: "16.01%", risk: "Moderate-High" },
                { name: "Diversified Equity Compounder", category: "Multi Cap", returns: "18.30%", risk: "Moderate-High" }
            ]
        },
        "Index Funds": {
            badge: "Passive Equity • Low Cost",
            desc: "Index funds passively replicate benchmark market indices (such as Nifty 50 or Sensex). Because there is no active fund manager bias, expense ratios are ultra-low and returns match broad economic growth.",
            risk: "Moderate",
            horizon: "5+ Years",
            funds: [
                { name: "Nifty 50 Index Fund", category: "Index", returns: "13.80%", risk: "Moderate" },
                { name: "Nifty Next 50 Growth Index", category: "Index", returns: "18.40%", risk: "Moderate-High" },
                { name: "Sensex Benchmark Fund", category: "Index", returns: "13.20%", risk: "Moderate" }
            ]
        },
        "PPF & Debt": {
            badge: "Fixed Income • Capital Protection",
            desc: "Public Provident Fund (PPF) and Debt Mutual Funds prioritize capital preservation and predictable returns. PPF is sovereign-backed, tax-free (EEE under 80C), and ideal for risk-averse wealth preservation.",
            risk: "Low",
            horizon: "1–15 Years",
            funds: [
                { name: "Public Provident Fund (Govt. PPF)", category: "Govt. Scheme", returns: "7.10% (Tax-Free)", risk: "Sovereign/Zero" },
                { name: "Short Duration Debt Fund", category: "Debt", returns: "7.40%", risk: "Low" },
                { name: "Corporate Bond Fund", category: "Debt", returns: "8.10%", risk: "Low-Moderate" }
            ]
        },
        "Gold & SGBs": {
            badge: "Commodity • Inflation Hedge",
            desc: "Sovereign Gold Bonds (SGB) and Digital Gold provide an effective hedge against inflation and currency depreciation. SGBs issued by RBI pay a 2.5% annual interest on top of gold price appreciation.",
            risk: "Low-Moderate",
            horizon: "5–8 Years",
            funds: [
                { name: "RBI Sovereign Gold Bond (SGB)", category: "Gold / Govt", returns: "Gold Price + 2.5% p.a.", risk: "Sovereign/Low" },
                { name: "Digital 24K Gold Accumulation", category: "Digital Gold", returns: "Gold Market Rate", risk: "Low-Moderate" }
            ]
        }
    };

    // --- UI Elements ---
    const categoryCards = document.querySelectorAll('.inv-category-card');
    const fundListContainer = document.getElementById('fund-list-container');
    const fundListItems = document.getElementById('fund-list-items');
    const fundListTitle = document.getElementById('fund-list-title');
    const accordionTitle = document.getElementById('accordion-title');
    const accordionDesc = document.getElementById('accordion-desc');
    const accordionToggle = document.getElementById('info-accordion-toggle');
    const accordionContent = document.getElementById('info-accordion-content');
    const searchInput = document.querySelector('.investment-search');
    const exploreAllBtn = document.querySelector('.explore-all-btn');
    const exploreGoldCard = document.querySelector('.explore-more-card');

    // Function to render category details & funds
    function showCategory(category) {
        const data = educationalFunds[category];
        if (!data || !fundListContainer) return;

        // Set titles and descriptions
        if (fundListTitle) fundListTitle.innerText = `Top Educational Options: ${category}`;
        if (accordionTitle) accordionTitle.innerText = `What is ${category} & how does it work?`;
        if (accordionDesc) accordionDesc.innerHTML = `
            <strong>Category Profile:</strong> ${data.badge}<br>
            <strong>Risk Level:</strong> ${data.risk} | <strong>Recommended Horizon:</strong> ${data.horizon}<br><br>
            ${data.desc}
        `;

        // Reset and expand accordion
        if (accordionContent) accordionContent.classList.add('expanded');
        if (accordionToggle) {
            const icon = accordionToggle.querySelector('.accordion-icon');
            if (icon) icon.style.transform = 'rotate(180deg)';
        }

        // Generate HTML for sample options
        let fundsHTML = '';
        data.funds.forEach(fund => {
            const isNegative = String(fund.returns).includes('-');
            const returnClass = isNegative ? 'returns-negative' : 'returns-positive';
            
            fundsHTML += `
                <div class="fund-item">
                    <div class="fund-info">
                        <h5>${fund.name}</h5>
                        <span>${fund.category}</span> • <small style="color: #666;">Risk: ${fund.risk || data.risk}</small>
                    </div>
                    <div class="fund-returns ${returnClass}">
                        ${isNegative || String(fund.returns).includes('%') === false ? '' : '+'}${fund.returns}
                    </div>
                </div>
            `;
        });

        if (fundListItems) fundListItems.innerHTML = fundsHTML;
        fundListContainer.style.display = 'block';

        // Update active state on cards
        categoryCards.forEach(c => {
            if (c.getAttribute('data-category') === category) {
                c.classList.add('selected');
            } else {
                c.classList.remove('selected');
            }
        });
        
        // Smooth scroll
        fundListContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Category Card Click Handlers
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            if (category) {
                showCategory(category);
            }
        });
    });

    // "Explore all funds / options" Button
    if (exploreAllBtn) {
        exploreAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Show all categories in one combined view
            let combinedHTML = '';
            Object.keys(educationalFunds).forEach(catKey => {
                const data = educationalFunds[catKey];
                combinedHTML += `<h4 style="margin: 16px 0 8px; color: var(--secondary); border-bottom: 1px dashed #eee; padding-bottom: 4px;">${catKey} (${data.badge})</h4>`;
                data.funds.forEach(fund => {
                    const isNegative = String(fund.returns).includes('-');
                    const returnClass = isNegative ? 'returns-negative' : 'returns-positive';
                    combinedHTML += `
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
            });

            if (fundListTitle) fundListTitle.innerText = 'All Educational Investment Options (30% Wealth Pillar)';
            if (accordionTitle) accordionTitle.innerText = 'How to Choose Between These Instruments?';
            if (accordionDesc) accordionDesc.innerHTML = 'Diversify according to your financial goals: Use Index/Large Cap funds for steady long-term compounding (>5 yrs), Mid Cap for higher growth risk, PPF for guaranteed tax-free preservation, and SGB/Gold for inflation hedging.';
            if (accordionContent) accordionContent.classList.add('expanded');
            if (fundListItems) fundListItems.innerHTML = combinedHTML;
            if (fundListContainer) {
                fundListContainer.style.display = 'block';
                fundListContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // Digital Gold Card Click Handler
    if (exploreGoldCard) {
        exploreGoldCard.addEventListener('click', () => {
            showCategory('Gold & SGBs');
        });
    }

    // Search bar filter logic
    if (searchInput) {
        searchInput.removeAttribute('readonly'); // Make search active
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                categoryCards.forEach(card => card.style.display = 'block');
                return;
            }
            categoryCards.forEach(card => {
                const cat = (card.getAttribute('data-category') || '').toLowerCase();
                const text = card.textContent.toLowerCase();
                if (cat.includes(query) || text.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Accordion Toggle Logic
    accordionToggle?.addEventListener('click', () => {
        const icon = accordionToggle.querySelector('.accordion-icon');
        if (accordionContent.classList.contains('expanded')) {
            accordionContent.classList.remove('expanded');
            if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
            accordionContent.classList.add('expanded');
            if (icon) icon.style.transform = 'rotate(180deg)';
        }
    });

});
