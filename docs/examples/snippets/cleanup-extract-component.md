## Cleanup Snippet: Extract Component

### Intent
Split a large template into a focused UI component to reduce complexity.

### When to use
- A template has more than one responsibility
- The same UI block appears in multiple places
- The container is doing both orchestration and rendering

### Before

```ts
import { Component } from '@angular/core';

@Component({
	selector: 'app-cleaning-dashboard',
	template: `
		<h3>Upcoming jobs</h3>
		<ul>
			@for (job of jobs(); track job.id) {
				<li>
					<span>{{ job.title }}</span>
					<button type="button" (click)="select(job.id)">View</button>
				</li>
			}
		</ul>
	`,
})
export class CleaningDashboardComponent {
	readonly jobs = this.store.jobs;

	select(id: string) {
		this.store.select(id);
	}
}
```

### After

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CleaningListComponent } from './cleaning-list.component';

@Component({
	selector: 'app-cleaning-dashboard',
	template: `
		<app-cleaning-list
			[jobs]="jobs()"
			(selectJob)="select($event)"
		/>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CleaningListComponent],
})
export class CleaningDashboardComponent {
	readonly jobs = this.store.jobs;

	select(id: string) {
		this.store.select(id);
	}
}
```

```ts
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
	selector: 'app-cleaning-list',
	template: `
		<h3>Upcoming jobs</h3>
		<ul>
			@for (job of jobs(); track job.id) {
				<li>
					<span>{{ job.title }}</span>
					<button type="button" (click)="selectJob.emit(job.id)">View</button>
				</li>
			}
		</ul>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningListComponent {
	readonly jobs = input<{ id: string; title: string }[]>([]);
	readonly selectJob = output<string>();
}
```
