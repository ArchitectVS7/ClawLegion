/**
 * OVI Whisper Transcription (P2.2 MOONSHOT — Web Speech API + Whisper fallback)
 * Uses OpenAI Whisper API for accurate server-side transcription.
 */

import { createWriteStream, unlinkSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function transcribeAudio(audioBase64, mimeType = "audio/webm") {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not set");
  }

  // Decode base64 audio
  const audioBuffer = Buffer.from(audioBase64.replace(/^data:[^;]+;base64,/, ""), "base64");

  // Determine file extension from MIME type
  const extMap = {
    "audio/webm": "webm",
    "audio/ogg": "ogg",
    "audio/wav": "wav",
    "audio/mp4": "mp4",
    "audio/m4a": "m4a",
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
  };
  const ext = extMap[mimeType] || "webm";
  const tmpFile = join(tmpdir(), `ovi-audio-${randomUUID()}.${ext}`);

  try {
    // Write to temp file
    await new Promise((resolve, reject) => {
      const ws = createWriteStream(tmpFile);
      ws.write(audioBuffer);
      ws.end();
      ws.on("finish", resolve);
      ws.on("error", reject);
    });

    // Call Whisper API using fetch (Node 25 has native fetch)
    const { default: FormData } = await import("form-data");
    const { createReadStream } = await import("fs");

    const formData = new FormData();
    formData.append("file", createReadStream(tmpFile), {
      filename: `audio.${ext}`,
      contentType: mimeType,
    });
    formData.append("model", "whisper-1");
    formData.append("response_format", "text");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Whisper API error ${response.status}: ${err}`);
    }

    const transcript = await response.text();
    return transcript.trim();
  } finally {
    // Clean up temp file
    if (existsSync(tmpFile)) {
      unlinkSync(tmpFile);
    }
  }
}
