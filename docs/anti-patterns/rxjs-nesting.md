## RxJS Nesting

### What it looks like
- `subscribe` inside another `subscribe`
- Manual lifecycle management for each nested stream
- Side effects scattered across callbacks

### Why it hurts
- Hard to reason about flow and error handling
- Unsubscribing becomes error-prone
- Inconsistent error and loading states

### Fixes that work
- Use higher-order mapping (`switchMap`, `concatMap`, `exhaustMap`)
- Keep error handling at boundaries
- Return composed streams from services

### Example refactor

Before (nested subscriptions):

```ts
this.route.params.subscribe((params) => {
	this.api.getJob(params['id']).subscribe((job) => {
		this.selectedJob.set(job);
	});
});
```

After (composition):

```ts
this.selectedJob = toSignal(
	this.route.params.pipe(
		switchMap((params) => this.api.getJob(params['id']))
	),
	{ initialValue: null }
);
```

### Detection checklist
If most answers are **yes**, you are nesting:
- Do you have more than one `subscribe` in a method?
- Do you need multiple `unsubscribe` paths?
- Is error handling duplicated across callbacks?
