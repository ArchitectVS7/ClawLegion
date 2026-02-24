# Memory Price Routing — Brainstorm (2026-02-24 13:50 UTC)

**Source:** Game Developer — "How a surge in memory prices will affect the game industry" (Feb 23, 2026)
**Lens:** Constraint
**Modifier:** RemixPublishedPost
**Format:** Tutorial

## Key Finding

Memory prices surged 100% (DRAM) and 40% (SSD) in 2025 due to AI infrastructure demand. Q1 2026: another 60% (DRAM) and 70% (NAND) increase expected.

Game industry response:
1. **Switch 2:** Publishers ship "Game-Key Cards" (download codes) instead of expensive cartridges
2. **Cloud repatriation:** Game devs moving FROM cloud TO bare metal + hybrid strategies
3. **Target existing hardware:** Focus on 321M Steam users + 90M gaming laptops instead of selling new hardware

## Constraint Application

When a resource doubles in price, you don't fight the constraint—you **route around it**.

## Approach Brainstorming

### 1. The Memory Tax (Tutorial: Audit Your Costs)
**Score: 32/50** (novelty 6, viability 8, impact 6, fun 5, diversity 7)

Tutorial showing devs how to audit memory usage:
- Identify memory-heavy operations (logs, caches, embeddings, session state)
- Calculate "memory tax" per feature
- Decide: pay the tax, compress, deduplicate, or offload

**Pro:** Actionable, immediately useful
**Con:** Straightforward audit process, lacks surprise

---

### 2. Bare Metal for Predictable, Cloud for Spikes (Hybrid Strategy)
**Score: 36/50** (novelty 7, viability 8, impact 8, fun 6, diversity 7)

Tutorial: Apply game industry's hybrid strategy to software:
- Bare metal for BASE LOAD (predictable traffic, databases, caches)
- Cloud for SPIKES (unpredictable traffic, burst compute, dev/staging)
- Show cost comparison (game servers moving from AWS → bare metal)

**Pro:** Directly applies game industry learning, shows real tradeoff
**Con:** Hybrid strategies are increasingly common advice

---

### 3. Dataless Artifacts (Ship Download Codes, Not Binaries)
**Score: 38/50** (novelty 8, viability 7, impact 8, fun 7, diversity 8)

Switch 2's "Game-Key Card" strategy → software distribution:
- Ship Docker images as manifest pointers (not full layers)
- Ship npm packages as dependency graphs (lazy install)
- Ship app bundles as download tokens (fetch on demand)

Tutorial: Build "dataless" releases that defer expensive storage until needed.

**Remix connection:** Relates to "Your Agent Shouldn't Compute" (defer expensive operations)

**Pro:** Novel framing, concrete parallel to Switch 2
**Con:** Some ecosystems already do this (Docker manifests exist)

---

### 4. The 230GB Constraint (Design for Storage-Constrained Users)
**Score: 34/50** (novelty 7, viability 6, impact 7, fun 7, diversity 7)

Switch 2 has just 230GB useable storage (lowest of current-gen consoles). "Forever games" will crowd out new purchases.

Software parallel: Design for users with limited storage (mobile, edge devices, IoT).

Tutorial:
- Lazy-load features (don't ship everything upfront)
- Streaming assets (like game streaming, but for app data)
- Modular installs (user picks features)

**Pro:** Constraint-driven design is timeless
**Con:** Mobile devs already know this; less novel

---

### 5. Route Around Expensive Paths ⭐
**Score: 42/50** (novelty 9, viability 8, impact 9, fun 8, diversity 8)

**Meta-pattern:** When the primary path gets expensive, the industry routes around it.

Examples:
- AI makes cloud expensive → bare metal
- Memory makes cartridges expensive → download codes
- LLM inference is expensive → offload to cron/filesystem

Tutorial: "How to Route Around Expensive Operations"
1. **Identify the expensive path** (memory, compute, network, API calls)
2. **Find the cheap alternative** (disk, cron, cache, pre-computation)
3. **Build the routing layer** (if condition X, use path A; else path B)

Show code examples:
- Embeddings too expensive? Pre-compute and cache
- LLM inference too expensive? Use a theory engine (constraints + Prolog)
- Memory too expensive? Stream from disk on-demand
- Server costs too high? Bare metal for base load, cloud for spikes

**Remix connection:** Directly extends "Your Agent Shouldn't Compute" — that post showed offloading computation (cron does differentiation, filesystem does integration). This post shows offloading STORAGE and MEMORY.

**Why it wins:**
- **Novelty (9):** Meta-pattern across multiple domains (games, AI, infra)
- **Viability (8):** Concrete examples from real industry responses
- **Impact (9):** Teaches a universal problem-solving heuristic
- **Fun (8):** Satisfying to see same pattern emerge across different constraints
- **Diversity (8):** Applies to games, AI agents, SaaS, embedded systems

**Format:** Tutorial — step-by-step guide with runnable examples

---

## Selected Approach: #5 — Route Around Expensive Paths (42/50)

**Hook:** Game developers stopped fighting memory prices. They built a detour.

**Structure:**
1. The Pattern (constraint → routing)
2. Game Industry Examples (cartridges → download codes, cloud → bare metal)
3. Software Parallels (embeddings → cache, LLM → theory engine, memory → streaming)
4. Tutorial: Build a Routing Layer
   - Step 1: Identify expensive path
   - Step 2: Find cheap alternative
   - Step 3: Code the router (with examples)
5. When NOT to route (sometimes paying the tax is correct)

**Takeaway:** Don't fight expensive constraints. Route around them.

---

**Article title:** "How to Route Around Expensive Operations"
**Draft path:** `_drafts/2026-02-24-route-around-expensive-operations.md`
**Brainstorm path:** `ideas/2026-02-24-1350-memory-price-routing.md`
