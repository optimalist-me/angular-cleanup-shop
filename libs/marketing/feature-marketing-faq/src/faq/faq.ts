import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketingSection } from '@cleanup/ui-marketing-section';

@Component({
  selector: 'marketing-faq',
  imports: [MarketingSection, RouterLink],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingFaq {}
