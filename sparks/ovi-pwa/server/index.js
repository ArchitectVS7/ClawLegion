/**
 * OVI PWA Backend Server
 * Express proxy between the PWA frontend and the OpenClaw gateway.
 * Handles: chat messages, TTS generation, push notifications, Whisper transcription.
 */

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { randomUUID } from "crypto";
import rateLimit from "express-rate-limit";
import { getGateway } from "./gateway.js";
import { transcribeAudio } from "./whisper.js";
import { synthesizeSpeech } from "./tts.js";
import { PushNotificationManager } from "./push.js";

const app = express();
const server = createServer(app);
const PORT = process.env.OVI_PORT || 3721;

// CORS — restrict to configured origins (defaults to same-origin only)
const ALLOWED_ORIGINS = process.env.OVI_ALLOWED_ORIGINS
  ? process.env.OVI_ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (same-origin, curl, server-to-server)
    if (!origin) return callback(null, true);
    // Allow configured origins
    if (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// Request size limits — 10mb for audio payloads, reasonable for base64 audio
app.use(express.json({ limit: "10mb" }));

// Rate limiting — per IP
const chatLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  message: { error: "Too many requests, slow down" },
  standardHeaders: true,
  legacyHeaders: false,
});

const ttsLimiter = rateLimit({
  windowMs: 60_000,
  max: 40,
  message: { error: "Too many TTS requests" },
  standardHeaders: true,
  legacyHeaders: false,
});

const transcribeLimiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  message: { error: "Too many transcription requests" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Max message length for chat (characters)
const MAX_MESSAGE_LENGTH = 4000;

// Push notification manager
const pushManager = new PushNotificationManager();

// ============================================================
// Health check
// ============================================================
app.get("/api/status", async (_req, res) => {
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
    version: "2.1.0",
    gateway: gatewayStatus,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// Chat — Send message to OpenClaw, get response
// ============================================================
app.post("/api/chat", chatLimiter, async (req, res) => {
  const { message, sessionKey = "ovi-voice-session" } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message required" });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `message too long (max ${MAX_MESSAGE_LENGTH} chars)` });
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
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);

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
app.post("/api/transcribe", transcribeLimiter, async (req, res) => {
  const { audio, mimeType = "audio/webm" } = req.body;

  if (!audio || typeof audio !== "string") {
    return res.status(400).json({ error: "audio (base64 string) required" });
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
app.post("/api/tts", ttsLimiter, async (req, res) => {
  const { text, voiceId } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "text required" });
  }

  if (text.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `text too long (max ${MAX_MESSAGE_LENGTH} chars)` });
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

app.get("/api/push/vapid-key", (_req, res) => {
  res.json({ publicKey: pushManager.getPublicKey() });
});

// ============================================================
// Polling endpoint — Long-poll for proactive messages
// ============================================================
const pendingPolls = new Map(); // clientId -> { res, timer }
const proactiveQueue = new Map(); // clientId -> messages[]
const POLL_TIMEOUT_MS = 30_000;

app.get("/api/poll/:clientId", (req, res) => {
  const { clientId } = req.params;

  // Validate clientId format
  if (!/^[\w-]{4,40}$/.test(clientId)) {
    return res.status(400).json({ error: "invalid clientId" });
  }

  // If there are queued messages, send immediately
  if (proactiveQueue.has(clientId) && proactiveQueue.get(clientId).length > 0) {
    const messages = proactiveQueue.get(clientId);
    proactiveQueue.set(clientId, []);
    return res.json({ ok: true, messages });
  }

  // Cancel any existing poll for this client (prevent leaked connections)
  if (pendingPolls.has(clientId)) {
    const existing = pendingPolls.get(clientId);
    clearTimeout(existing.timer);
    try { existing.res.json({ ok: true, messages: [] }); } catch {}
    pendingPolls.delete(clientId);
  }

  // Long-poll (hold connection for up to 30s)
  const timer = setTimeout(() => {
    if (pendingPolls.has(clientId)) {
      pendingPolls.delete(clientId);
      res.json({ ok: true, messages: [] });
    }
  }, POLL_TIMEOUT_MS);

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

// Export for internal use and testing
export { app, server, pushToClient, pendingPolls, proactiveQueue };

// ============================================================
// Workspace State — Cyberscape hex data feed
// ============================================================
import { readdirSync, existsSync } from "fs";
import { join } from "path";

const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT || "/root/.openclaw/workspace";

const HEX_MAP = [
  { id: "sparks",       label: "Sparks",      row: 0, col: 0 },
  { id: "legion",       label: "Legion",      row: 0, col: 1 },
  { id: "office-space", label: "Office",      row: 0, col: 2 },
  { id: "ovi-pwa",      label: "OVI PWA",     row: 1, col: 0 },
  { id: "ovi-native",   label: "OVI App",     row: 1, col: 1 },
  { id: "ovi-skill",    label: "OVI Skill",   row: 1, col: 2 },
  { id: "dev-brain",    label: "Dev Brain",   row: 2, col: 0 },
  { id: "todo-api",     label: "Todo API",    row: 2, col: 1 },
  { id: "testing",      label: "Testing",     row: 2, col: 2 },
];

function getHexStatus(dirId) {
  const dirPath = join(WORKSPACE_ROOT, dirId);
  if (!existsSync(dirPath)) return "idle";
  try {
    const files = readdirSync(dirPath, { recursive: false });
    const hasActivity = files.some(f => f.endsWith(".lock") || f.endsWith(".tmp") || f === ".wip");
    return hasActivity ? "active" : "idle";
  } catch {
    return "idle";
  }
}

app.get("/api/workspace-state", (_req, res) => {
  const hexes = HEX_MAP.map(hex => ({
    ...hex,
    status: getHexStatus(hex.id),
    agentCount: 0,
  }));
  res.json({ hexes, timestamp: new Date().toISOString() });
});

// ============================================================
// Push token registration (Expo push notifications)
// ============================================================
const pushTokens = new Set();

app.post("/api/register-push", (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Missing token" });
  }
  pushTokens.add(token);
  console.log(`[OVI Push] Token registered: ${token.slice(0, 20)}... (total: ${pushTokens.size})`);
  res.json({ ok: true, registered: pushTokens.size });
});

// ============================================================
// Start server + connect gateway (only when run directly)
// ============================================================
function startServer() {
  server.listen(PORT, "127.0.0.1", async () => {
    console.log(`[OVI] Server listening on http://127.0.0.1:${PORT}`);

    // Eagerly connect to gateway
    try {
      await getGateway();
      console.log("[OVI] Gateway connected!");
    } catch (err) {
      console.error("[OVI] Gateway connection failed (will retry):", err.message);
    }
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("[OVI] Shutting down...");
    server.close();
    process.exit(0);
  });
}

// Auto-start when run directly (not when imported for testing)
const isDirectRun = process.argv[1]?.endsWith("index.js") || process.argv[1]?.endsWith("server/index.js");
if (isDirectRun) {
  startServer();
}

export { startServer };
