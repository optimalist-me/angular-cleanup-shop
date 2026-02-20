import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';

@Component({
  selector: 'checkout-summary',
  imports: [CurrencyPipe, SharedDesignText],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutSummary {
  readonly itemCount = input.required<number>();
  readonly subtotal = input.required<number>();
  readonly caption = input('Requested cleanup scope');

  readonly formattedItems = computed(
    () => `${this.itemCount()} item${this.itemCount() === 1 ? '' : 's'}`,
  );
}
