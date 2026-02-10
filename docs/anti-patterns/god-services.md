## God Services

### What it looks like
- One service owns unrelated responsibilities
- Acts as a global mutable state container
- Injected across many features and UI components

### Why it hurts
- Hidden coupling between features
- Hard to test because state leaks between tests
- Changes cause unpredictable regressions

### Typical symptoms
- Service exposes many unrelated methods
- Multiple components mutate the same state
- Service grows without clear ownership

### Fixes that work
- Split by responsibility (feature, data-access, util)
- Use facades for bounded feature state
- Keep service APIs small and explicit

### Example refactor

Before (single god service):

```ts
@Injectable({ providedIn: 'root' })
export class AppStateService {
	jobs = signal<CleaningJob[]>([]);
	selectedJobId = signal<string | null>(null);

	loadJobs() {
		return this.http.get<CleaningJob[]>('/api/cleaning-jobs');
	}

	selectJob(id: string) {
		this.selectedJobId.set(id);
	}
}
```

After (split by responsibility):

```ts
@Injectable({ providedIn: 'root' })
export class CleaningJobsApi {
	private readonly http = inject(HttpClient);

	getJobs() {
		return this.http.get<CleaningJob[]>('/api/cleaning-jobs');
	}
}
```

```ts
@Injectable({ providedIn: 'root' })
export class CleaningJobsFacade {
	private readonly jobs = signal<CleaningJob[]>([]);
	readonly selectedJobId = signal<string | null>(null);

	setJobs(jobs: CleaningJob[]) {
		this.jobs.set(jobs);
	}

	selectJob(id: string) {
		this.selectedJobId.set(id);
	}
}
```

### Detection checklist
If most answers are **yes**, you have a god service:
- Does the service touch multiple domains?
- Is it injected in many unrelated components?
- Does it own both data fetching and UI state?
- Is it hard to test without elaborate setup?

### Migration steps
1. Identify one responsibility and extract it to a new service
2. Update one feature to use the new service
3. Repeat until the original service shrinks to a clear focus
