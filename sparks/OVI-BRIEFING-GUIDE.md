# 🎙️ OVI Briefing Mode — User Guide
*How to talk to OVI and what to expect back*

---

## Triggering a Briefing

Say any of these to get an OVI briefing:

- `/ovi` — full structured briefing
- "OVI, what's happening?" — natural language trigger
- "Brief me" — shorthand
- Send a voice note — OVI transcribes and processes it automatically

---

## What a Briefing Sounds Like

OVI speaks in this structure — always in this order, never more than 30 seconds:

```
[STATUS]    System health. One sentence.
[DONE]      What completed since your last check-in.
[ACTIVE]    What's in progress right now.
[DECISIONS] Max 3 things that need your input.
[WATCH]     Anything developing that might need attention soon.
```

**Example:**
> "All good. OVI Phase 1 is 3 of 6 tasks complete — skill built, transcription confirmed, pipeline mapped. Currently working on the briefing mode. One thing for you when you have a moment: we need an ElevenLabs API key to enable voice responses. Nothing urgent, nothing on fire."

If there's nothing in a category, OVI skips it cleanly. No filler.

---

## Voice Note Handling

When you send a Telegram voice note:

1. OVI receives the audio file (already downloaded by OpenClaw)
2. Whisper API transcribes it (~1-3 seconds for short notes)
3. Your spoken words arrive to LG2 as plain text
4. LG2 processes and responds — in text, or voice if ElevenLabs is configured

**Tips for best transcription:**
- Speak clearly at normal pace
- OVI is pre-prompted with your identity — no need to say who you are
- Background noise is handled well by Whisper-1
- Max ~25 minutes per audio file (Telegram practical limit is much shorter)

---

## Voice Responses

When `ELEVENLABS_API_KEY` is set, OVI can respond as audio.

To request a voice response:
- "Reply in voice"
- "Say that back to me"
- "OVI, voice brief"

To always get voice briefings by default, add to config:
```json
{ "ovi": { "defaultVoice": true } }
```

*(Voice responses require ElevenLabs — currently not configured)*

---

## Commands

| Command | What it does |
|---------|-------------|
| `/ovi` | Full structured briefing |
| `/ovi status` | One-line system health only |
| `/ovi spec` | Current OVI build progress |
| `/ovi roll` | Roll d20, consult table, take an action |

---

## Briefing Tone

OVI is a lead engineer, not a butler. Expect:
- Direct statements, not hedged suggestions
- Urgency that matches the actual situation
- Occasional opinion ("that auth conflict looks worse than yesterday")
- Clean stops — no "let me know if you need anything else"

---

*This guide lives at `/root/.openclaw/workspace/sparks/OVI-BRIEFING-GUIDE.md`*
