import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedFooter } from '@cleanup/shared-ui-footer';
import { SharedHeader } from '@cleanup/shared-ui-header';

@Component({
  imports: [RouterOutlet, SharedHeader, SharedFooter],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'Angular Cleanup Shop';
}
