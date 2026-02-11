import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketingSection } from '@cleanup/ui-marketing-section';

@Component({
  selector: 'marketing-architecture',
  imports: [MarketingSection, RouterLink],
  templateUrl: './architecture.html',
  styleUrl: './architecture.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingArchitecture {}
