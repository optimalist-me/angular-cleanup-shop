# Debt Item 0005: Domain boundary enforcement follow-ups

## Status
Open

## Priority
P1

## Owner
Unassigned

## Target Window
Sprint 4

## Context
Sprint 1 activated strict domain boundary linting and introduced temporary
suppressions. Sprint 2 resolved all checkout suppressions (`S2-1`, `S2-2`,
`S2-3`). Sprint 3 resolved the product-detail cart boundary suppression
(`S3-1`) by moving add-to-cart interaction behind a products-owned port and
route-level adapter.

### Evidence in repo
- `eslint.config.mjs` (active domain constraints)
- `libs/booking/presentation-booking-rest/src/lib/presentation-booking-rest.spec.ts`

## Resolution Status
- `S2-1`: Resolved in Sprint 2
- `S2-2`: Resolved in Sprint 2
- `S2-3`: Resolved in Sprint 2
- `S3-1`: Resolved in Sprint 3
- `S4-1`: Open

## Remaining Violation Inventory
| Type | File | Line | Import / Code | Story |
| --- | --- | --- | --- | --- |
| type | `libs/booking/presentation-booking-rest/src/lib/presentation-booking-rest.spec.ts` | 31 | `(h: any) => h.method === method` | `S4-1` |

## Current Suppression Scope
- `S4-1`: 1 line-level suppression in booking REST spec

## Impact
- checkout and product-detail now respect domain boundaries without suppressions
- lint remains enforceable with only one known, scoped TypeScript exception
- remaining debt is isolated to a single test typing issue

## Proposed Resolution
- Sprint 4: remove `S4-1` suppression by replacing `any` with precise type

## Acceptance Criteria
- `S4-1` suppression is removed
- `yarn nx run-many -t lint --all` passes without temporary boundary suppressions
- no `@typescript-eslint/no-explicit-any` suppression remains in booking REST spec

## Dependencies / Risks
- low risk; change is localized to test typing and route stack access typing

## Notes
This debt item remains open until `S4-1` is closed.
