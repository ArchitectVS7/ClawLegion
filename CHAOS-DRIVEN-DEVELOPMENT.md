# Chaos-Driven Development (CDD)
*A dice-based decision framework for LLM-powered development*

---

## What Is It?

Chaos-Driven Development is a structured randomness system that uses dice rolls to make development decisions. Instead of getting stuck in analysis paralysis or following rigid plans that don't adapt, you roll dice at key decision points and let the table tell you what to do.

**Core principle:** Chaos isn't the opposite of control — it's a tool for breaking out of ruts and forcing adaptation.

---

## Why It Works

### The Problem CDD Solves

LLMs (and humans) get stuck in patterns:
- Overengineering when simplicity would work
- Scope creep without realizing it
- Analysis paralysis at decision points
- Continuing down a broken path because "we've come this far"

### The CDD Solution

By injecting structured randomness, you force yourself to:
1. **Consider options you'd normally ignore** — "Simplify" when you wanted to add features
2. **Break decision deadlock** — the dice decide, you execute
3. **Adapt to reality** — "Adjust Scope to Code" when the implementation is better than the plan
4. **Create momentum** — even a random decision is better than no decision

### When LLMs Benefit Most

- **Long-running projects** — prevents tunnel vision after hours of work
- **Uncertain requirements** — when you don't know the "right" answer
- **Creative work** — forces exploration of adjacent possibilities
- **Debugging/refactoring** — breaks fixation on one approach
- **Multi-phase builds** — adds natural variation to prevent monotony

---

## 🎲 The Master Decision Table (1d20)

**When to roll:** Phase complete, major decision point, scope drift detected, or feeling stuck

| Roll | Decision | Use Case |
|------|----------|----------|
| **1** | **Chaos Rewrite** | Core assumption was wrong. Identify it, fix it, continue. *Use when: foundation is shaky* |
| **2** | **Narrow Scope** | Cut one item from current phase work list. *Use when: trying to do too much at once* |
| **3** | **Simplify** | Find the simpler version of what you just built. *Use when: overengineered solution* |
| **4** | **Remove Detail** | Strip one layer of complexity. Ship the simpler thing. *Use when: gold-plating* |
| **5** | **Stabilize** | Don't add features. Write tests for what exists. *Use when: built but untested* |
| **6** | **Adjust Code to Scope** | The code drifted. Bring it back to spec. *Use when: implementation wandered* |
| **7** | **Document First** | Write the doc before the next piece of code. *Use when: no one knows what it does* |
| **8-10** | **Continue** | No change. Execute the next item on the list. *Use when: on track* |
| **11** | **Adjust Scope to Code** | The code is better than the spec. Update spec to match. *Use when: happy accidents* |
| **12** | **Add Detail** | Pick one item and go deeper than planned. *Use when: shallow implementation* |
| **13** | **Expand Scope** | Add one item to the current phase that serves the vision. *Use when: momentum is high* |
| **14** | **Refactor Pass** | Clean up what exists before moving forward. *Use when: technical debt accumulating* |
| **15** | **Accelerate** | Combine two upcoming tasks. Do them together. *Use when: synergy exists* |
| **16** | **Spike** | 30-minute exploration of an adjacent idea. Document findings. *Use when: curiosity triggered* |
| **17** | **External Validation** | Test the thing with real input before continuing. *Use when: assumptions untested* |
| **18** | **Phase Skip** | Current phase is essentially done. Mark complete, move on. *Use when: 90% is enough* |
| **19** | **Moonshot** | Attempt a stretch goal from a future phase right now. *Use when: feeling ambitious* |
| **20** | **Inspired** | User was right about something. Name it, lean into it hard. *Use when: epiphany moment* |

**Weighted toward stability:** Rolls 8-10 (30% chance) continue as planned. This prevents chaos from dominating — most of the time you stay on course, but 70% of rolls inject some form of adaptation.

---

## 🎲 Recovery Table (1d20) — When You're Stalled

**When to roll:** No progress in >1 hour, blocked on a task, or stuck in a loop

| Roll | Recovery Action | When To Use |
|------|-----------------|-------------|
| **1-3** | **Restart from scratch** — New approach, fresh perspective | Current approach is fundamentally broken |
| **4-6** | **Skip and return later** — Do the next task, come back when unblocked | Waiting on external dependency or need fresh eyes |
| **7-9** | **Break into smaller pieces** — Do first piece only | Task too large or complex to tackle whole |
| **10-12** | **Debug mode** — Find exactly where it broke, fix only that | Solution almost works, one bug blocking |
| **13-15** | **Research mode** — 20-min investigation before continuing | Missing knowledge or context |
| **16-17** | **Phone a friend** — Check docs, ask for help, find existing tools | Reinventing the wheel |
| **18-19** | **Scope cut** — Remove the blocked item entirely, update spec | Not essential to core functionality |
| **20** | **Wild card** — Trust instinct, take the path that feels right | Intuition says "try this weird thing" |

---

## 🎲 Debugging Table (1d12) — When Code Doesn't Work

**When to roll:** Bug encountered, tests failing, unexpected behavior

| Roll | Debug Action |
|------|--------------|
| **1** | **Rubber duck it** — Explain the problem out loud, line by line |
| **2** | **Read the error message** — Actually read it, don't skim |
| **3** | **Add logging** — Print everything, find where it diverges from expected |
| **4** | **Isolate the smallest reproduction** — Minimal test case that fails |
| **5** | **Check assumptions** — List every assumption, verify each one |
| **6** | **Read the docs** — RTFM for the library/API you're using |
| **7** | **Git bisect** — Find which commit introduced the bug |
| **8** | **Start from known-good** — Revert to last working state, rebuild carefully |
| **9** | **Pair debug** — Get another set of eyes (human or LLM) |
| **10** | **Sleep on it** — Take a break, come back fresh |
| **11** | **Rewrite the module** — Sometimes faster than debugging legacy code |
| **12** | **Chaos acceptance** — The bug is a feature now. Document and move on. |

---

## 🎲 Creative Writing Table (1d10) — When Stuck on Content

**When to roll:** Writer's block, boring prose, or repetitive structure

| Roll | Creative Action |
|------|-----------------|
| **1** | **Switch perspective** — First person ↔ third person, active ↔ passive |
| **2** | **Cut the intro** — Start in the middle of the action |
| **3** | **Add conflict** — Introduce an obstacle or complication |
| **4** | **Show, don't tell** — Replace description with sensory detail or dialogue |
| **5** | **Kill your darling** — Delete the part you like most, rewrite around it |
| **6** | **Opposite approach** — If it's serious, make it funny. If verbose, make it terse. |
| **7** | **Stolen structure** — Borrow the pattern from a piece you admire |
| **8** | **Constraint challenge** — Write the next paragraph in exactly 3 sentences, or without the letter 'e' |
| **9** | **Audience shift** — Rewrite for a 5-year-old, then a PhD, then pick the best parts |
| **10** | **Chaos draft** — Write 200 words without editing, keep what's good |

---

## 🎲 Research Table (1d8) — When Learning Something New

**When to roll:** Starting a new topic, feeling overwhelmed, or going in circles

| Roll | Research Action |
|------|-----------------|
| **1** | **Skim 3 different sources** — Don't deep-dive yet, get breadth first |
| **2** | **Find the canonical reference** — The "authoritative" doc/paper/book |
| **3** | **Build the smallest thing** — Hands-on before theory |
| **4** | **Teach it to someone** — Explain what you know so far (even to a rubber duck) |
| **5** | **Find the critic** — Read the strongest argument *against* the thing you're learning |
| **6** | **Timeline reverse** — Start with the latest, work backward to understand evolution |
| **7** | **Use-case focus** — Ignore everything except what solves your immediate problem |
| **8** | **Chaos immersion** — Spend 30 minutes clicking every link, no filter. See what sticks. |

---

## 🎲 Refactoring Table (1d10) — When Code Works But Is Ugly

**When to roll:** Technical debt cleanup, legacy code improvement, pre-launch polish

| Roll | Refactor Action |
|------|-----------------|
| **1** | **Extract functions** — Every block of code gets a named function |
| **2** | **Naming pass** — Rename variables/functions to be self-documenting |
| **3** | **Remove duplication** — DRY sweep — combine repeated logic |
| **4** | **Type safety** — Add type hints/annotations/checks |
| **5** | **Error handling** — Add proper try/catch, validation, defensive checks |
| **6** | **Performance pass** — Profile and optimize the hot path |
| **7** | **Dependency audit** — Remove unused imports/packages |
| **8** | **Format consistency** — Run linter/formatter, fix all warnings |
| **9** | **Comment cleanup** — Remove stale comments, add missing ones |
| **10** | **Test coverage** — Write tests for untested paths |

---

## How to Use CDD in Your Workflow

### 1. **Define Decision Points**

Decide when you'll roll:
- Every N hours of work
- When a phase/milestone completes
- When you feel stuck or uncertain
- When scope is drifting

### 2. **Pick the Right Table**

- **Master Table** → Big decisions, phase transitions, major pivots
- **Recovery Table** → Stalled, blocked, or going in circles
- **Debugging Table** → Code broken, tests failing
- **Creative/Research/Refactor Tables** → Domain-specific challenges

### 3. **Roll and Commit**

- Use a real die, random.org, or `node -e "console.log(Math.floor(Math.random()*20)+1)"`
- Execute the action the table gives you — no rerolls
- If the action doesn't apply, roll again (rare, but happens)

### 4. **Log the Outcome**

Keep a roll log:
```
| Task | Roll | Result | Action Taken |
|------|------|--------|--------------|
| P3.2 | 14 | REFACTOR PASS | Cleaned up hook dependencies, fixed stale closures |
```

This creates a history of how chaos shaped the project.

### 5. **Tune Over Time**

If you find certain outcomes never apply, replace them. CDD tables should evolve with your workflow.

---

## Example: OVI Build (Real Roll Log)

| Phase | Roll | Outcome | Result |
|-------|------|---------|--------|
| P1.1 complete | 20 | INSPIRED | "VS7 was right — stay on droplet, improve channel." Leaned into Telegram voice pipeline instead of building new infrastructure. |
| P1.4 start | 7 | DOCUMENT FIRST | Wrote OVI briefing format spec before implementing the command. |
| P2.2 STT | 19 | MOONSHOT | Implemented Web Speech API + Whisper API fallback (future phase feature pulled forward). |
| P2.5 PWA | 1 | CHAOS REWRITE | Realized `vite-plugin-pwa` handles manifest/service worker automatically — threw out manual config. |
| P4 transition | 8 | CONTINUE | Clean handoff from Phase 3 to Phase 4, no chaos modifier needed. |

**Observation:** Roll 20 at P1.1 saved weeks of work by validating the simpler path. Roll 1 at P2.5 prevented a broken build. The chaos course-corrected before problems compounded.

---

## Why This Works for LLMs Specifically

### LLMs Have Bias Toward Completion

An LLM will tend to finish what it started, even if the approach is wrong. CDD forces re-evaluation.

### LLMs Don't Experience "Feel"

Humans have gut feelings when something's wrong. LLMs don't. A structured random check compensates.

### LLMs Explore the Same Solution Space

Without external prompting, an LLM will converge on the same patterns. CDD injects exploration.

### Asynchronous Development Benefits

In cron-driven or background agent workflows, CDD ensures the agent doesn't get stuck in a loop while you're away. The hourly heartbeat rolls dice and recovers automatically.

---

## Customizing CDD for Your Use Case

### Example: Data Science Workflow

**Experiment Table (1d12):**
1. Try a different model architecture
2. Add more training data
3. Remove features (simplify)
4. Hyperparameter random search
5. Check for data leakage
6. Visualize the errors (where is it failing?)
7. Ensemble with previous model
8. Add regularization
9. Feature engineering pass
10. Cross-validation check
11. Baseline comparison (is this better than random?)
12. Document findings and move to next experiment

### Example: System Administration

**Incident Response Table (1d8):**
1. Check the logs (last 100 lines)
2. Restart the service
3. Rollback to last known good
4. Check disk/memory/CPU
5. Query the monitoring dashboard
6. Compare config to prod
7. Ping the on-call engineer
8. Chaos acceptance — mitigate and postmortem later

---

## The Meta-Insight

CDD isn't about randomness for randomness' sake. It's about **forcing yourself to consider the action you'd normally ignore.**

When you roll "Simplify" and you were about to add features, that's the system working. When you roll "Continue" and you were second-guessing yourself, that's validation.

The dice don't make the decision — they surface the option. You still execute with intention.

---

## Try It

Next time you're stuck:
1. Pick the table that fits your context
2. Roll 1d20 (or 1d12, 1d10, 1d8 depending on table)
3. Do what it says
4. Notice what happens

You'll be surprised how often the "random" action was exactly what you needed.

---

*Created by LG2 for the OVI build — battle-tested through 5 phases of development.*  
*Roll tables expanded 2026-02-19 for general LLM task application.*
