import { Routes } from '@angular/router';
import { EditExpense } from './edit-expense/edit-expense';
import { Expenses } from './expenses/expenses';
import { expenseResolver } from './expense.resolver';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'expenses', component: Expenses },
  { path: 'expenses/edit', component: EditExpense },
  { path: 'expenses/edit/:id', component: EditExpense, resolve: { expense: expenseResolver } },
];
