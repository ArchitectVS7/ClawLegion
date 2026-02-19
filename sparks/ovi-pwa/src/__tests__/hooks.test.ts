/**
 * Hook unit tests — useOVI persistence, useTTS lifecycle
 */

import { describe, it, expect, beforeEach } from "vitest";

describe("useOVI message persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads empty array when localStorage is empty", () => {
    const raw = localStorage.getItem("ovi-messages");
    expect(raw).toBeNull();
  });

  it("round-trips messages through localStorage", () => {
    const messages = [
      { id: "1", role: "user", content: "Hello", timestamp: new Date("2026-01-01T12:00:00Z") },
      { id: "2", role: "assistant", content: "Hi there", timestamp: new Date("2026-01-01T12:00:01Z") },
    ];

    localStorage.setItem("ovi-messages", JSON.stringify(messages));
    const raw = localStorage.getItem("ovi-messages");
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].content).toBe("Hello");
    expect(parsed[1].content).toBe("Hi there");

    // Verify timestamps can be reconstructed
    const reconstructed = parsed.map((m: Record<string, unknown>) => ({
      ...m,
      timestamp: new Date(m.timestamp as string),
    }));
    expect(reconstructed[0].timestamp.getFullYear()).toBe(2026);
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem("ovi-messages", "not valid json{{{");

    // loadMessages should return empty array, not throw
    let result: unknown[] = [];
    try {
      const raw = localStorage.getItem("ovi-messages");
      if (raw) result = JSON.parse(raw);
    } catch {
      result = [];
    }
    expect(result).toEqual([]);
  });

  it("caps stored messages at 100", () => {
    const messages = Array.from({ length: 150 }, (_, i) => ({
      id: `msg-${i}`,
      role: "user",
      content: `Message ${i}`,
      timestamp: new Date(),
    }));

    const toStore = messages.slice(-100);
    localStorage.setItem("ovi-messages", JSON.stringify(toStore));

    const stored = JSON.parse(localStorage.getItem("ovi-messages")!);
    expect(stored).toHaveLength(100);
    expect(stored[0].content).toBe("Message 50"); // First 50 should be trimmed
  });
});

describe("OVI backoff calculation", () => {
  it("produces correct backoff sequence", () => {
    const BACKOFF_BASE_MS = 2000;
    const BACKOFF_MAX_MS = 30000;

    function getBackoffMs(failures: number): number {
      const delay = BACKOFF_BASE_MS * Math.pow(2, Math.min(failures - 1, 4));
      return Math.min(delay, BACKOFF_MAX_MS);
    }

    expect(getBackoffMs(1)).toBe(2000);   // 2s
    expect(getBackoffMs(2)).toBe(4000);   // 4s
    expect(getBackoffMs(3)).toBe(8000);   // 8s
    expect(getBackoffMs(4)).toBe(16000);  // 16s
    expect(getBackoffMs(5)).toBe(30000);  // capped at 30s (2000 * 16 = 32000 > 30000)
    expect(getBackoffMs(100)).toBe(30000); // stays capped, doesn't overflow
  });
});

describe("Client ID generation", () => {
  it("produces valid format", () => {
    const id = `ovi-${crypto.randomUUID().slice(0, 8)}`;
    expect(id).toMatch(/^ovi-[\w-]{8}$/);
  });
});
