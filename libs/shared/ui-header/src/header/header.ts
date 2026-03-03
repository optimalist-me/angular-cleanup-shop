import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { filter } from 'rxjs';
import { SHARED_HEADER_CONFIG, type SharedHeaderLink } from './header.config';

@Component({
  selector: 'shared-header',
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, SharedDesignText],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedHeader {
  readonly menuOpen = signal(false);
  readonly config = inject(SHARED_HEADER_CONFIG);
  private readonly router = inject(Router);
  private readonly closeOnNavigation = this.router.events
    .pipe(filter((event) => event.constructor.name === 'NavigationEnd'))
    .subscribe(() => this.closeMenu());

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  trackByLink(_index: number, link: SharedHeaderLink): string {
    return link.kind === 'internal'
      ? `internal:${link.route}`
      : `external:${link.href}`;
  }
}
