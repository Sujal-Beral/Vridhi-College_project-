// js/charts.js

let allocChartInstance = null;
let surveyChartInstance = null;
let impactChartInstance = null;

window.renderAllocationChart = function(data) {
    const ctx = document.getElementById('allocationPieChart');
    if (!ctx) return;

    if (allocChartInstance) {
        allocChartInstance.destroy();
    }

    // Read from the actual backend response structure
    const profile = data.profile || {};
    const allocation = data.allocation || null;
    const inc = parseFloat(profile.monthly_income) || 0;

    // Calculate amounts from the 20-20-30-30 allocation
    const secureAmt = allocation ? parseFloat(allocation.secureSavings) : inc * 0.20;
    const emergencyAmt = allocation ? parseFloat(allocation.emergencyShield) : inc * 0.20;
    const homeAmt = allocation ? parseFloat(allocation.homeEssentials) : inc * 0.30;
    const wealthAmt = allocation ? parseFloat(allocation.wealthGeneration) : inc * 0.30;

    allocChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Secure Savings', 'Emergency Shield', 'Home & Essentials', 'Wealth Generation'],
            datasets: [{
                data: [secureAmt, emergencyAmt, homeAmt, wealthAmt],
                backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        padding: 6,
                        font: { size: 10, family: "'Segoe UI', sans-serif" }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ₹' + context.raw.toLocaleString('en-IN');
                        }
                    }
                }
            }
        }
    });
};

window.renderSurveyCharts = function() {
    const ctx = document.getElementById('surveyChart');
    if(!ctx) return;

    if(surveyChartInstance) {
        surveyChartInstance.destroy();
    }

    // Mock data for display
    surveyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Budgeting', 'Saving', 'Emergency', 'Goals', 'Investments'],
            datasets: [
                {
                    label: 'Before Vridhi (Yes %)',
                    data: [30, 45, 20, 50, 15],
                    backgroundColor: '#FF9800'
                },
                {
                    label: 'After Vridhi (Yes %)',
                    data: [85, 90, 75, 95, 80],
                    backgroundColor: '#4CAF50'
                }
            ]
        },
        options: { responsive: true }
    });
};

window.renderImpactCharts = function() {
    const ctx = document.getElementById('impactChart');
    if(!ctx) return;

    if(impactChartInstance) {
        impactChartInstance.destroy();
    }

    impactChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Avg Awareness Rating',
                data: [4, 5.5, 7, 8.5],
                borderColor: '#2196F3',
                tension: 0.1
            }]
        },
        options: { responsive: true }
    });
};
