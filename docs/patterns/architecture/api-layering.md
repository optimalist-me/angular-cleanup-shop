## API Layering

### Intent
Keep client code simple and stable by talking to one API shape, while allowing the backend to evolve without breaking the UI.

### Frontend rule
Frontend talks only to:
- **data-access APIs** (HTTP clients, SDKs, or typed endpoints)

Frontend never talks directly to:
- domain services
- repositories
- database endpoints
- internal microservice APIs

### Backend context (minimal)
The backend should expose a single, stable contract to the UI. Internal layers and data models should not leak into frontend code.

### Why this matters
- The UI has a single, stable contract
- The backend can change internals without UI rewrites
- Testing becomes simpler and faster
- Clear separation reduces accidental coupling

### Example flow
UI -> data-access API -> backend contract

### Angular-specific example
Data-access API (feature-agnostic):

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export type CleaningJobDto = {
	id: string;
	title: string;
	scheduledAt: string;
};

@Injectable({ providedIn: 'root' })
export class CleaningJobsApi {
	private readonly http = inject(HttpClient);

	getJobs() {
		return this.http.get<CleaningJobDto[]>('/api/cleaning-jobs');
	}
}
```

Feature component (talks only to data-access API):

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CleaningJobsApi } from './cleaning-jobs.api';

@Component({
	selector: 'app-cleaning-jobs',
	template: `
		@if (jobs(); as jobs) {
			<ul>
				@for (job of jobs; track job.id) {
					<li>{{ job.title }}</li>
				}
			</ul>
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningJobsComponent {
	private readonly api = inject(CleaningJobsApi);
	readonly jobs = toSignal(this.api.getJobs(), { initialValue: [] });
}
```

### Enforcement hints
- Data-access APIs are the only imports from UI code
- UI code never imports server types or shared domain models
- Use DTOs at the boundary, not backend entities
