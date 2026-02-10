## RxJS Error Handling

### Intent
Keep streams predictable by handling errors where they cross a boundary and by making errors explicit in the UI.

### Rules
- Handle errors at boundaries (data-access, feature orchestration)
- Map errors to domain-friendly shapes
- Never swallow errors silently

### Patterns that work
**Boundary handling (data-access)**
- Convert transport errors to a small, typed shape
- Keep the stream alive when the UI expects multiple emissions

**UI handling (feature)**
- Expose error signals or observable states
- Render error states explicitly

### Example (Angular)

Data-access (map transport errors):

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export type CleaningJobsError = {
	message: string;
	code: 'network' | 'server' | 'unknown';
};

export type CleaningJobsResult =
	| { kind: 'ok'; data: { id: string; title: string }[] }
	| { kind: 'error'; error: CleaningJobsError };

@Injectable({ providedIn: 'root' })
export class CleaningJobsApi {
	private readonly http = inject(HttpClient);

	getJobs() {
		return this.http.get<{ id: string; title: string }[]>('/api/cleaning-jobs').pipe(
			catchError(() =>
				of({
					kind: 'error',
					error: { message: 'Could not load jobs', code: 'network' },
				} satisfies CleaningJobsResult)
			),
			// Normalize success into the same shape
			map((data) =>
				'kind' in data ? data : ({ kind: 'ok', data } satisfies CleaningJobsResult)
			)
		);
	}
}
```

Feature (expose error state):

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CleaningJobsApi } from './cleaning-jobs.api';

@Component({
	selector: 'app-cleaning-jobs',
	template: `
		@if (result(); as result) {
			@if (result.kind === 'error') {
				<p>{{ result.error.message }}</p>
			} @else {
				<ul>
					@for (job of result.data; track job.id) {
						<li>{{ job.title }}</li>
					}
				</ul>
			}
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningJobsComponent {
	private readonly api = inject(CleaningJobsApi);
	readonly result = toSignal(this.api.getJobs(), {
		initialValue: { kind: 'ok', data: [] },
	});
}
```

### Anti-patterns to avoid
- `catchError(() => EMPTY)` at data boundaries
- Logging and suppressing without surfacing to UI
- Throwing inside `subscribe` callbacks

### Decision checklist
If most answers are **yes**, handle the error at the boundary (data-access):
- Is this a transport or infrastructure failure?
- Do multiple consumers need the same error shape?
- Would retry or fallback be centralized here?

If most answers are **yes**, handle the error at the feature:
- Is the UI response specific to this screen?
- Is the recovery path tied to local UI state?
- Do you need to show contextual copy or actions?

### Centralize with HttpInterceptors
Use an interceptor for cross-cutting concerns like logging, auth refresh, or global error normalization. Keep it small and focused.

Good fits:
- Attach or refresh auth tokens
- Normalize transport errors into a shared shape
- Send telemetry for failed requests

Not a fit:
- Feature-specific error copy
- UI decisions or retry flows

Example (normalize transport errors):

```ts
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export type ApiError = {
	message: string;
	code: 'network' | 'server' | 'unknown';
};

function toApiError(error: HttpErrorResponse): ApiError {
	if (error.status === 0) {
		return { message: 'Network error', code: 'network' };
	}
	if (error.status >= 500) {
		return { message: 'Server error', code: 'server' };
	}
	return { message: 'Request failed', code: 'unknown' };
}

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
	intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => throwError(() => toApiError(error)))
		);
	}
}
```

Data-access (convert ApiError to feature-specific error):

```ts
import { ApiError } from './api-error.interceptor';
import { catchError, map, of } from 'rxjs';

type CleaningJobsError = {
	message: string;
	code: 'network' | 'server' | 'unknown';
};

type CleaningJobsResult =
	| { kind: 'ok'; data: { id: string; title: string }[] }
	| { kind: 'error'; error: CleaningJobsError };

function toCleaningJobsError(error: ApiError): CleaningJobsError {
	return {
		message: 'Could not load jobs',
		code: error.code,
	};
}

getJobs() {
	return this.http.get<{ id: string; title: string }[]>('/api/cleaning-jobs').pipe(
		map((data) => ({ kind: 'ok', data } satisfies CleaningJobsResult)),
		catchError((error: ApiError) =>
			of({ kind: 'error', error: toCleaningJobsError(error) } satisfies CleaningJobsResult)
		)
	);
}
```
