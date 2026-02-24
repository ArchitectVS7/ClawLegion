# Floor Plans → Playable Game Levels

**Source:** Dezeen (Creative cluster)  
**Time Range:** 7 days  
**Lens:** Elimination (d10 → 6)  
**Modifier:** Scope Explosion (d6 → 3)  
**Format:** Tutorial (d6 → 2)  
**Timestamp:** 2026-02-24T16:50:00Z

## Finding

Quake Brutalist Jam — gamers designed playable concrete cathedral levels using the 1996 Quake level editor. Results demonstrate that strong architectural constraints lead to beautiful, coherent spatial design. Raises question: why hand-place walls when architects already solved spatial design?

## Brainstorming Session

### Approach 1: Eliminate the Art Director
**Score: 35**
- Game environments built by AI agents interpreting architectural constraints
- "Brutalism" becomes an executable ruleset, not an aesthetic reference
- No human art direction needed
- **Scope Explosion:** Add multiple architectural styles (Art Deco, Bauhaus, Gothic) as competing constraint sets
- Each style has different generation rules
- **Novelty:** 7 | **Viability:** 8 | **Impact:** 7 | **Fun:** 7 | **Diversity:** 6

### Approach 2: Eliminate the Level Editor ✓ SELECTED
**Score: 42**
- Generate playable game levels from real architectural floor plans
- Upload blueprint PDF → instant walkable 3D world
- **Scope Explosion:** Add physics constraints from architectural style
  - Brutalist = heavy concrete = slow movement
  - Glass moderne = fragile = shatters under gunfire
  - Gothic = stone masonry = bullet-proof but slow
- Different styles become gameplay modifiers, not just visual themes
- **Novelty:** 9 | **Viability:** 9 | **Impact:** 8 | **Fun:** 8 | **Diversity:** 8

### Approach 3: Eliminate Player Navigation
**Score: 37**
- Levels reshape themselves based on play patterns
- Pathfinding data becomes level generation input
- Players never see the same space twice
- **Scope Explosion:** Each architectural style has different plasticity rules
  - Brutalism = permanent (concrete doesn't move)
  - Biomimetic = highly adaptive (grows/shrinks)
- **Novelty:** 8 | **Viability:** 6 | **Impact:** 7 | **Fun:** 9 | **Diversity:** 7

### Approach 4: Eliminate Static Geometry
**Score: 36**
- Brutalist-inspired procedural destruction
- Every surface is a structural element
- Shoot load-bearing wall → collapse building
- **Scope Explosion:** Add structural engineering simulation
  - Beam stress, point loads, shear forces
  - Destruction is architecturally accurate, not cosmetic
- **Novelty:** 7 | **Viability:** 7 | **Impact:** 8 | **Fun:** 8 | **Diversity:** 6

### Approach 5: Eliminate Human Authorship
**Score: 30**
- Full pipeline: LLM → architecture AI → game engine
- "A cathedral of concrete" → floor plan → 3D geometry → playable FPS level
- **Scope Explosion:** Multiple LLMs vote on architectural authenticity before generation
- Quality gate ensures generated spaces follow real architectural principles
- **Novelty:** 6 | **Viability:** 5 | **Impact:** 6 | **Fun:** 6 | **Diversity:** 7

## Why #2 Won

- **Immediate viability:** PDF parsing, 3D extrusion, and game engine import all exist today
- **Scope Explosion is genuinely novel:** Physics properties derived from architectural style isn't just aesthetic — it changes gameplay
- **Tutorial format fits perfectly:** Can walk through the entire pipeline step-by-step
- **Cross-domain value:** Architects, game devs, and procedural generation researchers all benefit
- **Fun factor:** The idea of uploading your own house floor plan and turning it into a Counter-Strike map is inherently playful

## Implementation Notes

Pipeline stages:
1. PDF → vector data (walls, doors, rooms)
2. Vector → 3D extrusion (style-specific height rules)
3. Doors/windows → portals + breakables
4. Material physics (style → gameplay modifiers)
5. Room labels → spawn rules
6. Export to Unity/Unreal/Godot

Physics table for architectural styles adds depth that typical procedural generation lacks. Brutalist levels become siege warfare, Bauhaus becomes fast rushes, Gothic becomes tactical cover-based combat.

## Related Ideas

- Could combine with **Code Neighborhoods** (2026-02-22) — floor plan analysis as spatial code analysis
- Connects to **Route Around Expensive Operations** (2026-02-24) — pathfinding influenced by material costs
- Music rhythm ideas (jazz ensemble) could apply to dynamic room generation based on player tempo

## Article Status

- **Path:** `_drafts/2026-02-24-turn-floor-plans-into-playable-levels.md`
- **Published:** Not yet (pending review)
- **Format:** Tutorial (800 words, step-by-step pipeline with code examples)
- **Excerpt Hook:** "Quake just had a Brutalist Jam... why are we still hand-placing walls when architects already solved spatial design decades ago?"
