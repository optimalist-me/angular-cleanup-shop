import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedDesignSurface } from '@cleanup/shared-ui-design-surface';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { MarketingSection } from '@cleanup/ui-marketing-section';

@Component({
  selector: 'marketing-architecture',
  imports: [
    MarketingSection,
    RouterLink,
    SharedDesignSurface,
    SharedDesignText,
  ],
  templateUrl: './architecture.html',
  styleUrl: './architecture.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingArchitecture {}
