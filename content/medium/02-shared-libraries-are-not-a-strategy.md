

# Shared Libraries Are Not a Strategy (They’re Often a Symptom)

It almost always starts with good intentions.

Two teams duplicate a utility function.
Someone says, “Let’s clean this up.”
The code moves into a shared folder.

It feels disciplined.
It feels mature.
It feels like architecture.

Six months later, that shared folder is one of the most sensitive parts of the system.

Changes ripple unexpectedly.
Features depend on it in subtle ways.
No one is fully sure who owns it.

Nothing dramatic happened.
No one made a catastrophic decision.

But structural gravity quietly shifted.

---

## Why Shared Feels Like the Right Move

When two features need the same logic, duplication feels wrong.

Extracting to a shared library feels responsible:

- Less repetition  
- Centralized maintenance  
- Cleaner features  

In the short term, it works.

But shared libraries don’t just remove duplication.

They change your dependency graph.

---

## Shared Is Not Neutral

When multiple domains depend on a shared library, that library becomes a hub.

Over time, hubs accumulate knowledge.

They start containing:

- Cross-domain utilities  
- Reusable UI components  
- Validation logic  
- Domain-adjacent assumptions  

At first, everything still looks clean.

But slowly, shared begins to depend — directly or indirectly — on the domains it was meant to abstract.

A helper function assumes a business rule.  
A validation utility references a domain-specific type “just for convenience.”  
A component starts importing models from one feature because they’re already available.

Now shared isn’t neutral.

It’s a coupling hub.

---

## The Coupling Hub Problem

The danger isn’t that shared exists.

The danger is that it becomes the easiest place to put code whose ownership is unclear.

Need reuse? Move it to shared.  
Unsure who owns it? Move it to shared.  
Don’t want duplication? Move it to shared.  

Shared becomes the lowest-resistance path.

And low resistance is exactly how structural drift begins.

Once shared becomes a hub, every change touching it has a wider blast radius.

Not because the change is large.

But because the surface area expanded.

---

## The Illusion of Reduced Complexity

Moving logic into shared often feels like simplification.

But complexity doesn’t disappear.

It relocates.

Instead of living inside a single feature boundary, it now lives between boundaries.

And the space between domains is harder to reason about.

Harder to test in isolation.

Harder to protect with ownership.

---

## Ownership First, Abstraction Second

Before extracting to shared, ask:

- Who truly owns this logic?  
- Which domain would break if this changed?  
- Is duplication actually harmful here?  
- Would extracting this increase cross-domain coupling?  

Sometimes duplication is not laziness.

Sometimes it’s containment.

Two similar implementations inside two bounded contexts may be more stable than one prematurely shared abstraction.

Shared should be the result of proven, stable ownership.

Not a reflex.

---

## A Structural Signal

If your shared library grows faster than your features, it’s not necessarily a sign of efficiency.

It may be a signal that ownership boundaries are blurring.

And when ownership blurs, cost-of-change increases.

Not immediately.

But gradually.

---

Shared libraries are not inherently bad.

But they are rarely a strategy.

More often, they’re a symptom of unclear boundaries.

Structural clarity compounds.

So does accidental coupling.

The question isn’t whether you have a shared folder.

It’s whether it has quietly become your architecture.

---
