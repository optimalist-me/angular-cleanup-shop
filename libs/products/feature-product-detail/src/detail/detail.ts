import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { map } from 'rxjs';
import { ProductsRepository } from '@cleanup/data-access-products';
import { ProductTag } from '@cleanup/ui-product-tag';

@Component({
  selector: 'products-detail',
  imports: [NgOptimizedImage, ProductTag, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(ProductsRepository);

  readonly products = this.repository.all;
  readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug'))),
    { initialValue: null },
  );

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
