/**
 * VoiceButton — Hold-to-talk UI component (P2.2)
 * Press and hold to speak. Release to process.
 * Shows pulsing animation while listening.
 */

import React, { useCallback, useRef, useState } from "react";

interface VoiceButtonProps {
  onStart: () => void;
  onStop: () => void;
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  disabled?: boolean;
  mode?: string;
}

export function VoiceButton({
  onStart,
  onStop,
  isListening,
  isProcessing,
  isSpeaking,
  disabled = false,
  mode,
}: VoiceButtonProps) {
  const pressedRef = useRef(false);
  const [longPressActive, setLongPressActive] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePressStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (disabled || isProcessing || isSpeaking) return;

      pressedRef.current = true;
      longPressTimer.current = setTimeout(() => {
        if (pressedRef.current) {
          setLongPressActive(true);
          onStart();
        }
      }, 150); // Small delay to avoid accidental triggers
    },
    [disabled, isProcessing, isSpeaking, onStart],
  );

  const handlePressEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!pressedRef.current) return;

      pressedRef.current = false;
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      if (longPressActive || isListening) {
        setLongPressActive(false);
        onStop();
      } else if (!isListening) {
        // Quick tap — toggle listen
        onStart();
        setTimeout(onStop, 3000); // Auto-stop after 3s for tap mode
      }
    },
    [longPressActive, isListening, onStart, onStop],
  );

  const getButtonState = () => {
    if (isListening) return "listening";
    if (isProcessing) return "processing";
    if (isSpeaking) return "speaking";
    return "idle";
  };

  const buttonState = getButtonState();

  const stateConfig = {
    idle: {
      label: "Hold to talk",
      hint: mode === "webSpeech" ? "Web Speech" : mode === "whisper" ? "Whisper" : "",
      bg: "var(--color-surface)",
      ring: "var(--color-accent)",
      icon: "🎙️",
      pulse: false,
    },
    listening: {
      label: "Listening...",
      hint: "Release to send",
      bg: "var(--color-accent)",
      ring: "var(--color-accent)",
      icon: "🔴",
      pulse: true,
    },
    processing: {
      label: "Thinking...",
      hint: "",
      bg: "var(--color-surface)",
      ring: "var(--color-secondary)",
      icon: "⟳",
      pulse: true,
    },
    speaking: {
      label: "Speaking...",
      hint: "Tap to stop",
      bg: "var(--color-surface)",
      ring: "var(--color-secondary)",
      icon: "🔊",
      pulse: true,
    },
  };

  const cfg = stateConfig[buttonState];

  return (
    <div className="voice-button-container">
      <div
        className={`voice-button-ring ${cfg.pulse ? "pulse" : ""}`}
        style={{ "--ring-color": cfg.ring } as React.CSSProperties}
      />
      <button
        className={`voice-button voice-button--${buttonState}`}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        disabled={disabled}
        aria-label={cfg.label}
        style={{ background: cfg.bg }}
      >
        <span className="voice-button-icon">{cfg.icon}</span>
      </button>
      <div className="voice-button-labels">
        <span className="voice-button-label">{cfg.label}</span>
        {cfg.hint && <span className="voice-button-hint">{cfg.hint}</span>}
      </div>
    </div>
  );
}
