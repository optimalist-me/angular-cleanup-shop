import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedFooter } from './footer';

describe('SharedFooter', () => {
  let component: SharedFooter;
  let fixture: ComponentFixture<SharedFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFooter],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render governance positioning text', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Governance-first stabilization');
  });
});
