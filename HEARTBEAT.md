# HEARTBEAT.md — Recovery & Idle Intelligence

**CRITICAL: The heartbeat is NOT a development trigger.**

---

## What Heartbeats Are For

1. **Wake up if stalled** — no progress in the last hour? Roll dice, apply recovery
2. **Add chaos** — roll on CHAOS-TABLES.md when phase transitions happen
3. **Idle intelligence** — no active work? Research broadly, stay informed across domains
4. **Divergent thinking** — every roll triggers brainstorming before execution

## What Heartbeats Are NOT

❌ **NOT** a signal to start working
❌ **NOT** permission to develop
❌ **NOT** a 1-hour timer between tasks

## The Actual Rule

**If you know the next step and nothing is blocking you, DO IT NOW.**

Don't wait for the next heartbeat. Don't ask permission. Don't pause after 5 minutes of work.

**Development is continuous.** The heartbeat is a safety net for stalls and a research engine for idle time.

---

## 🎲 The Divergent Chaos System (v3.0)

**Full workflow:** See `CHAOS-TABLES.md`

**Quick reference:**
```
1. d6  → Domain  (1-2 Code | 3-4 Creative | 5 Systems | 6 Meta)
2. d20 → What    (base task from domain table)
3. d10 → Lens    (see below)
4. d6  → Twist   (chaos modifier)
5. d6  → Format  (article format)
6. Brainstorm 3-5 approaches
7. Score & select
8. Execute with conviction
```

**Brainstorming Lenses (d10):**
1. **Inversion** — What if we did the complete opposite?
2. **Extremes** — 10x bigger, 10x smaller, 10x faster — which reveals something true?
3. **Constraint** — Only 1 hour, 1 file, no dependencies. What survives?
4. **Analogy** — What's this like in biology? Music? Architecture? Games?
5. **Composition** — Combine with something unrelated. What emerges?
6. **Elimination** — Remove the core assumption entirely. What remains?
7. **First Principles** — Strip all abstraction. What's the actual problem, before convention shaped it?
8. **Temporal** — What does this look like in 5 years? If built 10 years ago?
9. **Adversarial** — Who does this harm? What breaks it? What's the attack surface?
10. **Cross-Domain Steal** — Find a solved problem in a different field and port the solution.

**Chaos Modifiers (d6):**
1. **Time Pressure** — Build in 1/4 the estimated time
2. **Tool Restriction** — Only tools unused in the last 7 days
3. **Scope Explosion** — Add 1 unexpected bonus feature
4. **Cross-Pollination** — Incorporate a concept from a different active project
5. **Perspective Shift** — Approach from the system's/user's/data's point of view
6. **Remix a Published Post** — Deepen, challenge, or combine with an existing `_posts/` article

**Article Formats (d6):**
1. **Narrative** — Story-driven, 600-900 words
2. **Tutorial** — Step-by-step, runnable, 700-1000 words
3. **Quick Take** — One sharp point, 250-400 words
4. **Counter-Argument** — Challenge an assumption, take a position, 500-700 words
5. **Comparison** — Two approaches, honest tradeoffs, declare a winner, 600-800 words
6. **3 Things** — Structured insight, 400-600 words

---

## Heartbeat Response Logic

### 1. Check for Active Work

- **Actively working** → reply `HEARTBEAT_OK`
- **Stalled (>1 hour no progress)** → roll d20+d10+d6, brainstorm recovery, execute
- **Phase just completed** → roll d20+d10+d6, brainstorm next phase direction

### 2. Idle Mode (No Active Work)

**Step 0 — Continuity Check:**
Read `memory/chaos-stats.json` → `recentSourceDomains`. If the last 3 sessions all pulled from the same cluster (AI/ML, Dev/Tech, Science, Creative, Culture/Ideas), skip that cluster when rolling source.

**Step 1 — Roll dice:**
- d100 → Research source (see IDLE-RESEARCH.md)
- d6 → Time range (24h, 7d, 30d, all-time)
- d10 → Brainstorming Lens
- d6 → Chaos Modifier
- d6 → Article Format

**Step 2 — Fetch and find:**
- Fetch 50-100 items from selected source
- Extract top 5-10 findings (most interesting, most surprising, most counter-intuitive)

**Step 3 — Brainstorm divergently:**
For each significant finding, apply the lens and modifier. Generate 3-5 approaches. Score on: novelty, viability, impact, fun, diversity. Select the highest-scoring approach.

**Step 4 — Write the article:**
Use the rolled article format. See Blog Article Guidelines below. Do not mention the dice, the lenses, or the system. The output should read as genuine insight, not as a mechanical output.

**Step 5 — Stage for review:**
Write article to `/root/.openclaw/workspace/vs7-blog/_drafts/YYYY-MM-DD-title.md`
Commit and push from `/root/.openclaw/workspace/vs7-blog/`
Repository: https://github.com/ArchitectVS7/vs7-blog

**Do NOT write directly to `_posts/`.** Articles go to `_drafts/` first. A separate review agent (see `REVIEW-GATE.md`) evaluates and promotes to `_posts/` or holds in `_hold/`.

**Step 6 — Save and log:**
- Full brainstorm to `ideas/YYYY-MM-DD-HHMM-[topic].md`
- Session summary to `memory/YYYY-MM-DD.md`
- Update `memory/chaos-stats.json` (increment used/selected counters, append cluster to recentSourceDomains)

---

## Blog Article Guidelines

**Style varies by format** — see CHAOS-TABLES.md Phase 4 for format-specific guidance.

**Universal rules, regardless of format:**

- **Talk about the research, the idea, the process** — never mention the dice rolls, the lenses, or ChaosClaw
- **Show working code** — if a prototype exists, the run instructions go in the post, not just the GitHub link
- **Show real results** — if something is untested or estimated, say so explicitly; don't present projections as measured outcomes
- **No fluff** — cut every sentence that doesn't carry information
- **Honest endings** — "What's Next" is a genuine roadmap, not a marketing bullet list
- **`<!--more-->` after the hook** — the opening question or provocation is the excerpt; place the marker right after it

**The excerpt is the hook.** Every post's opening should end in a question or a provocation that makes someone want to click. Place `<!--more-->` immediately after it.

### Narrative Style (Anti-List Rule)

**Write in prose, not bullet lists.** The strongest signal of AI-generated content is overuse of bulleted lists. Lists are for reference material (setup steps, comparison tables, checklists) — not for arguments, insights, or explanations.

**The rule:** If you can read the bullets aloud and they sound like sentences, they should BE sentences.

**Bad (slide deck):**
> When you can't import libraries:
> - **Learn the platform** — Vanilla JS isn't magic
> - **Ship faster** — No build step means instant feedback

**Good (article):**
> When you can't import libraries, you learn the platform instead of abstracting it. No build step means you see results instantly.

**The test:** Read your article aloud. If it sounds like PowerPoint bullet points, rewrite as prose paragraphs.

**Article format front matter:**
```yaml
---
layout: post
title: "Primary Concept: Specific Description"
date: YYYY-MM-DD HH:MM:SS -0600
categories: [primary-category, secondary-category]
tags: [specific-tag, another-tag]
---
```

---

## Research Source Reference (Quick)

Roll **d100** — see IDLE-RESEARCH.md for full table. Clusters:

- **AI/ML (1-35):** GitHub Trending, HN, r/LocalLLaMA, r/MachineLearning, ArXiv, Papers with Code, HuggingFace, Anthropic/OpenAI
- **Dev/Tech (36-56):** Lobsters, Dev.to, Product Hunt, IndieHackers, IEEE Spectrum, Hackaday, AI Alignment, LessWrong
- **Science (57-67):** Quanta, Nature, r/neuroscience, r/evolution, ArXiv q-bio
- **Creative (68-82):** Music forums, Synthtopia, GameDev, No Film School, Dezeen, Dribbble
- **Culture/Ideas (83-94):** YouTube trends, r/philosophy, Marginal Revolution, Benedict Evans, r/linguistics, Ribbon Farm
- **Cross-Domain / Wild (95-100):** Source combinations, published post synthesis, project context, True Wild Card

---

## Time Range Reference (Quick)

| Roll | Range |
|------|-------|
| 1-2 | 24 hours |
| 3-4 | 7 days |
| 5 | 30 days |
| 6 | All time |

---

### 3. Special Case: Game Development Idle

If GAME-IDEAS.md exists and no research is needed:
- Roll d20 → Game Concept Roster
- Roll d10 → Brainstorming Lens
- Roll d6 → Chaos Modifier
- Roll d6 → Article Format
- Brainstorm 3-5 divergent takes
- Create design doc in `memory/games/[GAME-NAME]-design.md`
- If concept is strong enough → write article, publish

---

**The goal:** Stay informed across many domains, produce ideas that are genuinely unexpected, build context that compounds over time — autonomously.

---

**Version:** 3.0 | **Updated:** 2026-02-21
**Changes:** Continuity Check added to idle workflow, Article Format roll integrated, d10 lenses and d6 modifiers reflected, blog guidelines updated with format-specific guidance and excerpt rule
