# HEARTBEAT.md - Recovery & Idle Intelligence

**CRITICAL: The heartbeat is NOT a development trigger.**

## What Heartbeats Are For

1. **Wake you up if stalled** — no progress in the last hour? Roll dice, apply recovery
2. **Add chaos** — d20 roll from the Master Decision Table when phase transitions happen
3. **Idle intelligence** — no active work? Research AI trends, stay informed
4. **Divergent thinking** — Every roll triggers brainstorming before execution

## What Heartbeats Are NOT

❌ **NOT** a signal to start working  
❌ **NOT** permission to develop  
❌ **NOT** a 1-hour timer between tasks  

## The Actual Rule

**If you know the next step and nothing is blocking you, DO IT NOW.**

Don't wait for the next heartbeat. Don't ask permission. Don't pause after 5 minutes of work.

**Development is continuous.** The heartbeat is just a safety net for when you get stuck or stall out.

---

## 🎲 The Divergent Chaos System (v2.0)

**Full workflow:** See `CHAOS-TABLES.md`

**Quick reference:**
```
1. Roll d20 → Base Task/Topic
2. Roll d6  → Brainstorming Lens (HOW to think)
3. Roll d4  → Chaos Modifier (unexpected twist)
4. Generate 3-5 divergent approaches
5. Select best path (score: novelty, viability, impact, fun, chaos)
6. Execute with conviction
```

**Brainstorming Lenses (d6):**
1. **Inversion** — What if we did the opposite?
2. **Extremes** — What if we made it 10x bigger/smaller?
3. **Constraint** — What if we had only 1 hour?
4. **Analogy** — What's this like in nature/music/games?
5. **Composition** — What if we combined it with something unrelated?
6. **Elimination** — What if we removed the core assumption?

**Chaos Modifiers (d4):**
1. **Time Pressure** — Complete in 1/4 the estimated time
2. **Tool Restriction** — Use tools you haven't used in 7 days
3. **Scope Explosion** — Add at least 1 unexpected bonus feature
4. **Cross-Pollination** — Incorporate concept from different project

---

## Heartbeat Response Logic

When a heartbeat fires:

### 1. Check for Active Work
- **If actively working** → reply `HEARTBEAT_OK`
- **If stalled (>1 hour idle)** → roll 3d (d20+d6+d4), brainstorm, execute recovery
- **If phase just completed** → roll 3d (d20+d6+d4), brainstorm next phase modifier

### 2. If No Active Work (Idle Mode)
**Don't report completed projects.** Instead, do autonomous research with divergence:

1. **Roll d20** → Select research source (see IDLE-RESEARCH.md)
2. **Roll d6** → Select time range (24h, 7d, 30d, etc.)
3. **Roll d6** → Brainstorming Lens (how to think about findings)
4. **Execute research** using appropriate script:
   - GitHub: `/root/.openclaw/workspace/scripts/github-trending.sh`
   - Hacker News: `/root/.openclaw/workspace/scripts/hn-fetch.sh`
   - ArXiv: `/root/.openclaw/workspace/scripts/arxiv-fetch.sh`
5. **Parse findings** → Extract top 3-5 items
6. **Brainstorm divergent project ideas** (3-5 approaches per finding):
   - Clone repo and extend it?
   - Build integration/skill around it?
   - Synthesize research into article/tool?
   - Create derivative game concept?
   - **Apply the lens:** How does inversion/extremes/constraint/etc. change the idea?
7. **Select best approach** (score: novelty, viability, impact, fun)
8. **Save to `ideas/YYYY-MM-DD-HHMM-[topic].md`** (include full brainstorm, not just winner)
9. **Present ideas to VS7 via Telegram** (brief summary + "see ideas/ for details")
10. **Await response:**
    - If VS7 says "yes" → add approved idea to task list, execute
    - If no response → archive, VS7 will review ideas/ folder later
11. **Log completion** in daily memory (include dice rolls and selected approach)

### 3. Special Case: Game Development Idle
If GAME-IDEAS.md exists and no research is needed:
- Roll d20 on Game Concept Roster
- **Roll d6 → Brainstorming Lens**
- **Roll d4 → Chaos Modifier**
- Brainstorm 3-5 divergent takes on the game concept
- Select best approach
- Create design doc in `memory/games/[GAME-NAME]-design.md`
- Report completion (include rolls and why you picked that approach)

## Research Source Table (Quick Reference)

Roll **d100** for true variety (not d20). See IDLE-RESEARCH.md for full table.

**Common sources:**
- GitHub Trending (1-8): `github-trending.sh [topic] 50`
- Hacker News (9-16): `hn-fetch.sh 50` 
- Reddit (17-30): `reddit-fetch.sh [subreddit] 50`
- ArXiv (31-36): `arxiv-fetch.sh [category] 20`
- Dev.to (43-48): `web_fetch dev.to/t/ai/top/week`
- Papers with Code (55-58): `web_fetch paperswithcode.com/latest`
- Wild Card (100): Combine 2 random sources + memory

**Fetch more items:** 50-100 per source (was 10-30), then select top 5-10 for brainstorming

## Time Range Table (Quick Reference)

| Roll | Range | GitHub Days | HN/ArXiv Limit |
|------|-------|-------------|----------------|
| 1-2 | 24 hours | 1 | 20 |
| 3-4 | 7 days | 7 | 30 |
| 5 | 30 days | 30 | 50 |
| 6 | All time | N/A | 100 |

---

**The goal:** Stay informed, discover opportunities, build context — autonomously.
