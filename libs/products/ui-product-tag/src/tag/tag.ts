import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';

@Component({
  selector: 'products-tag',
  imports: [SharedDesignText],
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
  readonly textTone = computed(() => {
    const tone = this.tone();
    if (tone === 'accent') {
      return 'accent';
    }
    if (tone === 'muted') {
      return 'muted';
    }
    return 'default';
  });
}
