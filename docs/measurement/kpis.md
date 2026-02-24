# First-Party KPI Specification

## Scope
This document defines the operational KPIs used at launch without
non-essential analytics.

## Source of Truth
- booking and checkout records from first-party backend systems
- operational status updates maintained by booking operations

## Review Cadence
- weekly snapshot review
- monthly trend review

## KPI Definitions
### 1) Booking Requests per Week
- definition: count of new booking requests created during a calendar week
- formula: `count(bookings where createdAt in week)`
- owner: Booking Operations

### 2) Request-to-Scheduled Conversion Rate
- definition: share of booking requests that become scheduled calls
- formula: `scheduled_requests / total_requests`
- owner: Booking Operations

### 3) Median First-Response Time
- definition: median elapsed time between request creation and first operational
  reply
- formula: `median(firstResponseAt - createdAt)`
- owner: Booking Operations

### 4) Cancellation and No-Show Rate
- definition: share of scheduled calls canceled or marked no-show
- formula: `(canceled + no_show) / scheduled_calls`
- owner: Booking Operations

### 5) Completed Fit-Checks per Week
- definition: count of completed fit-check calls during a calendar week
- formula: `count(completed_fit_checks in week)`
- owner: Delivery Lead

## Governance Notes
- these KPIs are first-party and operational only
- no non-essential frontend tracking is required for these metrics

## Reconsideration Trigger
Non-essential analytics is only reconsidered if:
1. a concrete business question cannot be answered using these KPIs, and
2. the gap remains across two consecutive review cycles.

Any future non-essential analytics rollout requires consent collection and
prior blocking before activation.
