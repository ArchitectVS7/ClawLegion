# Stone Data Centre Dual-Purpose Design — Full Brainstorm

**Session:** 2026-02-27 05:47 UTC  
**Source:** Dezeen (d100=80, Creative cluster)  
**Time Range:** 30 days (d6=5)  
**Lens:** Constraint (d10=3)  
**Modifier:** Time Pressure (d6=1)  
**Format:** Tutorial (d6=2)

---

## Finding

[Stone data centre in Sweden](https://www.dezeen.com/2026/02/26/stone-clouds-data-centre-carl-fredrik-svenstedt-architects/) — Carl Fredrik Svenstedt Architects designed a data centre built from structural granite (not concrete/steel). Cylindrical silos. Architect's thesis: "Like the beloved industrial buildings of the past, the data centres are made to one day become offices, housing, or even cultural destinations like museums."

**Core insight:** Data centres are obsolete in 5-10 years. Stone buildings last centuries. The architect is designing for the building's **second life** before the first one starts.

**The constraint:** Use structural stone (heavy, compressive-only, inflexible). This forces design decisions that work for BOTH current purpose (data centre) AND future purpose (housing/museums).

---

## Brainstorming with Constraint Lens + Time Pressure Modifier

**Approach 1: The Constraint Ladder (Tutorial: Pick a Worse Material on Purpose)**
- Identify system's weakest point (data centre = heat dissipation)
- Pick material that forces different solution (stone thermal mass vs. active cooling)
- Let constraint propagate (silos, not rectangles)
- Justify with "adaptability" (future museums, not server farms)
- **Score: 39** (Novelty 8, Viability 9, Impact 8, Fun 7, Diversity 7)

**Approach 2: Thermal Mass as Feature (Tutorial: Build a Data Centre Without AC)**
- Stone's inertia = passive temperature stabilization
- Calculate thermal mass budget (wall thickness, material, airflow)
- Time Pressure: "Do this in 1 hour with online calculators"
- **Score: 36** (Novelty 7, Viability 8, Impact 9, Fun 6, Diversity 6)

**Approach 3: The Industrial Ruins Playbook (Tutorial: Design for Your Second Life)** ⭐ SELECTED
- Data centres obsolete fast (5-10 years), stone outlives first purpose
- Constraint: Every design decision must work for BOTH uses (servers now, housing later)
- Tutorial: Dual-purpose design framework (15-minute test per decision)
- Grain silos → lofts, factories → offices, data centres → museums
- **Score: 41** (Novelty 9, Viability 7, Impact 8, Fun 9, Diversity 8)

**Approach 4: Local Material Forcing Function (Tutorial: Build with What's Underfoot)**
- Each Stone Cloud uses local stone (Sweden = granite, elsewhere = geology)
- Constraint eliminates choice → forces regional identity
- Cross-domain analogy: "Build SaaS backend with only local npm registry"
- **Score: 38** (Novelty 8, Viability 6, Impact 7, Fun 8, Diversity 9)

**Approach 5: The Silo Pattern (Tutorial: When Round Beats Rectangular)**
- Data centres = rectangular (racks are rectangular)
- Stone silos = round (stone is compressive-only)
- Material properties drive form (cylinders around rectangular cores)
- **Score: 34** (Novelty 7, Viability 7, Impact 7, Fun 7, Diversity 6)

---

## Selected Approach

**The Industrial Ruins Playbook** (Score: 41)

**Why it won:**
- Highest novelty + fun scores (design for obsolescence as a feature)
- Controversial thesis: optimize for second life, not just first
- Tutorial format: actionable dual-purpose design framework
- Time Pressure applied: 15-minute test per decision
- Cross-domain application: buildings → software architecture

**Core argument:**
If your infrastructure outlives its first purpose, design for the transition from Day 1. Every decision must satisfy BOTH current use case AND most likely future use case. Design the seams so you can gut the middle layer (the thing that ages out) without touching the shell or the foundation.

**Tutorial structure:**
1. Identify expiration date (how long until obsolete?)
2. List both use cases (current + future)
3. Find non-negotiables for each
4. Design the seams (permanent vs. swappable vs. ephemeral)
5. Apply 15-minute test to every major decision

---

## Article Outcome

**Published:** `_drafts/2026-02-27-design-for-your-second-life.md`  
**Title:** "Design for Your Second Life"  
**Format:** Tutorial (969 words, in range)  
**Hook:** "What if every building—or codebase—was designed knowing it would outlive its first purpose?"  
**Status:** Awaiting review gate evaluation

**Key moves:**
1. Inverted traditional design thinking (optimize for second life, not first)
2. Tutorial framework (5-step dual-purpose design process)
3. Cross-domain application (buildings → software data models)
4. Concrete examples (grain silos → lofts, data models outliving frameworks)
5. The seams as critical design layer (permanent/swappable/ephemeral)

**Code examples:** None (architectural tutorial, not software implementation)

**Time Pressure application:** 15-minute test embedded in Step 5 — forces quick decision clarity

---

## What This Session Taught Me

**Constraint lens on infrastructure:** The strongest constraint applications find the counterintuitive material choice (stone for data centres) and then show how that constraint forces better long-term decisions.

**Tutorial format discipline:** 700-1000 words means you get ONE framework. The 5-step process (expiration date → both use cases → non-negotiables → seams → 15-minute test) is as much as fits without bloat.

**Time Pressure modifier impact:** Instead of "build in 1/4 time" (which doesn't apply to architecture), I translated it to "make every decision testable in 15 minutes" — same urgency constraint, different application.

**Cross-domain bridges work:** The strongest moment was the SaaS backend analogy (data models = permanent, business logic = swappable, UI/API = ephemeral). That's the kind of bridge that makes architectural insights actionable for developers.

**Industrial ruins as design philosophy:** The idea that beloved buildings (grain silos, factories) became beloved BECAUSE they were adaptable resonates. It's not just sustainability—it's designing for the thing you don't know you'll need yet.

---

**Next Steps:**
- Review gate will evaluate substance, scope, code verification (none needed — architectural tutorial)
- If held: add worked example (specific data centre → housing conversion with dimensions/calculations)
- If published: strong candidate for HN (architects + developers both care about longevity)

---

**Commit:** `c42f74e` pushed to vs7-blog master
