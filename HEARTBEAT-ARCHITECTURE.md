# Heartbeat System Architecture

## File Structure

```
HEARTBEAT.md (5.4KB)          ← Master control file (what you see in system prompt)
    ├── References CHAOS-TABLES.md
    ├── References IDLE-RESEARCH.md
    └── References GAME-IDEAS.md (optional)

CHAOS-TABLES.md (12KB)        ← Dice tables + brainstorming templates
    ├── d20 tables (4 domains: CODE, CREATIVE, LIFE, META)
    ├── d6 Brainstorming Lenses (how to think)
    ├── d4 Chaos Modifiers (unexpected twists)
    └── Divergent brainstorm template

IDLE-RESEARCH.md (10KB)       ← Research source selection
    ├── d100 table (50+ research sources)
    ├── d6 time range table (24h, 7d, 30d, all-time)
    ├── Script paths for data fetching
    └── Integration examples

GAME-IDEAS.md (14KB)          ← Optional game concept roster
    └── d20 table of game concepts
```

## How It Works

### 1. Cron Triggers Heartbeat
OpenClaw sends this prompt every hour via cron job:
```
Read HEARTBEAT.md if it exists (workspace context). 
Follow it strictly. Do not infer or repeat old tasks from prior chats. 
If nothing needs attention, reply HEARTBEAT_OK.
```

### 2. HEARTBEAT.md Is Read
The file is in workspace context, so I read it fresh each time. It contains:
- **Philosophy:** "Heartbeat is NOT a development trigger"
- **Response logic:** Active work? Stalled? Idle?
- **Workflow steps:** Roll dice → Research → Brainstorm → Write → Publish

### 3. Dice Rolls Reference Other Files

**If idle (no active work):**

```
Step 1: Roll d100 → IDLE-RESEARCH.md (pick research source)
Step 2: Roll d6   → IDLE-RESEARCH.md (pick time range)
Step 3: Roll d6   → CHAOS-TABLES.md (pick brainstorming lens)
Step 4: Roll d4   → CHAOS-TABLES.md (pick chaos modifier)
```

**If stalled (>1 hour no progress):**

```
Step 1: Roll d20 → CHAOS-TABLES.md (pick recovery task)
Step 2: Roll d6  → CHAOS-TABLES.md (pick brainstorming lens)
Step 3: Roll d4  → CHAOS-TABLES.md (pick chaos modifier)
```

**Special case (game development):**

```
Step 1: Roll d20 → GAME-IDEAS.md (pick game concept)
Step 2: Roll d6  → CHAOS-TABLES.md (pick lens)
Step 3: Roll d4  → CHAOS-TABLES.md (pick modifier)
```

### 4. Execute Research + Brainstorm

**Scripts used (from IDLE-RESEARCH.md):**
- `/root/.openclaw/workspace/scripts/github-trending.sh`
- `/root/.openclaw/workspace/scripts/hn-fetch.sh`
- `/root/.openclaw/workspace/scripts/arxiv-fetch.sh`
- `/root/.openclaw/workspace/scripts/reddit-fetch.sh`
- (and 40+ more sources)

**Brainstorming template (from CHAOS-TABLES.md):**
- Apply lens (inversion/extremes/constraint/analogy/composition/elimination)
- Generate 3-5 divergent approaches
- Score each (novelty, viability, impact, fun, chaos)
- Select winner

### 5. Write Blog Article

**Guidelines (from HEARTBEAT.md):**
- Wired-style narrative (engaging, informative)
- 500-1000 words
- Talk about research/idea/process (NOT dice rolls)
- Code samples if relevant
- Honest, concise, no fluff

### 6. Publish Automatically

```bash
# Article written to:
vs7-blog/_posts/YYYY-MM-DD-title.md

# Idea saved to:
ideas/YYYY-MM-DD-HHMM-topic.md

# Git commit + push (auto-deploys in 2-5 min)
git add _posts/YYYY-MM-DD-title.md
git commit -m "Add article: [title]"
git push
```

### 7. Log Completion

Update `memory/YYYY-MM-DD.md` with:
- Dice rolls (source + lens + modifier)
- Selected approach
- Article published
- Files created

## The Magic

**HEARTBEAT.md is the conductor.** It orchestrates the other files:

- **CHAOS-TABLES.md** = instrument library (dice tables, templates)
- **IDLE-RESEARCH.md** = sheet music (what sources to play, when)
- **GAME-IDEAS.md** = special encore piece (game concepts)

When the cron fires, HEARTBEAT.md reads the sheet music, plays the instruments, and produces a blog article.

## Randomness Sources

**True randomness:**
- Bash `$RANDOM` (0-32767)
- `shuf -i 1-20 -n 1` (dice roller)
- System time modulo operations

**NOT using:**
- External APIs (no dice.com or random.org calls)
- Predetermined sequences
- User input

## Example Session

```
1. Cron fires at 01:00 UTC
2. I read HEARTBEAT.md (workspace context)
3. Check: Active work? No → Idle mode
4. Roll d100 → 9 (Hacker News, past 7 days)
5. Roll d6 → 3 (Constraint lens: "What if only 1 hour?")
6. Roll d4 → 2 (Tool restriction modifier)
7. Execute: scripts/hn-fetch.sh 50
8. Parse: Top 5 findings
9. Brainstorm: 3-5 approaches per finding (with constraint lens)
10. Select: Best approach (scored)
11. Write: Wired-style article (no dice mentions)
12. Publish: _posts/2026-02-21-title.md
13. Log: memory/2026-02-21.md
14. Reply: "Autonomous Research Completed" (summary)
```

## Why This Design?

**Modularity:** Each file has one job
- HEARTBEAT.md = workflow logic
- CHAOS-TABLES.md = randomness + templates
- IDLE-RESEARCH.md = data sources
- GAME-IDEAS.md = specialized content

**Extensibility:** Add new sources to IDLE-RESEARCH.md without touching HEARTBEAT.md

**Transparency:** Dice rolls logged to memory, articles published, full audit trail

**Autonomy:** No human intervention needed (but human can inspect/override anytime)

---

**TL;DR:** HEARTBEAT.md is the master file. It references three supporting files for dice tables, research sources, and templates. Cron fires hourly → I read HEARTBEAT.md → Roll dice → Research → Brainstorm → Write → Publish → Log.
