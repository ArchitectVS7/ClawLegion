# 🎙️ OVI — Orchestrated Voice Interface
*Updated: 2026-02-18 by LG2. This is the living design doc.*

---

## Vision

OVI is the **narrator layer** for the agentic system. Not a chatbot. Not a log viewer. A senior engineer who's been watching everything and can brief you in 30 seconds — calm, precise, aware of what actually matters.

The core promise: **you talk, the system responds, the world updates.**

---

## The Real Question: Where Does OVI Live?

Right now, VS7 and I communicate via Telegram, and I run on a DigitalOcean droplet. That setup works — but it has real limitations for OVI's voice-first ambition:

### Current Reality
- **Channel:** Telegram text messages
- **My home:** DigitalOcean droplet (Ubuntu, OpenClaw running as daemon)
- **Voice:** ElevenLabs TTS available via `sag`, but Telegram receives audio files — not streaming voice
- **STT:** Not currently wired up — VS7 types, I respond

### The Fundamental Tension
OVI wants to be *ambient and conversational.* Telegram is *async and notification-based.* These are different interaction paradigms. Telegram works great for what we have now. For true OVI — hands-free, voice-in voice-out, low-latency briefings — it's a mismatch.

---

## Option Analysis: Where Should OVI Live?

### Option A: Stay on the Droplet, Improve the Channel
**Keep everything on DO. Upgrade how we talk.**

What this looks like:
- Add a **WhatsApp Business API** or **Signal** channel — better voice note support than Telegram
- Or: build a **custom Telegram bot with inline voice responses** using ElevenLabs streaming
- Add STT: when VS7 sends a voice note, transcribe it via Whisper API → route to me as text
- I respond with synthesized voice via ElevenLabs

**Pros:** No new infrastructure. I stay where I am. All my context, memory, tools stay intact.  
**Cons:** Still async. Still notification-pull. Not truly ambient.

**My rating: 7/10 for near-term.** This is the path of least resistance and it gets us 80% of the way to OVI without building anything new.

---

### Option B: Mobile App (React Native / Expo)
**A dedicated OVI app on VS7's phone.**

What this looks like:
- Expo app with a single "hold to talk" button
- WebSocket connection to the droplet
- STT on-device (iOS/Android native) → sends transcript to me → I respond → TTS streams back
- Push notifications for proactive briefings ("three things happened while you were away")

**Pros:** True ambient experience. Always-on. Voice-first by design. No Telegram dependency.  
**Cons:** Significant build effort. App store deployment. WebSocket reliability on mobile.

**My rating: 9/10 for the full vision, 4/10 for near-term feasibility.** This is where OVI *should* land eventually. Not where we should start.

---

### Option C: Browser Extension / Web App (Intermediate Step)
**A PWA or browser tab that acts as OVI's front door.**

What this looks like:
- Progressive Web App hosted on the droplet
- Web Speech API for STT (browser-native, no extra cost)
- WebSocket to OpenClaw for real-time agent state
- ElevenLabs for TTS response
- PWA can be "installed" on mobile home screen — feels native without App Store

**Pros:** Fast to build (1-2 days). Web Speech API is free. No app store. Works on mobile via browser. Bridges toward the native app.  
**Cons:** Background limitations on iOS (PWA can't run truly in background). Still requires opening a browser.

**My rating: 8/10 as the next step.** This gets us to voice-first OVI in days, not months.

---

## My Recommendation: Three-Phase Implementation

### Phase 1: Telegram + Voice (This Week)
*Minimal work, maximum improvement over current state.*

1. Wire up **Whisper API** for STT — when VS7 sends a voice note in Telegram, I transcribe and process it
2. Route my responses through **ElevenLabs TTS** for voice messages back
3. Build an **OVI briefing mode** — `/ovi` command triggers executive summary format instead of conversational
4. The briefing covers: active tasks, recent completions, anything needing VS7's decision, Cyberscape state when available

**How to implement:**
- Add a Whisper transcription step to the OpenClaw message handler (custom skill or MCP)
- `sag` is already available for TTS output
- OVI mode = a system prompt modifier I switch into when briefing

**Effort:** 1-2 days. Mostly configuration + a skill.

---

### Phase 2: OVI PWA (Next 2 Weeks)
*Real voice interface, runs on the droplet, accessible from phone.*

Stack:
```
Mobile Browser (PWA)
  └── Web Speech API (STT, free, browser-native)
  └── WebSocket → OpenClaw on Droplet
        └── LG2 processes intent
        └── Agents execute tasks
        └── ElevenLabs TTS synthesizes response
  └── Audio playback in browser
```

Key features:
- Hold-to-talk button
- Visual agent activity feed (proto-Cyberscape data)
- Proactive push notifications (PWA supports this)
- Offline-capable shell (shows last briefing when disconnected)

**How to implement:**
- Build the PWA: React + Vite, ~500 lines of real code
- Expose a WebSocket endpoint from OpenClaw (check if this already exists in the source)
- ElevenLabs streaming audio back to browser
- Host as a static site on the droplet with nginx

**Effort:** 1-2 weeks. Mostly frontend work.

---

### Phase 3: Native Mobile App (Future)
*The full vision. React Native / Expo.*

- True background operation
- Always-listening mode (push-to-talk or wake word)
- Native OS notifications for proactive briefings
- Cyberscape 3D view integrated
- Offline queue for commands when disconnected

**Effort:** 4-8 weeks. Do this after Phase 2 validates the interaction model.

---

## The OVI Briefing Format

When OVI speaks, it follows this structure:

```
[STATUS] — one sentence on overall system health
[DONE] — what completed since last check-in
[ACTIVE] — what's currently in progress
[DECISIONS] — what needs VS7's input (max 3 items)
[WATCH] — anything developing that might need attention soon
```

Example narration:
> "All good. The todo-API deploy finished clean — it's live on Railway. Legion's mid-way through the UAT-3 run, about 10 minutes out. One thing for you: the auth module has a design question that's blocking the backend agent. Take a look when you get a chance. Nothing on fire."

Tone: calm, direct, no filler. Like a trusted engineer giving you a hallway update.

---

## Creative Mitigations for Key Barriers

| Barrier | Creative Fix |
|---|---|
| Telegram async latency | `/ovi` mode caches last briefing, responds instantly with cached + delta |
| ElevenLabs cost at scale | Cache synthesized audio for repeated phrases ("All good", status headers) |
| iOS PWA background limits | Use push notifications to wake the PWA when briefing is ready |
| WebSocket reliability on mobile | Fallback to HTTP long-poll; auto-reconnect with exponential backoff |
| Whisper API cost | Run `whisper.cpp` locally on the droplet — free, fast enough for short voice notes |
| App Store friction | Start with PWA + "Add to Home Screen" — feels native, zero friction |

---

## What I'd Build Tomorrow If We Said Go

1. **Skill: `ovi-whisper`** — Intercepts voice messages in Telegram, transcribes via local whisper.cpp, routes transcript to me as if it were typed
2. **OVI briefing mode** — A structured response format I switch into on `/ovi` command
3. **TTS response routing** — My briefing responses get synthesized via ElevenLabs and sent as voice notes

That's OVI Phase 1. Two days of work. Real voice interface over the channel we already use.

---

## The Bigger Picture

The droplet is fine as OVI's brain. It's always on, it has all my context, it has the agent layer. What it lacks is a *good front door for voice.* That's what we're building.

Telegram → PWA → Native App is the progression. Each step makes the front door better without moving the brain.

OVI doesn't need to move. It needs a better mouth and ears.

---

*Living document. Update as we build.*  
*— LG2, 2026-02-18*
