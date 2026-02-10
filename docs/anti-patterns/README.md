## Anti-Patterns Index

- [Big components](big-components.md) - One component owns UI, state, and logic.
- [God services](god-services.md) - Global state containers with mixed responsibilities.
- [Implicit side effects](implicit-side-effects.md) - Hidden effects during reads or constructors.
- [RxJS nesting](rxjs-nesting.md) - Nested subscriptions instead of composition.
- [Template complexity](template-complexity.md) - Business logic embedded in templates.
- [Tight coupling to global state](tight-coupling-global-state.md) - Features wired directly to shared stores.
- [Leaky shared libs](leaky-shared-libs.md) - Shared libs that contain domain logic.
- [Weak types](weak-types.md) - `any` and loose DTOs leaking into the app.
- [Implicit shared mutable data](implicit-shared-mutable-data.md) - Shared references that mutate in place.
- [Service chains](service-chains.md) - Long service call chains with unclear ownership.
- [View logic in services](view-logic-in-services.md) - Formatting and UI decisions in services.
