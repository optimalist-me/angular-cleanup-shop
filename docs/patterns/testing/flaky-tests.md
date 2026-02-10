## Flaky Tests

### Intent
Make tests deterministic so failures signal real regressions, not timing or environment noise.

### Common causes
- Async timing assumptions (timeouts, intervals, uncontrolled promises)
- Shared state between tests (singletons, caches, global mocks)
- Over-mocking or partial mocks that drift from real behavior
- Clock/time dependencies (Date, timers, timezone)
- Non-deterministic data (random IDs, unordered collections)

### Fixes that work
- Use deterministic data and explicit ordering
- Control time with fake timers or injected clocks
- Reset shared state between tests
- Await all async work (no floating promises)
- Prefer integration-style tests over deep mocks

### Examples (Angular)
Async timing assumptions -> flush async:

```ts
it('renders jobs', fakeAsync(() => {
	fixture.detectChanges();
	tick();
	fixture.detectChanges();
	expect(fixture.nativeElement.textContent).toContain('Kitchen');
}));
```

Shared state -> reset between tests:

```ts
afterEach(() => {
	TestBed.resetTestingModule();
});
```

Over-mocking -> use a focused fake with real behavior:

```ts
const api = {
	getJobs: () => of([{ id: '1', title: 'Kitchen' }]),
};
```

Clock/time dependencies -> control time:

```ts
it('shows today', fakeAsync(() => {
	const now = new Date('2026-02-10T10:00:00Z');
	spyOn(Date, 'now').and.returnValue(now.getTime());
	fixture.detectChanges();
	// assert
}));
```

Non-deterministic data -> stable order:

```ts
const jobs = [
	{ id: '1', title: 'Kitchen' },
	{ id: '2', title: 'Bathroom' },
].sort((a, b) => a.id.localeCompare(b.id));
```

### Decision checklist
If most answers are **yes**, suspect flakiness:
- Does the test pass only when run alone?
- Does adding a delay change the result?
- Does it depend on time or randomness?
- Does it share state with other tests?

### CI-only flakes (common causes)
- Slower machines and headless rendering timing
- Parallel test workers sharing file system state
- Different locale/timezone defaults

Fix by:
- Avoiding time-based waits; use `fakeAsync`/`tick`
- Isolating file system side effects per test
- Setting explicit locale/timezone in test setup

### Anti-patterns to avoid
- `setTimeout` in tests without controlling time
- Global mocks that are never restored
- Tests that depend on implicit ordering
