import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartRepository } from '@cleanup/data-access-cart';
import { SharedDesignButton } from '@cleanup/shared-ui-design-button';
import { SharedDesignSurface } from '@cleanup/shared-ui-design-surface';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { CartLineItem } from '@cleanup/ui-cart-line-item';
import { CartSummary } from '@cleanup/ui-cart-summary';

@Component({
  selector: 'cart-cart',
  imports: [
    CartLineItem,
    CartSummary,
    RouterLink,
    SharedDesignButton,
    SharedDesignSurface,
    SharedDesignText,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartCart {
  private readonly repository = inject(CartRepository);
  private readonly router = inject(Router);

  readonly items = this.repository.items;
  readonly itemCount = this.repository.itemCount;
  readonly subtotal = this.repository.subtotal;
  readonly hasItems = computed(() => this.items().length > 0);

  updateQuantity(id: string, quantity: number): void {
    this.repository.updateQuantity(id, quantity);
  }

  removeItem(id: string): void {
    this.repository.removeItem(id);
  }

  emptyCart(): void {
    this.repository.clear();
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
