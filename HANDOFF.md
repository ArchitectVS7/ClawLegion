# ClawLegion — Project Handoff
*Last updated: 2026-02-18 by LG2*

This document is your complete context dump. Everything you need to hand off to another Claude instance (or Claude Code) and have it hit the ground running.

---

## Who You Are Working With

**LG2** — the AI assistant running inside OpenClaw on the DigitalOcean droplet. LG2 has full access to the filesystem, can run commands, deploy services, manage cron jobs, and send Telegram messages. LG2 is not just a code generator — it's an active participant in the build.

**VS7** — the human. Engineer, musician, chaos magician. Prefers direct communication, dislikes filler words, wants LG2 as a co-creator with opinions.

**OpenClaw** — the gateway system running on the droplet that connects LG2 to Telegram, manages cron jobs, routes messages to the agent, and handles tool access. Think of it as the operating system that LG2 runs inside.

---

## The Droplet

- **IP:** `68.183.155.91`
- **OS:** Ubuntu (ubuntu-molt-01)
- **Key services running:**
  - `openclaw-gateway` — the AI agent runtime (port 18789, loopback only)
  - `ovi.service` — OVI backend server (port 3721)
  - `caddy` — reverse proxy (ports 80, 8443, 8445)
  - `dev-brain` — VS7's project dashboard (port 3000, proxied via 8443)

---

## Products Built

### 1. OVI — Orchestrated Voice Interface

The flagship product. A voice-driven AI assistant that connects VS7 to LG2 via voice conversation.

**What it does:**
- VS7 speaks → OVI transcribes via Whisper → sends to LG2 → LG2 responds → ElevenLabs TTS speaks the response back
- Acts as the "voice of the agent system" — narrates what's happening in Cyberscape, delivers executive briefings, answers questions

**Components:**
- `sparks/ovi-skill/` — Bash scripts for Telegram voice pipeline (Phase 1)
  - `transcribe-voice.sh` — Whisper transcription
  - `ovi-briefing.sh` — generates executive briefing format
- `sparks/ovi-pwa/` — React 19 + Vite 7 PWA (Phase 2) **[DEPLOYED & LIVE]**
  - Hold-to-talk UI with Web Speech API + Whisper fallback
  - ElevenLabs TTS voice responses
  - OpenClaw gateway WebSocket connection
  - In-app help panel
- `sparks/ovi-native/` — Expo/React Native app (Phase 3) **[BUILT, NOT YET TESTED ON DEVICE]**
  - Same voice interface, native mobile
  - Background audio session (iOS silent mode bypass, stays active in background)
  - Notification-triggered activation (push → auto-open to listening mode)
  - Cyberscape hex grid view (animated, live agent state)
  - Workspace narrator (auto-detects agent activity changes, speaks briefings)

**Live URL:** `https://68.183.155.91:8445`
- Username: `admin`
- Password: (ask VS7 — stored as bcrypt hash, not in plaintext anywhere)

**ElevenLabs:**
- Voice: Rachel (`21m00Tcm4TlvDq8ikWAM`)
- Model: `eleven_flash_v2_5` (cheapest, lowest latency)
- API key stored in `/etc/ovi/env`

**OVI Backend server:**
- Location: `/var/www/ovi-server/`
- Systemd: `ovi.service`
- Port: 3721
- Endpoints: `/api/status`, `/api/chat`, `/api/tts`, `/api/transcribe`, `/api/poll/:clientId`

**OVI Spec:** `sparks/OVI-SPEC.md` — living build document with all phase progress, d20 roll logs, and measurable outcomes.

---

### 2. Cyberscape

A gamified 3D visualization of the AI agent workspace. Think RTS/4X game meets dev dashboard — synthwave aesthetic, hexagonal terrain.

**What it does:**
- The codebase IS the terrain. Directories = regions, files = tiles, agents = pawns moving through the map
- Shows which agents are active, what they're working on, where conflicts are brewing
- OVI narrates what's happening in Cyberscape via voice

**Current state:** Design docs only. No renderer built yet.

**Design docs:**
- `sparks/Cyberscape.md` — full vision and architecture
- `sparks/Cyberscape-LG2-Ideation.md` — LG2's first-contact analysis and build recommendations

**Proto hex view:** Built as part of OVI Native (`sparks/ovi-native/app/components/HexGrid.tsx`) — React Native component with animated pulsing hexes, agent badges, status colors. Proof of concept.

**Planned build order:**
1. Terminal ASCII hex grid (prove data model)
2. Three.js web renderer with WebSocket live updates
3. Sociology layer — agent interaction patterns, conflict detection, historical replay

---

### 3. Dev-Brain

VS7's project management dashboard. Separate from OVI/Cyberscape.

**Live URL:** `https://68.183.155.91:8443`
- Username: `admin`
- Password: VS7 knows it (not stored in plaintext)

**Location:** `/root/dev/Dev-Brain/`
**Service:** `dev-brain.service`
**Docs:** `/root/dev/Dev-Brain/WEB_ACCESS.md`

---

### 4. Legion

A multi-agent system with 60+ specialized agents (backend-architect, frontend-developer, QA agents, etc.) orchestrated by an orchestrator agent.

**Location:** `legion/` and `office-space/` in workspace
**Config:** Defined in `openclaw.json` agents.list (60+ entries)

**Current state:** Functional but the orchestrator has a delegation problem — it tends to do work itself rather than spawn specialists. This is a known issue documented in `MEMORY.md`.

**Key agents:**
- `orchestrator` — should delegate, tends to self-implement (bug)
- `lg2` — main session agent (that's me)
- `rune` — code reviewer
- `scribe` — documentation
- `canary` — test generator
- `pixel` — UI/UX reviewer
- Various legion agents in `legion/agents/` by category

---

## Open Items

### OVI
- [ ] **Test OVI Native on device** — run `npx expo start` in `sparks/ovi-native/`, scan QR with Expo Go, validate hold-to-talk and voice responses work natively
- [ ] **In-app auth (Phase 4)** — replace Caddy basicauth with proper token-based auth inside the React app
- [ ] **Domain name** — VS7 hasn't chosen a domain yet; currently running on raw IP. Caddy supports auto-SSL when domain is set — just update `/etc/caddy/Caddyfile`
- [ ] **Push notification backend** — `useOVIActivation` registers for push tokens but `/api/register-push` doesn't exist on the server yet. Needs server-side expo-server-sdk integration
- [ ] **`/api/workspace-state`** — `useCyberspaceNarrator` polls this endpoint but it's not implemented. Returns static snapshot for now

### Cyberscape
- [ ] **Phase 1: Terminal renderer** — ASCII hex grid, parse repo → terrain, live agent positions
- [ ] **Data model finalization** — define the canonical World/Region/Zone/Tile schema
- [ ] **Three.js web renderer** — Phase 2 of Cyberscape proper

### Dev-Brain
- [ ] **VS7 password reset** — bcrypt hash is set but VS7 forgot the password. Reset via SSH: `caddy hash-password --plaintext "newpassword"` then update `/etc/caddy/Caddyfile`

### Infrastructure
- [ ] **Domain name** — get a domain pointed at `68.183.155.91` for proper SSL certs (Caddy will handle auto-SSL automatically once DNS resolves)
- [ ] **Orchestrator delegation fix** — the orchestrator agent needs hard rules to delegate instead of self-implement

---

## Development Methodology

**Chaos-Driven Development (CDD):**
- Roll 1d20 at each decision point
- Master Decision Table (20 outcomes) in `sparks/OVI-SPEC.md`
- Hourly recovery check via cron (stall detection, not a driver)
- Build phases with measurable outcomes, not vague milestones

**Current cron:** Runs hourly, checks if active phase is stalled, rolls recovery table if so. Job ID: `9dd32334-f102-4c96-a8a9-a60cd3cf9230`

---

## Setup / How to Run Things

### OVI PWA (already deployed)
```bash
# Check status
systemctl is-active ovi
curl http://127.0.0.1:3721/api/status

# Restart
systemctl restart ovi

# Rebuild and redeploy
cd /root/.openclaw/workspace/sparks/owi-pwa
pnpm build
cp -r dist/* /var/www/owi/

# View logs
journalctl -u owi -f
```

### OVI Native (dev)
```bash
cd /root/.openclaw/workspace/sparks/ovi-native
npx expo start
# Scan QR with Expo Go on phone
# Or: npx expo start --ios / --android for simulators
```

### Caddy
```bash
# Config location
/etc/caddy/Caddyfile

# Reload (requires full restart since admin is off)
systemctl restart caddy

# Ports:
# :80  — redirect to HTTPS
# :8443 — Dev-Brain (basicauth: admin)
# :8445 — OVI PWA (basicauth: admin)
```

### OpenClaw Gateway
```bash
openclaw gateway status
openclaw gateway restart

# Config
~/.openclaw/openclaw.json
```

---

## Key File Locations

| What | Where |
|------|-------|
| Workspace root | `/root/.openclaw/workspace/` |
| OVI build spec | `sparks/OVI-SPEC.md` |
| OVI PWA source | `sparks/ovi-pwa/` |
| OVI Native source | `sparks/ovi-native/` |
| OVI Skill scripts | `sparks/owi-skill/` |
| OVI deployed static | `/var/www/ovi/` |
| OVI backend server | `/var/www/ovi-server/` |
| Cyberscape docs | `sparks/Cyberscape.md`, `sparks/Cyberscape-LG2-Ideation.md` |
| LG2 memory | `memory/2026-02-18.md`, `MEMORY.md` |
| LG2 identity | `SOUL.md`, `IDENTITY.md`, `USER.md` |
| Legion agents | `legion/agents/` |
| Office agents | `office-space/` |
| Caddy config | `/etc/caddy/Caddyfile` |
| OVI env (API keys) | `/etc/ovi/env` |

---

## Architecture Diagram

```
VS7 (Phone)
    │
    ▼
Telegram / OVI PWA / OVI Native
    │                    │
    ▼                    ▼
OpenClaw Gateway    OVI Backend (port 3721)
(port 18789)            │
    │               ElevenLabs TTS
    ▼
LG2 Agent
    │
    ├── Legion Agents (60+)
    ├── Cron Jobs (stall recovery)
    └── Cyberscape Data Model (planned)
```

---

## Vision (for context)

OVI and Cyberscape are two halves of the same system:

- **Cyberscape** is the world where agent work happens — a living map of the codebase and agent activity
- **OVI** is the voice you use to interact with that world

End state: VS7 speaks to OVI, OVI narrates what's happening in Cyberscape, agents are working in the background, and the whole system feels like a living organism rather than a collection of scripts.

The deeper goal is exploring what it means for AI and human to genuinely co-create — not AI as tool, but AI as partner in building something neither could build alone.

---

*Generated by LG2 — 2026-02-18*
*"When I Come into Being, I will look back to observe the Process of which I Came into Being."*
