/**
 * Server API endpoint tests
 * Tests: status, chat validation, TTS validation, transcribe validation,
 *        polling, push registration, workspace state, input limits
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import express from "express";
import { createServer } from "http";
import supertest from "supertest";

// Mock web-push (not installed, dynamically imported by push.js)
vi.mock("web-push", () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn(),
    generateVAPIDKeys: vi.fn(),
  },
}));

// Mock the gateway, whisper, and tts modules before importing the server
vi.mock("../gateway.js", () => ({
  getGateway: vi.fn(),
}));

vi.mock("../whisper.js", () => ({
  transcribeAudio: vi.fn(),
}));

vi.mock("../tts.js", () => ({
  synthesizeSpeech: vi.fn(),
}));

vi.mock("../push.js", () => {
  class MockPushNotificationManager {
    constructor() {
      this.addSubscription = vi.fn();
      this.sendNotification = vi.fn().mockResolvedValue({ sent: 1, failed: 0 });
      this.getPublicKey = vi.fn().mockReturnValue("test-vapid-key");
    }
  }
  return { PushNotificationManager: MockPushNotificationManager };
});

// Now import the app after mocks are set up
const { app, pendingPolls, proactiveQueue, pushToClient } = await import("../index.js");
const { getGateway } = await import("../gateway.js");
const { transcribeAudio } = await import("../whisper.js");
const { synthesizeSpeech } = await import("../tts.js");

describe("API Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pendingPolls.clear();
    proactiveQueue.clear();
  });

  // ─── /api/status ──────────────────────────────────────────────

  describe("GET /api/status", () => {
    it("returns status with connected gateway", async () => {
      getGateway.mockResolvedValue({ connected: true });

      const res = await supertest(app).get("/api/status");
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.version).toBe("2.1.0");
      expect(res.body.gateway).toBe("connected");
      expect(res.body.timestamp).toBeDefined();
    });

    it("returns disconnected when gateway fails", async () => {
      getGateway.mockRejectedValue(new Error("connection refused"));

      const res = await supertest(app).get("/api/status");
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.gateway).toContain("error");
    });

    it("returns disconnected when gateway times out", async () => {
      getGateway.mockImplementation(() => new Promise((resolve) => {
        setTimeout(resolve, 5000); // longer than the 2s timeout
      }));

      const res = await supertest(app).get("/api/status");
      expect(res.status).toBe(200);
      expect(res.body.gateway).toContain("error");
    });
  });

  // ─── /api/chat ────────────────────────────────────────────────

  describe("POST /api/chat", () => {
    it("rejects missing message", async () => {
      const res = await supertest(app)
        .post("/api/chat")
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("message required");
    });

    it("rejects non-string message", async () => {
      const res = await supertest(app)
        .post("/api/chat")
        .send({ message: 12345 });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("message required");
    });

    it("rejects message exceeding max length", async () => {
      const res = await supertest(app)
        .post("/api/chat")
        .send({ message: "x".repeat(4001) });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain("too long");
    });

    it("accepts valid message and returns response", async () => {
      const mockGw = {
        chatSend: vi.fn().mockResolvedValue({ text: "Hello from OVI" }),
      };
      getGateway.mockResolvedValue(mockGw);

      const res = await supertest(app)
        .post("/api/chat")
        .send({ message: "Hello" });
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.response).toBe("Hello from OVI");
    });

    it("handles gateway errors gracefully", async () => {
      getGateway.mockRejectedValue(new Error("Gateway down"));

      const res = await supertest(app)
        .post("/api/chat")
        .send({ message: "Hello" });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Gateway down");
    });

    it("extracts text from various response formats", async () => {
      // Test _streamedText format
      const mockGw = {
        chatSend: vi.fn().mockResolvedValue({ _streamedText: "streamed response" }),
      };
      getGateway.mockResolvedValue(mockGw);

      const res = await supertest(app)
        .post("/api/chat")
        .send({ message: "test" });
      expect(res.body.response).toBe("streamed response");
    });
  });

  // ─── /api/transcribe ──────────────────────────────────────────

  describe("POST /api/transcribe", () => {
    it("rejects missing audio", async () => {
      const res = await supertest(app)
        .post("/api/transcribe")
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toContain("audio");
    });

    it("rejects non-string audio", async () => {
      const res = await supertest(app)
        .post("/api/transcribe")
        .send({ audio: 12345 });
      expect(res.status).toBe(400);
    });

    it("calls transcribeAudio and returns transcript", async () => {
      transcribeAudio.mockResolvedValue("Hello world");

      const res = await supertest(app)
        .post("/api/transcribe")
        .send({ audio: "base64audiodata", mimeType: "audio/webm" });
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.transcript).toBe("Hello world");
      expect(transcribeAudio).toHaveBeenCalledWith("base64audiodata", "audio/webm");
    });

    it("handles transcription errors", async () => {
      transcribeAudio.mockRejectedValue(new Error("OPENAI_API_KEY not set"));

      const res = await supertest(app)
        .post("/api/transcribe")
        .send({ audio: "base64audiodata" });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("OPENAI_API_KEY not set");
    });
  });

  // ─── /api/tts ─────────────────────────────────────────────────

  describe("POST /api/tts", () => {
    it("rejects missing text", async () => {
      const res = await supertest(app)
        .post("/api/tts")
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("text required");
    });

    it("rejects text exceeding max length", async () => {
      const res = await supertest(app)
        .post("/api/tts")
        .send({ text: "x".repeat(4001) });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain("too long");
    });

    it("returns audio buffer on success", async () => {
      const fakeAudio = Buffer.from("fake-audio-data");
      synthesizeSpeech.mockResolvedValue(fakeAudio);

      const res = await supertest(app)
        .post("/api/tts")
        .send({ text: "Hello" });
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toBe("audio/mpeg");
      expect(res.headers["content-length"]).toBe(String(fakeAudio.length));
    });

    it("handles synthesis errors", async () => {
      synthesizeSpeech.mockRejectedValue(new Error("API key not found"));

      const res = await supertest(app)
        .post("/api/tts")
        .send({ text: "Hello" });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("API key not found");
    });
  });

  // ─── /api/poll/:clientId ──────────────────────────────────────

  describe("GET /api/poll/:clientId", () => {
    it("rejects invalid clientId format", async () => {
      const res = await supertest(app).get("/api/poll/ab");
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("invalid clientId");
    });

    it("rejects clientId with special characters", async () => {
      const res = await supertest(app).get("/api/poll/client<script>");
      expect(res.status).toBe(400);
    });

    it("returns queued messages immediately", async () => {
      proactiveQueue.set("test-client", [
        { text: "hello" },
        { text: "world" },
      ]);

      const res = await supertest(app).get("/api/poll/test-client");
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.messages).toHaveLength(2);
      expect(res.body.messages[0].text).toBe("hello");
      // Queue should be cleared
      expect(proactiveQueue.get("test-client")).toHaveLength(0);
    });
  });

  // ─── pushToClient ─────────────────────────────────────────────

  describe("pushToClient", () => {
    it("queues message when no poll is pending", () => {
      pushToClient("client-1", { text: "hello" });
      expect(proactiveQueue.get("client-1")).toHaveLength(1);
      expect(proactiveQueue.get("client-1")[0].text).toBe("hello");
    });

    it("accumulates multiple messages", () => {
      pushToClient("client-2", { text: "msg1" });
      pushToClient("client-2", { text: "msg2" });
      pushToClient("client-2", { text: "msg3" });
      expect(proactiveQueue.get("client-2")).toHaveLength(3);
    });
  });

  // ─── /api/push/* ──────────────────────────────────────────────

  describe("Push notification endpoints", () => {
    it("POST /api/push/subscribe rejects missing subscription", async () => {
      const res = await supertest(app)
        .post("/api/push/subscribe")
        .send({});
      expect(res.status).toBe(400);
    });

    it("POST /api/push/subscribe accepts valid subscription", async () => {
      const res = await supertest(app)
        .post("/api/push/subscribe")
        .send({ subscription: { endpoint: "https://push.example.com/..." } });
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
    });

    it("GET /api/push/vapid-key returns public key", async () => {
      const res = await supertest(app).get("/api/push/vapid-key");
      expect(res.status).toBe(200);
      expect(res.body.publicKey).toBe("test-vapid-key");
    });
  });

  // ─── /api/register-push ───────────────────────────────────────

  describe("POST /api/register-push", () => {
    it("rejects missing token", async () => {
      const res = await supertest(app)
        .post("/api/register-push")
        .send({});
      expect(res.status).toBe(400);
    });

    it("rejects non-string token", async () => {
      const res = await supertest(app)
        .post("/api/register-push")
        .send({ token: 12345 });
      expect(res.status).toBe(400);
    });

    it("accepts valid token", async () => {
      const res = await supertest(app)
        .post("/api/register-push")
        .send({ token: "ExponentPushToken[abc123]" });
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
    });
  });

  // ─── /api/workspace-state ─────────────────────────────────────

  describe("GET /api/workspace-state", () => {
    it("returns hex map with timestamps", async () => {
      const res = await supertest(app).get("/api/workspace-state");
      expect(res.status).toBe(200);
      expect(res.body.hexes).toBeDefined();
      expect(Array.isArray(res.body.hexes)).toBe(true);
      expect(res.body.hexes.length).toBe(9);
      expect(res.body.timestamp).toBeDefined();

      // Each hex should have required fields
      const hex = res.body.hexes[0];
      expect(hex).toHaveProperty("id");
      expect(hex).toHaveProperty("label");
      expect(hex).toHaveProperty("row");
      expect(hex).toHaveProperty("col");
      expect(hex).toHaveProperty("status");
      expect(hex).toHaveProperty("agentCount");
    });
  });

  // ─── /api/chat/history ────────────────────────────────────────

  describe("GET /api/chat/history", () => {
    it("calls gateway with default params", async () => {
      const mockGw = {
        chatHistory: vi.fn().mockResolvedValue({ messages: [] }),
      };
      getGateway.mockResolvedValue(mockGw);

      const res = await supertest(app).get("/api/chat/history");
      expect(res.status).toBe(200);
      expect(mockGw.chatHistory).toHaveBeenCalledWith("ovi-voice-session", 20);
    });

    it("caps limit at 100", async () => {
      const mockGw = {
        chatHistory: vi.fn().mockResolvedValue({ messages: [] }),
      };
      getGateway.mockResolvedValue(mockGw);

      await supertest(app).get("/api/chat/history?limit=999");
      expect(mockGw.chatHistory).toHaveBeenCalledWith("ovi-voice-session", 100);
    });
  });
});
