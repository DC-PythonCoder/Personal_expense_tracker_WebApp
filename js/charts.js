let categoryChart = null;


export function renderCategoryChart(expenses) {

    const canvas =
        document.getElementById(
            "categoryChart"
        );


    const emptyMessage =
        document.getElementById(
            "chartEmpty"
        );


    const totalsByCategory = {};


    for (const expense of expenses) {

        const category =
            expense.category;


        if (!totalsByCategory[category]) {
            totalsByCategory[category] = 0;
        }


        totalsByCategory[category] +=
            Number(expense.amount);
    }


    const categories =
        Object.keys(
            totalsByCategory
        );


    const totals =
        Object.values(
            totalsByCategory
        );


    /*
        Destroy the old chart before
        creating a new one.
    */

    if (categoryChart) {

        categoryChart.destroy();

        categoryChart = null;
    }


    if (categories.length === 0) {

        canvas.hidden = true;

        emptyMessage.hidden = false;

        return;
    }


    canvas.hidden = false;

    emptyMessage.hidden = true;


    categoryChart = new Chart(
        canvas,
        {

            type: "doughnut",

            data: {

                labels: categories,

                datasets: [
                    {

                        label: "Amount spent",

                        data: totals,

                        backgroundColor: [
                            "#4f46e5",
                            "#0891b2",
                            "#16a34a",
                            "#ea580c",
                            "#dc2626",
                            "#9333ea",
                            "#ca8a04"
                        ]

                    }
                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        }
    );
}