# WEBSITE-SITEMAP.md - Governance Site (Main App)

This document defines the marketing information architecture for the main Angular app.

The storefront/demo journey is removed from the main app runtime path.
Storefront libraries remain in the repository for reuse in a future, separate demo app.

## Objectives

Primary objective:
- Help decision-makers understand governance value and next steps quickly

Secondary objectives:
- Provide a technical-lead path with concrete implementation details
- Explain operating cadence and AI guardrails
- Keep messaging narrow: Angular + Nx governance

## Primary Route Map

```text
/                     # Manager-first landing page
/for-managers         # Manager outcomes, risk, measurability
/for-technical-leads  # Governance mechanics and technical details
/how-it-works         # Baseline -> setup -> cadence -> advisory
/ai-governance        # AI-supported governance use-cases and guardrails
/book                 # Executive introduction call request flow
/book/confirmed/:id   # Confirmation flow (non-index)
/privacy              # Privacy policy
```

## Legacy Redirects

```text
/playbook      -> /how-it-works
/architecture  -> /for-technical-leads
/faq           -> /for-managers
/products      -> /
/products/:slug-> /
/cart          -> /
/checkout      -> /
```

## Messaging Requirements

- Manager path first by default
- Technical path one click away
- No storefront-led IA
- No exact day rates or detailed pricing tables in app copy
- CTA language: "Executive introduction call"

## SEO Notes

- Index only governance marketing routes
- Keep confirmation routes non-indexed
- Exclude removed storefront routes from sitemap and LLM route listings
