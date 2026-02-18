/**
 * OVI TTS — ElevenLabs Synthesis (P2.4: REMOVE DETAIL — simple REST, no streaming)
 * Voice: Rachel (21m00Tcm4TlvDq8ikWAM) — calm, clear, direct
 * Model: eleven_flash_v2_5 — fast, low-latency
 */

import { readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel
const MODEL_ID = "eleven_flash_v2_5";

// Resolve API key: env var > openclaw config talk.apiKey
function resolveElevenLabsKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  if (process.env.OPENCLAW_TALK_API_KEY) return process.env.OPENCLAW_TALK_API_KEY;
  try {
    const cfg = JSON.parse(
      readFileSync(join(homedir(), ".openclaw", "openclaw.json"), "utf8"),
    );
    const key = cfg?.talk?.apiKey;
    if (key && typeof key === "string" && key.length > 10) return key;
  } catch {}
  return null;
}

const ELEVENLABS_API_KEY = resolveElevenLabsKey();

// Simple in-memory cache for repeated phrases
const phraseCache = new Map();
const MAX_CACHE_SIZE = 50;

function getCacheKey(text, voiceId) {
  return `${voiceId}:${text.slice(0, 200)}`;
}

export async function synthesizeSpeech(text, voiceId = DEFAULT_VOICE_ID) {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ElevenLabs API key not found (set ELEVENLABS_API_KEY or talk.apiKey in openclaw.json)");
  }

  const cacheKey = getCacheKey(text, voiceId);

  // Check cache first (for common phrases)
  if (phraseCache.has(cacheKey)) {
    console.log("[OVI TTS] Cache hit for:", text.slice(0, 40));
    return phraseCache.get(cacheKey);
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.0,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${err}`);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());

  // Cache short phrases (< 200 chars) to save API calls
  if (text.length < 200 && phraseCache.size < MAX_CACHE_SIZE) {
    phraseCache.set(cacheKey, audioBuffer);
  }

  return audioBuffer;
}
