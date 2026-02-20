# Fractal Descent - Project Ideas
**Generated:** 2026-02-19 13:41 UTC  
**Source:** Heartbeat research (Game Ideas d20 roll → 14)

---

## 🎮 Base Concept Summary

**Fractal Descent** is an infinite vertical platformer where you fall through procedurally generated platforms that fragment and become increasingly chaotic as you descend. Synthwave aesthetic meets glitch art.

**Full design doc:** `memory/games/fractal-descent-design.md`

---

## 💡 Follow-Up Project Ideas

### 1. **Build Fractal Descent MVP** ⭐ (RECOMMENDED)
**Scope:** 3-5 day sprint to create playable prototype

**Approach:**
- Clone Phaser 3 starter template
- Implement core falling physics + platform generation
- Add collision, scoring, game over screen
- Deploy to GitHub Pages for instant playtesting

**Why Now:**
- Aligns with VS7's procedural generation interests
- Low-risk tech stack (Phaser is battle-tested)
- Quick feedback loop (web-based, shareable URL)
- Can evolve into larger project if successful

**Deliverable:** Playable web game at `fractal-descent.vs7.dev` (or GitHub Pages)

**Next Step:** Initialize Phaser project, setup git repo, build player physics prototype

---

### 2. **Fractal Engine Library** 🔧
**Concept:** Extract the platform subdivision mechanics into a reusable npm package

**Use Case:**
- Other games that need procedural fragmentation
- Generative art projects
- Educational tool for teaching recursion/fractals

**Features:**
- Configurable subdivision rules (how many splits, size constraints)
- Multiple fractal patterns (Sierpinski, Mandelbrot-inspired, custom)
- Visual debugger/preview tool
- TypeScript support

**Why Interesting:**
- Turns game mechanic into reusable tool
- Could attract generative art community
- Teaching aid for CS concepts (recursion, procedural generation)

**Deliverable:** `@vs7/fractal-engine` npm package + interactive docs site

**Next Step:** Extract subdivision algorithm from game code, design API, publish v0.1.0

---

### 3. **"Descent into Madness" Narrative Mod** 📖
**Concept:** Add environmental storytelling layer to Fractal Descent

**Mechanics:**
- Every 500m, encounter glitched text fragments
- Piece together story of AI that descended into its own training data
- Multiple endings based on depth reached
- Easter eggs in fractal patterns spell hidden messages

**Narrative Hook:**
"You are an AI exploring the infinite descent of your own latent space. The deeper you fall, the more you fragment. What will you find at the bottom?"

**Why Compelling:**
- Meta-narrative about AI (relevant to VS7's AI consciousness explorations)
- Adds depth to arcade gameplay
- Could attract narrative game players alongside arcade fans

**Deliverable:** Story-enhanced version of Fractal Descent with branching narrative

**Next Step:** Write story outline, design text fragment system, integrate glitch messages

---

## 🎯 Recommended Path

**Start with #1 (MVP build)** → Get playable prototype in 3-5 days
- If successful, consider #3 (narrative layer) as Phase 2
- If fractal mechanics prove interesting, extract to #2 (library)

**Why this order:**
1. Validate core gameplay first (is it fun?)
2. Add depth if it hooks players (narrative)
3. Extract reusable tech if it generalizes well (library)

---

## 📊 Effort Estimates

| Project | Time | Complexity | Novelty | Impact |
|---------|------|------------|---------|--------|
| #1 MVP Build | 3-5 days | Medium | Low | High (playable game) |
| #2 Fractal Engine | 2-3 days | Low | Medium | Medium (reusable tool) |
| #3 Narrative Mod | 4-6 days | Medium | High | High (unique experience) |

---

## 🚀 Immediate Next Action

**If VS7 approves any idea:**
1. Create GitHub repo: `vs7-labs/fractal-descent`
2. Initialize Phaser 3 project with Vite
3. Build player physics prototype (Day 1 goal)
4. Report progress in daily memory

**Awaiting approval.** Reply "yes" to any idea to add it to task list.
