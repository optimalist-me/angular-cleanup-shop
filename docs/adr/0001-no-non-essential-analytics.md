# ADR 0001: No Non-Essential Analytics at Launch

## Date
February 24, 2026

## Status
Accepted

## Context
The service collects privacy-sensitive booking and checkout data. The launch
goal is to keep data processing minimal, predictable, and aligned with GDPR
data-minimization expectations.

The current business model can be operated using first-party operational
booking data, without adding third-party analytics trackers or marketing
profiling tools.

## Decision
For launch, the shop operates with a strict no-non-essential-analytics posture.

In scope:
- no analytics or marketing cookies
- no third-party pixels
- no behavioral profiling SDKs
- no tag manager
- only first-party operational KPI measurement from booking data

Allowed storage and processing:
- functional local storage for cart state and theme preference
- first-party booking/checkout operations data needed for service delivery

## Alternatives Considered
1. Add a basic third-party analytics suite at launch
- rejected: adds consent/operational overhead without immediate business need
2. Add self-hosted product analytics at launch
- rejected: still non-essential tracking at current stage

## Consequences
Positive:
- lower legal and operational complexity
- lower data protection risk surface
- clear implementation boundary for engineering and content

Negative:
- no granular page-level behavior analytics
- weaker attribution for marketing experiments

## Reconsideration Trigger
Non-essential analytics may be reconsidered only when:
1. a concrete business question cannot be answered with first-party KPIs, and
2. this remains true for two consecutive review cycles.

If reconsidered, rollout is blocked until:
1. consent management is implemented, and
2. non-essential trackers are prior-blocked until valid consent is granted.
