// Check Auth
const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
    window.location.href = 'login.html';
}

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

// State
let incomes = [];
let expenses = [];
let budget = 0;

// DOM Elements
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const balanceEl = document.getElementById('balance');
const incomeListEl = document.getElementById('income-list');
const expenseListEl = document.getElementById('expense-list');
const budgetAmountEl = document.getElementById('budget-amount');
const budgetProgressEl = document.getElementById('budget-progress');
const budgetStatusEl = document.getElementById('budget-status');

// Helper Info
const formatMoney = number => {
    return '₹' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Initialization
async function init() {
    try {
        await Promise.all([fetchIncomes(), fetchExpenses(), fetchBudget()]);
        updateValues();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        // Handle token expiry or error
        if (error.message === 'Not authorized' || error.message.includes('token')) {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        }
    }
}

// Fetch Data
async function fetchIncomes() {
    incomes = await API.getIncomes();
    renderIncomes();
}

async function fetchExpenses() {
    expenses = await API.getExpenses();
    renderExpenses();
}

async function fetchBudget() {
    const budgetData = await API.getBudget();
    if (budgetData && budgetData.length > 0) {
        // Assuming simple latest budget or first one logic for MVP. 
        // Ideally matching month.
        const date = new Date();
        const monthStr = date.toISOString().slice(0, 7);
        const currentBudget = budgetData.find(b => b.month === monthStr);

        if (currentBudget) {
            budget = currentBudget.amount;
        } else {
            // Fallback to latest added if strictly no month match logic or just take first
            budget = budgetData[0].amount;
        }
    }
    updateBudgetUI();
}

// Update UI Helpers
function updateValues() {
    const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0);
    const totalExpense = expenses.reduce((acc, item) => acc + item.amount, 0);
    const totalBalance = totalIncome - totalExpense;

    totalIncomeEl.innerText = formatMoney(totalIncome);
    totalExpenseEl.innerText = formatMoney(totalExpense);
    balanceEl.innerText = formatMoney(totalBalance);

    updateBudgetUI(totalExpense);
    updateCharts();
}

function updateBudgetUI(totalExpense = null) {
    if (totalExpense === null) {
        totalExpense = expenses.reduce((acc, item) => acc + item.amount, 0);
    }

    budgetAmountEl.innerText = formatMoney(budget);

    if (budget > 0) {
        const percentage = Math.min((totalExpense / budget) * 100, 100);
        budgetProgressEl.style.width = `${percentage}%`;

        if (percentage >= 100) {
            budgetProgressEl.style.backgroundColor = 'var(--danger-color)';
            budgetStatusEl.innerText = 'You have exceeded your budget!';
            budgetStatusEl.style.color = 'var(--danger-color)';
        } else if (percentage > 80) {
            budgetProgressEl.style.backgroundColor = 'var(--secondary-color)';
            budgetStatusEl.innerText = 'You are nearing your budget limit.';
            budgetStatusEl.style.color = 'var(--secondary-color)';
        } else {
            budgetProgressEl.style.backgroundColor = 'var(--success-color)';
            budgetStatusEl.innerText = 'You are within your budget.';
            budgetStatusEl.style.color = 'var(--success-color)';
        }
    }
}

// Render Lists
function renderIncomes() {
    incomeListEl.innerHTML = '';
    incomes.forEach(income => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="transaction-info">
                <span>${income.source}</span>
                <small>${new Date(income.date).toLocaleDateString()}</small>
            </div>
            <span>+${formatMoney(income.amount)}</span>
            <button class="delete-btn" onclick="deleteIncome('${income._id}')"><i class="fas fa-trash"></i></button>
        `;
        incomeListEl.appendChild(li);
    });
}

function renderExpenses() {
    expenseListEl.innerHTML = '';
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="transaction-info">
                <span>${expense.description} <small>(${expense.category})</small></span>
                <small>${new Date(expense.date).toLocaleDateString()}</small>
            </div>
            <span>-${formatMoney(expense.amount)}</span>
            <button class="delete-btn" onclick="deleteExpense('${expense._id}')"><i class="fas fa-trash"></i></button>
        `;
        expenseListEl.appendChild(li);
    });
}

// Add Income
document.getElementById('income-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const source = document.getElementById('income-source').value;
    const amount = Number(document.getElementById('income-amount').value);
    const date = document.getElementById('income-date').value;

    const newIncome = { source, amount, date };

    try {
        await API.addIncome(newIncome);
        await fetchIncomes();
        updateValues();
        document.getElementById('income-form').reset();
    } catch (error) {
        alert(error.message);
    }
});

// Add Expense
document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = document.getElementById('expense-desc').value;
    const category = document.getElementById('expense-category').value;
    const amount = Number(document.getElementById('expense-amount').value);
    const date = document.getElementById('expense-date').value;

    const newExpense = { description, category, amount, date };

    try {
        await API.addExpense(newExpense);
        await fetchExpenses();
        updateValues();
        document.getElementById('expense-form').reset();
    } catch (error) {
        alert(error.message);
    }
});

// Delete Logic (exposed to window)
window.deleteIncome = async (id) => {
    if (confirm('Are you sure?')) {
        try {
            await API.deleteIncome(id);
            // incomes = incomes.filter(i => i._id !== id);
            // renderIncomes();
            // updateValues();
            // Better to re-fetch to ensure sync
            await fetchIncomes();
            updateValues();
        } catch (error) {
            alert(error.message);
        }
    }
};

window.deleteExpense = async (id) => {
    if (confirm('Are you sure?')) {
        try {
            await API.deleteExpense(id);
            await fetchExpenses();
            updateValues();
        } catch (error) {
            alert(error.message);
        }
    }
};

// Tab Switching Logic
const tabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = tab.getAttribute('data-target');

        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        // Hide all tab contents
        tabContents.forEach(content => content.classList.remove('active-tab'));
        // Show target tab content
        document.getElementById(targetId).classList.add('active-tab');
    });
});

// Budget Form Setting
document.getElementById('budget-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = Number(document.getElementById('modal-budget-amount').value);

    try {
        await API.setBudget({ amount });
        budget = amount;
        updateBudgetUI();
        alert('Budget updated successfully!');
    } catch (error) {
        alert(error.message);
    }
});

// Charts
let expenseChart = null;
let categoryChart = null;

function initCharts() {
    const ctxExpense = document.getElementById('expense-chart').getContext('2d');
    const ctxCategory = document.getElementById('category-chart').getContext('2d');

    expenseChart = new Chart(ctxExpense, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Expenses Over Time',
                data: [],
                borderColor: '#e74c3c',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    categoryChart = new Chart(ctxCategory, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                label: 'Expenses by Category',
                data: [],
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#f1c40f',
                    '#e67e22',
                    '#9b59b6',
                    '#95a5a6'
                ],
            }]
        }
    });
}

function updateCharts() {
    if (!expenseChart || !categoryChart) return;

    // Process Date Data (Sort by date)
    const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
    const dates = sortedExpenses.map(e => new Date(e.date).toLocaleDateString());
    const amounts = sortedExpenses.map(e => e.amount);

    expenseChart.data.labels = dates;
    expenseChart.data.datasets[0].data = amounts;
    expenseChart.update();

    // Process Category Data
    const categories = {};
    expenses.forEach(e => {
        categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    categoryChart.data.labels = Object.keys(categories);
    categoryChart.data.datasets[0].data = Object.values(categories);
    categoryChart.update();
}

// Run Init
init();
initCharts();
