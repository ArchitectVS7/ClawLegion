/**
 * useOVI — Core hook for OVI backend connection (P2.3: HTTP polling, narrow scope)
 * Connects to the OVI proxy server for chat and proactive messages.
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
}

// For local dev: http://127.0.0.1:3721/api
// For production: https://68.183.155.91:8445/api
const API_BASE = "http://127.0.0.1:3721/api";
const CLIENT_ID = `ovi-${Math.random().toString(36).slice(2, 10)}`;

export function useOVI() {
  const [messages, setMessages] = useState<OVIMessage[]>([]);
  const [status, setStatus] = useState<OVIStatus>({ connected: false, gateway: "disconnected" });
  const [isProcessing, setIsProcessing] = useState(false);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Check server status
  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      if (res.ok) {
        const data = await res.json();
        setStatus({ connected: true, gateway: data.gateway });
      } else {
        setStatus({ connected: false, gateway: "error" });
      }
    } catch {
      setStatus({ connected: false, gateway: "disconnected" });
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

    const poll = async () => {
      if (!active) return;

      try {
        const controller = new AbortController();
        abortRef.current = controller;

        const res = await fetch(`${API_BASE}/poll/${CLIENT_ID}`, {
          signal: controller.signal,
        });

        if (res.ok) {
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
        // Wait before retry on error
        await new Promise((r) => setTimeout(r, 3000));
      }

      // Immediately re-poll
      if (active) {
        poll();
      }
    };

    poll();

    return () => {
      active = false;
      abortRef.current?.abort();
    };
  }, []);

  // Initialize: check status + start polling
  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    const stopPolling = startPolling();

    return () => {
      clearInterval(interval);
      stopPolling();
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [checkStatus, startPolling]);

  return {
    messages,
    status,
    isProcessing,
    sendMessage,
    transcribeAudio,
    clientId: CLIENT_ID,
  };
}
