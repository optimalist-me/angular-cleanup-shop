import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedDesignSurface } from '@cleanup/shared-ui-design-surface';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { MarketingSection } from '@cleanup/ui-marketing-section';

@Component({
  selector: 'marketing-faq',
  imports: [
    MarketingSection,
    RouterLink,
    SharedDesignSurface,
    SharedDesignText,
  ],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingFaq {}
