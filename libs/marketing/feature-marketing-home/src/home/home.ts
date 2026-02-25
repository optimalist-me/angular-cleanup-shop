import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SharedDesignSurface } from '@cleanup/shared-ui-design-surface';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { MarketingHero } from '@cleanup/ui-marketing-hero';
import { MarketingSection } from '@cleanup/ui-marketing-section';

@Component({
  selector: 'marketing-home',
  imports: [
    MarketingHero,
    MarketingSection,
    RouterLink,
    SharedDesignSurface,
    SharedDesignText,
    NgOptimizedImage,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingHome {}
