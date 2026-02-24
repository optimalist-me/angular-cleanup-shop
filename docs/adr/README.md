# Architecture Decision Records (ADRs)

This folder documents accepted and evolving architectural decisions for the
Angular Cleanup Shop repository.

Status lifecycle:
- Proposed: candidate decision under review
- Accepted: current decision in force
- Rejected: considered but not adopted
- Superseded: replaced by a later ADR

## Index
1. [ADR 0001: No Non-Essential Analytics at Launch](0001-no-non-essential-analytics.md)  
   Sets the launch posture to no non-essential analytics or tracker tooling.
2. [ADR 0002: Booking Consent and Retention Policy](0002-booking-consent-and-retention-policy.md)  
   Defines mandatory privacy acknowledgment evidence and 12-month retention enforcement.
3. [ADR 0003: Booking Data Persistence Strategy (SQLite)](0003-booking-data-persistence-strategy-sqlite.md)  
   Documents SQLite-based booking persistence with additive schema evolution.
4. [ADR 0004: Monorepo Boundary Enforcement](0004-monorepo-boundary-enforcement.md)  
   Records mandatory tag-based dependency and layering constraints.
5. [ADR 0005: Quality Gate Baseline](0005-quality-gate-baseline.md)  
   Establishes CI quality gates, coverage baseline, and compliance checks.
6. [ADR 0006: SEO Indexability Policy](0006-seo-indexability-policy.md)  
   Defines indexable vs noindex route classes and centralized route-driven SEO metadata.
7. [ADR 0007: Client Functional Storage Policy](0007-client-functional-storage-policy.md)  
   Limits client storage to functional cart and theme keys with no analytics storage.
