import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { privacyRoutes } from '../lib.routes';
import { PrivacyPrivacy } from './privacy';

describe('PrivacyPrivacy', () => {
  let component: PrivacyPrivacy;
  let fixture: ComponentFixture<PrivacyPrivacy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPrivacy],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPrivacy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders GDPR policy details and controller contacts', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Last updated: February 23, 2026');
    expect(element.textContent).toContain('Angular Cleanup Shop');
    expect(element.textContent).toContain('support@angularcleanup.shop');
    expect(element.textContent).toContain('bookings@angularcleanup.shop');
    expect(element.textContent).toContain('maximum of twelve (12) months');
  });

  it('exports /privacy feature route', async () => {
    expect(privacyRoutes).toHaveLength(1);
    expect(privacyRoutes[0]?.path).toBe('');

    const loaded = await privacyRoutes[0]?.loadComponent?.();
    expect(loaded).toBe(PrivacyPrivacy);
  });

  it('navigates back when goBack is called', () => {
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {
      // no-op
    });

    component.goBack();

    expect(backSpy).toHaveBeenCalled();
    backSpy.mockRestore();
  });
});
