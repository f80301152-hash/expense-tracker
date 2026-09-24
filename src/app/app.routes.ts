import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then(m => m.Home),
  },
  {
    path: 'add',
    loadComponent: () => import('./components/expense-form/expense-form').then(m => m.ExpenseForm),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/expense-form/expense-form').then(m => m.ExpenseForm),
  },
  {
    path: 'expenses',
    loadComponent: () => import('./components/expense-list/expense-list').then(m => m.ExpenseList),
  },
  {
    path: 'chat',
    loadComponent: () => import('./components/chatbot/chatbot').then(m => m.Chatbot),
  },
  { path: '**', redirectTo: '' },
];