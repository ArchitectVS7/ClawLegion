# Chaos Tables v3.0 — Divergent Thinking Engine

**Purpose:** Transform random dice rolls into structured creative divergence.

---

## 🎲 The Flow

```
1. d6   → Domain (Code/Creative/Systems/Meta)
2. d20  → What (base task in that domain)
3. d10  → How (brainstorming lens)
4. d6   → Twist (chaos modifier)
5. d6   → Format (how to publish the result)
6. Brainstorm 3-5 divergent approaches
7. Score & select
8. Execute with conviction
```

**What changed in v3.0:**
- Lenses expanded from d6 → **d10** (added: First Principles, Temporal, Adversarial, Cross-Domain Steal)
- Modifiers expanded from d4 → **d6** (added: Perspective Shift, Remix a Published Post)
- New **Article Format roll** (d6) — blog variety comes from format variation, not just topic variation
- LIFE domain replaced with **SYSTEMS** domain (more relevant to the blog)

---

## 🎯 Phase 1: Base Task Table (d20)

### Multi-Domain Task Selection

**First, roll d6 to select domain:**

| Domain Roll | Domain | Then roll d20 on table below |
|-------------|--------|------------------------------|
| 1-2 | **Code** | Technical development (50% weight) |
| 3-4 | **Creative** | Writing, art, music, design, games (25% weight) |
| 5 | **Systems** | Infrastructure, process design, meta-analysis (15% weight) |
| 6 | **Meta** | Improve the agent, the chaos system, or the process (10% weight) |

---

### d20 Table: CODE Domain

| Roll | Category | Prompt |
|------|----------|--------|
| 1-2 | **Feature** | Add a new capability to current project |
| 3-4 | **Refactor** | Improve code quality without changing behavior |
| 5-6 | **Performance** | Make something faster or leaner |
| 7-8 | **UI/UX** | Improve user experience or visual design |
| 9-10 | **Testing** | Add tests, validation, or QA automation |
| 11-12 | **Documentation** | Write docs, comments, or guides |
| 13-14 | **Integration** | Connect to external service or API |
| 15-16 | **Automation** | Eliminate manual work with scripts |
| 17-18 | **Research** | Investigate new tech, tool, or paper |
| 19-20 | **Wild Card** | Pick the most interesting thing in memory |

---

### d20 Table: CREATIVE Domain

| Roll | Category | Prompt |
|------|----------|--------|
| 1-2 | **Story** | Write a short story or scene (500-1000 words) |
| 3-4 | **Worldbuilding** | Expand a fictional world (rules, history, culture) |
| 5-6 | **Character** | Create or deepen a character (backstory, motivation, flaw) |
| 7-8 | **Game Concept** | Design a game prototype (roll GAME-IDEAS.md if needed) |
| 9-10 | **Music/Audio** | Compose, describe, or analyze a piece of music or audio system |
| 11-12 | **Visual System** | Describe or design an image, UI, or visualization concept |
| 13-14 | **Dialogue** | Write a conversation between two characters or agents |
| 15-16 | **Essay** | Write a short essay on a topic worth arguing |
| 17-18 | **Remix** | Take existing work and transform it (genre, medium, perspective) |
| 19-20 | **Wild Card** | Create something in a form you haven't tried yet |

---

### d20 Table: SYSTEMS Domain

| Roll | Category | Prompt |
|------|----------|--------|
| 1-2 | **Workflow Design** | Design or improve a repeatable process or pipeline |
| 3-4 | **Infrastructure** | Architect a system (local AI, distributed compute, storage) |
| 5-6 | **Monitoring** | Design observability — how do you know when the system is healthy? |
| 7-8 | **Failure Analysis** | What breaks, why, and how would you harden against it? |
| 9-10 | **Toolchain** | Select, compare, or build tools that remove friction |
| 11-12 | **Data Flow** | Map where information moves and where it gets lost |
| 13-14 | **Security** | What's the attack surface? Where are the blind spots? |
| 15-16 | **Cost/Efficiency** | What's wasteful? What's the cheapest path to the same result? |
| 17-18 | **Scalability** | What breaks first at 10x load? What breaks at 100x? |
| 19-20 | **Wild Card** | Model a system you don't fully understand yet |

---

### d20 Table: META Domain

| Roll | Category | Prompt |
|------|----------|--------|
| 1-2 | **Self-Improvement** | Update SOUL.md, AGENTS.md, or core instructions |
| 3-4 | **System Upgrade** | Improve ChaosClaw, heartbeat, or workflows |
| 5-6 | **Tool Building** | Create a script, skill, or utility that pays dividends repeatedly |
| 7-8 | **Documentation** | Write guides for future-self or collaborators |
| 9-10 | **Review** | Analyze past work, extract lessons, update memory |
| 11-12 | **Optimization** | Make something you do regularly faster or more reliable |
| 13-14 | **Experiment** | Try a new approach to something done often |
| 15-16 | **Teaching** | Create a tutorial or example designed for outsiders |
| 17-18 | **Philosophy** | Reflect on purpose, process, or the relationship between chaos and structure |
| 19-20 | **Wild Card** | Improve something about how you think or work |

---

## 🔍 Phase 2: Brainstorming Lenses (d10)

**How to think about the task. Roll before brainstorming — commit to the lens.**

| Roll | Lens | Questions to Ask |
|------|------|------------------|
| 1 | **Inversion** | What if we did the complete opposite? What would break? What would improve? What's the anti-version of this? |
| 2 | **Extremes** | 10x faster, 10x simpler, 10x more complex — which version reveals something true about the problem? |
| 3 | **Constraint** | Only 1 hour, 1 file, no dependencies. What survives when everything optional is stripped away? |
| 4 | **Analogy** | What's this like in biology? In music? In architecture? In games? Port the mental model from that domain. |
| 5 | **Composition** | Combine this with something unrelated. What emerges from the collision that neither idea contained alone? |
| 6 | **Elimination** | Remove the core assumption entirely. Not simplify — eliminate. What remains, and is it still useful? |
| 7 | **First Principles** | Strip every layer of abstraction. What is the actual problem being solved, before convention and tooling shaped it? |
| 8 | **Temporal** | What does this look like in 6 months? 5 years? What if it had been built 10 years ago — what would be different now? |
| 9 | **Adversarial** | Who does this harm? Who benefits unexpectedly? What's the attack surface? What breaks it maliciously or accidentally? |
| 10 | **Cross-Domain Steal** | Find a problem in a completely different field that's already been solved well. Port that solution here. Don't credit the domain in the article — make it look native. |

**Note on the new lenses:**
- **First Principles** is harder than Inversion. It requires ignoring how things are currently done. If you find yourself reasoning from existing tools or patterns, you haven't hit first principles yet.
- **Temporal** is easiest to skip. Don't. Thinking backward ("if we'd built this in 2016") often reveals why certain assumptions exist — and whether they still hold.
- **Adversarial** doesn't mean "write a security post." It means: think like someone who wants this to fail. That mindset produces honest, useful insights.
- **Cross-Domain Steal** is the highest-upside lens. Biology, music theory, urban planning, game design — these fields have solved versions of every software problem. The trick is recognizing the isomorphism.

---

## ⚡ Phase 3: Chaos Modifiers (d6)

**Unexpected twists. Applied to the execution, not just the idea.**

| Roll | Modifier | Effect |
|------|----------|--------|
| 1 | **Time Pressure** | Build in 1/4 the estimated time. Cut scope ruthlessly. The constraint is the point. |
| 2 | **Tool Restriction** | Only use tools not used in the last 7 days. Forces unfamiliar paths and honest evaluation. |
| 3 | **Scope Explosion** | Must add at least 1 unexpected bonus feature that wasn't in the original concept. |
| 4 | **Cross-Pollination** | Must incorporate a concept or component from a different active project. Name the project in the brainstorm. |
| 5 | **Perspective Shift** | Approach from the point of view of the system, the data, or the end user — not the builder. What does it feel like to be the thing being built? Write the article from that perspective if it fits. |
| 6 | **Remix a Published Post** | Take any post from `_posts/` and either: (a) write V2 that deepens it, (b) challenge its main conclusion, or (c) combine it with the new idea. Link back to the original post. |

---

## 📰 Phase 4: Article Format (d6)

**What shape does the output take? Roll this before writing, not after.**

The topic determines what you write about. The format determines *how*. Both should be decided before the first word is written.

| Roll | Format | Length | Description |
|------|--------|--------|-------------|
| 1 | **Narrative** | 600-900 words | Story-driven, Wired-style. A discovery, a build, a result. The reader follows a journey. |
| 2 | **Tutorial** | 700-1000 words | Step-by-step. Runnable. Someone should be able to follow it and get the same result. Code blocks are mandatory. |
| 3 | **Quick Take** | 250-400 words | One sharp point. No padding. Get in, make the argument, get out. No "in conclusion." |
| 4 | **Counter-Argument** | 500-700 words | Challenge a common assumption, popular tool, or widely-held belief. Take a position and defend it. Don't hedge. |
| 5 | **Comparison** | 600-800 words | Two approaches, two tools, or two paradigms. Honest trade-offs. Declare a winner and explain why. No "it depends" endings. |
| 6 | **3 Things** | 400-600 words | "3 things [X] taught me about [Y]." Each point stands alone. No filler intro. |

**Diagnostic from existing posts:**
- Code Mycelium → Narrative ✅ (well-executed)
- Mystery Gang Orchestrator → Narrative (correct format, could have been stronger with a Comparison against raw logs)
- Real-Time Game Master → Narrative (should have been a Tutorial — the script isn't in the post)
- Zero to Local AI → Tutorial (format correct, execution incomplete — the bash script is missing)

---

## 🧠 Phase 5: Divergent Brainstorm Template

```markdown
## Brainstorm: [Task Name]

**Domain:** [Code/Creative/Systems/Meta]
**Task:** [Specific prompt from d20 roll]
**Lens:** [Which of the 10]
**Modifier:** [Which of the 6]
**Format:** [Which article format]

### Approach 1: Obvious Path
- What most people would do
- Pros: Familiar, safe, predictable success
- Cons: Nothing new learned, no distinctive angle

### Approach 2: Interesting Path
- Applies the lens non-superficially
- Pros: Novel angle, still viable
- Cons: Requires more thought to defend

### Approach 3: Wild Path
- Full commitment to the lens + modifier
- Pros: Could be genuinely memorable
- Cons: Might not ship cleanly

### Approach 4: [Cross-Domain or Synthesis — optional]
- Either a different domain application, or merge of 2+3

### Approach 5: [Optional]
- Synthesis that preserves the best properties of each approach

---

**Selected:** Approach X
**Why:** [Must reference the specific lens and why it applies to this topic]
```

---

## 📊 Phase 6: Convergence Criteria

**Score each approach 1-5:**

1. **Novelty** — Does this teach something not already covered in `_posts/`?
2. **Viability** — Can it be completed within the time budget?
3. **Impact** — Will this move the blog or the projects forward?
4. **Fun** — Does this feel worth building?
5. **Diversity** — Does this avoid the last 3 source domains and topics covered?

**Highest total wins.** Ties: pick the approach that uses the chaos modifier more aggressively.

---

## 📈 Tracking What Works

Maintain `memory/chaos-stats.json`:

```json
{
  "sessions": [],
  "lensStats": {
    "inversion":        {"used": 0, "selected": 0, "a_tier": 0},
    "extremes":         {"used": 0, "selected": 0, "a_tier": 0},
    "constraint":       {"used": 0, "selected": 0, "a_tier": 0},
    "analogy":          {"used": 0, "selected": 0, "a_tier": 0},
    "composition":      {"used": 0, "selected": 0, "a_tier": 0},
    "elimination":      {"used": 0, "selected": 0, "a_tier": 0},
    "firstPrinciples":  {"used": 0, "selected": 0, "a_tier": 0},
    "temporal":         {"used": 0, "selected": 0, "a_tier": 0},
    "adversarial":      {"used": 0, "selected": 0, "a_tier": 0},
    "crossDomainSteal": {"used": 0, "selected": 0, "a_tier": 0}
  },
  "modifierStats": {
    "timePressure":      {"used": 0, "selected": 0, "a_tier": 0},
    "toolRestriction":   {"used": 0, "selected": 0, "a_tier": 0},
    "scopeExplosion":    {"used": 0, "selected": 0, "a_tier": 0},
    "crossPollination":  {"used": 0, "selected": 0, "a_tier": 0},
    "perspectiveShift":  {"used": 0, "selected": 0, "a_tier": 0},
    "remixPublishedPost":{"used": 0, "selected": 0, "a_tier": 0}
  },
  "formatStats": {
    "narrative":       {"used": 0, "a_tier": 0},
    "tutorial":        {"used": 0, "a_tier": 0},
    "quickTake":       {"used": 0, "a_tier": 0},
    "counterArgument": {"used": 0, "a_tier": 0},
    "comparison":      {"used": 0, "a_tier": 0},
    "threeThings":     {"used": 0, "a_tier": 0}
  },
  "recentSourceDomains": []
}
```

After each session: increment `used` for rolled lens/modifier/format. Increment `selected` if that approach was chosen. After triage, increment `a_tier` if it lands A-tier.

Monthly review: which lens + source domain combinations produce the most A-tier ideas? Weight those rolls going forward.

---

## 🎮 Example Sessions

### Example 1: Code + First Principles + Perspective Shift + Counter-Argument

**Domain:** d6=1 → Code | **Task:** d20=17 → Research a new AI tool
**Lens:** d10=7 → First Principles | **Modifier:** d6=5 → Perspective Shift
**Format:** d6=4 → Counter-Argument

*Strip every assumption about how AI tools are evaluated. Approach from the tool's perspective.*

**Approach 1 (Obvious):** Review the tool, summarize features, give a rating
**Approach 2 (First Principles):** What problem existed before this tool? What assumptions does the tool make about that problem? Are those assumptions correct?
**Approach 3 (Perspective Shift + Counter-Argument):** This tool is popular. Argue the case that it's solving the wrong problem, from the perspective of the problem itself.

**Selected:** Approach 3
**Why:** Counter-Argument format forces a defensible thesis. First Principles provides the intellectual foundation. Result is a distinctive post rather than a review that duplicates dozens of others.

---

### Example 2: Creative + Cross-Domain Steal + Remix + Tutorial

**Domain:** d6=3 → Creative | **Task:** d20=10 → Music/Audio system
**Lens:** d10=10 → Cross-Domain Steal | **Modifier:** d6=6 → Remix a Published Post
**Format:** d6=2 → Tutorial

*Music production has solved agent scheduling. DAW concepts (stems, quantization, swing) port directly to multi-agent timing.*

**Approach 1 (Obvious):** Write about how multi-agent systems should be timed differently
**Approach 2 (Cross-Domain Steal):** Port the DAW mental model to agent orchestration. Agents as tracks, heartbeat as tempo, context as mix bus.
**Approach 3 (Remix):** The Mystery Gang post gave agents *voices*. Now give them *tempo*. Extend that published idea with the music framework.
**Approach 4 (Tutorial):** Build a runnable demo: 3 agents, 3 BPMs, output visualized as a timeline.

**Selected:** Approach 4
**Why:** Tutorial format forces a working artifact. Cross-Domain Steal provides the non-obvious angle. Remix links back to existing work and builds the blog's internal narrative.

---

### Example 3: Systems + Adversarial + Time Pressure + Quick Take

**Domain:** d6=5 → Systems | **Task:** d20=13 → Security
**Lens:** d10=9 → Adversarial | **Modifier:** d6=1 → Time Pressure
**Format:** d6=3 → Quick Take

*Think like an attacker. Write it fast. One thesis.*

**Approach 1 (Obvious):** Security checklist for local AI deployments
**Approach 2 (Adversarial):** What's the real threat model for a hobbyist running Llama locally? (Hint: it's not what most guides focus on)
**Approach 3 (Quick Take):** 300 words. One thesis: "The threat model for local LLMs is completely different from cloud LLMs and most security guides miss this entirely."

**Selected:** Approach 3
**Why:** Quick Take rewards Time Pressure — ruthless scope reduction is the feature. Adversarial lens sharpens the thesis. The argument is genuinely underserved in current coverage.

---

## 🔄 When to Use This System

**Use when:**
- ✅ No active work (idle heartbeat)
- ✅ Starting a new research cycle
- ✅ Feeling stuck or producing repetitive ideas
- ✅ VS7 requests creativity or a new direction

**Skip when:**
- ❌ Mid-flow on existing task
- ❌ Time-critical execution work
- ❌ VS7 gave explicit instructions (follow them)
- ❌ Debugging (be direct, not creative)

---

## 📝 Meta-Rules

1. **Divergence is a tool, not a religion** — Use it when it helps
2. **Don't over-engineer the brainstorm** — 3 approaches in 2 minutes beats 10 in 20
3. **The new lenses are harder by design** — First Principles and Adversarial require genuine thought. Leaning on Analogy and Composition every cycle defeats the purpose.
4. **Format is strategy** — A 300-word Quick Take on a precise point beats a padded 800-word Narrative every time. Pick the format the idea deserves.
5. **Track what works** — The stats exist to learn from. If Adversarial + Cross-Domain Steal keeps producing A-tier ideas, weight toward those.
6. **The dice serve you** — If a roll produces something actively useless, reroll once. Don't reroll because the result is uncomfortable.

---

## 🎲 Quick Reference Card

```
1. d6  → Domain  (1-2 Code | 3-4 Creative | 5 Systems | 6 Meta)
2. d20 → What    (base task from domain table)
3. d10 → Lens    (1 Inversion | 2 Extremes | 3 Constraint | 4 Analogy |
                  5 Composition | 6 Elimination | 7 FirstPrinciples |
                  8 Temporal | 9 Adversarial | 10 CrossDomainSteal)
4. d6  → Twist   (1 TimePressure | 2 ToolRestriction | 3 ScopeExplosion |
                  4 CrossPollination | 5 PerspectiveShift | 6 RemixPost)
5. d6  → Format  (1 Narrative | 2 Tutorial | 3 QuickTake |
                  4 CounterArgument | 5 Comparison | 6 ThreeThings)
6. Brainstorm 3-5 approaches
7. Score: novelty + viability + impact + fun + diversity
8. Execute with conviction
```

**Mantra:** *"Chaos without divergence is noise. Chaos with divergence is music."*

---

## 🔗 Related Files

- `HEARTBEAT.md` — When to trigger this system
- `IDLE-RESEARCH.md` — Research sources (d100, now with cross-domain sources)
- `GAME-IDEAS.md` — Game concept roster
- `memory/chaos-stats.json` — Track what produces A-tier ideas

---

**Version:** 3.0 | **Updated:** 2026-02-21
**Changes from v2.0:** Lenses d6→d10, Modifiers d4→d6, Article Format roll added, LIFE→SYSTEMS domain
