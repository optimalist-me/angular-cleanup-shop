# ADR 0002: Booking Consent and Retention Policy

## Date
February 24, 2026

## Status
Accepted

## Context
Booking and checkout flows collect personal data. The service needs explicit,
auditable privacy acknowledgment and bounded retention.

### Evidence in repo
- `libs/booking/models-booking/src/models/booking.model.ts`
- `libs/booking/application-booking-service/src/lib/booking-service.ts`
- `apps/api/src/main.ts`

## Decision
For booking submissions:
- privacy acknowledgment is mandatory
- request payload must include the current privacy policy version
- server records the consent acceptance timestamp
- booking records are retained for 12 months maximum
- retention enforcement runs at API startup and then daily

## Alternatives Considered
1. Client-side-only consent proof
- rejected: consent evidence could be omitted, forged, or inconsistent

2. Manual retention cleanup
- rejected: operationally fragile and not reliably enforceable

## Consequences
Positive:
- stronger auditability and compliance posture
- consistent consent evidence for each accepted booking
- predictable retention behavior across environments

Negative:
- policy version changes require explicit rotation and communication
- strict validation may reject stale clients until they refresh and re-accept

## Follow-up Actions
- rotate `PRIVACY_POLICY_VERSION` whenever legal text changes materially
- keep tests for consent validation and retention scheduling in CI
