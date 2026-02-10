## Boundaries & Dependencies

### Intent
Keep dependencies predictable so teams can change code without surprise breakage or hidden coupling.

### Direction rules (always one-way)
- **feature -> data-access -> util**
- **ui -> util** (never `ui -> data-access`)
- **shared** is small, stable, and explicit (never a dumping ground)

### What each layer owns
**feature**
- Screens, routes, smart components
- Orchestrates state and calls data-access

**data-access**
- API clients, DTO mapping, query/caching
- No UI or component imports

**ui**
- Presentational components only
- Inputs/outputs, no HTTP, no stateful orchestration

**util**
- Pure functions and small helpers
- No Angular runtime dependencies

### Example (Angular)

Folder layout:

```
libs/
	cleaning/
		feature-cleaning-jobs/
		data-access-cleaning/
		ui-cleaning-list/
		util-cleaning-format/
```

Valid usage (feature -> data-access + ui + util):

Util (pure helper):

```ts
export function formatJobTitle(title: string) {
	return title.trim().replace(/\s+/g, ' ');
}
```

Data-access (owns API calls and mapping):

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { formatJobTitle } from '@cleaning/util-cleaning-format';

export type CleaningJobDto = {
	id: string;
	title: string;
	scheduledAt: string;
};

@Injectable({ providedIn: 'root' })
export class CleaningJobsApi {
	private readonly http = inject(HttpClient);

	getJobsSignal() {
		return toSignal(
			this.http
				.get<CleaningJobDto[]>('/api/cleaning-jobs')
				.pipe(map((jobs) => jobs.map((job) => ({ ...job, title: formatJobTitle(job.title) })))),
			{ initialValue: [] }
		);
	}
}
```

UI (presentational only):

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type CleaningJobView = {
	id: string;
	title: string;
};

@Component({
	selector: 'app-cleaning-list',
	template: `
		<ul>
			@for (job of jobs(); track job.id) {
				<li>{{ job.title }}</li>
			}
		</ul>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningListComponent {
	readonly jobs = input<CleaningJobView[]>([]);
}
```

Feature (orchestrates, wires UI to data-access):

```ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CleaningJobsApi } from '@cleaning/data-access-cleaning';
import { CleaningListComponent } from '@cleaning/ui-cleaning-list';
import { formatJobTitle } from '@cleaning/util-cleaning-format';

@Component({
	selector: 'app-cleaning-jobs',
	template: `
		<app-cleaning-list
			[jobs]="jobs()"
			[formatTitle]="formatTitle"
		/>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CleaningListComponent],
})
export class CleaningJobsComponent {
	private readonly api = inject(CleaningJobsApi);
	readonly jobs = this.api.getJobsSignal();
}
```

Invalid usage (ui -> data-access):

```ts
import { CleaningJobsApi } from '@cleaning/data-access-cleaning'; // Not allowed in UI
```

Invalid usage (data-access -> ui):

```ts
import { CleaningListComponent } from '@cleaning/ui-cleaning-list'; // Not allowed in data-access
```

### Enforcement hints
- UI libs should only import from `util` or other UI libs
- Data-access libs never import from feature or UI libs
- If a shared lib grows, split it by responsibility
