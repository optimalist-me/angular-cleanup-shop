import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketingHero } from '@cleanup/ui-marketing-hero';
import { MarketingSection } from '@cleanup/ui-marketing-section';

@Component({
  selector: 'marketing-home',
  imports: [MarketingHero, MarketingSection, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingHome {}
