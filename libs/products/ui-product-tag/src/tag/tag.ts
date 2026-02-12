import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'products-tag',
  imports: [],
  templateUrl: './tag.html',
  styleUrl: './tag.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTag {
  readonly label = input.required<string>();
  readonly tone = input<'neutral' | 'accent' | 'muted'>('neutral');
  readonly size = input<'sm' | 'md'>('sm');
  readonly ariaLabel = input<string | null>(null);

  readonly ariaValue = computed(() => this.ariaLabel() ?? this.label());
}
