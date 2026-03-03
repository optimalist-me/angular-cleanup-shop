import { Component } from '@angular/core';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { SharedHeader } from './header';

@Component({
  selector: 'shared-header-dummy',
  template: '',
})
class DummyRouteComponent {}

describe('SharedHeader', () => {
  let component: SharedHeader;
  let fixture: ComponentFixture<SharedHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedHeader],
      providers: [
        provideRouter([
          { path: 'for-managers', component: DummyRouteComponent },
          { path: 'for-technical-leads', component: DummyRouteComponent },
          { path: 'how-it-works', component: DummyRouteComponent },
          { path: 'ai-governance', component: DummyRouteComponent },
          { path: 'book/confirmed', component: DummyRouteComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should toggle the mobile menu', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    const toggle = compiled.querySelector(
      '.header__toggle',
    ) as HTMLButtonElement;

    expect(header?.classList.contains('header--open')).toBe(false);
    toggle.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(true);
  });

  it('should close the menu when overlay is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    const toggle = compiled.querySelector(
      '.header__toggle',
    ) as HTMLButtonElement;
    const overlay = compiled.querySelector(
      '.header__overlay',
    ) as HTMLButtonElement;

    toggle.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(true);

    overlay.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(false);
  });

  it('should render governance navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('For Managers');
    expect(compiled.textContent).toContain('For Technical Leads');
    expect(compiled.textContent).toContain('Engagement Model');
    expect(compiled.textContent).toContain('AI Governance');
  });

  it('should close the menu when a link is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    const toggle = compiled.querySelector(
      '.header__toggle',
    ) as HTMLButtonElement;
    const managersLink = compiled.querySelector(
      'a[routerLink="/for-managers"]',
    ) as HTMLAnchorElement;

    toggle.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(true);

    managersLink.click();
    fixture.detectChanges();
    expect(header?.classList.contains('header--open')).toBe(false);
  });

  it('should close the menu on navigation end', () => {
    const events$ = new Subject<NavigationEnd>();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { events: events$ } }],
    });

    const navigationHeader = TestBed.runInInjectionContext(
      () => new SharedHeader(),
    );
    navigationHeader.toggleMenu();
    expect(navigationHeader.menuOpen()).toBe(true);

    events$.next(new NavigationEnd(1, '/', '/'));
    expect(navigationHeader.menuOpen()).toBe(false);
  });
});
