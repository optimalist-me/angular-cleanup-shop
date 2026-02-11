import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'marketing-section',
  imports: [],
  templateUrl: './section.html',
  styleUrl: './section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingSection {
  readonly eyebrow = input<string | null>(null);
  readonly title = input<string | null>(null);
  readonly subtitle = input<string | null>(null);
  readonly align = input<'left' | 'center'>('left');
  readonly tone = input<'plain' | 'muted'>('plain');
  readonly size = input<'standard' | 'compact'>('standard');
}
