import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsApi } from '../api/products.api';

@Injectable({
  providedIn: 'root',
})
export class ProductsRepository {
  private readonly api = inject(ProductsApi);
  private readonly products = toSignal(this.api.getAll(), { initialValue: [] });

  readonly all = computed(() => this.products());

  getBySlug(slug: string) {
    return computed(
      () => this.products().find((product) => product.slug === slug) ?? null,
    );
  }
}
