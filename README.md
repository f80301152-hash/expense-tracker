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

- Node.js 18+
- npm 9+
- Angular CLI (`npm install -g @angular/cli`)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/expense-tracker.git
   cd expense-tracker