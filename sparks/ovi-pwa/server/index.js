/**
 * OVI PWA Backend Server
 * Express proxy between the PWA frontend and the OpenClaw gateway.
 * Handles: chat messages, TTS generation, push notifications, Whisper transcription.
 */

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { randomUUID } from "crypto";
import { getGateway } from "./gateway.js";
import { transcribeAudio } from "./whisper.js";
import { synthesizeSpeech } from "./tts.js";
import { PushNotificationManager } from "./push.js";

const app = express();
const server = createServer(app);
const PORT = process.env.OVI_PORT || 3721;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));

// Push notification manager
const pushManager = new PushNotificationManager();

// ============================================================
// Health check
// ============================================================
app.get("/api/status", async (req, res) => {
  let gatewayStatus = "disconnected";
  try {
    const gw = await Promise.race([
      getGateway(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 2000)),
    ]);
    gatewayStatus = gw.connected ? "connected" : "disconnected";
  } catch (e) {
    gatewayStatus = `error: ${e.message}`;
  }

  res.json({
    ok: true,
    version: "2.0.0",
    gateway: gatewayStatus,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// Chat — Send message to OpenClaw, get response
// ============================================================
app.post("/api/chat", async (req, res) => {
  const { message, sessionKey = "ovi-voice-session" } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message required" });
  }

  console.log(`[OVI] Chat: "${message.slice(0, 80)}..."`);

  try {
    const gw = await getGateway();
    const result = await gw.chatSend(message, sessionKey);

    // Extract the response text
    const responseText =
      result._streamedText ||
      result.text ||
      result.message ||
      result.content ||
      (Array.isArray(result.messages) && result.messages[result.messages.length - 1]?.content) ||
      JSON.stringify(result);

    res.json({
      ok: true,
      response: responseText,
      sessionKey,
    });
  } catch (err) {
    console.error("[OVI] Chat error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// Chat history
// ============================================================
app.get("/api/chat/history", async (req, res) => {
  const sessionKey = req.query.sessionKey || "ovi-voice-session";
  const limit = parseInt(req.query.limit) || 20;

  try {
    const gw = await getGateway();
    const result = await gw.chatHistory(sessionKey, limit);
    res.json({ ok: true, history: result });
  } catch (err) {
    console.error("[OVI] History error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// STT — Transcribe audio via Whisper API
// ============================================================
app.post("/api/transcribe", async (req, res) => {
  const { audio, mimeType = "audio/webm" } = req.body;

  if (!audio) {
    return res.status(400).json({ error: "audio (base64) required" });
  }

  console.log("[OVI] Transcribing audio...");

  try {
    const transcript = await transcribeAudio(audio, mimeType);
    res.json({ ok: true, transcript });
  } catch (err) {
    console.error("[OVI] Transcribe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// TTS — Synthesize speech via ElevenLabs
// ============================================================
app.post("/api/tts", async (req, res) => {
  const { text, voiceId } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "text required" });
  }

  console.log(`[OVI] TTS: "${text.slice(0, 60)}..."`);

  try {
    const audioBuffer = await synthesizeSpeech(text, voiceId);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
      "Cache-Control": "no-cache",
    });
    res.send(audioBuffer);
  } catch (err) {
    console.error("[OVI] TTS error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// Push Notifications — Subscribe / Send
// ============================================================
app.post("/api/push/subscribe", (req, res) => {
  const { subscription } = req.body;
  if (!subscription) {
    return res.status(400).json({ error: "subscription required" });
  }

  pushManager.addSubscription(subscription);
  console.log("[OVI] Push subscription registered");
  res.json({ ok: true });
});

app.post("/api/push/send", async (req, res) => {
  const { title, body, data } = req.body;

  try {
    await pushManager.sendNotification({ title: title || "OVI", body, data });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/push/vapid-key", (req, res) => {
  res.json({ publicKey: pushManager.getPublicKey() });
});

// ============================================================
// Polling endpoint — Long-poll for proactive messages
// ============================================================
const pendingPolls = new Map(); // clientId -> { res, timer }
const proactiveQueue = new Map(); // clientId -> messages[]

app.get("/api/poll/:clientId", (req, res) => {
  const { clientId } = req.params;

  // If there are queued messages, send immediately
  if (proactiveQueue.has(clientId) && proactiveQueue.get(clientId).length > 0) {
    const messages = proactiveQueue.get(clientId);
    proactiveQueue.set(clientId, []);
    return res.json({ ok: true, messages });
  }

  // Otherwise, long-poll (hold connection for up to 30s)
  const timer = setTimeout(() => {
    if (pendingPolls.has(clientId)) {
      pendingPolls.delete(clientId);
      res.json({ ok: true, messages: [] });
    }
  }, 30000);

  pendingPolls.set(clientId, { res, timer });
});

// Internal: push a proactive message to a client
function pushToClient(clientId, message) {
  if (pendingPolls.has(clientId)) {
    const { res, timer } = pendingPolls.get(clientId);
    clearTimeout(timer);
    pendingPolls.delete(clientId);
    res.json({ ok: true, messages: [message] });
  } else {
    if (!proactiveQueue.has(clientId)) {
      proactiveQueue.set(clientId, []);
    }
    proactiveQueue.get(clientId).push(message);
  }
}

// Export for internal use
export { pushToClient };

// ============================================================
// Start server + connect gateway
// ============================================================
server.listen(PORT, "127.0.0.1", async () => {
  console.log(`[OVI] Server listening on http://127.0.0.1:${PORT}`);

  // Eagerly connect to gateway
  try {
    await getGateway();
    console.log("[OVI] Gateway connected!");
  } catch (err) {
    console.error("[OVI] Gateway connection failed (will retry):", err.message);
    // Non-fatal — will retry on next request
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[OVI] Shutting down...");
  server.close();
  process.exit(0);
});
