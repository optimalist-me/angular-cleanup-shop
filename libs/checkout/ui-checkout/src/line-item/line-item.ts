import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';

@Component({
  selector: 'checkout-line-item',
  imports: [CurrencyPipe, NgOptimizedImage, SharedDesignText],
  templateUrl: './line-item.html',
  styleUrl: './line-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutLineItem {
  readonly id = input.required<string>();
  readonly name = input.required<string>();
  readonly imageSrc = input.required<string>();
  readonly imageAlt = input.required<string>();
  readonly price = input.required<number>();
  readonly quantity = input.required<number>();

  readonly quantityChange = output<number>();
  readonly remove = output<void>();

  increase(): void {
    this.quantityChange.emit(this.quantity() + 1);
  }

  decrease(): void {
    this.quantityChange.emit(Math.max(0, this.quantity() - 1));
  }

  removeItem(): void {
    this.remove.emit();
  }
}
