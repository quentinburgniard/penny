import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditExpense } from './edit-expense/edit-expense';
import { Expenses } from './expenses/expenses';

@Component({
  selector: 'penny-root',
  imports: [RouterOutlet, EditExpense, Expenses],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('penny');
}
