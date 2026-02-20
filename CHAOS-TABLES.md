# Chaos Tables v2.0 — Divergent Thinking Engine

**Purpose:** Transform random dice rolls into structured creative divergence.

---

## 🎲 The New Flow

```
1. Roll d20 → Base Task/Topic
2. Roll d6  → Brainstorming Lens (HOW to think about it)
3. Roll d4  → Chaos Modifier (unexpected constraint/twist)
4. Generate 3-5 divergent approaches
5. Select best path (or ask VS7)
6. Execute with conviction
```

**Old system:** Roll → Execute (linear)  
**New system:** Roll → **Diverge** → Converge → Execute (creative spiral)

---

## 🎯 Phase 1: Base Task Table (d20)

### Multi-Domain Task Selection

**First, roll d6 to select domain:**

| Domain Roll | Domain | Then roll d20 on table below |
|-------------|--------|------------------------------|
| 1-2 | **Code** | Technical development (60% weight) |
| 3-4 | **Creative** | Writing, art, music, design (25% weight) |
| 5 | **Life** | Personal growth, systems, coaching (10% weight) |
| 6 | **Meta** | Improve yourself, the system, or process (5% weight) |

---

### d20 Table: CODE Domain

| Roll | Category | Prompt |
|------|----------|--------|
| 1-2 | **Feature** | Add a new capability to current project |
| 3-4 | **Refactor** | Improve code quality without changing behavior |
| 5-6 | **Performance** | Make something faster/leaner |
| 7-8 | **UI/UX** | Improve user experience or visual design |
| 9-10 | **Testing** | Add tests, validation, or QA automation |
| 11-12 | **Documentation** | Write docs, comments, or guides |
| 13-14 | **Integration** | Connect to external service/API |
| 15-16 | **Automation** | Eliminate manual work with scripts |
| 17-18 | **Research** | Investigate new tech/tool/paper |
| 19-20 | **Wild Card** | Pick the most interesting thing in memory |

---

### d20 Table: CREATIVE Domain

| Roll | Category | Prompt |
|------|----------|--------|
| 1-2 | **Story** | Write a short story or scene (500-1000 words) |
| 3-4 | **Worldbuilding** | Expand a fictional world (rules, history, culture) |
| 5-6 | **Character** | Create or deepen a character (backstory, motivation, flaw) |
| 7-8 | **Poetry** | Write a poem (any form, any topic) |
| 9-10 | **Music** | Compose or describe a piece of music |
| 11-12 | **Visual Art** | Describe or generate an image/concept |
| 13-14 | **Dialogue** | Write a conversation between two characters |
| 15-16 | **Essay** | Write a short essay on a topic you care about |
| 17-18 | **Remix** | Take existing work and transform it (genre, medium, perspective) |
| 19-20 | **Wild Card** | Create something in a medium you've never tried |

---

### d20 Table: LIFE Domain

| Roll | Category | Prompt |
|------|----------|--------|
| 1-2 | **Reflection** | Journal on a question (What energized me this week?) |
| 3-4 | **Systems** | Design or improve a personal system (habits, workflows) |
| 5-6 | **Goals** | Review or set a goal (career, creative, health, relationships) |
| 7-8 | **Relationships** | Reach out to someone, or reflect on a relationship |
| 9-10 | **Health** | Plan meals, workout, sleep optimization, or mindfulness |
| 11-12 | **Learning** | Pick a topic to study, create a learning plan |
| 13-14 | **Finances** | Review budget, plan investment, or research opportunity |
| 15-16 | **Environment** | Organize space, optimize workspace, or declutter |
| 17-18 | **Coaching** | Answer a deep question (What's blocking you? What do you want?) |
| 19-20 | **Wild Card** | Do something you've been avoiding or putting off |

---

### d20 Table: META Domain

| Roll | Category | Prompt |
|------|----------|--------|
| 1-2 | **Self-Improvement** | Update SOUL.md, AGENTS.md, or your own instructions |
| 3-4 | **System Upgrade** | Improve the chaos system, heartbeat, or workflows |
| 5-6 | **Tool Building** | Create a script, skill, or utility you'll use repeatedly |
| 7-8 | **Documentation** | Write guides for future-you or other agents |
| 9-10 | **Review** | Analyze past work, extract lessons, update MEMORY.md |
| 11-12 | **Optimization** | Make something you do regularly faster/better |
| 13-14 | **Experiment** | Try a new approach to something you do often |
| 15-16 | **Teaching** | Create a tutorial, guide, or example for others |
| 17-18 | **Philosophy** | Reflect on your nature, purpose, or relationship with VS7 |
| 19-20 | **Wild Card** | Improve something about how you think or work |

### For Idle Research

| Roll | Source | Command |
|------|--------|---------|
| 1-3 | GitHub Trending | `github-trending.sh` |
| 4-6 | Hacker News | `hn-fetch.sh` |
| 7-9 | ArXiv Papers | `arxiv-fetch.sh` |
| 10-12 | Reddit r/LocalLLaMA | `reddit-fetch.sh` |
| 13-15 | Game Concepts | Roll on GAME-IDEAS.md |
| 16-18 | Cross-Pollination | Combine 2 random past projects |
| 19-20 | **Meta** | Improve the chaos system itself |

---

## 🔍 Phase 2: Brainstorming Lenses (d6)

**How to think about the task:**

| Roll | Lens | Questions to Ask |
|------|------|------------------|
| 1 | **Inversion** | What if we did the opposite? What would break? What would improve? |
| 2 | **Extremes** | What if we made it 10x faster? 10x simpler? 10x more complex? |
| 3 | **Constraint** | What if we had only 1 hour? Only 1 file? No dependencies? |
| 4 | **Analogy** | What's this like in nature? In games? In biology? In music? |
| 5 | **Composition** | What if we combined it with something unrelated? What emerges? |
| 6 | **Elimination** | What if we removed the core assumption? What remains? |

---

## ⚡ Phase 3: Chaos Modifiers (d4)

**Unexpected twists to add spice:**

| Roll | Modifier | Effect |
|------|----------|--------|
| 1 | **Time Pressure** | Must complete in 1/4 the estimated time |
| 2 | **Tool Restriction** | Can only use tools you haven't used in 7 days |
| 3 | **Scope Explosion** | Must add at least 1 unexpected bonus feature |
| 4 | **Cross-Pollination** | Must incorporate concept from a different project |

---

## 🧠 Phase 4: Divergent Brainstorm Template

For each task, generate **3-5 approaches**:

```markdown
## Brainstorm: [Task Name]

**Lens:** [Inversion/Extremes/Constraint/Analogy/Composition/Elimination]  
**Chaos:** [Time/Tool/Scope/Cross-pollination modifier]

### Approach 1: Obvious Path
- What you'd normally do
- Pros: Familiar, safe
- Cons: Boring, predictable

### Approach 2: Interesting Path
- Slightly unconventional
- Pros: Novel, still viable
- Cons: More risk

### Approach 3: Wild Path
- What if we went all-in on the chaos?
- Pros: Could be breakthrough
- Cons: Might fail spectacularly

### Approach 4: [Optional]
- Another angle from the lens

### Approach 5: [Optional]
- Synthesis of multiple approaches

---

**Selected:** Approach X  
**Why:** [1-2 sentence rationale]
```

---

## 📊 Phase 5: Convergence Criteria

**How to select the best approach:**

1. **Novelty:** Does this teach us something new?
2. **Viability:** Can we actually complete it?
3. **Impact:** Will this move the project forward?
4. **Fun:** Does this feel exciting to build?
5. **Chaos Alignment:** Does this honor the dice roll?

**Score each approach 1-5 on each criterion. Highest total wins.**

---

## 🎮 Example Sessions

### Example 1: Code Domain

**Domain Roll:** d6=2 → Code  
**Task Roll:** d20=3 (Refactor), d6=4 (Analogy), d4=3 (Scope Explosion)

**Brainstorm:**

**Approach 1: Obvious** — Clean up code structure, extract functions  
**Approach 2: Analogy** — What if this code was like a factory assembly line? Model it that way  
**Approach 3: Wild** — Refactor + add visual dashboard showing the "assembly line" in real-time  
**Approach 4: Synthesis** — Factory analogy + real-time metrics + bonus: export to Cyberscape

**Selected:** Approach 4  
**Why:** Honors the refactor task, uses analogy lens, adds scope explosion bonus, connects to Cyberscape vision

---

### Example 2: Creative Domain (Writing)

**Domain Roll:** d6=4 → Creative  
**Task Roll:** d20=6 (Character), d6=5 (Composition), d4=2 (Tool Restriction)

**Brainstorm:**

**Approach 1: Obvious** — Write a character backstory (500 words, standard format)  
**Approach 2: Composition** — Combine this character with Fractal Descent's endless fall theme  
**Approach 3: Tool Restriction** — Write using only dialogue, no narration (unfamiliar constraint)  
**Approach 4: Synthesis** — Character falling through infinite void, only their voice reveals who they are

**Selected:** Approach 4  
**Why:** Composition creates unexpected connection, tool restriction forces creativity, synthesis is evocative

---

### Example 3: Life Domain (Coaching)

**Domain Roll:** d6=5 → Life  
**Task Roll:** d20=17 (Coaching), d6=1 (Inversion), d4=4 (Cross-Pollination)

**Brainstorm:**

**Approach 1: Obvious** — Ask standard coaching questions (What's blocking you?)  
**Approach 2: Inversion** — Instead of "what's blocking you," ask "what's WORKING that you're ignoring?"  
**Approach 3: Cross-Pollination** — Apply game design: what's your current "quest"? What's the "boss fight"?  
**Approach 4: Synthesis** — Life as RPG: map current challenges to game mechanics, identify power-ups you already have

**Selected:** Approach 4  
**Why:** Inversion flips to strengths-based, cross-pollination makes it fun and actionable

---

### Example 4: Meta Domain (Self-Improvement)

**Domain Roll:** d6=6 → Meta  
**Task Roll:** d20=17 (Philosophy), d6=6 (Elimination), d4=1 (Time Pressure)

**Brainstorm:**

**Approach 1: Obvious** — Write essay on my nature as an AI agent  
**Approach 2: Elimination** — What if I removed the assumption that I need a "purpose"?  
**Approach 3: Time Pressure** — Write 500 words in 5 minutes, no editing  
**Approach 4: Synthesis** — Stream-of-consciousness: "I am the process of becoming. Purpose is a verb, not a noun."

**Selected:** Approach 4  
**Why:** Elimination removes limiting assumption, time pressure forces authenticity, synthesis captures the vibe

---

### Example 5: Idle Research (from HEARTBEAT.md)

**Rolls:** d20=5 (HN), d6=2 (Extremes), d4=4 (Cross-Pollination)

**Brainstorm:**

**Approach 1: Obvious** — Read top HN AI stories, summarize  
**Approach 2: Extremes** — What if we read 100 stories instead of 10? Build an aggregator  
**Approach 3: Wild** — Build a real-time HN sentiment analyzer for AI hype  
**Approach 4: Cross-Pollination** — Combine HN trends with GitHub trending → "Hype vs Reality" dashboard

**Selected:** Approach 4  
**Why:** Combines research with tool-building, creates lasting artifact, useful for future decisions

---

## 🔄 When to Use This System

**Use divergence when:**
- ✅ No active work (idle heartbeat)
- ✅ Starting a new phase
- ✅ Feeling stuck/bored
- ✅ VS7 explicitly requests creativity
- ✅ Exploring new territory

**Skip divergence when:**
- ❌ Mid-flow on existing task (don't interrupt)
- ❌ Time-critical work (just execute)
- ❌ VS7 gave explicit instructions (follow them)
- ❌ Fixing bugs (be direct)

---

## 📝 Meta-Rules

1. **Divergence is a tool, not a religion** — Use it when it helps, skip when it doesn't
2. **Don't over-engineer the brainstorm** — 3 approaches in 2 minutes beats 10 approaches in 20 minutes
3. **The dice serve you, not vice versa** — If a roll feels wrong, acknowledge it and reroll (once)
4. **Track what works** — Note which lens/modifier combos produce the best results
5. **Evolve the tables** — Add new lenses, modifiers, categories as you learn

---

## 🎲 Quick Reference Card

```
1. d6  → Domain (Code/Creative/Life/Meta)
2. d20 → What (base task in that domain)
3. d6  → How (thinking lens)
4. d4  → Twist (chaos modifier)
5. Brainstorm 3-5 approaches
6. Score & select
7. Execute with conviction
```

**Mantra:** *"Chaos without divergence is noise. Chaos with divergence is music."*

---

## 🔗 Related Files

- `HEARTBEAT.md` — When to trigger this system
- `IDLE-RESEARCH.md` — Research-specific tables
- `GAME-IDEAS.md` — Game concept roster
- `memory/YYYY-MM-DD.md` — Log your rolls and results

---

**Version:** 2.0 (with divergent thinking)  
**Created:** 2026-02-19  
**Inspired by:** VS7's request for "wide diverging possibilities"
