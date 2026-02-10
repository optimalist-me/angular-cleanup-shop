## Template Complexity

### What it looks like
- Business logic embedded in templates
- Long chains of pipes and ternaries
- Multiple nested `@if`/`@for` blocks with logic

### Why it hurts
- Hard to test and reason about
- Performance issues from repeated computation
- UI changes require logic changes in templates

### Fixes that work
- Move logic to the component class (signals, computed)
- Extract reusable UI into smaller components
- Keep templates declarative and shallow

### Example refactor

Before (logic-heavy template):

```html
<p>{{ (jobs | async)?.filter(isActive).length > 0 ? 'Active' : 'Idle' }}</p>
<ul>
	<li *ngFor="let job of (jobs | async)?.sort(sortByDate)">
		{{ job.title }} - {{ job.scheduledAt | date:'short' }}
	</li>
</ul>
```

After (logic moved to class):

```ts
readonly jobs = toSignal(this.api.getJobs(), { initialValue: [] });
readonly activeCount = computed(() => this.jobs().filter(this.isActive).length);
readonly sortedJobs = computed(() => [...this.jobs()].sort(this.sortByDate));
readonly statusLabel = computed(() => (this.activeCount() > 0 ? 'Active' : 'Idle'));
```

```html
<p>{{ statusLabel() }}</p>
<ul>
	@for (job of sortedJobs(); track job.id) {
		<li>{{ job.title }} - {{ job.scheduledAt }}</li>
	}
</ul>
```

### Detection checklist
If most answers are **yes**, the template is too complex:
- Does it contain business logic or filtering?
- Are there multiple nested branches?
- Would unit tests need to parse the template to validate behavior?

### Note on pipes vs computed
- Use pipes for simple, pure formatting (date, currency, casing)
- Use `computed` for business rules, filtering, and sorting
