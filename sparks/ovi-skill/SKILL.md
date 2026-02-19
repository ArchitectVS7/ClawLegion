---
name: ovi
description: OVI (Orchestrated Voice Interface) — transcribe Telegram voice notes via Whisper and generate executive briefings. Use when VS7 sends a voice message or requests an /ovi briefing.
metadata:
  {
    "openclaw":
      {
        "emoji": "🎙️",
        "requires": { "bins": ["curl", "bash"], "env": ["OPENAI_API_KEY"] },
        "primaryEnv": "OPENAI_API_KEY"
      }
  }
---

# OVI — Orchestrated Voice Interface

OVI gives LG2 a voice. Two capabilities:

1. **Transcription** — When VS7 sends a Telegram voice note, transcribe it via Whisper and process as text
2. **Briefing** — `/ovi` command triggers structured executive summary

---

## Transcription

When a message contains `<media:audio>` (Telegram voice note), the file is already saved to disk at the path provided. Run:

```bash
bash {baseDir}/scripts/transcribe-voice.sh /path/to/audio.ogg
```

Returns the transcript as plain text. Treat it as VS7's spoken message.

**Prompt hint:** The transcription prompt is pre-seeded with "OVI voice command. Speaker is VS7." for better accuracy.

**Supported formats:** .ogg, .mp3, .m4a, .wav, .webm (anything Whisper accepts)

---

## Briefing Mode

### Commands

- **`/ovi`** or **`/ovi status`** — Trigger executive briefing (current system state, active work, recent progress)
- **`/ovi brief`** — Alias for `/ovi status`

When triggered:

```bash
bash {baseDir}/scripts/ovi-status.sh [--voice]
```

(Internally calls `ovi-briefing.sh` for data, formats as narrative)

Returns structured data:
```
[STATUS]    — Active sessions, current phase, overall progress
[ACTIVE]    — Which workspace modules/hexes are active
[DONE]      — Recent git commits, completed tasks
[DECISIONS] — Where to find current phase work list
[WATCH]     — Tools to monitor system state
```

### Response Format

**Narrate in OVI voice:** Calm, direct, executive. No filler. Like a trusted lead engineer giving a 30-second hallway update.

**Example:**
```
🎙️ OVI STATUS — 04:41 UTC

One session active. Phase 5 in progress — 2 of 5 tasks complete.

Workspace quiet. All modules idle.

Recent: heartbeat is recovery only, NOT a development trigger.

Current focus: P5.3 — implement /ovi status command with voice + text output.

Check sparks/OVI-SPEC.md for full phase 5 work list.
```

**Structure:**
1. Timestamp
2. Session count + current phase
3. Active work / quiet state
4. Recent commits (if any in last 4h)
5. Next task focus
6. Reference to full spec

---

## Voice Response (Optional)

To respond with voice instead of text:

```bash
sag -o /tmp/ovi-reply.mp3 "Your briefing text here"
# Then return: MEDIA:/tmp/ovi-reply.mp3
```

Note: Requires ELEVENLABS_API_KEY. Falls back to text if unavailable.

---

## Integration Notes

- Voice notes from Telegram arrive as `<media:audio>` placeholder in message body
- The actual file path is in the media attachment context
- After transcription, process the transcript exactly as if VS7 typed it
- For `/ovi` briefing, pull from OVI-SPEC.md and recent session/git state
