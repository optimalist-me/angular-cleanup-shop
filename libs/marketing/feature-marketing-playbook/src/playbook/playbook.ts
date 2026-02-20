import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedDesignSurface } from '@cleanup/shared-ui-design-surface';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { MarketingSection } from '@cleanup/ui-marketing-section';

@Component({
  selector: 'marketing-playbook',
  imports: [
    MarketingSection,
    RouterLink,
    SharedDesignSurface,
    SharedDesignText,
  ],
  templateUrl: './playbook.html',
  styleUrl: './playbook.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingPlaybook {}
