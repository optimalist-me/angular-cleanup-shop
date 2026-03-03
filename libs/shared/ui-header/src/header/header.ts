import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { filter } from 'rxjs';

@Component({
  selector: 'shared-header',
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, SharedDesignText],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedHeader {
  readonly menuOpen = signal(false);
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
}
