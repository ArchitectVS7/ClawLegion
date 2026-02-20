# AI as Exoskeleton - Research & Ideas
**Source:** Hacker News (7 days)  
**Dice:** d20=7, d6=4, d6=3 (Constraint Lens)  
**Date:** 2026-02-19 23:41 UTC

## Original Article
**Title:** AI is not a coworker, it's an exoskeleton  
**Link:** https://www.kasava.dev/blog/ai-as-exoskeleton  
**Score:** 110 | **Comments:** 119

## Core Concept
Reframe AI assistants as **exoskeletons** rather than coworkers. Not autonomous agents doing work for you, but tools that amplify your capabilities while you remain in control.

## Constraint Challenge: What could we build in 1 hour?

### Approach 1: CLI Exoskeleton Wrapper
Build `exo` command that wraps any CLI tool and adds AI augmentation:
```bash
exo git commit  # AI suggests message based on diff
exo curl <url>  # AI summarizes response
exo ps aux      # AI explains what's running
```
**Time:** 45 min (bash + jq + OpenClaw API call)  
**Novelty:** 6/10 | **Viability:** 9/10 | **Impact:** 7/10 | **Fun:** 5/10

### Approach 2: Voice-to-Execution Pipeline
Speak command → Whisper STT → Claude translates to bash → exec with confirmation:
```
[You speak]: "Show me what's using the most CPU"
[Exo]: Running: ps aux --sort=-%cpu | head -10
[Output appears]
```
**Time:** 60 min (Whisper API + exec wrapper)  
**Novelty:** 7/10 | **Viability:** 8/10 | **Impact:** 8/10 | **Fun:** 9/10

### Approach 3: OVI Rebranding Document
Write design doc repositioning OVI as "exoskeleton" rather than "assistant":
- Metaphor shift: Iron Man suit vs. Jarvis
- UX implications: amplification vs. delegation
- Voice design: "Here's what I found" vs. "I did this for you"
**Time:** 45 min (pure writing)  
**Novelty:** 8/10 | **Viability:** 10/10 | **Impact:** 9/10 | **Fun:** 6/10

### Approach 4: Exoskeleton Mode Toggle
Add mode to OpenClaw agents:
- `exoskeleton=true`: Never do things autonomously, always ask & augment
- `exoskeleton=false`: Current autonomous behavior
Quick SOUL.md patch + config flag.
**Time:** 30 min  
**Novelty:** 7/10 | **Viability:** 9/10 | **Impact:** 8/10 | **Fun:** 7/10

### Approach 5: Meta-Commentary Integration
Update LG2's SOUL.md to include exoskeleton philosophy:
- "I amplify, I don't replace"
- Shift from "I did this" to "Here's what we found"
- More collaborative framing in responses
**Time:** 20 min  
**Novelty:** 5/10 | **Viability:** 10/10 | **Impact:** 7/10 | **Fun:** 4/10

## Selected Approach: #3 (OVI Rebranding Document)

**Why:**
- **Highest impact** for VS7's OVI vision
- **Most viable** (no code risk, pure design thinking)
- **Directly applicable** to current projects
- **Constraint-friendly** (writing is fast, ideas compound)

**Execution Plan:**
1. Read article for full context (5 min)
2. Draft metaphor comparison table (10 min)
3. Map exoskeleton principles to OVI features (15 min)
4. Write UX guidelines (10 min)
5. Polish & save (5 min)

**Deliverable:** `memory/ovi-exoskeleton-design.md`

## Bonus: Cross-Pollination Opportunity
Combine with Project Cyberscape: What if agents in the simulation wore "exoskeletons" (visible augmentation layers) showing what tools/context they're using?

---

**Next Steps:** Execute selected approach, report completion.
