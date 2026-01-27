import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { VERSION } from './version';

@Component({
  selector: 'penny-root',
  imports: [RouterOutlet, MatToolbarModule],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('penny');
  protected readonly version = VERSION;
}
