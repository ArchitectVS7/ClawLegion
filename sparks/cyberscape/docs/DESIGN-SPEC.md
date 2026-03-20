# Cyberscape — Design Specification v1.0

**Status:** Ready for initial coding
**Method:** Spec-driven development — each feature is independently codeable and testable
**Date:** 2026-02-19

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Integration Protocol](#3-integration-protocol)
4. [Data Model](#4-data-model)
5. [Feature Specifications](#5-feature-specifications)
   - F-01: World Data Model & Schema
   - F-02: Codebase Terrain Generator
   - F-03: Workspace State API v2
   - F-04: Agent State Machine
   - F-05: Terminal Renderer v2
   - F-06: Event Ingestion Pipeline
   - F-07: Web Renderer — Hex Terrain
   - F-08: Web Renderer — Agent Pawns
   - F-09: Real-time WebSocket Bridge
   - F-10: Conflict Detection Engine
   - F-11: Agent Interaction Graph
   - F-12: Historical Replay Engine
   - F-13: OVI Narration Integration
   - F-14: Human Presence (God View)
   - F-15: Persistence Layer
6. [Tech Stack](#6-tech-stack)
7. [Phase Roadmap](#7-phase-roadmap)

---

## 1. Project Overview

### What Cyberscape Is

A live, spatial visualization of software development as it happens. The codebase is rendered as hexagonal terrain. AI agents are visible workers moving through that terrain. Work, conflicts, and collaboration are observable in real time.

**Framework-agnostic by design.** Cyberscape is a visualization layer, not an agent framework. It works with any AI agent system — LangChain, CrewAI, AutoGen, custom agents, or simple scripts — via a universal HTTP heartbeat API. If your agent can make a POST request, it can appear on the map. See [Section 3: Integration Protocol](#3-integration-protocol).

### What Cyberscape Is Not

- Not a static dashboard or reporting tool
- Not a project management UI
- Not a code editor or IDE plugin
- Not an agent orchestration framework — it *observes* agents, it doesn't *control* them

### Core Principles

**Data-first, aesthetics second.** The hex grid is a projection of a canonical data model. The data model must be correct and useful before any rendering is meaningful. A terminal ASCII view of the correct data model is more valuable than a beautiful 3D view of bad data.

**Receiver, not controller.** Cyberscape observes what agents report. It does not manage, orchestrate, or direct agent behavior. This separation is what makes it framework-agnostic — any system that can send a heartbeat can participate.

### Existing Implementation (Inherit, Don't Rewrite)

The following exist and should be evolved, not replaced:

| Component | Location | Status |
|-----------|----------|--------|
| Terminal hex renderer | `packages/cyberscape-term/index.js` | Working, basic |
| RN HexGrid component | External: `ovi-native/app/components/HexGrid.tsx` | Working, visual only |
| HexCell type | External: `ovi-native/app/types/hex.ts` | Minimal |
| Workspace state API | External: `ovi-pwa/server/index.js` (L236-267) | Working, stub data |
| Workspace parser | External: `ovi-native/utils/workspaceParser.ts` | Working, fallback data |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  INGESTION LAYER                            │
│                                                             │
│  Any agent framework ──POST──> /api/cyberscape/heartbeat    │
│  Git activity ─────────poll──> GitAdapter                   │
│  CI/CD webhooks ───────POST──> /api/cyberscape/webhooks/ci  │
│                                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                     DATA LAYER                              │
│                          │                                  │
│  ┌──────────────┐  ┌─────▼────────┐  ┌──────────────────┐  │
│  │ Terrain DB   │  │ Agent State  │  │ Event Log        │  │
│  │ (hex map     │  │ (positions,  │  │ (git, CI, task   │  │
│  │  from code)  │  │  activities) │  │  completions)    │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         └─────────────┬───┘───────────────────┘             │
│                       │                                     │
│              ┌────────▼────────┐                            │
│              │  World State    │  (single source of truth)  │
│              │  Aggregator     │                            │
│              └────────┬────────┘                            │
└───────────────────────┼─────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────┐
│                  API LAYER                                  │
│                       │                                     │
│              ┌────────▼────────┐                            │
│              │  REST + WS API  │  /api/cyberscape/*         │
│              └───┬────────┬───┘                             │
└──────────────────┼────────┼─────────────────────────────────┘
                   │        │
      ┌────────────┘        └────────────┐
      │                                  │
┌─────▼──────┐               ┌───────────▼──────────┐
│ Terminal   │               │ Web Renderer         │
│ Renderer   │               │ (Three.js + React)   │
│ (ASCII)    │               │                      │
└────────────┘               └──────────────────────┘
```

### Key Architectural Decisions

- **Single world state:** All renderers read from the same data model via the same API. There is one truth.
- **Event-sourced:** The world state is built from an append-only event log. Current state is a projection.
- **Renderer-agnostic:** The API emits generic hex/agent/event data. Renderers interpret it however they want (ASCII, 2D, 3D).
- **Source-agnostic:** Agent data enters via a universal heartbeat API. Cyberscape doesn't know or care what framework sent it.
- **Polling and push:** REST for initial load + catch-up. WebSocket for real-time deltas.

---

## 3. Integration Protocol

Cyberscape is a **receiver, not a controller.** It observes what agents report. This section defines the universal contract for getting agent data into Cyberscape from any framework, language, or system.

### 3.1 The Heartbeat — Universal Integration Primitive

The heartbeat is a lightweight HTTP POST that an agent sends to report its current state. This is the only integration any external system needs to implement.

```
POST /api/cyberscape/heartbeat
Content-Type: application/json

{
  "agentId": "string",          // unique ID for this agent instance
  "name": "string",             // display name (e.g., "CodeReviewer-1")
  "type": "string",             // agent role (e.g., "architect", "reviewer", "qa")
  "currentFile": "string",      // file path the agent is currently working on
  "activity": "string",         // one of: idle, reading, writing, blocked, reviewing, testing
  "detail": "string"            // human-readable description (e.g., "refactoring auth middleware")
}
```

**Response:** `{ "ok": true, "tileId": "string" }` — confirms receipt and returns the hex tile ID the file was mapped to.

**Behavior:**
- First heartbeat from an unknown `agentId` auto-spawns the agent (no separate registration needed)
- Subsequent heartbeats update position and activity
- If no heartbeat arrives for 60 seconds, the agent is auto-despawned
- File paths are resolved to hex tile IDs via the terrain map; unknown paths map to the nearest region

### 3.2 Lifecycle Endpoints (Optional)

Agents can explicitly signal lifecycle transitions for more control. These are optional — heartbeats alone are sufficient.

```
POST /api/cyberscape/agents/spawn
{ "agentId": "string", "name": "string", "type": "string", "currentFile": "string" }

POST /api/cyberscape/agents/{agentId}/despawn
(empty body)
```

If an agent doesn't send explicit spawn/despawn, Cyberscape handles it automatically via heartbeat presence.

### 3.3 Agent Type Registry

Agent types are **user-defined, not hardcoded.** The first heartbeat with an unknown type auto-registers it with a default color. Users can customize types via server config:

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

Unregistered types receive auto-assigned colors from a default palette.

### 3.4 Integration Tiers

Cyberscape ships with Tier 1. Higher tiers are built on top of it.

| Tier | What | Who It's For | Ships When |
|------|------|-------------|------------|
| **1. HTTP API** | POST heartbeat JSON to Cyberscape's REST endpoint | Any developer, any language, any framework | Phase 1 (v0.1) |
| **2. SDK Packages** | `@cyberscape/agent` (npm), `cyberscape` (pip) — thin wrappers around the HTTP API | JS/Python developers who want a one-liner | Phase 2 |
| **3. Framework Adapters** | Drop-in plugins for popular agent frameworks — zero-config integration | Users of specific frameworks who want auto-reporting | Community-driven, post-launch |

### 3.5 Integration Examples

**curl (any system):**
```bash
curl -X POST http://localhost:4200/api/cyberscape/heartbeat \
  -H "Content-Type: application/json" \
  -d '{"agentId":"agent-1","name":"Reviewer","type":"qa","currentFile":"src/auth.ts","activity":"reviewing","detail":"Checking auth middleware"}'
```

**Python (requests):**
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

**JavaScript (fetch):**
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

**Future Tier 2 — npm SDK (not yet built):**
```javascript
import { CyberspaceAgent } from "@cyberscape/agent";

const agent = new CyberspaceAgent({
  id: "agent-1",
  name: "Reviewer",
  type: "qa",
  server: "http://localhost:4200"
});

agent.heartbeat("reviewing", "src/auth.ts", "Checking auth middleware");
// ... later
agent.despawn();
```

**Future Tier 3 — LangChain adapter (not yet built):**
```python
from cyberscape.adapters.langchain import CyberspaceCallbackHandler

handler = CyberspaceCallbackHandler(server="http://localhost:4200")
chain.invoke(input, config={"callbacks": [handler]})
# Agent automatically appears on the map, moves as the chain processes files
```

---

## 4. Data Model

### 4.1 World

The top-level container. One World per monitored repository/workspace.

```typescript
interface World {
  id: string;                    // e.g., "clawlegion"
  name: string;                  // e.g., "ClawLegion"
  repoRoot: string;              // absolute path to repo root
  regions: Region[];
  agents: Agent[];
  events: WorldEvent[];
  createdAt: ISO8601;
  updatedAt: ISO8601;
}
```

### 4.2 Region / Zone / Tile (Terrain Hierarchy)

```typescript
interface Region {
  id: string;                    // e.g., "sparks"
  label: string;                 // display name
  path: string;                  // relative path from repo root
  zones: Zone[];
  hexCoord: HexCoord;           // position on the hex map
}

interface Zone {
  id: string;                    // e.g., "sparks/ovi-pwa"
  label: string;
  path: string;
  tiles: Tile[];
  parentRegion: string;          // Region.id
  hexCoord: HexCoord;
}

interface Tile {
  id: string;                    // e.g., "sparks/ovi-pwa/server/index.js"
  label: string;
  path: string;                  // relative file path
  parentZone: string;            // Zone.id
  hexCoord: HexCoord;
  metrics: TileMetrics;
}

interface HexCoord {
  q: number;                     // axial hex coordinate
  r: number;                     // axial hex coordinate
}

interface TileMetrics {
  linesOfCode: number;
  lastModified: ISO8601;
  commitFrequency: number;       // commits in last 7 days
  hotness: number;               // 0.0 - 1.0, computed from recent activity
}
```

### 4.3 Agent

```typescript
type AgentActivity = 'idle' | 'reading' | 'writing' | 'blocked' | 'reviewing' | 'testing';

interface Agent {
  id: string;                    // unique agent instance ID
  name: string;                  // display name (e.g., "LG2", "CodeReviewer-1")
  type: AgentType;               // persona classification
  position: {
    tileId: string;              // current Tile the agent occupies
    zoneId: string;              // derived from tile
    regionId: string;            // derived from zone
  };
  activity: AgentActivity;
  activityDetail: string;        // human-readable, e.g., "refactoring auth middleware"
  history: AgentHistoryEntry[];  // recent tiles visited (ring buffer, max 50)
  conflicts: string[];           // agent IDs with overlapping recent tile activity
  startedAt: ISO8601;
  lastActiveAt: ISO8601;
}

interface AgentType {
  id: string;                    // e.g., "architect", "qa", "general"
  label: string;
  color: string;                 // hex color for rendering
  icon: string;                  // glyph or emoji for terminal
}

interface AgentHistoryEntry {
  tileId: string;
  activity: AgentActivity;
  timestamp: ISO8601;
  durationMs: number;
}
```

### 4.4 World Events

```typescript
type EventKind =
  | 'agent_move'           // agent changed position
  | 'agent_activity'       // agent changed activity state
  | 'agent_spawn'          // new agent appeared
  | 'agent_despawn'        // agent disconnected / finished
  | 'git_commit'           // commit pushed
  | 'git_branch'           // branch created/deleted
  | 'ci_start'             // CI pipeline started
  | 'ci_result'            // CI pipeline completed (pass/fail)
  | 'conflict_detected'    // two agents touching same tile
  | 'conflict_resolved'    // conflict no longer active
  | 'tile_updated'         // tile metrics changed
  | 'annotation'           // agent or human left a note on a tile

interface WorldEvent {
  id: string;                    // UUID
  kind: EventKind;
  timestamp: ISO8601;
  sourceAgentId?: string;        // which agent caused this event
  targetTileId?: string;         // which tile is affected
  targetAgentId?: string;        // for conflict events
  payload: Record<string, any>;  // event-specific data
}
```

---

## 5. Feature Specifications

Each feature below is independently implementable and testable. They are ordered by dependency — earlier features are prerequisites for later ones, but within a phase they can be parallelized.

---

### F-01: World Data Model & Schema

**Phase:** 1 (Foundation)
**Depends on:** Nothing
**Location:** `src/models/`

#### Description
Implement the TypeScript types and runtime validation for the entire data model described in Section 4. This is the canonical schema that all other features depend on.

#### Acceptance Criteria
- [ ] All interfaces from Section 4 are implemented as TypeScript types in `types.ts`
- [ ] Runtime validation functions exist for each major type (`validateWorld()`, `validateAgent()`, `validateWorldEvent()`, etc.) using a lightweight schema validator (Zod)
- [ ] A `WorldState` class holds the in-memory world and exposes read-only accessors
- [ ] Factory functions exist to create valid instances for testing: `createMockWorld()`, `createMockAgent()`, `createMockEvent()`
- [ ] Hex coordinate utility functions: `hexDistance(a, b)`, `hexNeighbors(coord)`, `hexRing(center, radius)`

#### Test Plan
- Unit tests for every validation function (valid input passes, invalid input throws)
- Unit tests for hex coordinate math (distance, neighbors, ring generation)
- Type-level tests confirming exhaustive EventKind handling
- Mock factory functions produce data that passes validation

#### Files to Create
```
src/models/types.ts        — all interfaces/types
src/models/validation.ts   — Zod schemas + validate fns
src/models/world-state.ts  — WorldState class
src/models/hex-math.ts     — hex coordinate utilities
src/models/mocks.ts        — test factories
src/models/index.ts        — barrel export
```

---

### F-02: Codebase Terrain Generator

**Phase:** 1 (Foundation)
**Depends on:** F-01
**Location:** `src/terrain/`

#### Description
Given a repository root path, scan the directory structure and produce a terrain map (Regions, Zones, Tiles) with hex coordinates assigned via a deterministic layout algorithm.

#### Acceptance Criteria
- [ ] `generateTerrain(repoRoot: string, config?: TerrainConfig): Terrain` scans the filesystem
- [ ] Top-level directories become Regions. Subdirectories become Zones. Files become Tiles.
- [ ] Configurable ignore patterns (default: `node_modules`, `.git`, `dist`, `build`, `.cache`)
- [ ] Configurable depth limit (default: 3 levels)
- [ ] Hex coordinates assigned using spiral layout from center outward
- [ ] Region size (hex count) is proportional to file count within that region
- [ ] Output passes F-01 validation
- [ ] Deterministic: same repo structure always produces same hex layout
- [ ] `TileMetrics.linesOfCode` populated via fast line counting
- [ ] `TileMetrics.lastModified` populated from filesystem stat

#### Test Plan
- Given a known fixture directory structure, assert exact terrain output
- Assert ignore patterns exclude expected directories
- Assert depth limit is respected
- Assert hex coordinates are unique (no two tiles share coordinates)
- Assert determinism: run twice, get identical output
- Performance: generate terrain for 1000-file repo in under 2 seconds

#### Files to Create
```
src/terrain/generator.ts        — main generateTerrain()
src/terrain/scanner.ts          — filesystem scanning
src/terrain/layout.ts           — hex coordinate assignment
src/terrain/config.ts           — TerrainConfig type + defaults
src/terrain/index.ts            — barrel export
tests/terrain/fixtures/         — test directory structures
tests/terrain/generator.test.ts
```

---

### F-03: Workspace State API v2

**Phase:** 1 (Foundation)
**Depends on:** F-01, F-02
**Location:** `src/api/`

#### Description
Replace the current stub `/api/workspace-state` endpoint with a full Cyberscape API that serves terrain, agent state, and events. This is the single API that all renderers consume.

#### Acceptance Criteria
- [ ] `GET /api/cyberscape/world` — returns full World snapshot (terrain + agents + recent events)
- [ ] `GET /api/cyberscape/terrain` — returns terrain only (for initial load)
- [ ] `GET /api/cyberscape/agents` — returns all current agents and their positions
- [ ] `GET /api/cyberscape/events?since={ISO8601}&limit={n}` — returns events since timestamp
- [ ] `GET /api/cyberscape/tile/:tileId` — returns tile detail including metrics and recent activity
- [ ] All responses validated against F-01 schemas before sending
- [ ] Backwards-compatible: the existing `/api/workspace-state` endpoint still works, translating the new data model into the old format
- [ ] Standalone Express server (not embedded in OVI PWA server) — can run independently
- [ ] CORS enabled for local development

#### Test Plan
- Integration tests using supertest against each endpoint
- Assert response shapes match F-01 schemas
- Assert `/api/workspace-state` backwards compatibility with existing terminal client
- Assert `?since=` filtering returns only events after the timestamp
- Assert CORS headers present
- Assert 404 for unknown tile IDs

#### Files to Create
```
src/api/server.ts          — Express app setup
src/api/routes/world.ts    — /world endpoint
src/api/routes/terrain.ts  — /terrain endpoint
src/api/routes/agents.ts   — /agents endpoint
src/api/routes/events.ts   — /events endpoint
src/api/routes/tiles.ts    — /tile/:id endpoint
src/api/compat.ts          — backwards-compat shim
src/api/index.ts
tests/api/endpoints.test.ts
```

---

### F-04: Agent State Machine

**Phase:** 1 (Foundation)
**Depends on:** F-01
**Location:** `src/agents/`

#### Description
Model agent lifecycle and state transitions. An agent spawns, moves between tiles, changes activity, may enter conflict, and eventually despawns. Each transition emits a WorldEvent.

#### Acceptance Criteria
- [ ] `AgentManager` class tracks all active agents
- [ ] `spawnAgent(config): Agent` creates an agent at an initial tile, emits `agent_spawn` event
- [ ] `moveAgent(agentId, tileId)` updates position, records in history, emits `agent_move` event
- [ ] `updateActivity(agentId, activity, detail)` changes activity state, emits `agent_activity` event
- [ ] `despawnAgent(agentId)` removes agent, emits `agent_despawn` event
- [ ] History ring buffer stores last 50 tile visits per agent
- [ ] `getConflicts(agentId): string[]` returns IDs of other agents whose recent history overlaps
- [ ] All mutations emit events to an EventEmitter (for downstream consumption)
- [ ] Thread-safe: concurrent spawn/move/despawn calls don't corrupt state

#### Test Plan
- Unit test full lifecycle: spawn -> move -> activity change -> move -> despawn
- Assert each transition emits the correct event type with correct payload
- Assert history ring buffer caps at 50 entries
- Assert conflict detection: two agents visiting same tile within time window are flagged
- Assert despawned agents are fully removed from state
- Assert invalid transitions throw (e.g., moving a despawned agent)

#### Files to Create
```
src/agents/agent-manager.ts    — AgentManager class
src/agents/state-machine.ts    — transition logic
src/agents/history.ts          — ring buffer implementation
src/agents/conflicts.ts        — conflict detection
src/agents/index.ts
tests/agents/agent-manager.test.ts
tests/agents/conflicts.test.ts
```

---

### F-05: Terminal Renderer v2

**Phase:** 1 (Foundation)
**Depends on:** F-01, F-03
**Location:** `packages/cyberscape-term/` (evolve existing)

#### Description
Upgrade the existing terminal renderer to consume the new Cyberscape API and display richer information: agent names, activity types, conflict indicators, and zoom levels.

#### Acceptance Criteria
- [ ] Consumes `GET /api/cyberscape/world` instead of `/api/workspace-state`
- [ ] Displays agent names and activity icons on their current hex tile
- [ ] Conflict tiles are highlighted with a distinct color (e.g., yellow border)
- [ ] Region-level zoom: show collapsed regions (one hex per region) as default view
- [ ] Zone-level zoom: pressing a key (e.g., `1`-`9`) zooms into a region showing its zones
- [ ] Tile-level zoom: pressing a key inside a zone zooms to individual tiles
- [ ] `q` or `Escape` zooms back out one level
- [ ] Status bar at bottom shows: agent count, event count, active conflicts, last update time
- [ ] Graceful fallback: if API is unreachable, show last known state with "OFFLINE" indicator

#### Test Plan
- Snapshot tests: given known world state JSON, assert exact terminal output string
- Assert zoom level transitions produce correct hex subset
- Assert offline fallback renders correctly
- Assert agent labels render within hex boundaries (no overflow)
- Manual smoke test: run against live API and visually confirm

#### Files to Modify
```
packages/cyberscape-term/index.js     — rewrite to consume v2 API
packages/cyberscape-term/renderer.js  — extract rendering logic (new file)
packages/cyberscape-term/zoom.js      — zoom state management (new file)
packages/cyberscape-term/tests/       — snapshot tests
```

---

### F-06: Event Ingestion Pipeline

**Phase:** 2 (Integration)
**Depends on:** F-01, F-04
**Location:** `src/ingestion/`

#### Description
Connect Cyberscape to real data sources. This is where the Integration Protocol (Section 3) meets the internal data model. Three adapter types transform external signals into WorldEvents:

1. **HeartbeatReceiver** — implements the universal heartbeat API from Section 3. This is the primary integration point for any external agent system.
2. **GitAdapter** — polls git repos for commit/branch activity.
3. **CIAdapter** — receives CI/CD webhook POSTs.

#### Acceptance Criteria
- [ ] `HeartbeatReceiver`: implements `POST /api/cyberscape/heartbeat` per Section 3.1
- [ ] `HeartbeatReceiver`: validates incoming heartbeat JSON against the heartbeat schema (Zod)
- [ ] `HeartbeatReceiver`: resolves `currentFile` path to a tile ID via terrain lookup
- [ ] `HeartbeatReceiver`: auto-spawns unknown agents on first heartbeat (via AgentManager)
- [ ] `HeartbeatReceiver`: updates agent position and activity on subsequent heartbeats
- [ ] `HeartbeatReceiver`: auto-despawns agents after 60 seconds of silence
- [ ] `HeartbeatReceiver`: implements `POST /api/cyberscape/agents/spawn` and `POST /api/cyberscape/agents/{agentId}/despawn` (Section 3.2)
- [ ] `HeartbeatReceiver`: returns `{ ok: true, tileId }` on success, `{ ok: false, error }` on validation failure
- [ ] `GitAdapter`: watches a git repo for new commits (via polling `git log`), emits `git_commit` events with affected file paths mapped to tile IDs
- [ ] `GitAdapter`: detects branch creation/deletion, emits `git_branch` events
- [ ] `CIAdapter`: accepts webhook POST at `/api/cyberscape/webhooks/ci`, emits `ci_start` and `ci_result` events
- [ ] All adapters are independently enableable via config
- [ ] Unknown file paths in heartbeats gracefully map to the nearest Region hex (never rejected)

#### Test Plan
- Unit test HeartbeatReceiver: valid heartbeat -> agent spawned/updated, correct response
- Unit test HeartbeatReceiver: invalid heartbeat (missing fields) -> 400 with error details
- Unit test HeartbeatReceiver: auto-despawn after timeout
- Unit test HeartbeatReceiver: file-to-tile resolution (known path -> known tile)
- Unit test HeartbeatReceiver: unknown file path -> nearest region fallback
- Unit test GitAdapter: given mock git log output, assert correct events emitted
- Unit test CIAdapter: POST mock webhook, assert correct events emitted
- Integration test: heartbeat -> agent appears in world -> visible via GET /api/cyberscape/agents

#### Files to Create
```
src/ingestion/heartbeat-receiver.ts   — universal heartbeat endpoint
src/ingestion/heartbeat-schema.ts     — Zod schema for heartbeat validation
src/ingestion/tile-resolver.ts        — file path -> tile ID resolution
src/ingestion/reaper.ts               — dead agent timeout detection
src/ingestion/git-adapter.ts           — git activity polling
src/ingestion/ci-adapter.ts            — CI/CD webhook handler
src/ingestion/index.ts
tests/ingestion/heartbeat-receiver.test.ts
tests/ingestion/tile-resolver.test.ts
tests/ingestion/git-adapter.test.ts
tests/ingestion/ci-adapter.test.ts
```

---

### F-07: Web Renderer — Hex Terrain

**Phase:** 2 (Integration)
**Depends on:** F-01, F-03
**Location:** `packages/cyberscape-web/src/`

#### Description
A browser-based hex terrain renderer using Three.js and React. Renders the terrain from the Cyberscape API as a 3D hexagonal grid with synthwave aesthetics.

#### Acceptance Criteria
- [ ] React app with Three.js (via @react-three/fiber) renders hex terrain
- [ ] Each hex tile is a 3D hexagonal prism with flat top
- [ ] Hex height (Y-axis) represents `TileMetrics.hotness` — hotter tiles are taller
- [ ] Color encodes status: idle = dark purple (#1a1a28), active = neon magenta (#7c5cfc), error = red (#fc5c5c)
- [ ] Commit frequency encoded as subtle emissive glow intensity
- [ ] Region boundaries shown as faint grid lines between hex groups
- [ ] Camera: orbit controls with zoom, pan, rotate
- [ ] Default camera angle: 45-degree isometric view looking down at the grid
- [ ] Hover tooltip: shows tile label, path, status, agent count, last modified
- [ ] Click tile: sidebar panel shows full tile detail
- [ ] Terrain loads from `GET /api/cyberscape/terrain` on mount
- [ ] Performance: render 500 hexes at 60fps on mid-range hardware

#### Test Plan
- Component tests: terrain component renders without crash given mock data
- Assert hex count matches input tile count
- Assert hover events fire with correct tile data
- Assert click events fire with correct tile data
- Visual regression test: screenshot comparison against baseline
- Performance test: measure FPS with 500 hex scene

#### Files to Create
```
packages/cyberscape-web/package.json
packages/cyberscape-web/src/App.tsx
packages/cyberscape-web/src/components/HexTerrain.tsx
packages/cyberscape-web/src/components/HexTile3D.tsx
packages/cyberscape-web/src/components/TileTooltip.tsx
packages/cyberscape-web/src/components/TileDetail.tsx
packages/cyberscape-web/src/hooks/useTerrain.ts
packages/cyberscape-web/src/theme.ts
packages/cyberscape-web/tests/HexTerrain.test.tsx
```

---

### F-08: Web Renderer — Agent Pawns

**Phase:** 2 (Integration)
**Depends on:** F-07
**Location:** `packages/cyberscape-web/src/components/`

#### Description
Render agents as animated "pawn" meshes on the hex terrain. Agents move between tiles with smooth interpolation. Activity state is shown via visual effects.

#### Acceptance Criteria
- [ ] Each agent rendered as a glowing capsule/cylinder mesh standing on its current hex
- [ ] Agent color matches `AgentType.color`
- [ ] Agent label (name) floats above the pawn as a billboard text
- [ ] Movement: when agent changes tile, pawn lerps to new position over 500ms
- [ ] Activity indicators: idle = dim, reading = pulsing, writing = bright + particle trail, blocked = red pulsing, reviewing = orbital ring, testing = spinning indicator
- [ ] Multiple agents on same tile: offset slightly so all are visible
- [ ] Agent spawn: fade-in animation (scale 0 -> 1 over 300ms)
- [ ] Agent despawn: fade-out animation (scale 1 -> 0 over 300ms)
- [ ] Click agent: sidebar panel shows agent detail (name, type, activity, history)
- [ ] Agent data loaded from `GET /api/cyberscape/agents`, updated via WebSocket (F-09)

#### Test Plan
- Component test: agent pawn renders at correct hex position
- Assert movement animation triggers on position change
- Assert spawn/despawn animations play
- Assert multiple agents on same tile are visually offset
- Assert click events fire with correct agent data

#### Files to Create
```
packages/cyberscape-web/src/components/AgentPawn.tsx
packages/cyberscape-web/src/components/AgentLabel.tsx
packages/cyberscape-web/src/components/AgentDetail.tsx
packages/cyberscape-web/src/hooks/useAgents.ts
packages/cyberscape-web/src/animations/movement.ts
packages/cyberscape-web/tests/AgentPawn.test.tsx
```

---

### F-09: Real-time WebSocket Bridge

**Phase:** 2 (Integration)
**Depends on:** F-03, F-04
**Location:** `src/api/`

#### Description
Add WebSocket support to the Cyberscape API server. Clients connect and receive real-time WorldEvent deltas, eliminating the need for polling.

#### Acceptance Criteria
- [ ] WebSocket server at `ws://host:port/ws/cyberscape`
- [ ] On connect: send full world snapshot as first message
- [ ] After connect: stream WorldEvents as they occur (JSON, one event per message)
- [ ] Message format: `{ type: "event", data: WorldEvent }` for deltas, `{ type: "snapshot", data: World }` for full state
- [ ] Client can send `{ type: "subscribe", filters: { regions?: string[], eventKinds?: EventKind[] } }` to filter events
- [ ] Heartbeat: server sends `{ type: "ping" }` every 30s, client responds `{ type: "pong" }`
- [ ] Auto-disconnect clients that miss 3 consecutive pings
- [ ] Connection count exposed at `GET /api/cyberscape/status`

#### Test Plan
- Integration test: connect WS client, assert snapshot received
- Assert events emitted by AgentManager appear on WS within 100ms
- Assert subscription filters work (subscribe to one region, only get events for that region)
- Assert ping/pong heartbeat works
- Assert stale clients are disconnected after missed pings
- Assert `/status` endpoint shows correct connection count
- Load test: 50 concurrent WS clients, assert no message loss

#### Files to Create/Modify
```
src/api/websocket.ts       — WS server setup
src/api/ws-client.ts       — client-side WS helper (for renderers)
src/api/server.ts          — integrate WS into Express server
tests/api/websocket.test.ts
```

---

### F-10: Conflict Detection Engine

**Phase:** 3 (Sociology)
**Depends on:** F-04, F-06
**Location:** `src/sociology/`

#### Description
Detect and classify conflicts between agents working in overlapping areas. This is the foundation of the "sociological simulation" — making invisible team dynamics visible.

#### Acceptance Criteria
- [ ] `ConflictDetector` monitors agent history and identifies overlaps
- [ ] Overlap defined as: two agents both have tile visits within the same Zone in the last N minutes (configurable, default 30)
- [ ] Conflict severity levels: `low` (same zone, different tiles), `medium` (same tile, different times), `high` (same tile, overlapping time windows)
- [ ] Each detected conflict emits a `conflict_detected` WorldEvent
- [ ] When agents separate (no overlap for 10 minutes), emit `conflict_resolved`
- [ ] `getActiveConflicts(): Conflict[]` returns all unresolved conflicts
- [ ] Each Conflict includes: the two agent IDs, the contested tile/zone, severity, duration, and a suggested action (e.g., "Consider partitioning the auth module between these agents")

#### Test Plan
- Unit test: two agents visit same tile -> conflict detected at severity `medium`
- Unit test: two agents in same zone but different tiles -> conflict at severity `low`
- Unit test: overlapping time windows -> severity `high`
- Assert conflict_resolved fires after separation timeout
- Assert no false positives: two agents in different zones produce no conflict
- Assert conflict list updates correctly as agents move

#### Files to Create
```
src/sociology/conflict-detector.ts
src/sociology/conflict-types.ts
src/sociology/index.ts
tests/sociology/conflict-detector.test.ts
```

---

### F-11: Agent Interaction Graph

**Phase:** 3 (Sociology)
**Depends on:** F-04, F-10
**Location:** `src/sociology/`

#### Description
Build and maintain a graph of agent-to-agent relationships based on their interaction history. This powers the "sociology" view — understanding how agents collaborate and where handoffs break down.

#### Acceptance Criteria
- [ ] `InteractionGraph` maintains weighted edges between agents
- [ ] Edge weight increases each time two agents interact (same zone, handoff, conflict)
- [ ] Interaction types tracked: `co-location` (same zone), `handoff` (agent B enters tile that agent A recently left), `conflict` (from F-10)
- [ ] `getInteractions(agentId): Interaction[]` returns all interactions for an agent
- [ ] `getTeamDynamics(): TeamDynamics` returns aggregate metrics: cluster detection (which agents work together most), bottleneck detection (which agents are involved in most conflicts), isolation detection (agents with no interactions)
- [ ] Graph queryable via API: `GET /api/cyberscape/sociology/graph`
- [ ] Graph prunable: interactions older than N days (configurable) are decayed by 50% per day

#### Test Plan
- Unit test: two agents co-locating increases edge weight
- Unit test: handoff detection (agent A leaves, agent B arrives within 5 min)
- Assert cluster detection groups agents that frequently co-locate
- Assert bottleneck detection flags agents with high conflict counts
- Assert isolation detection flags agents with zero interactions
- Assert decay reduces old interaction weights over time

#### Files to Create
```
src/sociology/interaction-graph.ts
src/sociology/team-dynamics.ts
tests/sociology/interaction-graph.test.ts
tests/sociology/team-dynamics.test.ts
```

---

### F-12: Historical Replay Engine

**Phase:** 3 (Sociology)
**Depends on:** F-06, F-15
**Location:** `src/replay/`

#### Description
Record all WorldEvents to persistent storage and allow replaying them as a timelapse. Watch the last hour, day, or week of development activity as an animation.

#### Acceptance Criteria
- [ ] All WorldEvents are persisted to the event store (F-15)
- [ ] `ReplayEngine` loads events from a time range and replays them in sequence
- [ ] Playback speed: 1x (real-time), 10x, 60x, 3600x (1 hour = 1 second)
- [ ] Playback controls: play, pause, seek to timestamp, set speed
- [ ] API endpoint: `GET /api/cyberscape/replay?from={ISO8601}&to={ISO8601}&speed={n}`
- [ ] Returns a WebSocket URL that streams events at the requested speed
- [ ] Replay accurately reconstructs agent positions and terrain state at any point in time
- [ ] Memory bounded: replay engine processes events in chunks, not all in memory

#### Test Plan
- Unit test: replay 100 events at 10x speed, assert events arrive at correct intervals
- Assert playback pause/resume works
- Assert seek to timestamp produces correct world state at that timestamp
- Assert memory usage stays bounded for large replays (10,000 events)
- Integration test: record 5 minutes of activity, replay at 60x, assert visual correctness

#### Files to Create
```
src/replay/replay-engine.ts
src/replay/time-cursor.ts
src/replay/index.ts
tests/replay/replay-engine.test.ts
```

---

### F-13: OVI Narration Integration

**Phase:** 3 (Sociology)
**Depends on:** F-03, F-10
**Location:** `src/narration/`

#### Description
Connect Cyberscape state to OVI so that OVI can narrate what's happening in the workspace in real time. OVI becomes the voice of Cyberscape.

#### Acceptance Criteria
- [ ] `NarrationEngine` generates human-readable summaries of Cyberscape state
- [ ] Summary types: `status` (current snapshot), `alert` (new conflict or error), `recap` (last N minutes of activity)
- [ ] `generateStatusNarration(): string` produces text like: "Three agents are active. LG2 is refactoring the auth module. CodeReviewer-1 is reviewing the API routes. No active conflicts."
- [ ] `generateAlertNarration(event: WorldEvent): string` produces text like: "Conflict developing in the auth module — LG2 and CodeReviewer-1 have been touching the same files for 20 minutes."
- [ ] `generateRecapNarration(since: ISO8601): string` produces text like: "In the last hour: 12 commits across 3 regions. The API zone was the most active. One conflict was detected and resolved in the auth module."
- [ ] OVI integration: POST narration text to OVI's TTS endpoint or expose via `GET /api/cyberscape/narration/{type}`
- [ ] Narration text is templated (no LLM dependency) — fast, deterministic, testable

#### Test Plan
- Unit test: given known world state, assert status narration contains expected agent names and activity descriptions
- Unit test: given conflict event, assert alert narration mentions both agents and the contested zone
- Unit test: given event history, assert recap narration includes correct counts
- Assert narration is purely template-driven (no external API calls)
- Assert narration handles edge cases: zero agents, zero events, all agents idle

#### Files to Create
```
src/narration/narration-engine.ts
src/narration/templates.ts
src/narration/index.ts
tests/narration/narration-engine.test.ts
```

---

### F-14: Human Presence (God View)

**Phase:** 3 (Sociology)
**Depends on:** F-04, F-07, F-08
**Location:** `packages/cyberscape-web/src/components/`

#### Description
The human operator exists as a special agent in the Cyberscape world — a "god view" pawn that agents can see and respond to. The human can click on tiles to "focus" attention there, and agents see this as a signal.

#### Acceptance Criteria
- [ ] A special Agent type `human` with distinct visual treatment (golden pawn, larger than AI agents)
- [ ] Human pawn auto-positioned based on which files the operator has open (via editor integration or manual selection)
- [ ] Click any tile in the web renderer to "focus" the human pawn there
- [ ] Focus emits an `annotation` event with kind `human_focus`, visible to all agents
- [ ] Human can right-click a tile to add a text annotation (max 280 chars)
- [ ] Annotations appear as floating text bubbles above the hex tile
- [ ] API: `POST /api/cyberscape/focus` with `{ tileId }` to move human pawn
- [ ] API: `POST /api/cyberscape/annotate` with `{ tileId, text }` to add annotation
- [ ] Annotations visible in terminal renderer as `[!]` badge on the hex

#### Test Plan
- Unit test: POST focus endpoint moves human agent to correct tile
- Unit test: POST annotate endpoint creates annotation event
- Assert human pawn renders with distinct visual style
- Assert annotations appear on correct tile
- Assert terminal renderer shows annotation badge
- Assert focus events are visible in WebSocket stream

#### Files to Create/Modify
```
src/agents/human-agent.ts
src/api/routes/human.ts
packages/cyberscape-web/src/components/HumanPawn.tsx
packages/cyberscape-web/src/components/Annotation.tsx
packages/cyberscape-web/tests/HumanPawn.test.tsx
```

---

### F-15: Persistence Layer

**Phase:** 2 (Integration)
**Depends on:** F-01
**Location:** `src/persistence/`

#### Description
Persist world state and events to disk so that Cyberscape state survives server restarts and enables historical replay (F-12). Lightweight — SQLite for structured data, append-only file for events.

#### Acceptance Criteria
- [ ] SQLite database at `data/cyberscape.db` (gitignored)
- [ ] Tables: `terrain` (hex map), `agents` (last known state), `events` (append-only log)
- [ ] `PersistenceLayer` class with: `saveTerrain()`, `loadTerrain()`, `saveAgentSnapshot()`, `loadAgentSnapshot()`, `appendEvent()`, `queryEvents(since, until, kinds?, limit?)`
- [ ] On server start: load last terrain + agent snapshot, then replay events since snapshot to reconstruct current state
- [ ] Event table indexed by timestamp and kind for fast range queries
- [ ] Auto-compact: events older than 30 days are summarized into daily rollups and originals deleted
- [ ] Database migrations: versioned schema with automatic upgrade on startup

#### Test Plan
- Unit test: save terrain, load terrain, assert identical
- Unit test: save agent snapshot, load, assert identical
- Unit test: append 1000 events, query by time range, assert correct subset returned
- Unit test: query by event kind filter
- Assert server restart reconstructs correct state from persistence
- Assert auto-compact reduces event count for old data
- Assert migration system handles version upgrades

#### Files to Create
```
src/persistence/database.ts       — SQLite setup + migrations
src/persistence/terrain-store.ts   — terrain CRUD
src/persistence/agent-store.ts     — agent snapshot CRUD
src/persistence/event-store.ts     — event append + query
src/persistence/compaction.ts      — auto-compact logic
src/persistence/index.ts
data/.gitkeep
tests/persistence/database.test.ts
tests/persistence/event-store.test.ts
```

---

## 6. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Language | TypeScript (strict) | Type safety, shared types across all layers |
| Runtime | Node.js 20+ | Already used by OVI, consistent ecosystem |
| API Server | Express + ws | Lightweight, existing OVI precedent |
| Validation | Zod | Runtime schema validation, infers TS types |
| Database | better-sqlite3 | Zero-config, embedded, fast for this scale |
| Web Renderer | React + @react-three/fiber | React ecosystem, Three.js without imperative boilerplate |
| Terminal Renderer | Raw ANSI (existing) | Zero-dependency, existing implementation |
| Testing | Vitest | Fast, TypeScript-native, watch mode |
| Build | tsup | Fast bundler, minimal config |
| Package Manager | npm | Matches existing workspace |

---

## 7. Phase Roadmap

### Phase 1 — Foundation (Features F-01 through F-05)

**Goal:** The data model works. You can see live terrain and agent state in the terminal.

```
F-01 World Data Model ──┬──> F-02 Terrain Generator ──> F-03 API v2 ──> F-05 Terminal v2
                        │
                        └──> F-04 Agent State Machine ─────────────────────┘
```

**Done when:** Terminal renderer shows real codebase terrain with agent positions from the API. All unit tests pass.

### Phase 2 — Integration (Features F-06, F-07, F-08, F-09, F-15)

**Goal:** Real data flows in. The web renderer works. State persists. External agents can connect.

```
F-06 Event Ingestion (Heartbeat API + Git + CI) ──> F-09 WebSocket Bridge
F-07 Web Hex Terrain ──> F-08 Web Agent Pawns
F-15 Persistence Layer
```

**Done when:** An external agent sends a heartbeat via curl, and its pawn appears on both the terminal and web renderer in real time. Git commits produce terrain updates. Server restart preserves state.

**Also ships:** Tier 1 integration is fully operational — any system that can POST JSON can connect.

### Phase 2.5 — SDK Packages (Post Phase 2, pre Phase 3)

**Goal:** Make integration a one-liner for JS and Python developers.

- `@cyberscape/agent` (npm) — thin wrapper: connect, heartbeat, despawn
- `cyberscape` (pip) — same API surface for Python agents
- Both packages are wrappers around the Tier 1 HTTP API — no new server-side code needed
- README examples showing integration with LangChain, CrewAI, AutoGen, and vanilla scripts

**Done when:** `npm install @cyberscape/agent` and three lines of code makes an agent appear on the map.

### Phase 3 — Sociology (Features F-10, F-11, F-12, F-13, F-14)

**Goal:** Cyberscape becomes a tool for *understanding*, not just *seeing*.

```
F-10 Conflict Detection ──> F-11 Interaction Graph
                        └──> F-13 OVI Narration
F-12 Historical Replay
F-14 Human Presence
```

**Done when:** You can see agent conflicts, replay history, hear OVI narrate workspace state, and place your own pawn on the map.

### Future — Framework Adapters (Community-Driven)

**Goal:** Zero-config integration for popular agent frameworks.

Tier 3 adapters are built on top of the SDK (Tier 2) and auto-report agent activity without users writing integration code. These are driven by community demand — build them when users ask for them, not before.

Potential adapters:
- LangChain callback handler
- CrewAI task listener
- AutoGen agent hook
- OpenClaw session bridge
- Custom webhook transformer

---

## Appendix A: Project Structure

```
cyberscape/                    — repo root
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
├── docs/
│   ├── DESIGN-SPEC.md         — this file
│   ├── IDEATION.md            — initial ideation notes
│   └── VISION.md              — original vision document
├── src/
│   ├── models/                — F-01: data model + validation
│   ├── terrain/               — F-02: codebase -> hex map
│   ├── agents/                — F-04: agent state machine
│   ├── api/                   — F-03, F-09: REST + WS server
│   ├── ingestion/             — F-06: heartbeat receiver, git/CI adapters
│   ├── persistence/           — F-15: SQLite storage
│   ├── sociology/             — F-10, F-11: conflict + interaction
│   ├── narration/             — F-13: OVI narration templates
│   ├── replay/                — F-12: historical replay
│   └── index.ts               — main entry point
├── tests/
│   └── (mirrors src/ structure)
├── data/
│   └── .gitkeep
├── packages/
│   ├── cyberscape-web/        — F-07, F-08, F-14: Three.js web renderer
│   └── cyberscape-term/       — F-05: terminal renderer (existing, evolved)
```

## Appendix B: Coding Agent Instructions

When picking a feature to implement:

1. Read this spec. Find the feature (F-01 through F-15).
2. Check "Depends on" — implement dependencies first if not yet done.
3. Create the files listed in "Files to Create."
4. Implement to satisfy every acceptance criterion (each `[ ]` checkbox).
5. Write tests matching the "Test Plan."
6. Run tests. All must pass before marking the feature complete.
7. Do not modify files outside the feature's listed scope without documenting why.
