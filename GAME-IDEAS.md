# GAME-IDEAS.md - Idle Task Reservoir

When heartbeats find no active work, roll d20 and pick a game concept. Brainstorm → Design Doc → Task List → Build.

---

## 🎲 Game Concept Roster (d20 Table)

| Roll | Title | Genre | Platform | Hook |
|------|-------|-------|----------|------|
| 1 | **Hex Conquest** | 4X Strategy | Web | Minimalist hex-based space conquest with AI factions |
| 2 | **Signal Lost** | Narrative Horror | PC | Text-based detective game where you decode corrupted transmissions |
| 3 | **Pocket Dungeon** | Roguelike | Mobile | Swipe-based dungeon crawler, one hand gameplay |
| 4 | **Synth Runner** | Endless Runner | Mobile/Web | Synthwave aesthetic infinite runner with procedural music |
| 5 | **Code Breach** | Puzzle | Web | Hacking sim where you write real regex/scripts to break systems |
| 6 | **Neon Drift** | Racing | PC | Arcade racer with cyberpunk aesthetic, drift-focused physics |
| 7 | **Void Garden** | Idle/Clicker | Web | Plant alien flora in space stations, watch ecosystems evolve |
| 8 | **Last Signal** | Survival | PC | Radio operator in apocalypse, manage resources + decode SOS |
| 9 | **Glyph Wars** | Card Battler | Mobile | Rune-based card game, draw glyphs to cast spells |
| 10 | **Night Shift** | Horror Management | Web | Run a 24hr convenience store, weird customers after midnight |
| 11 | **Terraform** | Automation | PC | Factorio-like resource management on Mars |
| 12 | **Echo Chamber** | Music Puzzle | Mobile | Rhythm game where you manipulate audio waveforms to solve puzzles |
| 13 | **Dead Drop** | Stealth Puzzle | Web | Cold War spy game, plan routes to avoid surveillance |
| 14 | **Fractal Descent** | Platformer | PC | Procedurally generated infinite vertical platformer |
| 15 | **Cage Match** | Turn-Based Tactics | Mobile | 3v3 tactical combat in phone booth-sized arenas |
| 16 | **Signal Jammer** | Tower Defense | Web | Defend server rooms from data breaches with firewall turrets |
| 17 | **Glitch Garden** | Visual Novel | PC | Explore a glitching VR world, uncover what went wrong |
| 18 | **Orbit** | Physics Puzzle | Mobile | Slingshot satellites using gravitational mechanics |
| 19 | **The Feed** | Social Sim | Web | Manage a fictional social network, balance engagement vs toxicity |
| 20 | **Rogue Signal** | Metroidvania | PC | Explore derelict space station, unlock abilities via radio frequencies |

---

## 🎯 Idle Heartbeat Workflow

When heartbeat finds no work:

1. **Roll d20** → Select game from table
2. **Brainstorm Phase** (30-60 min):
   - Core loop mechanics
   - Art/audio direction
   - Technical feasibility
   - Unique selling point
3. **Design Doc** (`memory/games/GAME-NAME-design.md`):
   - Overview
   - Mechanics breakdown
   - Tech stack
   - MVP scope
4. **Task List** (append to `GAME-IDEAS.md` under game entry):
   - Phase 1: Prototype core loop
   - Phase 2: Art/audio integration
   - Phase 3: Polish + deploy
5. **Archive** (move to `memory/games/archive/` when complete or abandoned)

---

## 📋 Detailed Game Concepts

### 1. Hex Conquest (4X Strategy, Web)
**Hook:** "Civilization meets idle game — watch AI empires rise and fall in real-time hex terrain."

**Core Loop:**
- Click to claim hex tiles
- Build cities → generate resources
- Spawn AI factions with different strategies (aggressive, defensive, economic)
- Watch them expand/war/trade autonomously
- Influence via high-level edicts (no micromanagement)

**Tech Stack:** React + Canvas, procedural hex generation, simple AI state machines

**MVP:**
- Hex map generation (50x50 grid)
- 3 AI factions with basic expand logic
- Resource system (food, production, science)
- City placement + growth
- Victory condition: control 60% of map

---

### 2. Signal Lost (Narrative Horror, PC)
**Hook:** "You're decoding transmissions from a lost expedition. The more you uncover, the worse it gets."

**Core Loop:**
- Receive corrupted audio/text logs
- Use filters/tools to clean up signal
- Piece together timeline of what happened
- Discover the expedition found something… and it followed them back

**Tech Stack:** Electron + Web Audio API, procedural text corruption, branching narrative

**MVP:**
- 5 transmission sequences
- 3 decoding tools (noise filter, frequency shift, timestamp sync)
- Branching dialogue tree based on decode order
- 2 possible endings

---

### 3. Pocket Dungeon (Roguelike, Mobile)
**Hook:** "Swipe to move, tap to attack. Pure one-handed dungeon crawling."

**Core Loop:**
- Swipe in 4 directions to move hero
- Auto-attack on collision with enemies
- Collect loot cards (weapons, spells, buffs)
- Permadeath, procedural dungeons

**Tech Stack:** React Native, procedural level gen, simple collision

**MVP:**
- 3 dungeon floors
- 5 enemy types
- 10 loot cards
- Death screen with stats

---

### 4. Synth Runner (Endless Runner, Mobile/Web)
**Hook:** "The music adapts to your performance. The better you play, the more epic the soundtrack."

**Core Loop:**
- Auto-run through neon cityscape
- Dodge obstacles (swipe left/right)
- Collect tempo orbs → music intensifies
- Miss obstacles → music degrades
- Highscore based on distance + music quality

**Tech Stack:** Three.js (3D runner), Tone.js (procedural music), mobile-first controls

**MVP:**
- Infinite procedural track
- 3 obstacle types
- Dynamic music system (4 intensity layers)
- Leaderboard

---

### 5. Code Breach (Puzzle, Web)
**Hook:** "Hack the mainframe by writing actual code. Regex, bash, SQL — the real deal."

**Core Loop:**
- Present system (file tree, logs, network map)
- Player writes real commands/scripts to extract data
- Validation against hidden test cases
- Unlock deeper layers of the system

**Tech Stack:** Monaco editor (VSCode in browser), sandboxed JS eval, puzzle validator

**MVP:**
- 5 levels (file search, log parsing, SQL injection, regex extraction, script automation)
- In-browser code execution (sandboxed)
- Hint system for beginners
- Victory screen with solve stats

---

### 6. Neon Drift (Racing, PC)
**Hook:** "Arcade racing where drifting isn't just cool — it's the core mechanic."

**Core Loop:**
- Race through cyberpunk city circuits
- Drift around corners to build boost meter
- Tight controls, skill-based physics
- Leaderboard ghosts for time attack

**Tech Stack:** Three.js, physics engine (Cannon.js), procedural track generation

**MVP:**
- 3 tracks
- 1 car (drift-focused physics)
- Time attack mode
- Ghost replay system

---

### 7. Void Garden (Idle/Clicker, Web)
**Hook:** "Plant alien seeds in your space station. Watch strange ecosystems emerge."

**Core Loop:**
- Click to plant seeds
- Plants grow in real-time (idle progress)
- Unlock new species via mutations
- Create symbiotic plant networks
- Expand to new station modules

**Tech Stack:** React + Canvas, save state in localStorage, procedural plant sprites

**MVP:**
- 10 plant species
- 3 station modules
- Mutation system (combine 2 plants → new species)
- Offline progress calculation

---

### 8. Last Signal (Survival, PC)
**Hook:** "You're the last radio operator. Decode SOS signals, send help, survive the night."

**Core Loop:**
- Receive distress signals (audio + morse code)
- Decode location/urgency
- Dispatch limited rescue resources
- Manage radio power, food, sanity
- Some signals are traps…

**Tech Stack:** Electron, Web Audio API, procedural signal generation

**MVP:**
- 10 signal types (SOS, false alarm, hostile)
- Resource management (power, food, med kits)
- Day/night cycle (7 days to survive)
- Multiple endings based on choices

---

### 9. Glyph Wars (Card Battler, Mobile)
**Hook:** "Draw glyphs on screen to cast spells. The better your drawing, the stronger the effect."

**Core Loop:**
- Draw rune shapes on touchscreen
- Accuracy score → spell power multiplier
- Build deck of glyphs (fire, ice, shield, heal)
- Battle AI opponents in best-of-3 matches

**Tech Stack:** React Native, gesture recognition, card battle logic

**MVP:**
- 12 glyph cards
- Gesture recognition (simple shape matching)
- 5 AI opponents (escalating difficulty)
- Deck builder

---

### 10. Night Shift (Horror Management, Web)
**Hook:** "Run a 24hr store. After midnight, the customers get… weird."

**Core Loop:**
- Stock shelves, serve customers, balance register
- Normal customers during day
- After midnight: strange requests, reality bends
- Choose how to respond (play along, refuse, investigate)
- Survive 7 nights

**Tech Stack:** Phaser.js (2D game engine), dialogue tree, state machine

**MVP:**
- Day/night cycle
- 10 customer types (5 normal, 5 weird)
- 20 dialogue scenarios
- Ending based on choices

---

### 11. Terraform (Automation, PC)
**Hook:** "Build the first Mars colony. Automate everything or die trying."

**Core Loop:**
- Place extractors, refineries, assemblers
- Design conveyor belt networks
- Research tech tree for efficiency upgrades
- Survive dust storms, equipment failures
- Expand across Martian terrain

**Tech Stack:** Phaser.js, pathfinding, resource flow simulation

**MVP:**
- 5 building types
- 10 resources (ore, water, oxygen, fuel, parts)
- 3 tech tiers
- Win condition: 1000 colonists sustained

---

### 12. Echo Chamber (Music Puzzle, Mobile)
**Hook:** "Manipulate sound waves to unlock doors. Physics-based audio puzzles."

**Core Loop:**
- Emit sound pulse
- Watch waveform propagate through environment
- Redirect with mirrors, amplify with resonators
- Match target frequency to unlock exit

**Tech Stack:** React Native, Web Audio API, physics visualization

**MVP:**
- 15 levels
- 4 tools (emitter, mirror, resonator, damper)
- Visual waveform feedback
- Sandbox mode

---

### 13. Dead Drop (Stealth Puzzle, Web)
**Hook:** "Cold War spy game. Plan your route, avoid cameras, leave no trace."

**Core Loop:**
- Top-down city map
- Plot waypoints to reach dead drop location
- Avoid surveillance zones (cameras, patrols)
- Time-based scoring (faster = better)
- Unlock new cities

**Tech Stack:** React + Canvas, pathfinding, procedural city generation

**MVP:**
- 10 cities
- 3 surveillance types
- Route planning UI
- Leaderboard per city

---

### 14. Fractal Descent (Platformer, PC)
**Hook:** "Fall forever through procedurally generated platforms. How deep can you go?"

**Core Loop:**
- Auto-fall downward
- Steer left/right to land on platforms
- Avoid spikes, collect power-ups
- Platforms get smaller/faster as you descend
- Leaderboard for max depth

**Tech Stack:** Phaser.js, procedural generation, physics

**MVP:**
- Infinite descent
- 5 platform types
- 3 power-ups (slow fall, shield, magnet)
- Death screen with depth score

---

### 15. Cage Match (Turn-Based Tactics, Mobile)
**Hook:** "Phone booth-sized arenas. 3v3 tactical combat where every tile matters."

**Core Loop:**
- Deploy 3 units in 5x5 grid
- Turn-based movement + attacks
- Abilities with cooldowns
- Victory: eliminate enemy team
- Climb ranked ladder

**Tech Stack:** React Native, turn-based logic, AI opponent

**MVP:**
- 6 unit types (tank, DPS, healer, etc.)
- 5 abilities per unit
- AI opponent
- Ranked mode (10 tiers)

---

### 16. Signal Jammer (Tower Defense, Web)
**Hook:** "Defend your server room from data breaches. Build firewalls, deploy honeypots."

**Core Loop:**
- Waves of malware/hackers approach servers
- Place defensive nodes (firewall, IDS, honeypot)
- Upgrade defenses between waves
- Lose condition: core server breached

**Tech Stack:** Phaser.js, pathfinding, wave spawning

**MVP:**
- 10 waves
- 5 tower types
- 3 enemy types
- 1 map

---

### 17. Glitch Garden (Visual Novel, PC)
**Hook:** "Explore a glitching VR world. Uncover the conspiracy behind the simulation."

**Core Loop:**
- Dialogue-driven exploration
- Encounter glitched NPCs
- Decode hidden messages in visual artifacts
- Multiple endings based on choices
- Uncover what happened to the dev team

**Tech Stack:** Ren'Py or custom Electron + Ink (narrative engine)

**MVP:**
- 5 chapters
- 10 NPCs
- 3 endings
- Glitch visual effects

---

### 18. Orbit (Physics Puzzle, Mobile)
**Hook:** "Slingshot satellites using gravity. Get them into stable orbit."

**Core Loop:**
- Launch satellite from planet surface
- Drag to aim trajectory
- Use moon/planet gravity wells to redirect
- Goal: achieve stable orbit around target
- 50+ levels, escalating difficulty

**Tech Stack:** React Native, physics engine, orbital mechanics

**MVP:**
- 20 levels
- 3 celestial body types (planet, moon, asteroid)
- Trajectory prediction line
- 3-star rating per level

---

### 19. The Feed (Social Sim, Web)
**Hook:** "You run a fictional social network. Balance engagement, profit, and ethics."

**Core Loop:**
- Approve/reject user posts
- Tune algorithm (engagement vs. toxicity)
- Manage ads, privacy policies
- Events trigger crises (data breach, scandal)
- Survive 30 days without collapse

**Tech Stack:** React, state machine, procedural content generation

**MVP:**
- 100 procedural posts
- 10 crisis events
- 3 metrics (users, revenue, trust)
- 5 possible endings

---

### 20. Rogue Signal (Metroidvania, PC)
**Hook:** "Explore a derelict space station. Unlock abilities by tuning into radio frequencies."

**Core Loop:**
- 2D exploration + combat
- Collect radio chips → unlock new frequencies
- Each frequency = new ability (dash, shield, etc.)
- Backtracking to access new areas
- Boss fights at signal sources

**Tech Stack:** Phaser.js, tilemap generation, ability gating

**MVP:**
- 5 zones
- 10 abilities
- 5 bosses
- Interconnected map

---

## 🔄 Active Development (When Selected)

When a game is selected via d20 roll, move it here with:
- Current phase
- Task list
- Next action

**Format:**
```
### [Game Name] - Phase [X]
**Tasks:**
- [ ] Task 1
- [ ] Task 2

**Next:** [specific action]
```

---

*Roll when idle. Build when inspired. Archive when done.*
