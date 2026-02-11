import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketingSection } from '@cleanup/ui-marketing-section';

@Component({
  selector: 'marketing-playbook',
  imports: [MarketingSection, RouterLink],
  templateUrl: './playbook.html',
  styleUrl: './playbook.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingPlaybook {}
