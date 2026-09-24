import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Expense } from '../models/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/expenses';

  private _expenses = signal<Expense[]>([]);
  readonly expenses = this._expenses.asReadonly();

  loadExpenses(): void {
    this.http.get<Expense[]>(this.apiUrl).subscribe(data => {
      this._expenses.set(data);
    });
  }

  getExpenseById(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  addExpense(expense: Omit<Expense, 'id'>): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense).pipe(
      tap(() => this.loadExpenses())
    );
  }

  updateExpense(id: string, expense: Omit<Expense, 'id'>): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expense).pipe(
      tap(() => this.loadExpenses())
    );
  }

  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadExpenses())
    );
  }
}