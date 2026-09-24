import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseCategory } from '../../models/expense.model';

@Component({
  selector: 'app-expense-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="form-page">
      <h1>{{ isEdit() ? 'Edit Expense' : 'Add Expense' }}</h1>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <label>
          Amount
          <input type="number" formControlName="amount" step="0.01" min="0" />
        </label>
        @if (form.controls.amount.touched && form.controls.amount.invalid) {
          <p class="error">Amount is required and must be greater than 0.</p>
        }

        <label>
          Category
          <select formControlName="category">
            <option value="" disabled>Select a category</option>
            @for (c of categories; track c) {
              <option [value]="c">{{ c }}</option>
            }
          </select>
        </label>
        @if (form.controls.category.touched && form.controls.category.invalid) {
          <p class="error">Category is required.</p>
        }

        <label>
          Date
          <input type="date" formControlName="date" />
        </label>
        @if (form.controls.date.touched && form.controls.date.invalid) {
          <p class="error">Date is required and cannot be in the future.</p>
        }

        <label>
          Note (optional, max 200 chars)
          <textarea formControlName="note" rows="3"></textarea>
        </label>
        @if (form.controls.note.touched && form.controls.note.invalid) {
          <p class="error">Note cannot exceed 200 characters.</p>
        }

        <div class="actions">
          <button type="submit" class="btn primary" [disabled]="form.invalid">
            {{ isEdit() ? 'Update Expense' : 'Add Expense' }}
          </button>
          <a routerLink="/expenses" class="btn secondary">Cancel</a>
        </div>
      </form>
    </section>
  `,
  styles: [`
    .form-page { max-width: 500px; margin: 2rem auto; font-family: system-ui, sans-serif; padding: 0 1rem; }
    h1 { margin-bottom: 1rem; }
    form { display: flex; flex-direction: column; gap: .5rem; }
    label { display: flex; flex-direction: column; font-weight: 600; gap: .25rem; margin-top: .5rem; }
    input, select, textarea { padding: .5rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem; font-weight: normal; }
    .error { color: #dc2626; font-size: .85rem; margin: 0; }
    .actions { display: flex; gap: 1rem; margin-top: 1rem; }
    .btn { padding: .6rem 1.2rem; border-radius: 6px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; }
    .primary { background: #2563eb; color: white; }
    .primary:disabled { background: #93c5fd; cursor: not-allowed; }
    .secondary { background: #e5e7eb; color: #111; }
  `],
})
export class ExpenseForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private expenseService = inject(ExpenseService);

  categories: ExpenseCategory[] = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

  isEdit = signal(false);
  private editingId: string | null = null;

  form = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    date: ['', [Validators.required, this.noFutureDate]],
    note: ['', [Validators.maxLength(200)]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = idParam;
      this.isEdit.set(true);
      this.editingId = id;
      this.expenseService.getExpenseById(id).subscribe(exp => {
        this.form.patchValue({
          amount: exp.amount,
          category: exp.category,
          date: exp.date,
          note: exp.note ?? '',
        });
      });
    }
  }

  private noFutureDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const today = new Date().toISOString().split('T')[0];
    return control.value > today ? { futureDate: true } : null;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    const payload = {
      amount: Number(value.amount),
      category: value.category as ExpenseCategory,
      date: value.date as string,
      note: value.note ?? '',
    };

    if (this.isEdit() && this.editingId !== null) {
      this.expenseService.updateExpense(this.editingId, payload).subscribe(() => {
        this.router.navigate(['/expenses']);
      });
    } else {
      this.expenseService.addExpense(payload).subscribe(() => {
        this.router.navigate(['/expenses']);
      });
    }
  }
}