import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="home">
      <h1>💰 Expense Tracker</h1>
      <p>Track your spending. Stay on budget.</p>
      <nav class="actions">
        <a routerLink="/add" class="btn primary">➕ Add Expense</a>
        <a routerLink="/expenses" class="btn secondary">📋 View Expenses</a>
      </nav>
    </section>
  `,
  styles: [`
    .home { max-width: 600px; margin: 4rem auto; text-align: center; font-family: system-ui, sans-serif; }
    h1 { font-size: 2.5rem; margin-bottom: .5rem; }
    p { color: #555; }
    .actions { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
    .btn { padding: .75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .primary { background: #2563eb; color: white; }
    .secondary { background: #e5e7eb; color: #111; }
  `],
})
export class Home {}