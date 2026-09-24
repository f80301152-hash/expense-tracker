import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { CategoryIcon } from '../../pipes/category-icon-pipe';
import { HighlightOverBudget } from '../../directives/highlight-over-budget';
import { ExpenseCategory } from '../../models/expense.model';

@Component({
  selector: 'app-expense-list',
  imports: [CurrencyPipe, CategoryIcon, HighlightOverBudget],
  template: `
    <section class="list-page">
      <h1>Expenses</h1>

      <div class="controls">
        <label>
          Category
          <select [value]="category()" (change)="onCategoryChange($event)">
            <option value="All">All</option>
            @for (c of categories; track c) {
              <option [value]="c">{{ c }}</option>
            }
          </select>
        </label>

        <label>
          Search note
          <input type="text" [value]="search()" (input)="onSearchChange($event)" placeholder="Type to filter..." />
        </label>

        <label>
          Sort by
          <select [value]="sortBy()" (change)="onSortByChange($event)">
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </label>

        <label>
          Direction
          <select [value]="sortDir()" (change)="onSortDirChange($event)">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>

      <p class="total">
        Total (visible): <strong>{{ total() | currency }}</strong>
      </p>

      @if (filteredExpenses().length === 0) {
        <p class="empty">No expenses match your filters.</p>
      } @else {
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (exp of filteredExpenses(); track exp.id) {
              <tr [appHighlightOverBudget]="exp.amount">
                <td>{{ exp.category | categoryIcon }}</td>
                <td>{{ exp.amount | currency }}</td>
                <td>{{ exp.date }}</td>
                <td>{{ exp.note || '—' }}</td>
                <td class="row-actions">
                  <button class="btn small" (click)="edit(exp.id)">Edit</button>
                  <button class="btn small danger" (click)="remove(exp.id)">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `,
  styles: [`
    .list-page { max-width: 900px; margin: 2rem auto; font-family: system-ui, sans-serif; padding: 0 1rem; }
    h1 { margin-bottom: 1rem; }
    .controls { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; }
    .controls label { display: flex; flex-direction: column; font-weight: 600; font-size: .85rem; gap: .25rem; }
    .controls input, .controls select { padding: .4rem .5rem; border: 1px solid #ccc; border-radius: 6px; font-weight: normal; }
    .total { font-size: 1.1rem; margin: 1rem 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: .6rem .5rem; border-bottom: 1px solid #eee; }
    th { background: #f9fafb; font-size: .85rem; text-transform: uppercase; color: #555; }
    .row-actions { display: flex; gap: .5rem; }
    .btn { border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .small { padding: .3rem .7rem; font-size: .85rem; background: #e5e7eb; color: #111; }
    .danger { background: #dc2626; color: white; }
    .empty { color: #777; font-style: italic; }
  `],
})
export class ExpenseList implements OnInit {
  private expenseService = inject(ExpenseService);
  private router = inject(Router);

  categories: ('All' | ExpenseCategory)[] = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

  category = signal<'All' | ExpenseCategory>('All');
  search = signal('');
  sortBy = signal<'date' | 'amount'>('date');
  sortDir = signal<'asc' | 'desc'>('desc');

  filteredExpenses = computed(() => {
    let list = this.expenseService.expenses();

    if (this.category() !== 'All') {
      list = list.filter(e => e.category === this.category());
    }

    const q = this.search().trim().toLowerCase();
    if (q) {
      list = list.filter(e => (e.note ?? '').toLowerCase().includes(q));
    }

    const dir = this.sortDir() === 'asc' ? 1 : -1;
    const key = this.sortBy();

    return [...list].sort((a, b) => {
      if (key === 'amount') return (a.amount - b.amount) * dir;
      return a.date.localeCompare(b.date) * dir;
    });
  });

  total = computed(() => this.filteredExpenses().reduce((s, e) => s + e.amount, 0));

  ngOnInit(): void {
    this.expenseService.loadExpenses();
  }

  onCategoryChange(e: Event): void {
    this.category.set((e.target as HTMLSelectElement).value as 'All' | ExpenseCategory);
  }

  onSearchChange(e: Event): void {
    this.search.set((e.target as HTMLInputElement).value);
  }

  onSortByChange(e: Event): void {
    this.sortBy.set((e.target as HTMLSelectElement).value as 'date' | 'amount');
  }

  onSortDirChange(e: Event): void {
    this.sortDir.set((e.target as HTMLSelectElement).value as 'asc' | 'desc');
  }

  edit(id: string): void {
  this.router.navigate(['/edit', id]);
}

remove(id: string): void {
  if (!confirm('Delete this expense?')) return;
  this.expenseService.deleteExpense(id).subscribe();
}
}