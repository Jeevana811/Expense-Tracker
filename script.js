const expenseForm = document.getElementById("expenseForm");
const expensesList = document.getElementById("expensesList");
const filterCategory = document.getElementById("filterCategory");
const clearBtn = document.getElementById("clearBtn");

let expenses = [];

let categoryChart;
let trendChart;

// Add Expense
expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    expenses.push({
        description,
        amount,
        category,
        date
    });

    expenseForm.reset();

    displayExpenses();
    updateStats();
    updateCategoryChart();
    updateTrendChart();
});

// Display Expenses
function displayExpenses(data = expenses) {

    expensesList.innerHTML = "";

    if (data.length === 0) {
        expensesList.innerHTML =
            '<div class="empty-state">No expenses found.</div>';
        return;
    }

    data.forEach((expense, index) => {

        const div = document.createElement("div");
        div.className = "expense-item";

        div.innerHTML = `
            <div class="expense-info">
                <div class="expense-description">
                    ${expense.description}
                </div>
                <div class="expense-meta">
                    ${expense.category} | ${expense.date}
                </div>
            </div>

            <div class="expense-amount">
                $${expense.amount.toFixed(2)}
            </div>

            <button class="btn-small btn-delete"
                onclick="deleteExpense(${index})">
                Delete
            </button>
        `;

        expensesList.appendChild(div);
    });
}

// Delete Expense
function deleteExpense(index) {

    expenses.splice(index, 1);

    displayExpenses();
    updateStats();
    updateCategoryChart();
    updateTrendChart();
}

// Update Statistics
function updateStats() {

    const total = expenses.reduce(
        (sum, item) => sum + item.amount,
        0
    );

    document.getElementById("totalExpenses").textContent =
        "$" + total.toFixed(2);

    const today = new Date();

    const monthTotal = expenses
        .filter(exp => {
            const d = new Date(exp.date);

            return (
                d.getMonth() === today.getMonth() &&
                d.getFullYear() === today.getFullYear()
            );
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

    document.getElementById("monthExpenses").textContent =
        "$" + monthTotal.toFixed(2);

    const weekTotal = expenses
        .filter(exp => {
            const d = new Date(exp.date);

            const diff =
                (today - d) /
                (1000 * 60 * 60 * 24);

            return diff <= 7;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

    document.getElementById("weekExpenses").textContent =
        "$" + weekTotal.toFixed(2);
}

// Filter Category
filterCategory.addEventListener("change", function () {

    const category = this.value;

    if (category === "") {
        displayExpenses(expenses);
    } else {

        const filtered = expenses.filter(
            exp => exp.category === category
        );

        displayExpenses(filtered);
    }
});

// Category Pie Chart
function updateCategoryChart() {

    const categoryData = {};

    expenses.forEach(exp => {

        if (!categoryData[exp.category]) {
            categoryData[exp.category] = 0;
        }

        categoryData[exp.category] += exp.amount;
    });

    const ctx =
        document.getElementById("categoryChart");

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData)
            }]
        }
    });
}

// Expense Trend Chart
function updateTrendChart() {

    const trendData = {};

    expenses.forEach(exp => {

        if (!trendData[exp.date]) {
            trendData[exp.date] = 0;
        }

        trendData[exp.date] += exp.amount;
    });

    const ctx =
        document.getElementById("trendChart");

    if (trendChart) {
        trendChart.destroy();
    }

    trendChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: Object.keys(trendData),
            datasets: [{
                label: "Expenses",
                data: Object.values(trendData),
                borderWidth: 2,
                fill: false
            }]
        }
    });
}

// Clear All Expenses
clearBtn.addEventListener("click", () => {

    if (confirm("Clear all expenses?")) {

        expenses = [];

        displayExpenses();
        updateStats();
        updateCategoryChart();
        updateTrendChart();
    }
});

// Initial Load
displayExpenses();
updateStats();