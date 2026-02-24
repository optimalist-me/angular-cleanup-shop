# ADR 0007: Client Functional Storage Policy

## Date
February 24, 2026

## Status
Accepted

## Context
Client-side persistence is needed for user experience, but data minimization
requires strict limits on what is stored and why.

### Evidence in repo
- `libs/cart/data-access-cart/src/repositories/cart.repository.ts`
- `libs/shared/util-design-theming/src/lib/theme-options.ts`
- `libs/shared/util-design-theming/src/lib/theme.service.ts`
- `libs/privacy/feature-privacy/src/privacy/privacy.html`

## Decision
Client storage is limited to functional use only:
- cart state persisted under `cleanup-shop-cart`
- theme preference persisted under `cleanup-shop-theme`
- no marketing or analytics identifiers are stored client-side
- no non-essential analytics storage is permitted

## Alternatives Considered
1. Session-only storage with no persistence
- rejected: worsens user experience for cart continuity and theme preference

2. Client analytics identifiers for behavior tracking
- rejected: conflicts with data-minimization and no-non-essential-analytics
  posture

## Consequences
Positive:
- minimal privacy surface area on the client
- policy and implementation remain aligned and auditable
- functional UX needs are met without behavioral profiling

Negative:
- limited behavioral insight from client-side interaction history
- future storage additions require explicit policy review

## Follow-up Actions
- gate new client storage keys behind privacy and architecture review
- keep privacy policy text aligned with actual storage behavior
