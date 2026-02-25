import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';

@Component({
  selector: 'marketing-section',
  imports: [SharedDesignText],
  templateUrl: './section.html',
  styleUrl: './section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingSection {
  readonly eyebrow = input<string | null>(null);
  readonly title = input<string | null>(null);
  readonly subtitle = input<string | null>(null);
  readonly align = input<'left' | 'center'>('left');
  readonly tone = input<'plain' | 'muted'>('plain');
  readonly size = input<'standard' | 'compact'>('standard');
  readonly sectionElement = viewChild<ElementRef<HTMLElement>>('sectionRoot');
  readonly isRevealPending = computed(() => this.revealState() === 'pending');
  readonly isRevealRevealed = computed(() => this.revealState() === 'revealed');

  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly revealState = signal<'pending' | 'revealed'>('revealed');

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    afterNextRender(() => this.setupRevealObserver());
  }

  private setupRevealObserver(): void {
    if (
      this.prefersReducedMotion() ||
      typeof IntersectionObserver === 'undefined'
    ) {
      this.revealState.set('revealed');
      return;
    }

    const sectionHost = this.sectionElement()?.nativeElement;
    if (!sectionHost) {
      this.revealState.set('revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.revealState.set('revealed');
          observer.disconnect();
          return;
        }

        this.revealState.set('pending');
      },
      {
        root: null,
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    observer.observe(sectionHost);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private prefersReducedMotion(): boolean {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return false;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
