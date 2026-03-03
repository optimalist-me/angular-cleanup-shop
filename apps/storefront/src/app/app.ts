import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedHeader } from '@cleanup/shared-ui-header';
import { SharedFooter } from '@cleanup/shared-ui-footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedHeader, SharedFooter],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
