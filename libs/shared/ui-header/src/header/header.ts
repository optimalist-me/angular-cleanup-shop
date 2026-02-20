import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroShoppingCart } from '@ng-icons/heroicons/outline';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { filter } from 'rxjs';

@Component({
  selector: 'shared-header',
  imports: [
    NgOptimizedImage,
    NgIconComponent,
    RouterLink,
    RouterLinkActive,
    SharedDesignText,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ heroShoppingCart })],
})
export class SharedHeader {
  readonly cartCount = input(0);
  readonly hasCartItems = computed(() => this.cartCount() > 0);
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
