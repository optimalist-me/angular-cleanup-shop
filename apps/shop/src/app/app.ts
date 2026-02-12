import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartRepository } from '@cleanup/data-access-cart';
import { SharedFooter } from '@cleanup/shared-ui-footer';
import { SharedHeader } from '@cleanup/shared-ui-header';

@Component({
  imports: [RouterOutlet, SharedHeader, SharedFooter],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly cartRepository = inject(CartRepository);
  readonly cartCount = this.cartRepository.itemCount;
}
