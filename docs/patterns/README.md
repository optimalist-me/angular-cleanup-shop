## Patterns Index

### Architecture
- [API layering](architecture/api-layering.md) - Keep UI talking to a stable contract.
- [Boundaries and deps](architecture/boundaries-and-deps.md) - Enforce one-way dependencies.
- [Folder structure](architecture/folder-structure.md) - Organize libs by domain and type.

### Components
- [Change detection](components/change-detection.md) - When to use default vs OnPush.
- [Component decomposition](components/component-decomposition.md) - Split orchestration from UI.
- [Smart vs dumb](components/smart-vs-dumb.md) - Define container vs presentational roles.

### RxJS
- [Common operator patterns](rxjs/common-operator-patterns.md) - Choose the right mapping operator.
- [Error handling](rxjs/error-handling.md) - Handle errors at clear boundaries.
- [Subscription hygiene](rxjs/subscription-hygiene.md) - Avoid leaks and manual subscriptions.

### State
- [Local state vs store](state/local-state-vs-store.md) - Keep state scoped unless shared.
- [NgRx: when and when not](state/ngrx-when-and-when-not.md) - Use NgRx only when justified.
- [Signals guidelines](state/signals-guidelines.md) - Use signals as default state.

### Testing
- [Flaky tests](testing/flaky-tests.md) - Causes and fixes for instability.
- [Pragmatic testing](testing/pragmatic-testing.md) - Focus on high-value tests.
