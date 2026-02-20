import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  ProductsRepository,
  ProductDomainTag,
} from '@cleanup/data-access-products';
import { SharedDesignButton } from '@cleanup/shared-ui-design-button';
import { SharedDesignSurface } from '@cleanup/shared-ui-design-surface';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { ProductCard } from '@cleanup/ui-product-card';

@Component({
  selector: 'products-list',
  imports: [
    ProductCard,
    SharedDesignButton,
    SharedDesignSurface,
    SharedDesignText,
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsList {
  private readonly repository = inject(ProductsRepository);

  readonly products = this.repository.all;
  readonly selectedTag = signal<ProductDomainTag | null>(null);

  readonly filteredProducts = computed(() => {
    const tag = this.selectedTag();
    if (!tag) return this.products();
    return this.products().filter((product) => product.domainTag === tag);
  });

  readonly hasProducts = computed(() => this.filteredProducts().length > 0);

  readonly availableTags = computed(() => {
    const tags = new Set(this.products().map((p) => p.domainTag));
    return Array.from(tags).sort();
  });
  readonly tagLabels = tagLabels;

  selectTag(tag: ProductDomainTag | null): void {
    this.selectedTag.set(tag);
  }

  readonly productCards = computed(() =>
    this.filteredProducts().map((product) => ({
      ...product,
      tagLabel: tagLabels[product.domainTag],
      imageSrc: product.imageSrc,
      imageAlt: product.imageAlt,
      href: `/products/${product.slug}`,
    })),
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
