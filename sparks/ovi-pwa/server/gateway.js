/**
 * OVI Gateway Client — Fixed Protocol
 * 
 * OpenClaw Gateway Protocol:
 * - Request frame:  { type: "req", id: UUID, method: "...", params: {...} }
 * - Response frame: { type: "res", id: UUID, ok: bool, payload: {...}, error: {...} }
 * - Event frame:    { type: "event", event: "...", payload: {...}, seq: int }
 * 
 * Handshake:
 * 1. Send: { type:"req", id:"X", method:"connect", params: ConnectParams }
 * 2. Receive: { type:"res", id:"X", ok:true, payload: { type:"hello-ok", ... } }
 * 
 * Chat flow:
 * 1. Send: { type:"req", id:"X", method:"chat.send", params: ChatSendParams }
 * 2. Receive ack: { type:"res", id:"X", ok:true, payload: { runId:"R", status:"in_flight" } }
 * 3. Receive events: { type:"event", event:"chat", payload: { runId:"R", state:"final", message:{...} } }
 */

import WebSocket from "ws";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || `ws://127.0.0.1:${process.env.OPENCLAW_GATEWAY_PORT || 18789}`;

// Read local gateway auth token from config (not the remote token from env)
function resolveLocalGatewayToken() {
  // 1. Explicit override
  if (process.env.OPENCLAW_LOCAL_GATEWAY_TOKEN) return process.env.OPENCLAW_LOCAL_GATEWAY_TOKEN;

  // 2. Read from openclaw.json config
  try {
    const configPath = join(homedir(), ".openclaw", "openclaw.json");
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    const token = config?.gateway?.auth?.token;
    if (typeof token === "string" && token.length > 0) return token;
  } catch (e) {
    // ignore
  }

  // 3. Fallback to env (may work if OPENCLAW_GATEWAY_TOKEN is the right one)
  return process.env.OPENCLAW_GATEWAY_TOKEN || "";
}

const GATEWAY_TOKEN = resolveLocalGatewayToken();
const PROTOCOL_VERSION = 3; // Must match OpenClaw's PROTOCOL_VERSION

class OVIGatewayClient {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.connId = null;
    this.pending = new Map(); // requestId -> { resolve, reject }
    this.chatListeners = new Map(); // sessionKey -> callback[]
    this.genericEventHandlers = new Map(); // eventName -> callback[]
    this.reconnectDelay = 1000;
    this.reconnectTimer = null;
    this.shuttingDown = false;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      console.log(`[OVI Gateway] Connecting to ${GATEWAY_URL}...`);
      this.ws = new WebSocket(GATEWAY_URL);

      const timeout = setTimeout(() => {
        reject(new Error("Gateway connection timeout (10s)"));
        try { this.ws?.close(); } catch {}
      }, 10000);

      this.ws.on("open", () => {
        console.log("[OVI Gateway] WS open, sending connect handshake...");
        const id = randomUUID();

        // Store the connect promise
        this.pending.set(id, {
          resolve: (payload) => {
            clearTimeout(timeout);
            this.connected = true;
            this.connId = payload?.server?.connId;
            console.log(`[OVI Gateway] Connected! connId=${this.connId}`);
            resolve(this);
          },
          reject: (err) => {
            clearTimeout(timeout);
            reject(err);
          },
        });

        this._send({
          type: "req",
          id,
          method: "connect",
          params: {
            minProtocol: PROTOCOL_VERSION,
            maxProtocol: PROTOCOL_VERSION,
            client: {
              id: "cli",
              displayName: "OVI PWA",
              version: "2.0.0",
              platform: "node",
              mode: "cli",
              instanceId: "ovi-pwa-server",
            },
            auth: {
              token: GATEWAY_TOKEN,
            },
          },
        });
      });

      this.ws.on("message", (data) => {
        let frame;
        try {
          frame = JSON.parse(data.toString());
        } catch (e) {
          console.error("[OVI Gateway] Invalid JSON frame:", String(data).slice(0, 100));
          return;
        }

        switch (frame.type) {
          case "res":
            this._handleResponse(frame);
            break;
          case "event":
            this._handleEvent(frame);
            break;
          default:
            // Ignore unknown frame types (tick, etc.)
        }
      });

      this.ws.on("close", (code, reason) => {
        this.connected = false;
        const reasonStr = reason?.toString() || "";
        console.log(`[OVI Gateway] Closed (${code}): ${reasonStr}`);

        // Reject all pending requests
        const err = new Error(`Gateway disconnected: ${code} ${reasonStr}`);
        for (const [id, p] of this.pending.entries()) {
          p.reject(err);
          this.pending.delete(id);
        }

        // Reject pending chat listeners
        for (const [key, listeners] of this.chatListeners.entries()) {
          for (const l of listeners) {
            l.reject(err);
          }
          this.chatListeners.delete(key);
        }

        if (!this.shuttingDown) {
          this._scheduleReconnect();
        }
      });

      this.ws.on("error", (err) => {
        console.error("[OVI Gateway] WS error:", err.message);
        // close event will fire after error
        if (!this.connected) {
          clearTimeout(timeout);
          reject(err);
        }
      });
    });
  }

  _handleResponse(frame) {
    const { id, ok, payload, error } = frame;
    const pending = this.pending.get(id);
    if (!pending) return;
    this.pending.delete(id);

    if (ok) {
      pending.resolve(payload);
    } else {
      pending.reject(new Error(error?.message || JSON.stringify(error) || "Request failed"));
    }
  }

  _handleEvent(frame) {
    const { event, payload } = frame;

    // Route chat events to waiting listeners
    if (event === "chat" && payload) {
      const sessionKey = payload.sessionKey;
      const state = payload.state;

      if (sessionKey && this.chatListeners.has(sessionKey)) {
        const listeners = this.chatListeners.get(sessionKey);

        if (state === "final") {
          // Final response — resolve all waiting listeners
          const text = this._extractChatText(payload.message);
          for (const l of listeners) {
            l.resolve(text);
          }
          this.chatListeners.delete(sessionKey);
        } else if (state === "error") {
          const errMsg = payload.errorMessage || "Chat run failed";
          for (const l of listeners) {
            l.reject(new Error(errMsg));
          }
          this.chatListeners.delete(sessionKey);
        }
        // Ignore delta/in_flight events
      }
    }

    // Also dispatch to generic event handlers
    const handlers = this.genericEventHandlers.get(event) || [];
    for (const h of handlers) {
      try { h(payload); } catch (e) { console.error("[OVI Gateway] Event handler error:", e); }
    }
  }

  _extractChatText(message) {
    if (!message) return "";

    // message.content can be:
    // - string
    // - array of { type: "text", text: "..." }
    const content = message.content;
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .filter((c) => c.type === "text")
        .map((c) => c.text || "")
        .join("\n");
    }
    return JSON.stringify(message);
  }

  _send(frame) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not open");
    }
    this.ws.send(JSON.stringify(frame));
  }

  _scheduleReconnect() {
    if (this.reconnectTimer) return;
    console.log(`[OVI Gateway] Reconnecting in ${this.reconnectDelay}ms...`);
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      try {
        await this.connect();
        this.reconnectDelay = 1000; // Reset on success
      } catch (e) {
        console.error("[OVI Gateway] Reconnect failed:", e.message);
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
        this._scheduleReconnect();
      }
    }, this.reconnectDelay);
  }

  async request(method, params, timeoutMs = 30000) {
    if (!this.connected) throw new Error("Gateway not connected");

    const id = randomUUID();
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });

      const timer = setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`Request timeout: ${method} (${timeoutMs}ms)`));
        }
      }, timeoutMs);

      // Wrap resolve/reject to clear timer
      const origResolve = resolve;
      const origReject = reject;
      this.pending.set(id, {
        resolve: (v) => { clearTimeout(timer); origResolve(v); },
        reject: (e) => { clearTimeout(timer); origReject(e); },
      });

      try {
        this._send({ type: "req", id, method, params });
      } catch (e) {
        this.pending.delete(id);
        clearTimeout(timer);
        reject(e);
      }
    });
  }

  async chatSend(message, sessionKey = "ovi-voice-session", timeoutMs = 120000) {
    if (!this.connected) throw new Error("Gateway not connected");

    const idempotencyKey = randomUUID();

    // Register chat listener BEFORE sending
    const responsePromise = new Promise((resolve, reject) => {
      if (!this.chatListeners.has(sessionKey)) {
        this.chatListeners.set(sessionKey, []);
      }
      this.chatListeners.get(sessionKey).push({ resolve, reject });

      // Timeout for AI response
      setTimeout(() => {
        const listeners = this.chatListeners.get(sessionKey) || [];
        const idx = listeners.findIndex((l) => l.resolve === resolve);
        if (idx !== -1) {
          listeners.splice(idx, 1);
          reject(new Error(`Chat response timeout (${timeoutMs}ms)`));
        }
      }, timeoutMs);
    });

    // Send the chat message
    const ack = await this.request("chat.send", {
      sessionKey,
      message,
      idempotencyKey,
      deliver: false,
      timeoutMs,
    }, 10000);

    console.log(`[OVI Gateway] Chat ack: runId=${ack?.runId} status=${ack?.status}`);

    // Wait for the AI response via events
    return responsePromise;
  }

  async chatHistory(sessionKey = "ovi-voice-session", limit = 20) {
    return this.request("chat.history", { sessionKey, limit });
  }

  onEvent(eventName, handler) {
    if (!this.genericEventHandlers.has(eventName)) {
      this.genericEventHandlers.set(eventName, []);
    }
    this.genericEventHandlers.get(eventName).push(handler);
  }

  shutdown() {
    this.shuttingDown = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.ws) {
      this.ws.close(1000, "shutdown");
    }
  }
}

// Singleton
let _client = null;

export async function getGateway() {
  if (!_client) {
    _client = new OVIGatewayClient();
  }
  if (!_client.connected) {
    await _client.connect();
  }
  return _client;
}

export { OVIGatewayClient };
