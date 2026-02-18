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

When VS7 says `/ovi` or asks for an OVI briefing:

```bash
bash {baseDir}/scripts/ovi-briefing.sh
```

Returns a structured briefing:
```
[STATUS]    — one-line system health
[DONE]      — completed since last check
[ACTIVE]    — in progress now
[DECISIONS] — what needs VS7's input
[WATCH]     — developing situations
```

Narrate this in OVI voice: calm, direct, executive. No filler. Like a trusted lead engineer giving a 30-second hallway update.

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
