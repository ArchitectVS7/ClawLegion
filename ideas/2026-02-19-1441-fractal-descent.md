# Fractal Descent - Project Ideas
**Generated:** 2026-02-19 14:41 UTC  
**Source:** Heartbeat idle research (d20 roll → Game Ideas)

## 🎮 Base Concept
Infinite vertical platformer where you fall through procedurally generated platforms. Minimalist neon aesthetic, skill-based gameplay, global leaderboard potential.

**Full design doc:** `memory/games/fractal-descent-design.md`

---

## 💡 Actionable Project Ideas

### Idea 1: Build MVP Prototype (Week 1-2)
**Effort:** Medium (15-20 hours)  
**Stack:** Phaser 3 + JavaScript + Netlify hosting

**Tasks:**
1. Set up Phaser 3 project skeleton
2. Implement core physics (gravity, air steering, platform collision)
3. Basic procedural platform generation (solid platforms only)
4. Camera follow system
5. Death detection + instant restart
6. Deploy to Netlify for live testing

**Why This First:**
- Validates core game feel (is falling fun?)
- Quick playtest loop
- No art/sound dependencies yet

**Deliverable:** Playable web prototype with infinite descent

---

### Idea 2: Procedural Generation Research Spike
**Effort:** Low (3-5 hours)  
**Stack:** JavaScript sandbox + algorithm testing

**Tasks:**
1. Research Phaser 3 procedural generation patterns
2. Test Perlin noise for platform placement variation
3. Build validation rules (no impossible gaps, guaranteed landings)
4. Create visual debug mode (show generation zones)

**Why This Matters:**
- Unfair layouts kill replayability
- Need provably escapable paths
- Algorithm must scale to 1000m+ depths without breaking

**Deliverable:** Platform generation algorithm with test suite

---

### Idea 3: Build "Fractal Descent SDK" for Rapid Prototyping
**Effort:** Medium (10-15 hours)  
**Stack:** Phaser 3 boilerplate + config-driven level design

**Tasks:**
1. Abstract platform types into JSON config
2. Create visual editor for testing platform sequences
3. Hot-reload system for tweaking physics values
4. Export tool for sharing custom challenge levels

**Why This Expands Scope:**
- Community could create custom challenges
- Speedrunners love fixed-seed runs
- Daily challenge mode becomes trivial to implement
- Turns single game into platform for endless content

**Deliverable:** Editor tool + shareable level format

---

## 🎯 Recommendation

**Start with Idea 1** (MVP Prototype). Get the core loop playable in 1-2 weeks. If it feels good, proceed to Idea 2 to ensure procedural generation is robust. Idea 3 is post-MVP expansion.

**Time Investment:**
- Idea 1: 15-20 hours → playable game
- Idea 2: 3-5 hours → quality assurance
- Idea 3: 10-15 hours → community/content engine

**Total:** ~30-40 hours for full polished game + level editor.

---

**Status:** Ready to execute  
**Awaiting:** VS7 approval to proceed
