# Debt Item 0005: Domain boundary enforcement follow-ups

## Status
Open

## Priority
P1

## Owner
Unassigned

## Target Window
Sprints 3-4

## Context
Sprint 1 activated strict domain boundary linting and introduced temporary
suppressions. Sprint 2 removed all checkout suppressions (`S2-1`, `S2-2`,
`S2-3`) by introducing checkout-owned contracts, data-access ports, and
route-level adapters.

### Evidence in repo
- `eslint.config.mjs` (active domain constraints)
- `libs/products/feature-product-detail/src/detail/detail.ts`
- `libs/products/feature-product-detail/src/detail/detail.spec.ts`
- `libs/booking/presentation-booking-rest/src/lib/presentation-booking-rest.spec.ts`

## Resolution Status
- `S2-1`: Resolved in Sprint 2
- `S2-2`: Resolved in Sprint 2
- `S2-3`: Resolved in Sprint 2
- `S3-1`: Open
- `S4-1`: Open

## Remaining Violation Inventory
| Type | File | Line | Import / Code | Story |
| --- | --- | --- | --- | --- |
| boundary | `libs/products/feature-product-detail/src/detail/detail.ts` | 15 | `@cleanup/data-access-cart` | `S3-1` |
| boundary | `libs/products/feature-product-detail/src/detail/detail.spec.ts` | 7 | `@cleanup/data-access-cart` | `S3-1` |
| type | `libs/booking/presentation-booking-rest/src/lib/presentation-booking-rest.spec.ts` | 31 | `(h: any) => h.method === method` | `S4-1` |

## Current Suppression Scope
- `S3-1`: 2 line-level suppressions in product detail
- `S4-1`: 1 line-level suppression in booking REST spec

## Impact
- checkout now respects bounded contexts (`domain:checkout` + `domain:shared`)
- remaining debt is isolated to product-detail/cart coupling and one `any` type
- lint remains enforceable and visible for unresolved boundary debt

## Proposed Resolution
- Sprint 3: remove all `S3-1` suppressions by decoupling product-detail from cart
- Sprint 4: remove `S4-1` suppression by replacing `any` with precise type

## Acceptance Criteria
- all remaining suppressions are removed by end of Sprint 4
- `yarn nx run-many -t lint --all` passes without Sprint 1/2 temporary suppressions
- boundary rules remain fully enforced through `@nx/enforce-module-boundaries`

## Dependencies / Risks
- Sprint 3 must define a stable add-to-cart abstraction for products domain
- delayed Sprint 4 fix leaves one targeted type-safety exception in tests

## Notes
This debt item remains open until `S3-1` and `S4-1` are both closed.
