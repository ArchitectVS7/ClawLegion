/**
 * Gateway client tests — protocol handling, text extraction, request management
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock ws module
vi.mock("ws", () => {
  const OPEN = 1;
  class MockWebSocket {
    static OPEN = OPEN;
    readyState = OPEN;
    handlers = {};
    sent = [];

    on(event, handler) {
      if (!this.handlers[event]) this.handlers[event] = [];
      this.handlers[event].push(handler);
    }

    send(data) {
      this.sent.push(JSON.parse(data));
    }

    close() {}

    // Test helper: simulate receiving a message
    _receive(data) {
      const handlers = this.handlers["message"] || [];
      handlers.forEach((h) => h(JSON.stringify(data)));
    }

    // Test helper: simulate open
    _open() {
      const handlers = this.handlers["open"] || [];
      handlers.forEach((h) => h());
    }
  }

  return { default: MockWebSocket };
});

const { OVIGatewayClient } = await import("../gateway.js");

describe("OVIGatewayClient", () => {
  describe("_extractChatText", () => {
    it("extracts string content", () => {
      const client = new OVIGatewayClient();
      const result = client._extractChatText({ content: "Hello world" });
      expect(result).toBe("Hello world");
    });

    it("extracts array content", () => {
      const client = new OVIGatewayClient();
      const result = client._extractChatText({
        content: [
          { type: "text", text: "Hello " },
          { type: "text", text: "world" },
        ],
      });
      expect(result).toBe("Hello \nworld");
    });

    it("handles null message", () => {
      const client = new OVIGatewayClient();
      const result = client._extractChatText(null);
      expect(result).toBe("");
    });

    it("handles message without content", () => {
      const client = new OVIGatewayClient();
      const result = client._extractChatText({});
      // content is undefined, so JSON.stringify({}) = "{}"
      expect(result).toBe("{}");
    });

    it("filters non-text content blocks", () => {
      const client = new OVIGatewayClient();
      const result = client._extractChatText({
        content: [
          { type: "text", text: "Hello" },
          { type: "image", url: "..." },
          { type: "text", text: "World" },
        ],
      });
      expect(result).toBe("Hello\nWorld");
    });
  });

  describe("_handleResponse", () => {
    it("resolves pending request on success", () => {
      const client = new OVIGatewayClient();
      const resolve = vi.fn();
      const reject = vi.fn();
      client.pending.set("req-1", { resolve, reject });

      client._handleResponse({ id: "req-1", ok: true, payload: { data: "test" } });

      expect(resolve).toHaveBeenCalledWith({ data: "test" });
      expect(reject).not.toHaveBeenCalled();
      expect(client.pending.has("req-1")).toBe(false);
    });

    it("rejects pending request on failure", () => {
      const client = new OVIGatewayClient();
      const resolve = vi.fn();
      const reject = vi.fn();
      client.pending.set("req-2", { resolve, reject });

      client._handleResponse({
        id: "req-2",
        ok: false,
        error: { message: "Not found" },
      });

      expect(reject).toHaveBeenCalled();
      expect(reject.mock.calls[0][0].message).toBe("Not found");
      expect(resolve).not.toHaveBeenCalled();
    });

    it("ignores unknown request IDs", () => {
      const client = new OVIGatewayClient();
      // Should not throw
      client._handleResponse({ id: "unknown", ok: true, payload: {} });
    });
  });

  describe("_handleEvent", () => {
    it("resolves chat listeners on final state", () => {
      const client = new OVIGatewayClient();
      const resolve = vi.fn();
      const reject = vi.fn();
      client.chatListeners.set("session-1", [{ resolve, reject }]);

      client._handleEvent({
        event: "chat",
        payload: {
          sessionKey: "session-1",
          state: "final",
          message: { content: "AI response" },
        },
      });

      expect(resolve).toHaveBeenCalledWith("AI response");
      expect(client.chatListeners.has("session-1")).toBe(false);
    });

    it("rejects chat listeners on error state", () => {
      const client = new OVIGatewayClient();
      const resolve = vi.fn();
      const reject = vi.fn();
      client.chatListeners.set("session-2", [{ resolve, reject }]);

      client._handleEvent({
        event: "chat",
        payload: {
          sessionKey: "session-2",
          state: "error",
          errorMessage: "Run failed",
        },
      });

      expect(reject).toHaveBeenCalled();
      expect(reject.mock.calls[0][0].message).toBe("Run failed");
    });

    it("dispatches to generic event handlers", () => {
      const client = new OVIGatewayClient();
      const handler = vi.fn();
      client.genericEventHandlers.set("agent.event", [handler]);

      client._handleEvent({
        event: "agent.event",
        payload: { type: "completion" },
      });

      expect(handler).toHaveBeenCalledWith({ type: "completion" });
    });

    it("catches errors in generic event handlers", () => {
      const client = new OVIGatewayClient();
      const badHandler = vi.fn(() => { throw new Error("oops"); });
      client.genericEventHandlers.set("test", [badHandler]);

      // Should not throw
      client._handleEvent({ event: "test", payload: {} });
      expect(badHandler).toHaveBeenCalled();
    });
  });

  describe("onEvent", () => {
    it("registers generic event handlers", () => {
      const client = new OVIGatewayClient();
      const handler = vi.fn();

      client.onEvent("agent.update", handler);

      expect(client.genericEventHandlers.get("agent.update")).toContain(handler);
    });

    it("supports multiple handlers for same event", () => {
      const client = new OVIGatewayClient();
      const h1 = vi.fn();
      const h2 = vi.fn();

      client.onEvent("test", h1);
      client.onEvent("test", h2);

      expect(client.genericEventHandlers.get("test")).toHaveLength(2);
    });
  });

  describe("shutdown", () => {
    it("sets shuttingDown flag", () => {
      const client = new OVIGatewayClient();
      client.shutdown();
      expect(client.shuttingDown).toBe(true);
    });
  });
});
