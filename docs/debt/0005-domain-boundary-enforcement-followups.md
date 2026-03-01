# Debt Item 0005: Domain boundary enforcement follow-ups

## Status
Open

## Priority
P1

## Owner
Unassigned

## Target Window
Sprints 2-4

## Context
Sprint 1 completed governance hardening for domain boundaries, which surfaced
known cross-domain coupling and one TypeScript `any` usage. To keep lint green
while decoupling is delivered incrementally, targeted suppressions were applied
with story-linked TODO comments.

### Evidence in repo
- `eslint.config.mjs` (active domain constraints for checkout/products/privacy)
- `libs/checkout/feature-checkout/src/checkout/checkout.ts`
- `libs/checkout/feature-checkout/src/checkout/checkout.spec.ts`
- `libs/products/feature-product-detail/src/detail/detail.ts`
- `libs/products/feature-product-detail/src/detail/detail.spec.ts`
- `libs/booking/presentation-booking-rest/src/lib/presentation-booking-rest.spec.ts`

## Violation Inventory
| Type | File | Line | Import / Code | Story |
| --- | --- | --- | --- | --- |
| boundary | `libs/checkout/feature-checkout/src/checkout/checkout.ts` | 22 | `@cleanup/data-access-booking` | `S2-1` |
| boundary | `libs/checkout/feature-checkout/src/checkout/checkout.ts` | 25 | `@cleanup/data-access-cart` | `S2-2` |
| boundary | `libs/checkout/feature-checkout/src/checkout/checkout.ts` | 28 | `@cleanup/models-booking` | `S2-1` |
| boundary | `libs/checkout/feature-checkout/src/checkout/checkout.ts` | 36 | `@cleanup/ui-cart-line-item` | `S2-3` |
| boundary | `libs/checkout/feature-checkout/src/checkout/checkout.spec.ts` | 8 | `@cleanup/data-access-booking` | `S2-1` |
| boundary | `libs/checkout/feature-checkout/src/checkout/checkout.spec.ts` | 11 | `@cleanup/data-access-cart` | `S2-2` |
| boundary | `libs/checkout/feature-checkout/src/checkout/checkout.spec.ts` | 14 | `@cleanup/models-booking` | `S2-1` |
| boundary | `libs/products/feature-product-detail/src/detail/detail.ts` | 15 | `@cleanup/data-access-cart` | `S3-1` |
| boundary | `libs/products/feature-product-detail/src/detail/detail.spec.ts` | 7 | `@cleanup/data-access-cart` | `S3-1` |
| type | `libs/booking/presentation-booking-rest/src/lib/presentation-booking-rest.spec.ts` | 31 | `(h: any) => h.method === method` | `S4-1` |

## Sprint 1 Suppression Status
- status: Temporary suppression in Sprint 1
- method: line-level `eslint-disable-next-line` comments with story-linked TODOs
- scope: only the 10 items listed above

## Impact
- domain boundaries are now enforced by lint, but existing coupling remains
- architecture debt is explicit and trackable rather than hidden in config gaps
- new violations are prevented unless deliberately and locally suppressed

## Proposed Resolution
- Sprint 2: remove all `S2-*` suppressions by decoupling checkout from booking/cart
- Sprint 3: remove all `S3-1` suppressions by decoupling product-detail from cart
- Sprint 4: remove `S4-1` suppression by replacing `any` with precise type

## Acceptance Criteria
- all suppressions introduced in Sprint 1 are removed by end of Sprint 4
- `yarn nx run-many -t lint --all` passes without Sprint 1 suppression comments
- cross-domain boundaries remain enforced via `@nx/enforce-module-boundaries`

## Dependencies / Risks
- decoupling stories must land in sequence to remove suppressions safely
- temporary suppressions can become stale if story tracking is not maintained

## Notes
This debt item tracks the temporary Sprint 1 compliance bridge and must be
closed only when all listed suppressions are removed.
