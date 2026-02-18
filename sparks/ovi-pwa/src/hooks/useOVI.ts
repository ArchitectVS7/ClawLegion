/**
 * useOVI — Core hook for OVI backend connection (P2.3: HTTP polling, narrow scope)
 * Connects to the OVI proxy server for chat and proactive messages.
 * P4.4: Added reconnecting state + exponential backoff (#1)
 */

import { useState, useCallback, useRef, useEffect } from "react";

export interface OVIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface OVIStatus {
  connected: boolean;
  gateway: string;
  reconnecting: boolean;
}

const API_BASE = "/api";
const CLIENT_ID = `ovi-${Math.random().toString(36).slice(2, 10)}`;

// Exponential backoff config
const BACKOFF_BASE_MS = 2000;
const BACKOFF_MAX_MS = 30000;
const POLL_INTERVAL_MS = 10000;

export function useOVI() {
  const [messages, setMessages] = useState<OVIMessage[]>([]);
  const [status, setStatus] = useState<OVIStatus>({
    connected: false,
    gateway: "disconnected",
    reconnecting: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const failureCountRef = useRef<number>(0);
  const wasConnectedRef = useRef<boolean>(false);

  // Calculate backoff delay from failure count
  const getBackoffMs = useCallback((failures: number): number => {
    const delay = BACKOFF_BASE_MS * Math.pow(2, failures - 1);
    return Math.min(delay, BACKOFF_MAX_MS);
  }, []);

  // Check server status with exponential backoff
  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      if (res.ok) {
        const data = await res.json();
        failureCountRef.current = 0;
        wasConnectedRef.current = true;
        setStatus({ connected: true, gateway: data.gateway, reconnecting: false });
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch {
      failureCountRef.current += 1;
      const isReconnecting = wasConnectedRef.current && failureCountRef.current <= 3;
      setStatus({
        connected: false,
        gateway: "disconnected",
        reconnecting: isReconnecting,
      });
    }
  }, []);

  // Send message to OVI backend
  const sendMessage = useCallback(async (text: string): Promise<string> => {
    if (isProcessing) throw new Error("Already processing");

    setIsProcessing(true);

    // Add user message immediately
    const userMsg: OVIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const responseText = data.response || "No response";

      const assistantMsg: OVIMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      return responseText;
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  // Transcribe audio via Whisper API (server-side)
  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    const res = await fetch(`${API_BASE}/transcribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audio: base64,
        mimeType: audioBlob.type || "audio/webm",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || "Transcription failed");
    }

    const data = await res.json();
    return data.transcript;
  }, []);

  // Long-poll for proactive messages from the backend
  const startPolling = useCallback(() => {
    let active = true;
    let consecutiveErrors = 0;

    const poll = async () => {
      if (!active) return;

      try {
        const controller = new AbortController();
        abortRef.current = controller;

        const res = await fetch(`${API_BASE}/poll/${CLIENT_ID}`, {
          signal: controller.signal,
        });

        if (res.ok) {
          consecutiveErrors = 0;
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            for (const msg of data.messages) {
              setMessages((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  content: msg.text || msg.content || JSON.stringify(msg),
                  timestamp: new Date(),
                },
              ]);
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        consecutiveErrors += 1;
        // Exponential backoff on poll errors
        const backoff = getBackoffMs(consecutiveErrors);
        await new Promise((r) => setTimeout(r, backoff));
      }

      // Re-poll after brief delay
      if (active) {
        poll();
      }
    };

    poll();

    return () => {
      active = false;
      abortRef.current?.abort();
    };
  }, [getBackoffMs]);

  // Initialize: check status + start polling with adaptive interval
  useEffect(() => {
    checkStatus();

    // Adaptive status check: faster when reconnecting, normal otherwise
    let intervalId: ReturnType<typeof setInterval>;

    const scheduleCheck = () => {
      clearInterval(intervalId);
      const delay = failureCountRef.current > 0
        ? getBackoffMs(failureCountRef.current)
        : POLL_INTERVAL_MS;
      intervalId = setInterval(() => {
        checkStatus();
        // Reschedule with potentially updated backoff
        scheduleCheck();
      }, delay);
    };

    scheduleCheck();
    const stopPolling = startPolling();

    return () => {
      clearInterval(intervalId);
      stopPolling();
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [checkStatus, startPolling, getBackoffMs]);

  return {
    messages,
    status,
    isProcessing,
    sendMessage,
    transcribeAudio,
    clientId: CLIENT_ID,
  };
}
