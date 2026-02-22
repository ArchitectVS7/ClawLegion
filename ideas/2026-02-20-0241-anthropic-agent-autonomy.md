# Idea: Measuring Agent Autonomy in Practice

**Source:** "Measuring AI agent autonomy in practice" — Anthropic Research  
**HN Score:** 83 | **Fetched:** 2026-02-20 02:41 UTC  
**Constraint Lens:** What if we had only 1 hour?  
**Chaos Modifier:** Tool Restriction (use tools not used in 7 days)

## Key Insights from Article

Anthropic analyzed millions of Claude Code sessions + public API calls to measure real-world agent autonomy:

**Key Findings:**
- 99.9th percentile turn duration doubled (25 min → 45 min) in 3 months
- Experienced users auto-approve 40%+ of sessions (vs. 20% for new users)
- Experienced users *interrupt more* (9% vs. 5%) — they monitor instead of micromanage
- Claude asks for clarification 2x more often than humans interrupt it on complex tasks
- Most agent actions are low-risk software engineering (~50% of API traffic)
- Emerging usage in healthcare, finance, cybersecurity

**Core Insight:** **Deployment overhang** — agents are capable of more autonomy than they exercise in practice

## Divergent 1-Hour Approaches

### 🎯 Approach 1: Personal Agent Autonomy Tracker
**Time:** 60 minutes  
**Tool:** `canvas` for dashboard

Build a personal dashboard that tracks *your own* OpenClaw agent interactions:

1. Parse OpenClaw session logs for:
   - Turn duration (how long LG2 works before stopping)
   - Interrupt frequency (how often VS7 interrupts mid-task)
   - Auto-approve vs. manual approval patterns
   - Tool call complexity (file edits vs. API calls vs. exec)
2. Generate a simple HTML dashboard with:
   - Line chart: Turn duration over time (am I granting more autonomy?)
   - Bar chart: Interrupt rate vs. session tenure
   - Heatmap: Which tool categories trigger interrupts?
3. Serve via `canvas`

**Why this works in 1 hour:**
- OpenClaw already logs everything (`sessions_history`, process logs)
- Simple shell script + jq to parse JSON
- Minimal HTML + Chart.js (copy-paste template)
- Shows *your* autonomy evolution, mirroring Anthropic's research

**Impact:** Self-awareness tool for AI power users

---

### 🎯 Approach 2: "Clarification Quality" Scorer
**Time:** 60 minutes  
**Tool:** `browser` automation

Anthropic found that Claude asks for clarification 2x more than humans interrupt. But *are those clarifications useful?*

Build a tool that:
1. Extracts all "clarification questions" from session history
2. Classifies them: Useful vs. Pedantic vs. Obvious
3. Uses `browser` to scrape similar questions from GitHub Issues / Stack Overflow
4. Generates a report: "Your agent asks too many obvious questions"
5. Outputs improvement suggestions (e.g., "Add more context in TOOLS.md")

**Why this works in 1 hour:**
- Session history already contains clarification turns
- Simple heuristic: Did the question get answered in <10 words? → Probably obvious
- Browser scraping for comparison data (quick validation)
- Generates actionable feedback

**Impact:** Agent training data / product improvement feedback

---

### 🎯 Approach 3: "Risk × Autonomy" Heat Map for Your Workflow
**Time:** 60 minutes  
**Tool:** `canvas` for interactive viz

Recreate Anthropic's risk × autonomy scatter plot for *your own* OpenClaw usage:

1. Extract all tool calls from session history
2. Use LLM to score each: Risk (1-10) + Autonomy (1-10)
3. Cluster similar actions (file edits, API calls, exec commands)
4. Plot as interactive scatter plot via `canvas` + D3.js
5. Hovering over a point shows: "What was this task? When did it happen?"

**Why this works in 1 hour:**
- Anthropic already published the scoring prompt (use theirs!)
- Session history provides full tool call context
- D3.js scatter plot template: 20 lines
- Interactive = more engaging than static chart

**Impact:** Personal risk audit / workflow optimization

---

### 🎯 Approach 4: Voice-Narrated Autonomy Report (Audio)
**Time:** 60 minutes  
**Tool:** `tts` (haven't used in 7+ days)

What if your agent *told you* how autonomous it's becoming?

1. Parse session history for:
   - Total turns, turn duration, interrupt rate
   - Longest autonomous session
   - Most complex task completed
2. Generate a "weekly autonomy report" as a narrative script
3. Convert to speech with `tts` (use a calm, analytical voice)
4. Output: 2-minute audio summary ("This week, I worked 45 minutes uninterrupted on Project Cyberscape...")

**Why this works in 1 hour:**
- Session parsing: 20 minutes
- Script generation: 10 minutes (template + LLM fill-in)
- TTS conversion: 5 minutes
- Feels like a personal assistant briefing

**Impact:** Frictionless weekly reflection tool

---

### 🎯 Approach 5: "Interrupt Pattern Analyzer" (Behavioral Fingerprinting)
**Time:** 60 minutes  
**Tool:** `browser` for visualization + data collection

Anthropic found that interrupt rate increases with experience. But *why* do people interrupt?

Build a tool that:
1. Extracts all human interruptions from session history
2. Classifies the *reason* for interrupt:
   - Correction (agent was wrong)
   - Redirection (agent was right, but wrong path)
   - Impatience (agent was slow)
   - Curiosity (just checking in)
3. Plots interrupt reasons over time (line chart)
4. Compares to Anthropic's Table 1 data (do you match the pattern?)

**Why this works in 1 hour:**
- LLM classifies interrupt reasons (batch API call)
- Simple matplotlib chart (or Chart.js if web-based)
- Shows *how* your oversight style evolves

**Impact:** Self-optimization for human-AI collaboration

---

## 🏆 Selected Approach: **Approach 1 - Personal Agent Autonomy Tracker**

**Why:**
- **Novelty:** 7/10 — Personal version of Anthropic's research (meta!)
- **Viability:** 10/10 — All data already exists in OpenClaw logs
- **Impact:** 8/10 — Immediate utility for VS7, extensible to other users
- **Fun:** 9/10 — Seeing your own autonomy evolution is satisfying
- **Chaos:** 7/10 — Uses `canvas`, simple but effective

**Next Steps (if approved):**
1. Write `scripts/autonomy-tracker.sh`:
   - Parse `sessions_list` + `sessions_history` for turn metrics
   - Calculate: median turn duration, 99.9th percentile, interrupt rate
   - Group by week for trend analysis
2. Generate HTML dashboard with Chart.js
3. Serve via `canvas`
4. Add to HEARTBEAT.md as weekly autonomous task

**Time estimate:** 50-60 minutes

---

**Meta Notes:**
- All approaches satisfy 1-hour constraint
- All use tools not used recently (canvas/browser/tts)
- Approach 1 provides immediate value to VS7's workflow
- Can be extended to multi-user comparison (if OpenClaw grows)
