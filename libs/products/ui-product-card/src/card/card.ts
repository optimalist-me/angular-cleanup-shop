import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { ProductTag } from '@cleanup/ui-product-tag';

@Component({
  selector: 'products-card',
  imports: [NgOptimizedImage, ProductTag, SharedDesignText],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly name = input.required<string>();
  readonly imageSrc = input.required<string>();
  readonly imageAlt = input.required<string>();
  readonly shortDescription = input<string | null>(null);
  readonly outcome = input<string | null>(null);
  readonly pattern = input<string | null>(null);
  readonly tag = input<string | null>(null);
  readonly ctaLabel = input('View details');
  readonly ctaHref = input<string | null>(null);

  readonly hasDetails = computed(() =>
    Boolean(this.outcome() || this.pattern()),
  );
}
