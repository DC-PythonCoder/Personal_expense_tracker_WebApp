const STORAGE_KEY = "personalExpenseTracker.expenses";


export function loadExpenses() {

    const storedExpenses =
        localStorage.getItem(STORAGE_KEY);


    if (!storedExpenses) {
        return [];
    }


    try {

        const parsedExpenses =
            JSON.parse(storedExpenses);


        if (!Array.isArray(parsedExpenses)) {
            return [];
        }


        return parsedExpenses;

    } catch (error) {

        console.error(
            "Could not load expenses:",
            error
        );

        return [];
    }
}


export function saveExpenses(expenses) {

    const expensesAsText =
        JSON.stringify(expenses);


    localStorage.setItem(
        STORAGE_KEY,
        expensesAsText
    );
}