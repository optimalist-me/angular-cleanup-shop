import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'cart-summary',
  imports: [CurrencyPipe],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummary {
  readonly itemCount = input.required<number>();
  readonly subtotal = input.required<number>();
  readonly ctaLabel = input('Checkout');

  readonly checkout = output<void>();

  readonly formattedItems = computed(
    () => `${this.itemCount()} item${this.itemCount() === 1 ? '' : 's'}`,
  );

  submitCheckout(): void {
    this.checkout.emit();
  }
}
