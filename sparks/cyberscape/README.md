# Cyberscape

A live, spatial visualization of software development. Your codebase becomes hexagonal terrain. AI agents become visible workers moving through that terrain. Work, conflicts, and collaboration are observable in real time.

```
  ╱‾‾‾╲   ╱‾‾‾╲   ╱‾‾‾╲
 │ src │  │ api │  │ lib │
  ╲___╱   ╲___╱   ╲___╱
    ╱‾‾‾╲   ╱‾‾‾╲
   │auth │  │test │  ← agents move here
    ╲___╱   ╲___╱
```

Cyberscape maps your repository structure onto a hex grid and shows you what your AI agents are doing — which files they're touching, where conflicts are developing, and how your automated team actually works together.

## Quick Start

```bash
# Install
npm install

# Point at a repo and start the server
npx cyberscape --repo /path/to/your/project

# In another terminal, see the ASCII view
npx cyberscape-term
```

Send a heartbeat from any agent (any language, any framework):

```bash
curl -X POST http://localhost:4200/api/cyberscape/heartbeat \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent-1",
    "name": "Reviewer",
    "type": "qa",
    "currentFile": "src/auth.ts",
    "activity": "reviewing",
    "detail": "Checking auth middleware"
  }'
```

The agent appears on the map. No SDK, no config, no framework dependency. Just HTTP.

## What It Looks Like

**Terminal (Phase 1 — ships first):**
- ASCII hex grid rendered from your actual repo structure
- Agent positions, activity indicators, conflict highlights
- Zoom from region overview down to individual files

**Web (Phase 2):**
- Three.js hex terrain with synthwave aesthetics
- Animated agent pawns that move between tiles in real time
- Hover for file details, click for deep inspection

## How It Works

### The Terrain Is Your Codebase

Cyberscape scans your repository and builds a hex map:

- **Regions** = top-level directories
- **Zones** = subdirectories / modules
- **Tiles** = individual files

The layout is deterministic — same repo structure always produces the same map. Tile height and color reflect activity: hotter files glow brighter.

### Agents Report via Heartbeat

Cyberscape is **framework-agnostic**. It doesn't control your agents — it observes them. Any system that can make an HTTP POST can participate:

```
POST /api/cyberscape/heartbeat
{
  "agentId": "string",       // unique agent ID
  "name": "string",          // display name
  "type": "string",          // role (architect, qa, reviewer, etc.)
  "currentFile": "string",   // file the agent is working on
  "activity": "string",      // idle | reading | writing | blocked | reviewing | testing
  "detail": "string"         // human-readable description
}
```

- First heartbeat auto-spawns the agent on the map
- Subsequent heartbeats update position and activity
- 60 seconds of silence auto-despawns the agent
- Unknown file paths gracefully map to the nearest region

### Integration Tiers

| Tier | What | Effort |
|------|------|--------|
| **1. HTTP API** | POST JSON to the heartbeat endpoint | One curl command |
| **2. SDK** | `@cyberscape/agent` (npm), `cyberscape` (pip) | One line of code |
| **3. Adapters** | Drop-in plugins for LangChain, CrewAI, AutoGen, etc. | Zero lines of code |

Tier 1 ships with Phase 1. Tiers 2 and 3 follow.

### Example Integrations

**Python:**
```python
import requests

requests.post("http://localhost:4200/api/cyberscape/heartbeat", json={
    "agentId": "agent-1",
    "name": "Reviewer",
    "type": "qa",
    "currentFile": "src/auth.ts",
    "activity": "reviewing",
    "detail": "Checking auth middleware"
})
```

**JavaScript:**
```javascript
await fetch("http://localhost:4200/api/cyberscape/heartbeat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    agentId: "agent-1",
    name: "Reviewer",
    type: "qa",
    currentFile: "src/auth.ts",
    activity: "reviewing",
    detail: "Checking auth middleware"
  })
});
```

## Architecture

```
┌─────────────────────────────────────────────┐
│              INGESTION LAYER                 │
│                                              │
│  Agent heartbeats ──> /api/cyberscape/       │
│  Git activity ──────> GitAdapter             │
│  CI/CD webhooks ────> CIAdapter              │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────┼───────────────────────┐
│               DATA LAYER                     │
│  Terrain DB  │  Agent State  │  Event Log    │
│              └──────┬────────┘               │
│              World State Aggregator           │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────┼───────────────────────┐
│               API LAYER                      │
│           REST + WebSocket                   │
│         /api/cyberscape/*                    │
└────────┬─────────────────────────┬───────────┘
         │                         │
  ┌──────▼──────┐       ┌─────────▼──────────┐
  │  Terminal   │       │  Web Renderer      │
  │  (ASCII)   │       │  (Three.js)        │
  └─────────────┘       └────────────────────┘
```

**Key design decisions:**
- **Data-first.** The hex grid is a projection of a canonical data model. The data model must be correct before any rendering matters.
- **Receiver, not controller.** Cyberscape observes what agents report. It doesn't manage, orchestrate, or direct them.
- **Event-sourced.** World state is built from an append-only event log. Current state is a projection.
- **Renderer-agnostic.** The API emits generic data. Renderers interpret it however they want.

## Project Structure

```
cyberscape/
├── src/
│   ├── models/        — data model, validation, hex math
│   ├── terrain/       — codebase → hex map generator
│   ├── agents/        — agent state machine + lifecycle
│   ├── api/           — REST + WebSocket server
│   ├── ingestion/     — heartbeat receiver, git/CI adapters
│   ├── persistence/   — SQLite storage
│   ├── sociology/     — conflict detection, interaction graph
│   ├── narration/     — OVI narration templates
│   ├── replay/        — historical replay engine
│   └── index.ts       — main entry point
├── tests/             — mirrors src/ structure
├── data/              — SQLite database (gitignored)
├── docs/              — design specs and ideation
│   ├── DESIGN-SPEC.md
│   ├── IDEATION.md
│   └── VISION.md
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Roadmap

### Phase 1 — Foundation
Data model, terrain generator, API server, agent state machine, terminal renderer. **Ship target: everything you need to see your codebase as a hex grid with live agents in the terminal.**

### Phase 2 — Integration
Heartbeat API (the framework-agnostic ingestion point), Three.js web renderer, WebSocket real-time bridge, persistence layer.

### Phase 2.5 — SDKs
`@cyberscape/agent` (npm) and `cyberscape` (pip) — thin wrappers that make integration a one-liner.

### Phase 3 — Sociology
Conflict detection, agent interaction graph, historical replay, OVI voice narration, human presence (god view). **This is the killer feature:** not the 3D rendering, but the insight into how AI teams actually work.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript (strict) |
| Runtime | Node.js 20+ |
| API | Express + ws |
| Validation | Zod |
| Database | better-sqlite3 |
| Web Renderer | React + @react-three/fiber |
| Terminal | Raw ANSI |
| Testing | Vitest |
| Build | tsup |

## API Reference

### Heartbeat (Primary Integration)
```
POST /api/cyberscape/heartbeat
```

### World State
```
GET /api/cyberscape/world       — full snapshot
GET /api/cyberscape/terrain     — hex map only
GET /api/cyberscape/agents      — all agents
GET /api/cyberscape/events      — event log (supports ?since= and ?limit=)
GET /api/cyberscape/tile/:id    — single tile detail
```

### Agent Lifecycle (Optional)
```
POST /api/cyberscape/agents/spawn
POST /api/cyberscape/agents/:id/despawn
```

### WebSocket
```
ws://host:port/ws/cyberscape    — real-time event stream
```

## Agent Type Registry

Agent types are user-defined. The first heartbeat with an unknown type auto-registers it. Customize via server config:

```json
{
  "agentTypes": {
    "architect": { "color": "#7c5cfc", "icon": "A" },
    "qa":        { "color": "#5cfc7c", "icon": "Q" },
    "reviewer":  { "color": "#fc5c7c", "icon": "R" },
    "writer":    { "color": "#fcb05c", "icon": "W" }
  }
}
```

Unregistered types get auto-assigned colors from a default palette.

## Contributing

This project is in active early development. The [Design Specification](docs/DESIGN-SPEC.md) defines all 15 features with acceptance criteria and test plans — each is independently implementable. See [Appendix B](docs/DESIGN-SPEC.md#appendix-b-coding-agent-instructions) for coding instructions.

## License

MIT
