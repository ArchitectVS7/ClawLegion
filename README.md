# OVI — Orchestrated Voice Interface

Voice interface for VS7's AI system. Hold to talk, release to send. OVI speaks back.

## Architecture

```
Mobile Browser (PWA)
  └─ React 19 + Vite 7 frontend
       └─ Express proxy server (:3721)
            ├─ OpenClaw Gateway (WebSocket)
            ├─ OpenAI Whisper (STT)
            └─ ElevenLabs (TTS)
```

**Frontend** — Hold-to-talk voice UI with dual-mode speech input (Web Speech API for speed, Whisper fallback for accuracy). Messages persist to localStorage.

**Server** — Express proxy that handles auth, rate limiting, and API routing. Connects to the OpenClaw gateway via WebSocket for chat, and proxies Whisper/ElevenLabs API calls.

## Setup

```bash
cd sparks/ovi-pwa
pnpm install
```

### Environment Variables

Set in `/etc/ovi/env` on the droplet, or export directly:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Whisper transcription |
| `ELEVENLABS_API_KEY` | Yes | TTS synthesis |
| `OPENCLAW_GATEWAY_URL` | No | Gateway WebSocket URL (default: `ws://127.0.0.1:18789`) |
| `OPENCLAW_GATEWAY_TOKEN` | No | Gateway auth token (reads from `~/.openclaw/openclaw.json` if not set) |
| `OVI_PORT` | No | Server port (default: `3721`) |
| `OVI_ALLOWED_ORIGINS` | No | Comma-separated CORS origins (e.g. `http://YOUR_IP:PORT`) |

## Development

```bash
# Frontend + server together
pnpm dev:full

# Frontend only (uses Vite proxy to localhost:3721)
pnpm dev

# Server only (with file watching)
pnpm server:dev
```

## Testing

```bash
pnpm test          # Run all 75 tests
pnpm test:watch    # Watch mode
```

Test coverage:
- **Server API** (31 tests) — endpoint validation, error handling, rate limiting
- **Gateway client** (15 tests) — protocol handling, event routing, reconnection
- **TTS** (3 tests) — cache key integrity
- **Components** (20 tests) — MessageFeed, StatusBar, HelpPanel, VoiceButton
- **Hooks** (6 tests) — persistence, backoff calculation

## Production Build & Deploy

```bash
pnpm build    # TypeScript check + Vite production build
pnpm deploy   # Build + deploy to droplet
```

The server runs via systemd (`ovi.service`). Nginx handles SSL termination and proxies to the Express server on 127.0.0.1:3721.

## Project Structure

```
sparks/ovi-pwa/
  src/
    App.tsx                  # Main component — voice flow orchestration
    hooks/
      useOVI.ts              # Backend connection, chat, polling, persistence
      useSpeech.ts           # Web Speech API + Whisper dual-mode STT
      useTTS.ts              # ElevenLabs TTS playback
    components/
      VoiceButton.tsx        # Hold-to-talk button with state animations
      MessageFeed.tsx        # Scrollable conversation history
      StatusBar.tsx          # Connection status indicator
      HelpPanel.tsx          # In-app help overlay
    __tests__/               # Frontend tests

  server/
    index.js                 # Express server — routes, CORS, rate limiting
    gateway.js               # OpenClaw WebSocket client (protocol v3)
    whisper.js               # OpenAI Whisper transcription
    tts.js                   # ElevenLabs synthesis with phrase caching
    push.js                  # Web Push notification scaffold
    __tests__/               # Server tests
```
