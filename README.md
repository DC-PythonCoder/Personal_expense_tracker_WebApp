# Personal Expense Tracker

A simple personal expense tracking web application built with HTML, CSS and JavaScript.

The application allows users to record expenses, organize them by category, edit or delete transactions, search their expense history and visualize spending by category.

## My Objetive
My objective with this project is to further learn Html, JavaScript and Css, as well as how this programming languages interact with each other, through a project that entices my curiosity, as I find that the best way to learn something.

## Features

- Add personal expenses
- Edit existing expenses
- Delete expenses
- Categorize expenses
- Search transactions
- Filter transactions by category
- Calculate total spending
- Calculate spending for the current month
- Display spending by category using Chart.js
- Persist data using browser localStorage
- Responsive interface for desktop and mobile

## Technologies

- HTML5
- CSS3
- JavaScript
- JavaScript ES Modules
- Browser localStorage
- Chart.js

## Running the Project
Because the project uses JavaScript modules, it is recommended to run it through a local web server instead of opening index.html directly.

Using Python from the project directory in the terminal:
``` bash
python -m http.server 8000
```

Then open in your browser:
http://localhost:8000

in your browser.
You can stop the server with:
Ctrl + C in the terminal that you opened the server with.

### Using VS Code
Alternatively, the project can be run using a local development server extension such as Live Server.

## Data Storage
Expenses are stored using the browser's localStorage. This means that no account or database is currently required. The data is stored locally in the browser and remains available after refreshing or closing the page. Deleting browser storage will also delete the saved expense data.

## How the whole Application flows

                        USER
                          │
                          │ submits form
                          ▼
                    handleFormSubmit()
                          │
                  ┌───────┴────────┐
                  │                │
                  ▼                ▼
             addExpense()     updateExpense()
                  │                │
                  └───────┬────────┘
                          ▼
                     expenses[]
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
      saveExpenses()                render()
             │                         │
             ▼              ┌──────────┼──────────┐
        localStorage        ▼          ▼          ▼
                         Table      Summary      Chart