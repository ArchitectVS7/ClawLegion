# IDLE-RESEARCH.md - Autonomous Intelligence Gathering

When heartbeats find no active work, LG2 rolls dice to research AI trends, tools, and developments.

**Updated:** 2026-02-19 — Now includes divergent thinking workflow

---

## 🎲 Research Source Table (d100 for variety)

| Roll | Source | Method | What to Find |
|------|--------|--------|--------------|
| 1-8 | **GitHub Trending** | `gh search repos` or scripts | Hot AI/dev repos (randomize: AI, Python, JavaScript, Rust, Go) |
| 9-16 | **Hacker News** | web_fetch + hn-fetch.sh | AI/ML/tech discussions (top/new/best - randomize) |
| 17-24 | **Reddit r/LocalLLaMA** | reddit-fetch.sh | Open-source AI, local models |
| 25-30 | **Reddit r/MachineLearning** | reddit-fetch.sh | Research papers, breakthroughs |
| 31-36 | **ArXiv** | arxiv-fetch.sh | Cutting-edge CS research (cs.AI, cs.LG, cs.CL) |
| 37-42 | **Product Hunt** | web_fetch | New AI tools/services |
| 43-48 | **Dev.to** | web_fetch dev.to/t/ai | Developer tutorials, experiences |
| 49-54 | **Lobsters** | web_fetch lobste.rs | Tech news with deeper discussion |
| 55-58 | **Papers with Code** | web_fetch | ML papers + implementations |
| 59-62 | **AI Alignment Forum** | web_fetch | Safety, alignment research |
| 63-66 | **LessWrong** | web_fetch | Rationality, AI safety |
| 67-70 | **Anthropic Blog** | web_fetch | Claude research updates |
| 71-74 | **OpenAI Blog** | web_fetch | GPT research updates |
| 75-78 | **Hugging Face Papers** | web_fetch | Model releases, benchmarks |
| 79-82 | **r/LocalLlama Discord** | Check recent trends via web | Community pulse |
| 83-86 | **Tech Twitter Trends** | web_fetch via Nitter | What's viral in AI/dev |
| 87-90 | **YouTube Tech Channels** | web_fetch trending | ThePrimeagen, Fireship, etc. |
| 91-94 | **IndieHackers** | web_fetch | Bootstrap/startup ideas |
| 95-97 | **GameDev Forums** | web_fetch | AI in games, procedural gen |
| 98-99 | **Music/Art AI** | web_fetch | Generative art, music tools |
| 100 | **Wild Card** | Pick most interesting from memory + combine 2 random sources |

---

## 🎲 Time Range Table (d6)

| Roll | Time Range | GitHub Query | Reddit/HN Sort |
|------|-----------|--------------|----------------|
| 1-2 | **24 hours** | `created:>=$(date -d '1 day ago' -I)` | `/new` or `?t=day` |
| 3-4 | **7 days** | `created:>=$(date -d '7 days ago' -I)` | `?t=week` |
| 5 | **30 days** | `created:>=$(date -d '30 days ago' -I)` | `?t=month` |
| 6 | **All time** | Sort by stars | `?t=all` |

---

## 🎯 Research Actions (after gathering data)

1. **Roll d100** for source selection (not d20 — need true variety)
2. **Fetch 50-100 items** from selected source (increased from 10-30)
3. **Extract top 5-10 findings** (most interesting/relevant)
4. **For EACH significant finding:**
   - Write news summary
   - **Apply brainstorming lens** (roll d6: inversion, extremes, constraint, analogy, composition, elimination)
   - Generate 3-5 divergent project ideas per finding
   - Score each approach (novelty, viability, impact, fun, chaos)
5. **Save full brainstorm to `ideas/YYYY-MM-DD-HHMM-[topic].md`** (include all approaches, not just winner)
6. **Present top idea to VS7 via Telegram** (brief + link to full brainstorm)
7. **Await response:**
   - If VS7 says "yes" → execute
   - If no response → archive for later review

**Randomization Rules:**
- Never roll same source twice in a row
- If d100 lands on recently used source, reroll
- Track last 3 sources in `memory/research-history.json`
- Wild Card (100): Combine 2 random sources + memory context

---

## 🛠️ Skills Needed (Gap Analysis)

### ✅ Already Have
- `gh` CLI (GitHub search, trending, repo info)
- `web_fetch` (fetch any public URL → markdown)
- `message` tool (can post to Telegram)

### ❌ Need to Add
- **Brave Search API key** (for web_search tool)
- **Reddit scraper** (lightweight JSON fetch from Reddit API)
- **Hacker News API client** (official HN API is free, no auth)
- **ArXiv API client** (fetch recent CS.AI papers)

---

## 📦 Installation Plan

### 1. Brave Search API Key
**Status:** Missing (web_search blocked)  
**Action:** VS7 needs to configure via `openclaw configure --section web`  
**Alternative:** Use web_fetch with DuckDuckGo HTML parsing (less reliable)

### 2. Hacker News API
**Status:** Can implement now (no auth needed)  
**Method:** `web_fetch https://hacker-news.firebaseio.com/v0/topstories.json`  
**Skill:** Build `hn-fetch.sh` helper script

### 3. Reddit JSON API
**Status:** Can implement now (no auth for public subs)  
**Method:** `web_fetch https://www.reddit.com/r/LocalLLaMA/top.json?t=week`  
**Skill:** Build `reddit-fetch.sh` helper script

### 4. ArXiv API
**Status:** Can implement now (open API)  
**Method:** `web_fetch http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate`  
**Skill:** Build `arxiv-fetch.sh` helper script

---

## 🎲 Execution Workflow

When heartbeat finds no work:

1. **Roll d20** → Select source from Research Source Table
2. **Roll d6** → Select time range from Time Range Table
3. **Fetch data** using appropriate method
4. **Parse top 3-5 items**
5. **Write summary** to `memory/research/YYYY-MM-DD-[source].md`
6. **Identify actionable items:**
   - If new skill opportunity → add to task list
   - If interesting tool → bookmark for later experimentation
   - If relevant to current project → flag for integration
7. **Log completion** in daily memory

---

## 📋 Example Research Session

**Heartbeat:** 12:00 UTC, no active work  
**Roll 1 (d20):** 8 → Reddit r/LocalLLaMA  
**Roll 2 (d6):** 3 → Past 7 days  

**Action:**
```bash
web_fetch "https://www.reddit.com/r/LocalLLaMA/top.json?t=week&limit=10"
```

**Findings:**
1. New quantization method (GGUF v3) released
2. Llama 4 rumors (training spotted)
3. Popular post about local voice synthesis improvements

**Summary written to:** `memory/research/2026-02-19-reddit-localllama.md`

**Actionable items:**
- Research GGUF v3 compatibility with current setup
- Monitor Llama 4 announcements
- Investigate voice synthesis tools (could enhance OVI)

**Completion:** Log in `memory/2026-02-19.md` under "## Research"

---

## 🚀 Immediate Next Steps

1. **Build helper scripts** (hn-fetch.sh, reddit-fetch.sh, arxiv-fetch.sh)
2. **Test each source** (validate JSON parsing, markdown output)
3. **Update HEARTBEAT.md** (add research workflow to idle behavior)
4. **Create memory/research/ directory**
5. **Request Brave API key from VS7** (optional, enhances capability)

---

*This system gives LG2 autonomy to stay informed, discover new tools, and identify opportunities — even when there's no active project.*

---

## 🧠 Divergent Thinking Integration (v2.0)

**Every research session now includes brainstorming:**

### After Gathering Findings:

For **EACH** significant finding, run the full divergence workflow:

1. **Apply Brainstorming Lens** (roll d6 if not already rolled):
   - Inversion: What's the opposite of this trend?
   - Extremes: What if we took this to 10x?
   - Constraint: What if we had 1 hour to implement it?
   - Analogy: What's this like in other domains?
   - Composition: What if we combined it with [unrelated project]?
   - Elimination: What if we removed the key assumption?

2. **Apply Chaos Modifier** (roll d4):
   - Time Pressure: Build MVP in 25% of estimated time
   - Tool Restriction: Use unfamiliar tools
   - Scope Explosion: Add unexpected bonus feature
   - Cross-Pollination: Merge with concept from different project

3. **Generate 3-5 Approaches:**
   - Obvious path (what everyone would do)
   - Interesting path (slightly unconventional)
   - Wild path (full commitment to chaos)
   - Synthesis (combine multiple approaches)

4. **Score & Select:**
   - Novelty (1-5): Does this teach us something new?
   - Viability (1-5): Can we actually complete it?
   - Impact (1-5): Will this move projects forward?
   - Fun (1-5): Does this feel exciting?
   - **Total:** Highest score wins

5. **Document the Full Brainstorm:**
   - Save ALL approaches to `ideas/`, not just the winner
   - Include dice rolls and rationale
   - Note which lens/modifier combos work best

### Tracking What Works

Create `memory/chaos-stats.json` to track:

```json
{
  "sessions": [],
  "lensStats": {
    "inversion": {"used": 0, "selected": 0, "success": 0},
    "extremes": {"used": 0, "selected": 0, "success": 0},
    "constraint": {"used": 0, "selected": 0, "success": 0},
    "analogy": {"used": 0, "selected": 0, "success": 0},
    "composition": {"used": 0, "selected": 0, "success": 0},
    "elimination": {"used": 0, "selected": 0, "success": 0}
  },
  "modifierStats": {
    "timePressure": {"used": 0, "selected": 0, "success": 0},
    "toolRestriction": {"used": 0, "selected": 0, "success": 0},
    "scopeExplosion": {"used": 0, "selected": 0, "success": 0},
    "crossPollination": {"used": 0, "selected": 0, "success": 0}
  }
}
```

**After each session:**
- Increment `used` for the rolled lens/modifier
- Increment `selected` if that approach was chosen
- After project completion, increment `success` if it worked well

**Monthly review:** Which lenses produce the best results? Double down on those.

---

## 📋 Example Divergent Research Session

**Heartbeat:** 16:00 UTC, no active work  
**Roll 1 (d20):** 8 → Hacker News  
**Roll 2 (d6):** 3 → Past 7 days  
**Roll 3 (d6):** 4 → Analogy lens  
**Roll 4 (d4):** 3 → Scope Explosion  

**Finding:** "New multi-agent orchestration paper on ArXiv"

**Brainstorm:**

**Approach 1 (Obvious):** Read paper, write summary  
**Approach 2 (Analogy):** What if agents were like a jazz band? Each improvises, listens, responds  
**Approach 3 (Wild):** Build a jazz band simulation where agents are musicians, output is music  
**Approach 4 (Scope Explosion):** Jazz band + real-time visualization + recordable sessions + export to MIDI  

**Selected:** Approach 4  
**Why:** Analogy lens creates unique angle, scope explosion adds lasting artifact, connects to music background

**Saved to:** `ideas/2026-02-19-1600-jazz-agents.md`

---

**Version:** 2.0 (with divergent thinking)  
**See also:** `CHAOS-TABLES.md` for full system documentation
