import { TestBed } from '@angular/core/testing';
import { provideDesignTheming } from './provide-design-theming';
import { DesignThemeService } from './theme.service';

describe('provideDesignTheming', () => {
  it('should initialize DesignThemeService through environment initializer', () => {
    const initializeSpy = vi
      .spyOn(DesignThemeService.prototype, 'initialize')
      .mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [
        provideDesignTheming({
          defaultTheme: 'dark',
          storageKey: 'cleanup-shop-theme',
        }),
      ],
    });

    TestBed.inject(DesignThemeService);
    expect(initializeSpy).toHaveBeenCalled();

    initializeSpy.mockRestore();
  });
});
