# WEBSITE-SITEMAP.md – Structural Cleaning Store (Single App)

This document defines the website/app structure for the **Angular Cleanup Shop**, implemented as a **single Angular application** that acts as:

- Marketing website
- Demo application (architectural reference)
- Booking funnel (checkout → intro-call booking)

The app is intentionally designed to **demonstrate clean domain boundaries** (DDD/Nx-friendly),
while remaining **accessible** for non-technical visitors.

Core concept:

> A “webshop” selling fictional cleaning products.  
> Each product is a metaphor for a real outcome/pattern of the Angular Cleanup Shop.

---

# 1. Objectives

Primary objective:

- Convert qualified visitors into **booked exploratory calls**

Secondary objectives:

- Demonstrate architectural clarity (domains, state ownership, boundaries)
- Provide a playful but professional metaphor for structural improvement
- Serve as a reference implementation for Angular best practices

---

# 2. Navigation Model

The app supports two modes:

1. **Normal Mode** (default)
   - Clear marketing story
   - Simple store UX
   - Minimal technical jargon

2. **Architecture Mode** (toggle)
   - Shows domain ownership, state panels, boundaries, and “why” explanations
   - Helps CTOs/architects/devs evaluate the approach quickly

Global UI elements:

- Top navigation (minimal)
- “Architecture Mode” toggle
- Footer with links (Playbook, Architecture, Book, Privacy)

---

# 3. Route Map

Single app routes:

```
/                          # Storefront + Marketing (Catalog entry point)
/products                  # Product catalog list (Catalog domain)
/products/:slug            # Product detail (Outcome + Pattern + Boundary)
/cart                      # Cart domain
/checkout                  # Checkout domain (converts to booking request)
/book/confirmed            # Booking confirmation
/playbook                  # Playbook highlights + links to GitHub docs
/architecture              # Explicit architecture explanation & diagrams
/faq                       # Fit & constraints, pricing framing, boundaries
/privacy                   # GDPR privacy statement and data handling details
```

Optional (later):

```
/about                     # Credibility, background, “why this exists”
/insights                  # Articles / short posts
```

---

# 4. Page/Route Specifications

## 🏠 Storefront ( / )

### Objective

Position the service within 10 seconds and invite exploration through the “store” metaphor.

### Sections

#### Hero

Headline:

> Structural Cleaning Store

Subheadline:

> Less friction. More efficient development.  
> Pick the “product” your Angular/Nx codebase needs most.

Primary CTA:

> Browse products

Secondary CTA:

> Request a 20‑min fit check

---

#### The Problem (Entropy)

Explain symptoms:

- growing component complexity
- slower PR reviews
- regression fear
- onboarding friction
- unclear boundaries

---

#### The Approach

- 1 day/week, remote
- incremental refactoring
- no feature delivery
- no rewrites
- sustainable velocity

---

#### Featured Products (3–6)

Cards that link into `/products/:slug`.

---

#### Trust Signals

- Nx Partner, Nx Certified Expert (concise)
- Links to playbook / architecture

---

#### Final CTA

> Request a 20‑min fit check

---

## 🧴 Catalog List ( /products )

### Objective

Expose the “menu” of outcomes and patterns.

### UI

- Product grid
- Filters (optional): Components / State / RxJS / Boundaries / Testing / Upgrades
- Each product card shows:
  - name (playful)
  - 1-line outcome
  - tag (domain/pattern)

In Architecture Mode:

- Show badge: `Domain: catalog`
- Indicate: route is lazy-loaded (if applicable)

---

## 🧼 Product Detail ( /products/:slug )

### Objective

Turn metaphor into credibility and action.

### Layout

Product header:

- Product name + short playful description
- “What it solves” summary
- CTA: “Add to cart”

Tabs (or sections):

1. **Outcome**
   - What friction it reduces
   - What teams notice after cleanup

2. **Pattern**
   - The pattern we apply
   - A short “before → after” illustration
   - Link to playbook docs (GitHub)

3. **Boundary & Ownership**
   - Domain that owns this concern (e.g., `catalog`, `cart`, `checkout`)
   - Clear statements:
     - what state lives where
     - what this domain must NOT do
   - Links to related anti-patterns

In Architecture Mode:

- Show:
  - owning domain
  - which libs are involved (ui/data-access/util)
  - “allowed dependencies” statement

---

## 🛒 Cart ( /cart )

### Objective

Demonstrate clean local state and derive totals with minimal complexity.

### UX

- list line items
- quantity update
- remove item
- computed totals

Architecture demonstration:

- `cart.items` as signal state
- `cart.total` as computed
- no global store

In Architecture Mode:

- Small “State Panel” showing:
  - `cart.items`
  - `cart.total`
  - `cart.count`

CTA:

> Checkout

---

## ✅ Checkout ( /checkout )

### Objective

Convert “checkout” into a **booking request** for an exploratory call.

Checkout is NOT a payment flow.
It is a qualification and scheduling flow.

### Form fields (minimum)

- Company
- Email
- Angular version (approx)
- Nx usage (yes/no)
- Biggest pain area (dropdown)
- Optional note

Validation:

- reactive forms
- clear feedback
- calm tone

On submit:

- create booking request
- navigate to `/book/confirmed`
- optionally trigger email (later)

In Architecture Mode:

- Show ownership:
  - form state is local to checkout
  - booking request is created in booking domain

---

## 📅 Booking Confirmation ( /book/confirmed )

### Objective

Confirm and explain next steps calmly.

Content:

- “Thanks — here’s what happens next”
- link to schedule (Calendly/SavvyCal integration OR embedded calendar)
- expectations (no sales pressure)
- what to prepare (optional)

In Architecture Mode:

- show booking request summary (non-sensitive) and flow diagram

---

## 📘 Playbook ( /playbook )

### Objective

Thought leadership + transparency.

Content:

- Short summary of the method
- “What we do / don’t do”
- Link to GitHub:
  - README
  - AGENTS
  - CONTRIBUTING
  - patterns/anti-patterns

CTA:

> Request a 20‑min fit check

---

## 🧭 Architecture ( /architecture )

### Objective

Make the architectural demonstration explicit for technical evaluators.

Content sections:

- Domain map (catalog/cart/checkout/booking)
- Lazy-loading strategy (feature routes)
- State ownership rules
- Boundaries & allowed dependencies (Nx module boundaries)
- Why signals / why not global store by default
- “What we deliberately did not do”

This page should feel:

- confident
- minimal
- not overly academic

---

## ❓ FAQ ( /faq )

### Objective

Remove friction, filter wrong expectations.

Include:

- Is this “just refactoring”?
- Why only 1 day per week?
- Can you also build features?
- Do you work with Nx monorepos?
- What’s the day rate?
- What does success look like after 4–8 weeks?
- When is this NOT a fit?

Pricing copy:

- Communicate a single fixed day rate (no ranges)
- Frame in efficiency / ROI terms

---

# 5. Content Model: Products

Products are fictional cleaning items.
Each product maps to:

- an outcome (friction removed)
- a pattern (how we do it)
- optional anti-pattern references

Example product naming style:

- Angular Degreaser
- RxJS Untangler
- Boundary Polish
- State Simplifier
- Template Detangler
- OnPush Primer
- Test Stabilizer
- Upgrade Lubricant

Keep the humor subtle and consistent.
The credibility comes from the outcomes/patterns.

---

# 6. Conversion Philosophy

The app is not built for volume.
It is built for qualified leads.

CTAs are calm:

- “Request a 20‑min fit check”
- “See if this model fits your team”

No urgency tactics.
No aggressive sales language.

---

# 7. Technical Structure Notes (Nx-Friendly)

Even as a single app, structure the code in **domain libs**:

- catalog
- cart
- checkout
- booking
- privacy
- playbook
- marketing
- shared
- ui

Rules:

- Each domain owns its state
- Cross-domain access via explicit public APIs
- Feature routes should lazy-load domain entry points
- Keep UI components in dedicated UI libs

---

# 8. “Architecture Mode” Specification

A global toggle that:

- adds domain badges per route
- enables a small state panel where relevant
- shows a lightweight “flow” explanation on key pages
- never overwhelms the normal UX

This turns the app into a living reference implementation.

---

Angular Cleanup Shop  
Less Friction. More Efficient Development.
