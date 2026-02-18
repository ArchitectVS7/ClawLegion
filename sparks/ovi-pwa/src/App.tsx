/**
 * OVI PWA — Main App Component
 * Phase 2: Voice interface for VS7's AI system
 */

import { useState, useCallback } from "react";
import { useOVI } from "./hooks/useOVI";
import { useSpeech } from "./hooks/useSpeech";
import { useTTS } from "./hooks/useTTS";
import { VoiceButton } from "./components/VoiceButton";
import { MessageFeed } from "./components/MessageFeed";
import { StatusBar } from "./components/StatusBar";
import { HelpPanel } from "./components/HelpPanel";
import "./App.css";

function App() {
  const { messages, status, isProcessing, sendMessage, transcribeAudio } = useOVI();
  const { speak, stop: stopTTS, isSpeaking } = useTTS();

  const {
    state: speechState,
    startListening,
    stopListening,
    mode: sttMode,
  } = useSpeech(transcribeAudio);

  const [error, setError] = useState<string | null>(null);

  // Better: capture the promise from startListening
  const [listenPromise, setListenPromise] = useState<Promise<string> | null>(null);

  const handleStartWithPromise = useCallback(() => {
    setError(null);
    if (isSpeaking) stopTTS();
    const promise = startListening();
    setListenPromise(promise);
  }, [isSpeaking, stopTTS, startListening]);

  const handleStopWithPromise = useCallback(async () => {
    stopListening();

    try {
      const transcript = await listenPromise;
      setListenPromise(null);

      if (transcript?.trim()) {
        const response = await sendMessage(transcript.trim());
        if (response) {
          await speak(response).catch(console.error);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setListenPromise(null);
    }
  }, [stopListening, listenPromise, sendMessage, speak]);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <span className="header-logo">◈</span>
          <span className="header-title">OVI</span>
        </div>
        <StatusBar status={status} />
      </header>

      {/* Message feed */}
      <main className="app-main">
        <MessageFeed
          messages={messages}
          interimTranscript={speechState.interimTranscript || (speechState.isListening ? speechState.transcript : "")}
        />
      </main>

      {/* Error banner */}
      {error && (
        <div className="error-banner" onClick={() => setError(null)}>
          <span>⚠ {error}</span>
          <span className="error-dismiss">✕</span>
        </div>
      )}

      {/* Help */}
      <HelpPanel />

      {/* Voice control */}
      <footer className="app-footer">
        <VoiceButton
          onStart={handleStartWithPromise}
          onStop={handleStopWithPromise}
          isListening={speechState.isListening}
          isProcessing={isProcessing}
          isSpeaking={isSpeaking}
          mode={sttMode}
        />
      </footer>
    </div>
  );
}

export default App;
