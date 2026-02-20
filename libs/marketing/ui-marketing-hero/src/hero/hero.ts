import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';

@Component({
  selector: 'marketing-hero',
  imports: [RouterLink, SharedDesignText],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingHero {}
