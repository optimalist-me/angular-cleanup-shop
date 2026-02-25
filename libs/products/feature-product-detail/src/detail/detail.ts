import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { map } from 'rxjs';
import { CartRepository } from '@cleanup/data-access-cart';
import { ProductsRepository } from '@cleanup/data-access-products';
import { SharedDesignButton } from '@cleanup/shared-ui-design-button';
import { SharedDesignSurface } from '@cleanup/shared-ui-design-surface';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { ProductTag } from '@cleanup/ui-product-tag';

@Component({
  selector: 'products-detail',
  imports: [
    CurrencyPipe,
    NgOptimizedImage,
    ProductTag,
    RouterLink,
    SharedDesignButton,
    SharedDesignSurface,
    SharedDesignText,
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly cartRepository = inject(CartRepository);
  private readonly destroyRef = inject(DestroyRef);
  private readonly repository = inject(ProductsRepository);
  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly products = this.repository.all;
  readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug'))),
    { initialValue: null },
  );
  readonly cartToastMessage = signal<string | null>(null);

  readonly product = computed(() => {
    const slug = this.slug();

    if (!slug) {
      return null;
    }

    return this.products().find((item) => item.slug === slug) ?? null;
  });

  readonly tagLabel = computed(() => {
    const product = this.product();
    return product ? tagLabels[product.domainTag] : null;
  });

  readonly isLoading = computed(
    () => this.slug() !== null && this.products().length === 0,
  );
  readonly notFound = computed(
    () => this.slug() !== null && !this.isLoading() && !this.product(),
  );

  constructor() {
    this.destroyRef.onDestroy(() => this.clearToastTimer());
  }

  addToCart(): void {
    const product = this.product();
    if (!product) {
      return;
    }

    this.cartRepository.addItem({
      id: product.slug,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageSrc: product.imageSrc,
      imageAlt: product.imageAlt,
      quantity: 1,
    });

    this.showAddToCartToast(product.name);
  }

  private showAddToCartToast(productName: string): void {
    this.cartToastMessage.set(`${productName} added to cart.`);
    this.clearToastTimer();
    this.toastTimeoutId = setTimeout(() => {
      this.cartToastMessage.set(null);
      this.toastTimeoutId = null;
    }, 2200);
  }

  private clearToastTimer(): void {
    if (this.toastTimeoutId === null) {
      return;
    }

    clearTimeout(this.toastTimeoutId);
    this.toastTimeoutId = null;
  }
}

const tagLabels = {
  boundaries: 'Boundaries',
  state: 'State',
  rxjs: 'RxJS',
  components: 'Components',
  testing: 'Testing',
  upgrades: 'Upgrades',
  performance: 'Performance',
} as const;
