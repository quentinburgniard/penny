import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'penny-root',
  imports: [RouterOutlet, MatToolbarModule],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('penny');
}
