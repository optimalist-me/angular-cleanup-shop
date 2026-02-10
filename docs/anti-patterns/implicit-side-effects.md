## Implicit Side Effects

### What it looks like
- Side effects triggered during reads (`getters`, `computed`, template access)
- Side effects in constructors or property initializers
- Async work kicked off without an explicit user action or lifecycle

### Why it hurts
- Debugging becomes unpredictable
- Tests become brittle or order-dependent
- Side effects happen multiple times due to change detection

### Typical symptoms
- HTTP calls from getters
- `signal` reads that trigger writes
- Subscriptions started in constructors without teardown

### Fixes that work
- Make effects explicit with `effect` or event handlers
- Trigger async work from clear lifecycle points
- Separate reads from writes

### Example refactor

Before (hidden side effect):

```ts
get jobs() {
	this.api.refresh();
	return this.store.jobs();
}
```

After (explicit effect):

```ts
readonly jobs = this.store.jobs;

readonly refreshEffect = effect(() => {
	this.api.refresh();
});
```

Second example (signals):

Before (computed writes to state):

```ts
readonly total = computed(() => {
	const value = this.items().length;
	this.count.set(value);
	return value;
});
```

After (separate read and write):

```ts
readonly total = computed(() => this.items().length);

readonly syncCount = effect(() => {
	this.count.set(this.total());
});
```

### Detection checklist
If most answers are **yes**, you have implicit side effects:
- Does reading a value trigger a write or async work?
- Do constructors start subscriptions without teardown?
- Do templates indirectly trigger HTTP calls?
