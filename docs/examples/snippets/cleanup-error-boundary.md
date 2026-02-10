## Cleanup Snippet: Error Boundary

### Intent
Capture unexpected errors in one place and show a safe fallback UI without sprinkling try/catch across components.

### When to use
- You need a consistent global fallback message
- You want to centralize error logging
- Feature-specific errors are already handled locally

### Snippet

```ts
import { ErrorHandler, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorStateService {
	readonly lastError = signal<string | null>(null);

	setError(message: string) {
		this.lastError.set(message);
	}

	clear() {
		this.lastError.set(null);
	}
}

@Injectable()
export class AppErrorHandler implements ErrorHandler {
	constructor(private readonly errors: ErrorStateService) {}

	handleError(error: unknown) {
		this.errors.setError('Something went wrong. Please try again.');
		console.error(error);
	}
}
```

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorStateService } from './error-state.service';

@Component({
	selector: 'app-error-banner',
	template: `
		@if (error(); as message) {
			<div role="alert">
				{{ message }}
				<button type="button" (click)="clear()">Dismiss</button>
			</div>
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorBannerComponent {
	private readonly errors = inject(ErrorStateService);
	readonly error = this.errors.lastError;

	clear() {
		this.errors.clear();
	}
}
```

### Notes
- Register `AppErrorHandler` in app config so errors flow into `ErrorStateService`.
- Keep UI fallback components small and presentational.
