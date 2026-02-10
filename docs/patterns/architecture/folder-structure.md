## Folder Structure

### Intent
Make ownership and dependency direction obvious at a glance. A predictable layout reduces onboarding time and prevents cross-layer leaks.

### Top-level layout
```
apps/
libs/
```

### Library naming rules
- **feature-***: smart components, routes, orchestration
- **data-access-***: API clients, DTO mapping, state adapters
- **ui-***: presentational components only
- **util-***: pure functions and helpers

### Example layout
```
apps/
  shop/
    src/
libs/
  cleaning/
    feature-cleaning-jobs/
    data-access-cleaning/
    ui-cleaning-list/
    util-cleaning-format/
```

### Domain-based libraries (DDD note)
Domain-driven design (DDD) organizes software around business domains and bounded contexts. It is most useful when:
- The domain is complex and evolving
- Multiple teams contribute to the same product
- Business rules change frequently

Even without full DDD, domain-based library folders are a good idea because they:
- Clarify ownership and intent
- Reduce cross-feature coupling
- Make boundaries enforceable with lint rules

Recommended structure:

```
libs/<domain>/
  feature-*/
  data-access-*/
  ui-*/
  util-*/
```

### Example (feature + ui + data-access)

Feature component lives in `feature-*`:

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CleaningJobsApi } from '@cleaning/data-access-cleaning';
import { CleaningListComponent } from '@cleaning/ui-cleaning-list';

@Component({
  selector: 'app-cleaning-jobs',
  template: `<app-cleaning-list [jobs]="jobs()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CleaningListComponent],
})
export class CleaningJobsComponent {
  private readonly api = inject(CleaningJobsApi);
  readonly jobs = this.api.getJobsSignal();
}
```

UI component lives in `ui-*`:

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-cleaning-list',
  template: `
    <ul>
      @for (job of jobs(); track job.id) {
        <li>{{ job.title }}</li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleaningListComponent {
  readonly jobs = input<{ id: string; title: string }[]>([]);
}
```

Data-access lives in `data-access-*`:

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

export type CleaningJobDto = {
  id: string;
  title: string;
};

@Injectable({ providedIn: 'root' })
export class CleaningJobsApi {
  private readonly http = inject(HttpClient);

  getJobsSignal() {
    return toSignal(this.http.get<CleaningJobDto[]>('/api/cleaning-jobs'), { initialValue: [] });
  }
}
```

### Why structure matters
- Files tell you where logic belongs before you open them
- Dependencies are easier to enforce with lint rules
- Features scale without becoming “shared” soup
