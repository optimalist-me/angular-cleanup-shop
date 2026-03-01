# Debt Item 0005: Domain boundary enforcement follow-ups

## Status
Closed

## Priority
P1

## Owner
Unassigned

## Target Window
Completed in Sprint 4

## Context
Sprint 1 activated strict domain boundary linting and introduced temporary
suppressions. Sprint 2 resolved all checkout suppressions (`S2-1`, `S2-2`,
`S2-3`). Sprint 3 resolved product-detail cart decoupling (`S3-1`). Sprint 4
resolved the final type-safety suppression (`S4-1`).

### Evidence in repo
- `eslint.config.mjs` (active domain constraints)
- `libs/booking/presentation-booking-rest/src/lib/presentation-booking-rest.spec.ts`

## Resolution Status
- `S2-1`: Resolved in Sprint 2
- `S2-2`: Resolved in Sprint 2
- `S2-3`: Resolved in Sprint 2
- `S3-1`: Resolved in Sprint 3
- `S4-1`: Resolved in Sprint 4

## Remaining Violation Inventory
None.

## Current Suppression Scope
None.

## Impact
- checkout and product-detail respect domain boundaries without suppressions
- booking REST spec no longer requires `any` suppression
- lint policy is fully enforced without temporary exceptions from this initiative

## Acceptance Criteria
- all S2/S3/S4 suppressions removed
- `yarn nx run-many -t lint --all` passes with no temporary boundary/type suppressions
- debt item `0005` is closed in both item file and debt index

## Dependencies / Risks
- none remaining for this debt item

## Notes
Closed after Sprint 4 completion.
