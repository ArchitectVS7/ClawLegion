/**
 * MessageFeed — Scrollable conversation history
 */

import { useEffect, useRef } from "react";
import type { OVIMessage } from "../hooks/useOVI";

interface MessageFeedProps {
  messages: OVIMessage[];
  interimTranscript?: string;
}

export function MessageFeed({ messages, interimTranscript }: MessageFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimTranscript]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (messages.length === 0 && !interimTranscript) {
    return (
      <div className="message-feed message-feed--empty">
        <div className="empty-state">
          <p className="empty-state-title">OVI is ready.</p>
          <p className="empty-state-hint">Hold the button and speak.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-feed">
      {messages.map((msg) => (
        <div key={msg.id} className={`message message--${msg.role}`}>
          <div className="message-bubble">
            <p className="message-content">{msg.content}</p>
          </div>
          <span className="message-time">{formatTime(msg.timestamp)}</span>
        </div>
      ))}
      {interimTranscript && (
        <div className="message message--user message--interim">
          <div className="message-bubble">
            <p className="message-content">{interimTranscript}</p>
          </div>
          <span className="message-time">listening…</span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
