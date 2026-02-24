# Sales Timing Automation - Brainstorm Session
**Date:** 2026-02-23 00:42 UTC
**Source:** IndieHackers (Dev/Tech)
**Time Range:** 7 days
**Lens:** Elimination (d10=6)
**Modifier:** Time Pressure (d6=1)
**Format:** Counter-Argument (d6=4)

## Key Finding
LeadSynth insight: "Most founders don't have a lead problem, they have a timing problem"

Supporting pattern: Multiple tools automating communication overhead (PushNote, Ozkour)

## Divergent Approaches

### 1. Eliminate the Sales Pipeline Entirely
**Core idea:** Timing > leads means sales funnels are theater
**Mechanism:** Monitor buying signals, show up only when they're ready
**Tools:** RSS/webhook monitoring + auto-outreach on trigger
**Score:** 38
**Why held back:** Still reactive, not predictive enough

### 2. Eliminate Human Timing Judgment
**Core idea:** Auto-schedule based on company signals (funding/hiring/launches)
**Mechanism:** Clearbit + Calendly on steroids
**Score:** 42
**Strength:** Directly addresses timing insight
**Weakness:** Doesn't go far enough on automation

### 3. Eliminate Outreach Entirely
**Core idea:** Be present when they search (SEO + smart retargeting)
**Score:** 35
**Why rejected:** Too passive for B2B

### 4. Eliminate the Founder from the Loop ⭐
**Core idea:** Timing is pattern recognition, not intuition - automate the rules
**Mechanism:** Rule engine with observable triggers
**Example:** `WHEN [Series A] AND [job posting] AND [>60 days] THEN [send email]`
**Score:** 44
**Selected because:** 
- Strongest counter-argument angle
- Challenges core assumption (timing = human judgment)
- Practical with existing tools
- Scales infinitely

### 5. Eliminate the Lead Concept
**Core idea:** Replace "leads" with "eventual buyers + trigger monitoring"
**Mechanism:** CRM becomes smart wait list
**Score:** 40
**Why not selected:** Interesting but less actionable

## Counter-Argument Framing
**Thesis:** Founders think timing is intuition. It's actually pattern recognition that should be automated.

**Challenge:** "You don't have a timing problem. You have a manual timing problem."

**Evidence:**
- Funding rounds, job posts, GitHub activity = observable facts
- Founders already automate worse decisions (Calendly, templates, batch timing)
- Mental load is "remembering to check" not "figuring it out"

## Prototype Concept (1-hour build)
1. Define 3-5 trigger patterns
2. Pick one monitoring source
3. Write templated outreach with variables
4. Auto-populate review queue
5. Graduate to auto-send after validation

## Article Approach
- Hook: The timing myth (intuition vs. pattern recognition)
- Problem: What founders actually do (manual checking, gut feel)
- Solution: Rule engine for "when", founder controls "what"
- Objection handling: "But relationships!" → You already automate worse
- Practical example: What this looks like with existing tools
- CTA: Build the timing engine (concrete steps)

**Outcome:** Published to _drafts/ for review gate evaluation
