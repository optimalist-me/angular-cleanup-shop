## Quick Scan (15 Minutes)

### Intent
Get a fast signal on risk areas without deep diving.

### 0:00 - 3:00 | Orientation
- Open the main app entry point
- Identify the top-level routes and features
- Note the primary data-access layer

### 3:00 - 8:00 | Risk scan
- Spot oversized components and god services
- Look for nested subscriptions and implicit side effects
- Check for shared libs that contain domain logic

### 8:00 - 12:00 | Boundaries
- Verify feature -> data-access -> util direction
- Confirm UI components do not import data-access

### 12:00 - 15:00 | Summary
- Write 3-5 bullets of risks or smells
- Identify 1-2 safe cleanup opportunities

### Outputs
- Quick scan notes
- Suggested first cleanup target
