import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingSection } from './section';

describe('MarketingSection', () => {
  const originalMatchMedia = window.matchMedia;
  const originalIntersectionObserver = window.IntersectionObserver;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingSection],
    }).compileComponents();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.IntersectionObserver = originalIntersectionObserver;
  });

  it('should render provided inputs', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
    fixture.componentRef.setInput('eyebrow', 'Section');
    fixture.componentRef.setInput('title', 'Section title');
    fixture.componentRef.setInput('subtitle', 'Section subtitle');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.section__eyebrow')?.textContent).toContain(
      'Section',
    );
    expect(compiled.querySelector('h2')?.textContent).toContain(
      'Section title',
    );
    expect(compiled.querySelector('.section__subtitle')?.textContent).toContain(
      'Section subtitle',
    );
  });

  it('should keep section revealed when reduced motion is preferred', async () => {
    window.matchMedia = createMatchMedia(true);

    const fixture = createFixture();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('.section');
    expect(section?.classList.contains('section--reveal-revealed')).toBe(true);
    expect(section?.classList.contains('section--reveal-pending')).toBe(false);
  });

  it('should reveal section after it intersects the viewport', async () => {
    window.matchMedia = createMatchMedia(false);

    let observerCallback: IntersectionObserverCallback | null = null;
    let observeCalls = 0;
    let disconnectCalls = 0;
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin = '0px';
      readonly thresholds = [0.16];

      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }

      observe(): void {
        observeCalls += 1;
      }

      unobserve(): void {
        return undefined;
      }

      disconnect(): void {
        disconnectCalls += 1;
      }

      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }

    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;

    const fixture = createFixture();
    await fixture.whenStable();

    fixture.detectChanges();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('.section') as HTMLElement;
    expect(section.classList.contains('section--reveal-revealed')).toBe(true);
    expect(observeCalls).toBe(1);

    const callback = observerCallback as
      | ((
          entries: IntersectionObserverEntry[],
          observer: IntersectionObserver,
        ) => void)
      | null;
    if (!callback) {
      throw new Error('IntersectionObserver callback was not registered');
    }

    callback([createEntry(section, false)], {} as IntersectionObserver);
    fixture.detectChanges();
    expect(section.classList.contains('section--reveal-pending')).toBe(true);

    callback([createEntry(section, true)], {} as IntersectionObserver);
    fixture.detectChanges();
    expect(section.classList.contains('section--reveal-revealed')).toBe(true);
    expect(section.classList.contains('section--reveal-pending')).toBe(false);
    expect(disconnectCalls).toBe(1);
  });
});

function createFixture(): ComponentFixture<MarketingSection> {
  return TestBed.createComponent(MarketingSection);
}

function createMatchMedia(prefersReducedMotion: boolean): Window['matchMedia'] {
  return ((query: string) =>
    ({
      matches:
        query === '(prefers-reduced-motion: reduce)'
          ? prefersReducedMotion
          : false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList) as Window['matchMedia'];
}

function createEntry(
  target: HTMLElement,
  isIntersecting: boolean,
): IntersectionObserverEntry {
  const rect = target.getBoundingClientRect();

  return {
    time: 0,
    target,
    rootBounds: null,
    boundingClientRect: rect,
    intersectionRect: rect,
    intersectionRatio: isIntersecting ? 1 : 0,
    isIntersecting,
  } as IntersectionObserverEntry;
}
