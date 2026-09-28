/**
 * public/js/financialReport.js
 * Vridhi (वृद्धि) — Phase 3: Monthly Financial Report & Downloadable Financial Plan
 * Generates dynamic, authenticated monthly report and downloadable PDF plan.
 */

(function () {
    let cachedReportData = null;

    // Helper: Format INR currency
    function formatINR(amount) {
        const num = parseFloat(amount) || 0;
        return '₹' + Math.round(num).toLocaleString('en-IN');
    }

    // Helper: Dynamic Month and Year
    function getCurrentReportMonthYear() {
        const date = new Date();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthIndex = date.getMonth();
        const monthName = monthNames[monthIndex];
        const year = date.getFullYear();

        return {
            monthName,
            monthIndex,
            year,
            formattedString: `${monthName} ${year}`
        };
    }

    // Load full report data from backend APIs
    window.loadFinancialReport = async function () {
        const reportContainer = document.getElementById('financial-report-content');
        if (reportContainer) {
            reportContainer.innerHTML = `
                <div style="text-align: center; padding: 50px 20px; color: #64748b;">
                    <div style="font-size: 2rem; margin-bottom: 12px;">📊</div>
                    <p style="font-size: 1rem; font-weight: 600;">Generating your personalized financial report...</p>
                </div>
            `;
        }

        try {
            const [dashRes, profRes, goalsRes, surveyRes] = await Promise.all([
                fetch('/api/dashboard'),
                fetch('/api/profile'),
                fetch('/api/goals'),
                fetch('/api/survey/status')
            ]);

            const dashData = await dashRes.json();
            const profData = await profRes.json();
            const goalsData = await goalsRes.json();
            const surveyData = await surveyRes.json();

            if (!dashData.success || !dashData.data) {
                throw new Error(dashData.error || 'Failed to load dashboard data');
            }

            const user = dashData.data.user || {};
            const profile = (profData.success && profData.data && profData.data.profile)
                ? profData.data.profile
                : (dashData.data.profile || {});

            const goalsList = (goalsData.success && Array.isArray(goalsData.data))
                ? goalsData.data
                : [];

            const surveyStatus = (surveyData.success && surveyData.data)
                ? surveyData.data
                : { beforeQuiz: null, afterQuiz: null, improvementPoints: null };

            const emergencyFund = (profData.success && profData.data && profData.data.emergencyFund)
                ? profData.data.emergencyFund
                : null;

            const healthScore = (profData.success && profData.data && profData.data.healthScore !== undefined)
                ? profData.data.healthScore
                : 50;

            const strengths = (profData.success && profData.data && profData.data.strengths)
                ? profData.data.strengths
                : [];

            const improvements = (profData.success && profData.data && profData.data.improvements)
                ? profData.data.improvements
                : [];

            const allocation = dashData.data.allocation || null;

            cachedReportData = {
                user,
                profile,
                goalsList,
                surveyStatus,
                emergencyFund,
                healthScore,
                strengths,
                improvements,
                allocation,
                goalsSummary: dashData.data.goals || { count: goalsList.length, totalTarget: 0, totalSaved: 0 }
            };

            renderFinancialReport(cachedReportData);

        } catch (err) {
            console.error("Error generating report:", err);
            if (reportContainer) {
                reportContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #ef4444;">
                        <p><strong>Unable to load financial report.</strong></p>
                        <p style="font-size: 0.88rem; color: #64748b;">Please verify your network connection or update your financial profile.</p>
                        <button class="report-back-btn" onclick="window.switchView('dashboard-view')" style="margin-top: 15px;">← Back to Dashboard</button>
                    </div>
                `;
            }
        }
    };

    // Render Report View
    function renderFinancialReport(data) {
        const reportContainer = document.getElementById('financial-report-content');
        if (!reportContainer) return;

        const { user, profile, goalsList, surveyStatus, emergencyFund, healthScore, strengths, improvements, allocation, goalsSummary } = data;

        const dateMeta = getCurrentReportMonthYear();
        const income = parseFloat(profile.monthly_income) || 0;
        const expenses = parseFloat(profile.essential_expenses) || 0;
        const savings = parseFloat(profile.current_savings) || 0;
        const debt = parseFloat(profile.existing_debt) || 0;
        const availableAmount = Math.max(0, income - expenses);

        // 20-20-30-30 Allocation
        const secureAmt = allocation ? parseFloat(allocation.secureSavings) : income * 0.20;
        const emergencyAmt = allocation ? parseFloat(allocation.emergencyShield) : income * 0.20;
        const homeAmt = allocation ? parseFloat(allocation.homeEssentials) : income * 0.30;
        const wealthAmt = allocation ? parseFloat(allocation.wealthGeneration) : income * 0.30;

        // Emergency Fund coverage
        const ef3mo = emergencyFund ? emergencyFund.min : (expenses * 3);
        const ef6mo = emergencyFund ? emergencyFund.max : (expenses * 6);
        const coverageMonths = expenses > 0 ? (savings / expenses).toFixed(1) : '0.0';

        let efBadgeClass = 'attention';
        let efBadgeText = 'Needs Attention (<3 mo)';
        if (parseFloat(coverageMonths) >= 6) {
            efBadgeClass = 'sufficient';
            efBadgeText = 'Healthy Buffer (6+ mo)';
        } else if (parseFloat(coverageMonths) >= 3) {
            efBadgeClass = 'partial';
            efBadgeText = 'Partial Buffer (3-6 mo)';
        }

        // Personalized Tips (Reusing Phase 1 generator)
        let tips = [];
        if (typeof window.generatePersonalizedTips === 'function') {
            tips = window.generatePersonalizedTips(user, profile, goalsSummary);
        } else {
            // Fallback rules
            if (expenses > 0 && (savings / expenses) < 3) {
                tips.push({
                    icon: '🛡️',
                    title: window.t('tip_emergency_low_title') || 'Build Your Emergency Fund',
                    desc: `Your current savings cover ${coverageMonths} months of essential expenses. Aim for a 3-month safety buffer (${formatINR(ef3mo)}) before high-risk investments.`
                });
            }
            if (debt > 0) {
                tips.push({
                    icon: '💳',
                    title: window.t('tip_debt_high_title') || 'Review & Accelerate Debt Payoff',
                    desc: `You have existing debt of ${formatINR(debt)}. Prioritize clearing high-interest obligations to reduce monthly drag.`
                });
            }
            if (goalsList.length === 0) {
                tips.push({
                    icon: '🎯',
                    title: window.t('tip_goals_none_title') || 'Set Your First Milestone',
                    desc: "You don't have an active goal yet. Use Vridhi's Goal Planner to set a clear milestone."
                });
            } else {
                tips.push({
                    icon: '🎯',
                    title: window.t('tip_goals_progress_title') || 'Goal Progress on Track',
                    desc: `You have ${goalsList.length} active goal(s) progressing steadily toward target.`
                });
            }
        }

        // Goals HTML
        let goalsHTML = '';
        if (goalsList.length === 0) {
            goalsHTML = `
                <div class="report-empty-state" data-i18n="no_goals_report">
                    ${window.t('no_goals_report')}
                </div>
            `;
        } else {
            goalsHTML = '<div class="report-goals-list">';
            goalsList.forEach(g => {
                const targetAmt = parseFloat(g.target_amount) || 0;
                const savedAmt = parseFloat(g.saved_amount) || 0;
                const pct = Math.min(100, Math.max(0, targetAmt > 0 ? ((savedAmt / targetAmt) * 100) : 0)).toFixed(1);
                const deadlineText = g.deadline ? new Date(g.deadline).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'No deadline set';

                goalsHTML += `
                    <div class="report-goal-row">
                        <div class="report-goal-header">
                            <span class="report-goal-name">🎯 ${g.name || 'Goal'}</span>
                            <span class="report-goal-amounts">Target: <strong>${formatINR(targetAmt)}</strong> | Saved: <strong>${formatINR(savedAmt)}</strong></span>
                        </div>
                        <div class="report-progress-track">
                            <div class="report-progress-fill" style="width: ${pct}%;"></div>
                        </div>
                        <div class="report-goal-footer">
                            <span>Progress: <strong>${pct}%</strong></span>
                            <span>Target Date: <strong>${deadlineText}</strong></span>
                        </div>
                    </div>
                `;
            });
            goalsHTML += '</div>';
        }

        // Quiz Progress HTML
        let quizHTML = '';
        const bQuiz = surveyStatus.beforeQuiz;
        const aQuiz = surveyStatus.afterQuiz;

        if (bQuiz && aQuiz) {
            const bScore = bQuiz.score_percentage !== null ? `${bQuiz.score_percentage}%` : `${bQuiz.quiz_score}/${bQuiz.quiz_total || 10}`;
            const aScore = aQuiz.score_percentage !== null ? `${aQuiz.score_percentage}%` : `${aQuiz.quiz_score}/${aQuiz.quiz_total || 10}`;
            const impPts = surveyStatus.improvementPoints !== null ? `+${surveyStatus.improvementPoints} percentage points` : 'Completed';

            quizHTML = `
                <div class="report-quiz-stats">
                    <div class="report-quiz-stat-item">
                        <span data-i18n="before_quiz_score_label">${window.t('before_quiz_score_label')}</span>
                        <strong>${bScore}</strong>
                    </div>
                    <div class="report-quiz-stat-item">
                        <span data-i18n="after_quiz_score_label">${window.t('after_quiz_score_label')}</span>
                        <strong>${aScore}</strong>
                    </div>
                    <div class="report-quiz-stat-item highlight">
                        <span data-i18n="improvement_label">${window.t('improvement_label')}</span>
                        <strong>${impPts}</strong>
                    </div>
                </div>
            `;
        } else if (bQuiz) {
            const bScore = bQuiz.score_percentage !== null ? `${bQuiz.score_percentage}%` : `${bQuiz.quiz_score}/${bQuiz.quiz_total || 10}`;
            quizHTML = `
                <div class="report-quiz-stats">
                    <div class="report-quiz-stat-item">
                        <span data-i18n="before_quiz_score_label">${window.t('before_quiz_score_label')}</span>
                        <strong>${bScore}</strong>
                    </div>
                    <div class="report-quiz-stat-item">
                        <span data-i18n="after_quiz_score_label">${window.t('after_quiz_score_label')}</span>
                        <strong style="color: #64748b; font-size: 0.95rem;">Pending (Available in Vridhi Learn)</strong>
                    </div>
                </div>
            `;
        } else {
            quizHTML = `
                <div style="text-align: center; color: #64748b; font-size: 0.9rem; padding: 8px 0;">
                    <span data-i18n="quiz_not_completed_label">${window.t('quiz_not_completed_label')}</span>
                    <div style="font-size: 0.8rem; margin-top: 4px; color: #94a3b8;">Take the Before & After quizzes in Vridhi Learn to measure knowledge growth.</div>
                </div>
            `;
        }

        // Tips HTML
        let tipsHTML = '<div class="report-tips-grid">';
        tips.slice(0, 3).forEach(tip => {
            tipsHTML += `
                <div class="report-tip-card">
                    <div class="report-tip-icon">${tip.icon}</div>
                    <div class="report-tip-content">
                        <h5>${tip.title}</h5>
                        <p>${tip.desc}</p>
                    </div>
                </div>
            `;
        });
        tipsHTML += '</div>';

        // Strengths & Improvements List
        const strengthsList = strengths.length > 0
            ? strengths.map(s => `<li>${s}</li>`).join('')
            : '<li>Regular profile maintained</li>';

        const improvementsList = improvements.length > 0
            ? improvements.map(i => `<li>${i}</li>`).join('')
            : '<li>Keep tracking expenses and goals</li>';

        reportContainer.innerHTML = `
            <div id="financial-report-sheet" class="report-sheet">
                
                <!-- 1. Report Header -->
                <div class="report-header-section">
                    <div>
                        <div class="report-brand-title">
                            VRIDHI <span class="report-brand-tagline">वृद्धि</span>
                        </div>
                        <h2 class="report-doc-title" data-i18n="monthly_financial_report">${window.t('monthly_financial_report')}</h2>
                        <div class="report-date-badge">${dateMeta.formattedString}</div>
                    </div>
                    <div class="report-meta-info">
                        <div>${window.t('prepared_for')}:</div>
                        <strong>${user.full_name || 'Valued Member'}</strong>
                        <div style="font-size: 0.82rem; margin-top: 2px;">${user.email || ''} | Category: ${user.category || 'General'}</div>
                    </div>
                </div>

                <!-- 2. Financial Overview -->
                <div class="report-section-block">
                    <h4 class="report-section-title">
                        <span>📊</span> <span data-i18n="financial_overview">${window.t('financial_overview')}</span>
                    </h4>
                    <div class="report-overview-grid">
                        <div class="report-stat-box">
                            <span class="report-stat-label" data-i18n="monthly_income_label">${window.t('monthly_income_label')}</span>
                            <div class="report-stat-value">${formatINR(income)}</div>
                        </div>
                        <div class="report-stat-box">
                            <span class="report-stat-label" data-i18n="essential_expenses">${window.t('essential_expenses')}</span>
                            <div class="report-stat-value">${formatINR(expenses)}</div>
                        </div>
                        <div class="report-stat-box">
                            <span class="report-stat-label" data-i18n="current_savings">${window.t('current_savings')}</span>
                            <div class="report-stat-value">${formatINR(savings)}</div>
                        </div>
                        <div class="report-stat-box">
                            <span class="report-stat-label" data-i18n="existing_debt">${window.t('existing_debt')}</span>
                            <div class="report-stat-value">${formatINR(debt)}</div>
                        </div>
                        <div class="report-stat-box highlight">
                            <span class="report-stat-label" data-i18n="available_amount">${window.t('available_amount')}</span>
                            <div class="report-stat-value">${formatINR(availableAmount)}</div>
                        </div>
                    </div>
                </div>

                <!-- 3. 20-20-30-30 Allocation Framework -->
                <div class="report-section-block">
                    <h4 class="report-section-title">
                        <span>⚖️</span> <span data-i18n="allocation_framework">${window.t('allocation_framework')}</span>
                    </h4>
                    <div class="report-allocation-grid">
                        <div class="report-alloc-card p-secure">
                            <div class="report-alloc-title" data-i18n="secure_savings">Secure Savings (20%)</div>
                            <div class="report-alloc-amount">${formatINR(secureAmt)}</div>
                            <div class="report-alloc-desc">Planned short-term savings</div>
                        </div>
                        <div class="report-alloc-card p-emergency">
                            <div class="report-alloc-title" data-i18n="emergency_shield">Emergency / Needs (20%)</div>
                            <div class="report-alloc-amount">${formatINR(emergencyAmt)}</div>
                            <div class="report-alloc-desc">Liquid emergency buffer</div>
                        </div>
                        <div class="report-alloc-card p-home">
                            <div class="report-alloc-title" data-i18n="home_essentials">Lifestyle / Spending (30%)</div>
                            <div class="report-alloc-amount">${formatINR(homeAmt)}</div>
                            <div class="report-alloc-desc">Rent, utilities & essentials</div>
                        </div>
                        <div class="report-alloc-card p-wealth">
                            <div class="report-alloc-title" data-i18n="wealth_generation">Growth / Investment (30%)</div>
                            <div class="report-alloc-amount">${formatINR(wealthAmt)}</div>
                            <div class="report-alloc-desc">SIPs, mutual funds & growth</div>
                        </div>
                    </div>
                </div>

                <!-- 4. Emergency Fund Analysis -->
                <div class="report-section-block">
                    <h4 class="report-section-title">
                        <span>🛡️</span> <span data-i18n="emergency_fund_title">${window.t('emergency_fund_title')}</span>
                    </h4>
                    <div class="report-ef-container">
                        <div class="report-ef-item">
                            <span data-i18n="current_savings">${window.t('current_savings')}</span>
                            <strong>${formatINR(savings)}</strong>
                        </div>
                        <div class="report-ef-item">
                            <span data-i18n="target_3mo_label">${window.t('target_3mo_label')}</span>
                            <strong>${formatINR(ef3mo)}</strong>
                        </div>
                        <div class="report-ef-item">
                            <span data-i18n="target_6mo_label">${window.t('target_6mo_label')}</span>
                            <strong>${formatINR(ef6mo)}</strong>
                        </div>
                        <div class="report-ef-item">
                            <span data-i18n="current_coverage_label">${window.t('current_coverage_label')}</span>
                            <strong>${coverageMonths} ${window.t('coverage_months_text')}</strong>
                        </div>
                        <div>
                            <span class="report-ef-badge ${efBadgeClass}">${efBadgeText}</span>
                        </div>
                    </div>
                </div>

                <!-- 5. Financial Health Score -->
                <div class="report-section-block">
                    <h4 class="report-section-title">
                        <span>🩺</span> <span data-i18n="financial_health_title">${window.t('financial_health_title')}</span>
                    </h4>
                    <div class="report-health-layout">
                        <div class="report-health-circle-box">
                            <div class="report-score-number">${healthScore}</div>
                            <div class="report-score-label">out of 100</div>
                        </div>
                        <div class="report-health-col">
                            <h5 data-i18n="strengths_label">✓ ${window.t('strengths_label')}</h5>
                            <ul>${strengthsList}</ul>
                        </div>
                        <div class="report-health-col">
                            <h5 data-i18n="improvements_label">⚡ ${window.t('improvements_label')}</h5>
                            <ul>${improvementsList}</ul>
                        </div>
                    </div>
                </div>

                <!-- 6. Goals Summary & Progress -->
                <div class="report-section-block">
                    <h4 class="report-section-title">
                        <span>🎯</span> <span data-i18n="goals_summary_title">${window.t('goals_summary_title')}</span>
                    </h4>
                    ${goalsHTML}
                </div>

                <!-- 7. Personalized Financial Tips -->
                <div class="report-section-block">
                    <h4 class="report-section-title">
                        <span>💡</span> <span data-i18n="personalized_insights_title">${window.t('personalized_insights_title')}</span>
                    </h4>
                    ${tipsHTML}
                </div>

                <!-- 8. Financial Learning Progress -->
                <div class="report-section-block">
                    <h4 class="report-section-title">
                        <span>🎓</span> <span data-i18n="financial_learning_title">${window.t('financial_learning_title')}</span>
                    </h4>
                    <div class="report-learning-box">
                        ${quizHTML}
                    </div>
                </div>

                <!-- 9. Report Summary Card -->
                <div class="report-section-block">
                    <h4 class="report-section-title">
                        <span>📋</span> <span data-i18n="report_summary_title">${window.t('report_summary_title')}</span>
                    </h4>
                    <div class="report-summary-box">
                        <div class="report-summary-item">
                            <span data-i18n="monthly_income_label">Income</span>
                            <strong>${formatINR(income)}/mo</strong>
                        </div>
                        <div class="report-summary-item">
                            <span data-i18n="current_savings">Savings</span>
                            <strong>${formatINR(savings)}</strong>
                        </div>
                        <div class="report-summary-item">
                            <span data-i18n="current_coverage_label">Emergency Coverage</span>
                            <strong>${coverageMonths} mo</strong>
                        </div>
                        <div class="report-summary-item">
                            <span data-i18n="financial_health_title">Financial Health</span>
                            <strong>${healthScore}/100</strong>
                        </div>
                        <div class="report-summary-item">
                            <span data-i18n="active_goals_count_label">Active Goals</span>
                            <strong>${goalsList.length}</strong>
                        </div>
                    </div>
                </div>

                <!-- 10. Disclaimer Footer -->
                <div class="report-footer-disclaimer" data-i18n="report_disclaimer">
                    ${window.t('report_disclaimer')}
                </div>

            </div>
        `;
    }

    // Open Report View
    window.openFinancialReport = function () {
        if (window.switchView) {
            window.switchView('report-view');
        }
    };

    // Print Support
    window.printFinancialReport = function () {
        window.print();
    };

    // Send Monthly Report via Email
    window.emailFinancialReport = async function () {
        const emailBtn = document.getElementById('btn-email-report');
        const origText = emailBtn ? emailBtn.innerHTML : '';
        if (emailBtn) {
            emailBtn.disabled = true;
            emailBtn.innerHTML = '⏳ Sending...';
        }

        try {
            const res = await fetch('/api/dashboard/email-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                if (typeof window.showGoalToast === 'function') {
                    window.showGoalToast(data.message || 'Report sent to your email successfully!', 'info');
                } else {
                    alert(data.message || 'Report sent to your email successfully!');
                }
            } else {
                if (typeof window.showGoalToast === 'function') {
                    window.showGoalToast(data.error || 'Failed to email report.', 'error');
                } else {
                    alert(data.error || 'Failed to email report.');
                }
            }
        } catch (err) {
            if (typeof window.showGoalToast === 'function') {
                window.showGoalToast('Network error while requesting email report.', 'error');
            } else {
                alert('Network error while requesting email report.');
            }
        } finally {
            if (emailBtn) {
                emailBtn.disabled = false;
                emailBtn.innerHTML = origText;
            }
        }
    };

    // Downloadable PDF Plan
    window.downloadFinancialPlanPDF = async function () {
        // Ensure report data is loaded
        const reportSheet = document.getElementById('financial-report-sheet');
        if (!reportSheet) {
            // If report view not open, load it first in memory/DOM
            if (window.openFinancialReport) {
                window.openFinancialReport();
                await window.loadFinancialReport();
            }
        }

        const targetEl = document.getElementById('financial-report-sheet');
        if (!targetEl) {
            alert('Please open the report before downloading.');
            return;
        }

        const dateMeta = getCurrentReportMonthYear();
        const filename = `Vridhi-Financial-Plan-${dateMeta.monthName}-${dateMeta.year}.pdf`;

        // Check if html2pdf library is available
        if (typeof html2pdf === 'function') {
            const opt = {
                margin: [8, 10, 8, 10], // mm
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    logging: false
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            // Temporary indicator
            const dlBtn = document.getElementById('btn-download-pdf');
            const originalText = dlBtn ? dlBtn.innerHTML : '';
            if (dlBtn) {
                dlBtn.innerHTML = '⏳ Generating PDF...';
                dlBtn.disabled = true;
            }

            try {
                await html2pdf().set(opt).from(targetEl).save();
            } catch (err) {
                console.error("html2pdf generation error:", err);
                // Fallback to print
                window.print();
            } finally {
                if (dlBtn) {
                    dlBtn.innerHTML = originalText;
                    dlBtn.disabled = false;
                }
            }
        } else {
            // Direct print dialog fallback
            window.print();
        }
    };

})();
