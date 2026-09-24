# Expense Tracker

A multi-page Angular app for tracking expenses, backed by a local `json-server` REST API.

## Features

- Add, edit, and delete expenses (full CRUD)
- Reactive form with validation (amount, category, date, note)
- Table with filter, search, and sort
- Custom pipe: category icon (`categoryIcon`)
- Custom attribute directive: over-budget highlight (`appHighlightOverBudget`)
- Running total of visible expenses
- Chatbot page for querying expenses in natural language

## Tech Stack

- Angular v22 (standalone components, signals, new control flow)
- Angular Router
- Angular Reactive Forms
- Angular HttpClient
- json-server (fake REST API)

## Prerequisites

- Node.js 18+ — https://nodejs.org
- npm 9+ (comes with Node.js)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/f80301152-hash/expense-tracker.git
   cd expense-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install json-server locally:

   ```bash
   npm install json-server --save-dev
   ```

## Running the App

You need **two terminals** open at the same time.

**Terminal 1 — Start the API:**

```bash
npx json-server --watch db.json --port 3000
```

You should see `http://localhost:3000/expenses`.

**Terminal 2 — Start the Angular app:**

```bash
npx ng serve
```

Wait for `http://localhost:4200`.

Open your browser at **http://localhost:4200**.

## Data

Expenses are stored in `db.json` at the project root. The file starts empty so you can add and delete your own expenses.

Sample `db.json`:

```json
{
  "expenses": []
}
```

## Project Structure

```
src/app/
├── components/
│   ├── home/
│   ├── expense-form/
│   ├── expense-list/
│   └── chatbot/
├── directives/
│   └── highlight-over-budget.ts
├── models/
│   └── expense.model.ts
├── pipes/
│   └── category-icon-pipe.ts
└── services/
    ├── expense.service.ts
    └── ai-chatbot.ts
```

## License

This project was built for educational purposes.

   ```bash
   git clone https://github.com/YOUR-USERNAME/expense-tracker.git
   cd expense-tracker
