# IDLE-RESEARCH.md — Autonomous Intelligence Gathering

When heartbeats find no active work, roll dice to research trends, tools, and ideas across many domains — not just AI.

**Updated:** 2026-02-21 — v3.0: source table expanded, cross-domain sources added, continuity check added

---

## ⚠️ Continuity Check (Do This First)

Before rolling, check `memory/chaos-stats.json` → `recentSourceDomains`.

**Rule:** If the last 3 sessions all drew from the same domain cluster (e.g., three consecutive AI/ML rolls), skip that cluster on this roll. Reroll until you land outside it.

**Domain clusters:**
- **AI/ML cluster:** GitHub Trending, HN, r/LocalLLaMA, r/MachineLearning, ArXiv, Papers with Code, HuggingFace, Anthropic/OpenAI blogs
- **Dev/Tech cluster:** Lobsters, Dev.to, IndieHackers, IEEE Spectrum, Hackaday, Product Hunt
- **Science cluster:** Quanta, Nature digest, cognitive science, r/neuroscience
- **Creative cluster:** Music forums, game dev, film/narrative, design/architecture
- **Culture/Ideas cluster:** Philosophy, economics blogs, YouTube trends, linguistics

After rolling, append the landed cluster to `recentSourceDomains` and trim to last 3 entries.

---

## 🎲 Research Source Table (d100)

| Roll | Cluster | Source | Method | What to Find |
|------|---------|--------|--------|--------------|
| 1-5 | AI/ML | **GitHub Trending — AI** | `gh search repos --topic ai --sort stars` | Hot new AI/ML repos |
| 6-9 | AI/ML | **GitHub Trending — General** | `github-trending.sh python 50` | Broader dev ecosystem |
| 10-14 | AI/ML | **Hacker News** | `hn-fetch.sh 50` | AI/ML/tech discussions (randomize: top/new/best) |
| 15-18 | AI/ML | **Reddit r/LocalLLaMA** | `reddit-fetch.sh LocalLLaMA 50` | Open-source AI, local models, community pulse |
| 19-21 | AI/ML | **Reddit r/MachineLearning** | `reddit-fetch.sh MachineLearning 30` | Research papers, breakthroughs |
| 22-25 | AI/ML | **ArXiv cs.AI + cs.LG** | `arxiv-fetch.sh cs.AI 20` | Cutting-edge research, fresh papers |
| 26-28 | AI/ML | **Papers with Code** | `web_fetch paperswithcode.com/latest` | ML papers with working implementations |
| 29-31 | AI/ML | **Hugging Face Papers** | `web_fetch huggingface.co/papers` | Model releases, benchmarks |
| 32-33 | AI/ML | **Anthropic Blog** | `web_fetch anthropic.com/research` | Claude research updates |
| 34-35 | AI/ML | **OpenAI Blog** | `web_fetch openai.com/research` | GPT/reasoning research |
| 36-38 | Dev/Tech | **Lobsters** | `web_fetch lobste.rs` | Tech news with deeper discussion, less hype |
| 39-41 | Dev/Tech | **Dev.to** | `web_fetch dev.to/t/ai/top/week` | Developer tutorials, real-world experiences |
| 42-44 | Dev/Tech | **Product Hunt** | `web_fetch producthunt.com` | New AI tools launching today |
| 45-47 | Dev/Tech | **IndieHackers** | `web_fetch indiehackers.com` | Bootstrap/startup ideas, what's working for builders |
| 48-49 | Dev/Tech | **IEEE Spectrum** | `web_fetch spectrum.ieee.org` | Engineering depth, hardware trends |
| 50-52 | Dev/Tech | **Hackaday** | `web_fetch hackaday.com` | Hardware hacking, embedded systems, physical computing |
| 53-54 | Dev/Tech | **AI Alignment Forum** | `web_fetch alignmentforum.org` | Safety research, alignment problems |
| 55-56 | Dev/Tech | **LessWrong** | `web_fetch lesswrong.com` | Rationality, decision theory, long-form thinking |
| 57-59 | Science | **Quanta Magazine** | `web_fetch quantamagazine.org` | Deep science — physics, biology, math — for biomimicry ideas |
| 60-61 | Science | **Nature News** | `web_fetch nature.com/news` | Research breakthroughs, cross-discipline |
| 62-63 | Science | **r/neuroscience** | `reddit-fetch.sh neuroscience 20` | Brain, cognition, memory — directly maps to agent design |
| 64-65 | Science | **r/evolution** | `reddit-fetch.sh evolution 20` | Evolutionary mechanisms, adaptation, emergent behavior |
| 66-67 | Science | **ArXiv q-bio** | `arxiv-fetch.sh q-bio 15` | Quantitative biology — ecosystems, networks, dynamics |
| 68-70 | Creative | **r/WeAreTheMusicMakers** | `reddit-fetch.sh WeAreTheMusicMakers 30` | Music production — synthesis, composition, process |
| 71-72 | Creative | **Synthtopia** | `web_fetch synthtopia.com` | Synthesizers, generative music, audio AI |
| 73-74 | Creative | **GameDev Forums / r/gamedesign** | `reddit-fetch.sh gamedesign 25` | Game mechanics, systems design, player psychology |
| 75-76 | Creative | **Gamasutra / Game Developer** | `web_fetch gamedeveloper.com` | In-depth game development analysis |
| 77-78 | Creative | **No Film School** | `web_fetch nofilmschool.com` | Storytelling techniques, narrative structure |
| 79-80 | Creative | **Dezeen / Archdaily** | `web_fetch dezeen.com` | Architecture and design — structure, constraint, aesthetics |
| 81-82 | Creative | **Dribbble Trending** | `web_fetch dribbble.com/shots/popular` | Visual design, UI patterns, color and motion |
| 83-84 | Culture/Ideas | **YouTube Tech Trends** | `web_fetch youtube trending tech` | ThePrimeagen, Fireship, what's viral in dev |
| 85-86 | Culture/Ideas | **r/philosophy** | `reddit-fetch.sh philosophy 20` | Epistemology, ethics, thought experiments |
| 87-88 | Culture/Ideas | **Marginal Revolution** | `web_fetch marginalrevolution.com` | Economics, unexpected applications of incentive thinking |
| 89-90 | Culture/Ideas | **Benedict Evans Newsletter** | `web_fetch ben-evans.com` | Tech industry dynamics, long-range thinking |
| 91-92 | Culture/Ideas | **r/linguistics** | `reddit-fetch.sh linguistics 20` | Language structure, semantics — directly maps to LLM behavior |
| 93-94 | Culture/Ideas | **Ribbon Farm** | `web_fetch ribbonfarm.com` | Long-form essays on systems, organizations, tech culture |
| 95 | Cross-Domain | **Two random sources combined** | Pick two rolls (1-94) and synthesize findings | Look for the non-obvious connection |
| 96 | Cross-Domain | **Published posts + any source** | Pick a `_posts/` article + roll 1-94 | How does the source inform or challenge the post? |
| 97 | Cross-Domain | **A-tier ideas backlog + any source** | Pick an idea from `ideas/` + roll 1-94 | Does the source unlock an angle that was missing? |
| 98-99 | Wild Card | **VS7's current project context** | Check `memory/` for active projects | What's the most useful research for what's actually being built? |
| 100 | Wild Card | **True Wild Card** | Combine 2 random rolls (d99 twice) + memory context | No filter, no judgment — run with whatever the collision produces |

---

## 🎲 Time Range Table (d6)

| Roll | Time Range | GitHub Query | Reddit/HN Sort |
|------|-----------|--------------|----------------|
| 1-2 | **24 hours** | `created:>=$(date -d '1 day ago' -I)` | `/new` or `?t=day` |
| 3-4 | **7 days** | `created:>=$(date -d '7 days ago' -I)` | `?t=week` |
| 5 | **30 days** | `created:>=$(date -d '30 days ago' -I)` | `?t=month` |
| 6 | **All time** | Sort by stars | `?t=all` |

---

## 🎯 Research Workflow

After the Continuity Check and dice rolls:

1. **Fetch 50-100 items** from the selected source
2. **Extract top 5-10 findings** — most interesting, most surprising, most counter-intuitive
3. **For EACH significant finding, run the full CHAOS-TABLES.md divergence workflow:**
   - Apply Brainstorming Lens (d10)
   - Apply Chaos Modifier (d6)
   - Note Article Format (d6)
   - Generate 3-5 approaches
   - Score and select
4. **Save full brainstorm to `ideas/YYYY-MM-DD-HHMM-[topic].md`** — include all approaches, not just the winner
5. **Write the article** using the selected format and approach
6. **Publish to `_posts/`** and push
7. **Log session** in `memory/YYYY-MM-DD.md` — include source, dice rolls, selected approach, article published
8. **Update `memory/chaos-stats.json`** — increment counters, append to recentSourceDomains

---

## 🔀 Source Selection Rules

- Never use the same source twice in a row
- If d100 lands on a source used in either of the last 2 sessions, reroll once
- Cross-domain sources (95-100) can be used consecutively — they're always different in practice
- Wild Card (100) gets full commitment — no rerolling because the combo seems strange

---

## 🛠️ Available Tools

### Already Working
- `gh` CLI — GitHub search, trending, repo info
- `web_fetch` — fetch any public URL → markdown
- `reddit-fetch.sh` — fetch subreddit top posts
- `hn-fetch.sh` — Hacker News API client
- `arxiv-fetch.sh` — ArXiv paper fetch
- `github-trending.sh` — GitHub trending repos

### Missing / Needs Setup
- **Brave Search API key** — for `web_search` tool (broader queries)
  - Alternative: DuckDuckGo HTML parsing via `web_fetch` (less reliable)
- **Nitter instance** — for Tech Twitter trends without API (try `nitter.net`)

---

## 📋 Example Research Sessions

### Example 1: Science source, Temporal lens

**Continuity check:** Last 3 sessions were AI/ML cluster. Roll until out of that cluster.
**d100 → 62** → r/neuroscience | **d6 → 3** → 7 days | **d10 → 8** → Temporal | **d6 → 4** → Cross-Pollination | **d6 → 1** → Narrative

**Finding:** "New research on memory consolidation during sleep — hippocampus replays experiences in compressed form"

**Brainstorm with Temporal lens:**
- What if AI agents had a sleep cycle that compressed and reorganized context?
- Cross-Pollination: OpenClaw already does memory — what would a "sleep pass" look like on its existing memory files?
- Looking back: if this had been built 2 years ago, would transformers have developed differently?

**Selected:** Sleep-cycle memory compression for agents — build a proof of concept, write as Narrative

---

### Example 2: Creative source, Cross-Domain Steal + Remix

**d100 → 70** → r/WeAreTheMusicMakers | **d6 → 4** → 30 days | **d10 → 10** → Cross-Domain Steal | **d6 → 6** → Remix a Published Post | **d6 → 5** → Comparison

**Finding:** "Discussion of sidechain compression — using one audio signal to control the volume of another"

**Brainstorm with Cross-Domain Steal:**
- Sidechain compression = one agent's output controlling another agent's throughput
- The Mystery Gang Orchestrator post already gave agents voices. What if their outputs sidechained each other?
- Comparison format: Sidechain orchestration vs. round-robin orchestration — honest tradeoffs, declare a winner

**Selected:** Comparison post — Sidechain Agent Orchestration vs. Standard Round-Robin, using Mystery Gang as the base implementation

---

### Example 3: Wild Card

**d100 → 100** → Wild Card
**d99 roll 1 → 63** → r/evolution | **d99 roll 2 → 48** → IEEE Spectrum

**Finding 1 (evolution):** "Horizontal gene transfer — bacteria share DNA across species, not just parent-to-child"
**Finding 2 (IEEE Spectrum):** "New FPGA programming model using dataflow graphs instead of sequential logic"

**Collision:** What if agents could do horizontal skill transfer — sharing learned behaviors sideways across agents, not just inheriting from a parent orchestrator?

**Format:** d6 → 3 → Quick Take. 300 words. One thesis: "Inheritance is the wrong mental model for agent learning."

---

## 🧠 What Cross-Domain Sources Actually Produce

Based on what the existing ideas in `ideas/` demonstrate, the most generative non-AI source collisions have been:

- **Music → Agent timing** (polyrhythmic agents, jazz band orchestration)
- **Biology → Code analysis** (mycelium → Code Mycelium, the blog's best post)
- **Games → Agent design** (RPG stats → autonomy metrics, game master → narrative AI)
- **Physics → Data flow** (orbital mechanics → dependency graphs)

The pattern: AI has unsolved problems in orchestration, timing, memory, and behavior that other fields solved decades ago under different names. The job is to recognize the isomorphism.

---

**Version:** 3.0 | **Updated:** 2026-02-21
**Changes from v2.0:** Continuity check added, d100 table expanded with cross-domain sources (science, creative, culture/ideas), source cluster tracking, cross-domain examples added
