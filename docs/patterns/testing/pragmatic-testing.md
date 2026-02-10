## Pragmatic Testing

### Intent
Test what matters most with the least maintenance burden. Prefer tests that catch regressions quickly without slowing development.

### Focus on
- Business logic (pure functions, state transitions)
- Critical UI paths (top user journeys)
- Integration boundaries (API contracts, data mapping)

### Prefer this mix
- Unit tests for logic and utilities
- Component tests for reusable UI and state wiring
- A small set of E2E tests for critical flows

### Test pyramid vs test trophy (short)
Use the pyramid to keep the base fast and stable, but follow the trophy for UI apps:
- Lots of unit tests
- Some integration/component tests
- Few E2E tests

### Examples (Angular)

Unit test for pure logic:

```ts
import { formatJobTitle } from './format-job-title';

it('formats titles', () => {
	expect(formatJobTitle('  Kitchen  ')).toBe('Kitchen');
});
```

Component test for wiring:

```ts
it('renders job titles', () => {
	const fixture = TestBed.createComponent(CleaningListComponent);
	fixture.componentInstance.jobs.set([
		{ id: '1', title: 'Kitchen' },
	]);
	fixture.detectChanges();
	expect(fixture.nativeElement.textContent).toContain('Kitchen');
});
```

Small E2E for a critical flow:

```ts
test('book a cleaning', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Book now' }).click();
	await page.getByRole('heading', { name: 'Confirm booking' }).isVisible();
});
```

### Decision checklist
If most answers are **yes**, add a test:
- Is this logic hard to reason about or easy to break?
- Would a regression be costly for users?
- Is the behavior used in multiple places?

If most answers are **yes**, skip the test:
- Is this just a framework or library detail?
- Is the code trivial and unlikely to change?
- Would the test be more brittle than the code?

### Anti-patterns to avoid
- Snapshot-heavy tests for dynamic UI
- E2E tests for every edge case
- Unit tests that mock everything in sight
