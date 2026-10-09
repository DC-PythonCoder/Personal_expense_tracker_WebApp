import {
    loadExpenses,
    saveExpenses
} from "./storage.js";


import {
    renderCategoryChart
} from "./charts.js";



/* =========================
   CONFIGURATION
   ========================= */

const CATEGORIES = [
    "Food",
    "Transport",
    "Housing",
    "Entertainment",
    "Shopping",
    "Health",
    "Education",
    "Other"
];



/* =========================
   APPLICATION STATE
   ========================= */

let expenses = loadExpenses();



/* =========================
   DOM ELEMENTS
   ========================= */

const form =
    document.getElementById(
        "expenseForm"
    );


const expenseIdInput =
    document.getElementById(
        "expenseId"
    );


const descriptionInput =
    document.getElementById(
        "description"
    );


const amountInput =
    document.getElementById(
        "amount"
    );


const categoryInput =
    document.getElementById(
        "category"
    );


const dateInput =
    document.getElementById(
        "date"
    );


const submitButton =
    document.getElementById(
        "submitButton"
    );


const cancelEditButton =
    document.getElementById(
        "cancelEditButton"
    );


const expenseTableBody =
    document.getElementById(
        "expenseTableBody"
    );


const totalSpentElement =
    document.getElementById(
        "totalSpent"
    );


const monthSpentElement =
    document.getElementById(
        "monthSpent"
    );


const expenseCountElement =
    document.getElementById(
        "expenseCount"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const filterCategory =
    document.getElementById(
        "filterCategory"
    );



/* =========================
   FORMATTERS
   ========================= */

const currencyFormatter =
    new Intl.NumberFormat(
        "en-IE",
        {
            style: "currency",
            currency: "EUR"
        }
    );


const dateFormatter =
    new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );



/* =========================
   INITIAL SETUP
   ========================= */

populateCategories();

resetForm();

render();



/* =========================
   EVENT LISTENERS
   ========================= */

form.addEventListener(
    "submit",
    handleFormSubmit
);


cancelEditButton.addEventListener(
    "click",
    resetForm
);


searchInput.addEventListener(
    "input",
    render
);


filterCategory.addEventListener(
    "change",
    render
);



/* =========================
   CATEGORY SETUP
   ========================= */

function populateCategories() {

    for (const category of CATEGORIES) {

        const formOption =
            document.createElement(
                "option"
            );


        formOption.value =
            category;


        formOption.textContent =
            category;


        categoryInput.appendChild(
            formOption
        );


        const filterOption =
            document.createElement(
                "option"
            );


        filterOption.value =
            category;


        filterOption.textContent =
            category;


        filterCategory.appendChild(
            filterOption
        );

    }
}



/* =========================
   FORM
   ========================= */

function handleFormSubmit(event) {

    /*
        Prevent the browser from
        reloading the page.
    */

    event.preventDefault();


    const description =
        descriptionInput.value.trim();


    const amount =
        Number(
            amountInput.value
        );


    const category =
        categoryInput.value;


    const date =
        dateInput.value;


    if (
        !description ||
        !category ||
        !date ||
        amount <= 0
    ) {

        alert(
            "Please enter valid expense information."
        );

        return;
    }


    const expenseId =
        expenseIdInput.value;


    /*
        If expenseId contains something,
        we're editing an existing expense.
    */

    if (expenseId) {

        updateExpense(
            expenseId,
            {
                description,
                amount,
                category,
                date
            }
        );

    } else {

        addExpense({
            description,
            amount,
            category,
            date
        });

    }


    saveExpenses(expenses);

    resetForm();

    render();
}



/* =========================
   ADD EXPENSE
   ========================= */

function addExpense(
    {
        description,
        amount,
        category,
        date
    }
) {

    const expense = {

        id:
            window.crypto.randomUUID
                ? window.crypto.randomUUID()
                : String(Date.now()),

        description,

        amount,

        category,

        date

    };


    expenses.push(expense);
}



/* =========================
   UPDATE EXPENSE
   ========================= */

function updateExpense(
    id,
    updatedData
) {

    expenses =
        expenses.map(
            expense => {

                if (expense.id !== id) {
                    return expense;
                }


                return {
                    ...expense,
                    ...updatedData
                };

            }
        );
}



/* =========================
   EDIT EXPENSE
   ========================= */

function startEditingExpense(id) {

    const expense =
        expenses.find(
            expense =>
                expense.id === id
        );


    if (!expense) {
        return;
    }


    expenseIdInput.value =
        expense.id;


    descriptionInput.value =
        expense.description;


    amountInput.value =
        expense.amount;


    categoryInput.value =
        expense.category;


    dateInput.value =
        expense.date;


    submitButton.textContent =
        "Save changes";


    cancelEditButton.hidden =
        false;


    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}



/* =========================
   DELETE EXPENSE
   ========================= */

function deleteExpense(id) {

    const expense =
        expenses.find(
            expense =>
                expense.id === id
        );


    if (!expense) {
        return;
    }


    const confirmed =
        window.confirm(
            `Delete "${expense.description}"?`
        );


    if (!confirmed) {
        return;
    }


    expenses =
        expenses.filter(
            expense =>
                expense.id !== id
        );


    /*
        If we're currently editing the
        deleted expense, reset the form.
    */

    if (
        expenseIdInput.value === id
    ) {

        resetForm();
    }


    saveExpenses(expenses);

    render();
}



/* =========================
   RESET FORM
   ========================= */

function resetForm() {

    form.reset();


    expenseIdInput.value = "";


    dateInput.value =
        getTodayDate();


    submitButton.textContent =
        "Add expense";


    cancelEditButton.hidden =
        true;
}



/* =========================
   MAIN RENDER FUNCTION
   ========================= */

function render() {

    const visibleExpenses =
        getFilteredExpenses();


    /*
        Sort newest expenses first.
    */

    visibleExpenses.sort(
        (a, b) =>
            b.date.localeCompare(
                a.date
            )
    );


    renderExpenseTable(
        visibleExpenses
    );


    renderSummary();


    renderCategoryChart(
        expenses
    );
}



/* =========================
   FILTERS
   ========================= */

function getFilteredExpenses() {

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedCategory =
        filterCategory.value;


    return expenses.filter(
        expense => {

            const matchesSearch =
                expense.description
                    .toLowerCase()
                    .includes(
                        searchText
                    );


            const matchesCategory =
                selectedCategory === "all" ||
                expense.category ===
                    selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        }
    );
}



/* =========================
   RENDER TABLE
   ========================= */

function renderExpenseTable(
    expensesToDisplay
) {

    /*
        Remove all existing table rows.
    */

    expenseTableBody.replaceChildren();


    if (
        expensesToDisplay.length === 0
    ) {

        const row =
            document.createElement(
                "tr"
            );


        const cell =
            document.createElement(
                "td"
            );


        cell.colSpan = 5;


        cell.textContent =
            "No expenses found.";


        cell.className =
            "empty-table";


        row.appendChild(cell);


        expenseTableBody.appendChild(
            row
        );


        return;
    }


    for (
        const expense
        of expensesToDisplay
    ) {

        const row =
            document.createElement(
                "tr"
            );


        const dateCell =
            document.createElement(
                "td"
            );


        dateCell.textContent =
            formatDate(
                expense.date
            );


        const descriptionCell =
            document.createElement(
                "td"
            );


        descriptionCell.textContent =
            expense.description;


        const categoryCell =
            document.createElement(
                "td"
            );


        categoryCell.textContent =
            expense.category;


        const amountCell =
            document.createElement(
                "td"
            );


        amountCell.textContent =
            currencyFormatter.format(
                expense.amount
            );


        amountCell.className =
            "amount-cell";


        const actionsCell =
            document.createElement(
                "td"
            );


        const editButton =
            document.createElement(
                "button"
            );


        editButton.textContent =
            "Edit";


        editButton.className =
            "action-button edit-button";


        editButton.addEventListener(
            "click",
            () =>
                startEditingExpense(
                    expense.id
                )
        );


        const deleteButton =
            document.createElement(
                "button"
            );


        deleteButton.textContent =
            "Delete";


        deleteButton.className =
            "action-button delete-button";


        deleteButton.addEventListener(
            "click",
            () =>
                deleteExpense(
                    expense.id
                )
        );


        actionsCell.append(
            editButton,
            deleteButton
        );


        row.append(
            dateCell,
            descriptionCell,
            categoryCell,
            amountCell,
            actionsCell
        );


        expenseTableBody.appendChild(
            row
        );

    }
}



/* =========================
   SUMMARY
   ========================= */

function renderSummary() {

    const totalSpent =
        expenses.reduce(
            (
                total,
                expense
            ) =>
                total +
                Number(
                    expense.amount
                ),

            0
        );


    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const currentMonthPrefix =
        `${year}-${month}`;


    const monthSpent =
        expenses

            .filter(
                expense =>
                    expense.date
                        .startsWith(
                            currentMonthPrefix
                        )
            )

            .reduce(
                (
                    total,
                    expense
                ) =>
                    total +
                    Number(
                        expense.amount
                    ),

                0
            );


    totalSpentElement.textContent =
        currencyFormatter.format(
            totalSpent
        );


    monthSpentElement.textContent =
        currencyFormatter.format(
            monthSpent
        );


    expenseCountElement.textContent =
        expenses.length;
}



/* =========================
   DATE HELPERS
   ========================= */

function getTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
}



function formatDate(dateString) {

    const [
        year,
        month,
        day
    ] =
        dateString
            .split("-")
            .map(Number);


    const date =
        new Date(
            year,
            month - 1,
            day
        );


    return dateFormatter.format(
        date
    );
}