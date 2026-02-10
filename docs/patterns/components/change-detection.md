## Change Detection

### Modern Angular (14+)
**Default change detection** is acceptable for most app-level screens. Use it when:
- The component is a feature shell
- The component wires services, routing, or orchestration
- You do not pass many inputs down the tree

**OnPush** is preferred for reusable UI. Use it when:
- The component is presentational
- Inputs are immutable or replaced as a whole
- You want predictable render behavior and easier testing

Example (feature shell with default CD):

```ts
import { Component } from '@angular/core';

@Component({
	selector: 'app-orders-page',
	template: `<app-orders-list />`,
})
export class OrdersPageComponent {}
```

Example (reusable UI with OnPush):

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-orders-list',
	template: `
		<ul>
			@for (order of orders(); track order.id) {
				<li>{{ order.title }}</li>
			}
		</ul>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListComponent {
	readonly orders = input<{ id: string; title: string }[]>([]);
}
```

### When to switch to OnPush
- The component is reused in multiple places
- It receives inputs rather than owning state
- It renders lists or large view trees
- It is pure: output is a direct function of inputs
- You want predictable render behavior in tests

### Latest Angular (v21)
Signals reduce unnecessary re-renders by default, but they do not replace change detection strategy choices.

Recommendations:
- Keep **OnPush** for UI components and shared widgets
- Default CD is fine for feature shells and pages
- Use signals for local state and derived values to avoid manual subscriptions

Example (signals with OnPush):

```ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
	selector: 'app-order-counter',
	template: `{{ label() }}`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCounterComponent {
	readonly orders = signal<{ id: string }[]>([]);
	readonly label = computed(() => `${this.orders().length} orders`);
}
```
