import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render header and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('shared-header')).toBeTruthy();
    expect(compiled.querySelector('shared-footer')).toBeTruthy();
  });

  it('should allow toggling the header menu', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('shared-header header');
    const toggle = compiled.querySelector(
      'shared-header .header__toggle',
    ) as HTMLButtonElement;
    const overlay = compiled.querySelector(
      'shared-header .header__overlay',
    ) as HTMLDivElement;

    toggle.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(true);

    overlay.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(false);
  });

  it('should expose the app title', () => {
    const fixture = TestBed.createComponent(App);
    const instance = fixture.componentInstance as unknown as {
      title: string;
    };
    expect(instance.title).toBe('Angular Cleanup Shop');
  });
});
