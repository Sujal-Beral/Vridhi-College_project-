// js/goals.js
// Smart Goal Planner (Phase 1) & Goals Management

document.addEventListener("DOMContentLoaded", () => {
    let goals = [];
    const openAddGoalBtn = document.getElementById("open-add-goal-btn");
    const closeGoalModalBtn = document.getElementById("close-goal-modal");
    const goalModalOverlay = document.getElementById("goal-modal-overlay");
    const addGoalForm = document.getElementById("add-goal-form");
    const goalsGrid = document.getElementById("goals-grid");
    
    // Modal Inputs
    const goalNameInput = document.getElementById("goal_name");
    const goalTargetInput = document.getElementById("goal_target");
    const goalSavedInput = document.getElementById("goal_saved");
    const goalDeadlineInput = document.getElementById("goal_deadline");
    const goalAllocationInput = document.getElementById("goal_allocation");
    const allocationTypeSelect = document.getElementById("allocation_type");
    const smartAnalysisBox = document.getElementById("smart-goal-analysis-box");

    // Non-blocking Toast Notification Helper
    function showGoalToast(message, type = 'success') {
        let container = document.getElementById("goals-toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "goals-toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = `goals-toast ${type === 'error' ? 'toast-error' : (type === 'info' ? 'toast-info' : '')}`;

        let icon = '✅';
        if (type === 'error') icon = '⚠️';
        else if (type === 'info') icon = 'ℹ️';

        toast.innerHTML = `
            <span class="goals-toast-icon">${icon}</span>
            <div class="goals-toast-text">${message}</div>
            <button type="button" class="goals-toast-close" aria-label="Close notification">&times;</button>
        `;

        const closeBtn = toast.querySelector(".goals-toast-close");
        const removeToast = () => {
            toast.classList.add("toast-fadeout");
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        };

        closeBtn?.addEventListener("click", removeToast);
        container.appendChild(toast);

        // Auto remove after 3.5 seconds
        setTimeout(removeToast, 3500);
    }

    // Fetch goals from API
    window.loadGoals = async function() {
        try {
            const res = await fetch('/api/goals', {
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await res.json();
            if (result.success) {
                goals = result.data || [];
                renderGoals();
            } else {
                console.error("Failed to load goals:", result.error);
            }
        } catch (error) {
            console.error("Error fetching goals:", error);
        }
    };

    // Helper to open goal modal with optional prefilled name
    function openGoalModal(prefillName = '') {
        if (!goalModalOverlay) return;
        if (addGoalForm) addGoalForm.reset();
        if (prefillName && goalNameInput) {
            goalNameInput.value = prefillName;
        }
        goalModalOverlay.classList.add("active");
        updateSmartGoalAnalysis();
        if (goalNameInput && !prefillName) {
            goalNameInput.focus();
        } else if (goalTargetInput && prefillName) {
            goalTargetInput.focus();
        }
    }

    // Modal Events
    openAddGoalBtn?.addEventListener("click", () => {
        openGoalModal();
    });

    const heroCreateGoalBtn = document.getElementById("hero-create-goal-btn");
    heroCreateGoalBtn?.addEventListener("click", () => {
        openGoalModal();
    });

    // Popular Goals button click listener (event delegation)
    document.addEventListener("click", (e) => {
        const popularBtn = e.target.closest(".popular-goal-btn");
        if (popularBtn) {
            const goalType = popularBtn.getAttribute("data-goal-type") || "";
            openGoalModal(goalType);
        }
    });

    closeGoalModalBtn?.addEventListener("click", () => {
        goalModalOverlay.classList.remove("active");
        addGoalForm.reset();
        if (smartAnalysisBox) smartAnalysisBox.style.display = "none";
    });

    // Calculate Remaining Months from Deadline
    function getRemainingMonthsFromDate(deadlineStr) {
        if (!deadlineStr) return 0;
        const targetDate = new Date(deadlineStr);
        if (isNaN(targetDate.getTime())) return 0;

        const now = new Date();
        const diffYears = targetDate.getFullYear() - now.getFullYear();
        const diffMonths = targetDate.getMonth() - now.getMonth() + (diffYears * 12);
        return Math.max(1, diffMonths);
    }

    // Smart Goal Analysis Calculator
    async function updateSmartGoalAnalysis() {
        if (!smartAnalysisBox) return;

        const target = Math.max(0, parseFloat(goalTargetInput?.value) || 0);
        const saved = Math.max(0, parseFloat(goalSavedInput?.value) || 0);
        const allocationVal = Math.max(0, parseFloat(goalAllocationInput?.value) || 0);
        const allocType = allocationTypeSelect?.value || 'amount';
        const deadline = goalDeadlineInput?.value || '';

        if (target <= 0) {
            smartAnalysisBox.style.display = "none";
            return;
        }

        // Fetch user income if percentage allocation
        let monthlyAllocation = allocationVal;
        if (allocType === 'percent') {
            let income = 50000;
            try {
                const pRes = await fetch('/api/profile');
                const pData = await pRes.json();
                if (pData.success && pData.data && pData.data.profile) {
                    income = parseFloat(pData.data.profile.monthly_income) || 50000;
                }
            } catch(e) {}
            monthlyAllocation = Math.round((income * allocationVal) / 100);
        }

        const remaining = Math.max(0, target - saved);
        let remainingMonths = getRemainingMonthsFromDate(deadline);
        
        // If no deadline, estimate months based on planned monthly allocation
        if (remainingMonths <= 0) {
            remainingMonths = monthlyAllocation > 0 ? Math.ceil(remaining / monthlyAllocation) : 12;
        }

        const requiredMonthly = remainingMonths > 0 ? Math.ceil(remaining / remainingMonths) : 0;
        const diff = monthlyAllocation - requiredMonthly;

        let statusBadge = '';
        let statusAdvice = '';

        if (saved >= target && target > 0) {
            statusBadge = '<span class="smart-badge badge-success">🎉 Goal Completed!</span>';
            statusAdvice = 'Target amount has already been achieved.';
        } else if (diff >= 0 && monthlyAllocation > 0) {
            statusBadge = '<span class="smart-badge badge-success">🟢 On Track</span>';
            statusAdvice = `Planned monthly allocation (₹${monthlyAllocation.toLocaleString('en-IN')}) meets or exceeds required saving (₹${requiredMonthly.toLocaleString('en-IN')}/mo). Surplus: +₹${diff.toLocaleString('en-IN')}/mo.`;
        } else if (monthlyAllocation > 0) {
            statusBadge = '<span class="smart-badge badge-warning">🟡 Needs Adjustment</span>';
            statusAdvice = `Shortfall of <strong>₹${Math.abs(diff).toLocaleString('en-IN')}/mo</strong>. <br><small>Options: Increase monthly allocation to ₹${requiredMonthly.toLocaleString('en-IN')}, extend deadline, or adjust target.</small>`;
        } else {
            statusBadge = '<span class="smart-badge badge-neutral">ℹ️ Enter Planned Allocation</span>';
            statusAdvice = `Required saving: <strong>₹${requiredMonthly.toLocaleString('en-IN')}/mo</strong> over ${remainingMonths} months.`;
        }

        smartAnalysisBox.style.display = "block";
        smartAnalysisBox.innerHTML = `
            <div class="smart-analysis-header">
                <strong>📊 Smart Goal Analysis</strong>
                ${statusBadge}
            </div>
            <div class="smart-analysis-stats">
                <div><span>Remaining:</span> <strong>₹${remaining.toLocaleString('en-IN')}</strong></div>
                <div><span>Timeline:</span> <strong>${remainingMonths} Months</strong></div>
                <div><span>Required:</span> <strong>₹${requiredMonthly.toLocaleString('en-IN')}/mo</strong></div>
                <div><span>Planned:</span> <strong>₹${monthlyAllocation.toLocaleString('en-IN')}/mo</strong></div>
            </div>
            <div class="smart-analysis-advice">${statusAdvice}</div>
        `;
    }

    // Attach real-time input listeners to modal fields
    [goalTargetInput, goalSavedInput, goalAllocationInput, allocationTypeSelect, goalDeadlineInput].forEach(el => {
        el?.addEventListener("input", updateSmartGoalAnalysis);
        el?.addEventListener("change", updateSmartGoalAnalysis);
    });

    // Form Submission for New Goal
    addGoalForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = addGoalForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';
        }

        const name = goalNameInput?.value?.trim() || 'Financial Goal';
        const target = Math.max(1, parseFloat(goalTargetInput?.value) || 0);
        const saved = Math.max(0, parseFloat(goalSavedInput?.value) || 0);
        const allocationVal = Math.max(1, parseFloat(goalAllocationInput?.value) || 0);
        const allocType = allocationTypeSelect?.value || 'amount';
        const deadline = goalDeadlineInput?.value || null;

        let monthlyAmount = allocationVal;
        if (allocType === 'percent') {
            try {
                const profileRes = await fetch('/api/profile');
                const profileData = await profileRes.json();
                const income = (profileData.success && profileData.data && profileData.data.profile) 
                    ? (parseFloat(profileData.data.profile.monthly_income) || 50000) 
                    : 50000;
                monthlyAmount = Math.round((income * allocationVal) / 100);
            } catch(err) {}
        }

        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    target_amount: target,
                    saved_amount: saved,
                    monthly_allocation: monthlyAmount,
                    deadline: deadline
                })
            });
            const result = await response.json();
            if (result.success) {
                // If initial saved amount was specified > 0 and wasn't handled in POST, PATCH it
                if (saved > 0 && result.data && result.data.saved_amount !== saved) {
                    const patchRes = await fetch(`/api/goals/${result.data.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ saved_amount: saved })
                    });
                    const patchData = await patchRes.json();
                    if (patchData && patchData.goalJustCompleted) {
                        if (patchData.emailSent) {
                            showGoalToast(`🎉 Congratulations! You completed "${name}". A confirmation email has been sent to your registered address.`, 'success');
                        } else {
                            showGoalToast(`🎉 Congratulations! You completed "${name}".`, 'success');
                        }
                    }
                } else if (result.goalCompleted) {
                    if (result.emailSent) {
                        showGoalToast(`🎉 Congratulations! You completed "${name}". A confirmation email has been sent to your registered address.`, 'success');
                    } else {
                        showGoalToast(`🎉 Congratulations! You completed "${name}".`, 'success');
                    }
                } else {
                    showGoalToast(`Goal "${name}" created successfully!`, 'success');
                }

                await loadGoals();
                goalModalOverlay.classList.remove("active");
                addGoalForm.reset();
                if (smartAnalysisBox) smartAnalysisBox.style.display = "none";
            } else {
                showGoalToast(result.error || "Failed to add goal. Please check your inputs.", 'error');
            }
        } catch (error) {
            console.error("Error adding goal:", error);
            showGoalToast("Network error. Unable to add goal.", 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save Goal';
            }
        }
    });

    // Render Goals in the Grid (State A vs State B)
    window.renderGoals = function() {
        const emptyStateEl = document.getElementById("goals-empty-state");
        if (!goalsGrid) return;

        if (goals.length === 0) {
            goalsGrid.style.display = "none";
            goalsGrid.innerHTML = "";
            if (emptyStateEl) emptyStateEl.style.display = "flex";
            return;
        }

        if (emptyStateEl) emptyStateEl.style.display = "none";
        goalsGrid.style.display = "grid";
        goalsGrid.innerHTML = "";

        goals.forEach(goal => {
            const saved = parseFloat(goal.saved_amount) || 0;
            const target = Math.max(1, parseFloat(goal.target_amount) || 1);
            const allocation = parseFloat(goal.monthly_allocation) || 0;
            const progress = Math.min(100, Math.round((saved / target) * 100));
            const remaining = Math.max(0, target - saved);

            // Calculate feasibility & ETA
            let etaMonths = allocation > 0 ? Math.ceil(remaining / allocation) : 0;
            let statusBadge = '';

            if (saved >= target) {
                statusBadge = `<span class="goal-feasibility-badge badge-success">🎉 Goal Completed</span>`;
            } else if (goal.deadline) {
                const deadlineMonths = getRemainingMonthsFromDate(goal.deadline);
                const requiredMonthly = deadlineMonths > 0 ? Math.ceil(remaining / deadlineMonths) : allocation;
                if (allocation >= requiredMonthly) {
                    statusBadge = `<span class="goal-feasibility-badge badge-success">🟢 On Track (${deadlineMonths} mo)</span>`;
                } else {
                    const shortfall = requiredMonthly - allocation;
                    statusBadge = `<span class="goal-feasibility-badge badge-warning">🟡 Shortfall: ₹${shortfall.toLocaleString('en-IN')}/mo</span>`;
                }
            } else {
                statusBadge = `<span class="goal-feasibility-badge badge-neutral">⏱️ ~${etaMonths} Months to Go</span>`;
            }

            const card = document.createElement("div");
            card.className = "goal-card";
            card.id = `goal-card-${goal.id}`;
            card.innerHTML = `
                <div class="goal-header">
                    <h4>🎯 ${goal.name}</h4>
                    <div class="goal-actions">
                        <button onclick="handleDeleteGoal(${goal.id})" class="delete-btn" title="Delete Goal"><i style="font-style: normal;">🗑️</i></button>
                    </div>
                </div>
                <div class="goal-stats">
                    <span>Target: <span class="target">₹${target.toLocaleString('en-IN')}</span></span>
                    <span>Saved: <span class="goal-saved-val" style="color: var(--primary); font-weight: 600;">₹${saved.toLocaleString('en-IN')}</span></span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progress}%;"></div>
                </div>
                <div class="goal-footer-info">
                    <span class="goal-progress-pct">${progress}% Completed</span>
                    ${statusBadge}
                </div>
                <div class="goal-allocation-info">
                    <span>Monthly: <strong>₹${allocation.toLocaleString('en-IN')}/mo</strong></span>
                    ${goal.deadline ? `<span>Deadline: <strong>${new Date(goal.deadline).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</strong></span>` : ''}
                </div>
                <div class="goal-update-row">
                    <input type="number" id="update-saved-${goal.id}" placeholder="+ Add Saved (₹)" min="1" />
                    <button class="action-btn" onclick="handleUpdateSaved(${goal.id})">Save</button>
                </div>
            `;
            goalsGrid.appendChild(card);
        });
    };

    // Update Saved Amount Handler (Smooth Inline Update & Non-blocking)
    window.handleUpdateSaved = async function(id) {
        const input = document.getElementById(`update-saved-${id}`);
        const addAmount = Number(input?.value);
        if (!addAmount || !Number.isFinite(addAmount) || addAmount <= 0) {
            showGoalToast("Please enter a valid positive amount to add.", "error");
            return;
        }

        const goal = goals.find(g => g.id === id);
        if (!goal) return;

        const cardEl = document.getElementById(`goal-card-${id}`) || input?.closest('.goal-card');
        const saveBtn = cardEl?.querySelector('.goal-update-row .action-btn');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';
        }

        const currentSaved = Number(goal.saved_amount) || 0;
        const newSaved = currentSaved + addAmount;
        const target = Math.max(1, Number(goal.target_amount) || 1);

        try {
            const res = await fetch(`/api/goals/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ saved_amount: newSaved })
            });
            const data = await res.json();
            if (data.success) {
                if (input) input.value = "";
                
                // Update local in-memory goal model
                goal.saved_amount = data.data?.saved_amount !== undefined ? Number(data.data.saved_amount) : newSaved;
                if (data.data?.completion_email_sent !== undefined) {
                    goal.completion_email_sent = data.data.completion_email_sent;
                }

                // Smooth Inline DOM update for the specific card
                if (cardEl) {
                    const savedValEl = cardEl.querySelector('.goal-saved-val');
                    if (savedValEl) savedValEl.textContent = `₹${newSaved.toLocaleString('en-IN')}`;

                    const newProgress = Math.min(100, Math.round((newSaved / target) * 100));
                    const progressBar = cardEl.querySelector('.progress-bar');
                    if (progressBar) progressBar.style.width = `${newProgress}%`;

                    const progressPctEl = cardEl.querySelector('.goal-progress-pct');
                    if (progressPctEl) progressPctEl.textContent = `${newProgress}% Completed`;

                    // Update badge if completed
                    if (newSaved >= target) {
                        const footerInfo = cardEl.querySelector('.goal-footer-info');
                        if (footerInfo) {
                            footerInfo.innerHTML = `
                                <span class="goal-progress-pct">100% Completed</span>
                                <span class="goal-feasibility-badge badge-success">🎉 Goal Completed</span>
                            `;
                        }
                    }
                }

                // Non-blocking Toast Notification
                if (data.goalJustCompleted) {
                    if (data.emailSent) {
                        showGoalToast(`🎉 Congratulations! You completed "${goal.name}". A confirmation email has been sent.`, 'success');
                    } else {
                        showGoalToast(`🎉 Congratulations! You have completed your goal "${goal.name}".`, 'success');
                    }
                } else {
                    showGoalToast(`Added ₹${addAmount.toLocaleString('en-IN')} to "${goal.name}".`, 'info');
                }

                // Re-render in background to ensure all computed states remain consistent
                renderGoals();
            } else {
                showGoalToast(data.error || "Unable to update goal. Please try again.", "error");
            }
        } catch (err) {
            console.error("Error updating goal:", err);
            showGoalToast("Network error while updating goal. Please try again.", "error");
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save';
            }
        }
    };

    // Delete Goal Handler
    window.handleDeleteGoal = async function(id) {
        if (!confirm("Are you sure you want to delete this goal?")) return;
        try {
            const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                showGoalToast("Goal deleted successfully.", "info");
                await loadGoals();
            } else {
                showGoalToast(data.error || "Failed to delete goal.", "error");
            }
        } catch (err) {
            console.error("Error deleting goal:", err);
            showGoalToast("Network error. Unable to delete goal.", "error");
        }
    };
});
