import { TestBed } from '@angular/core/testing';
import { DESIGN_THEMING_OPTIONS } from './theme-options';

describe('theme options', () => {
  it('should provide default theming options from token factory', () => {
    TestBed.configureTestingModule({});

    const options = TestBed.inject(DESIGN_THEMING_OPTIONS);
    expect(options.defaultTheme).toBe('light');
    expect(options.storageKey).toBe('cleanup-shop-theme');
  });
});
