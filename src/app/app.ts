import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditExpense } from './edit-expense/edit-expense';

@Component({
  selector: 'penny-root',
  imports: [RouterOutlet, EditExpense],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('penny');
}
