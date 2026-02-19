/**
 * useSpeech — Web Speech API + Whisper fallback (P2.2: MOONSHOT)
 * 
 * Moonshot behavior: Try Web Speech API first (free, instant).
 * If unavailable or user preference: record audio + send to Whisper (accurate).
 * Result: best of both worlds — fast when possible, accurate when needed.
 */

import { useState, useCallback, useRef } from "react";

export type STTMode = "webSpeech" | "whisper" | "unavailable";

export interface SpeechState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  mode: STTMode;
  error: string | null;
}

export function useSpeech(onTranscribeAudio?: (blob: Blob) => Promise<string>) {
  const [state, setState] = useState<SpeechState>({
    isListening: false,
    transcript: "",
    interimTranscript: "",
    mode: "unavailable",
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const resolveRef = useRef<((text: string) => void) | null>(null);
  const rejectRef = useRef<((err: Error) => void) | null>(null);

  // Detect available mode
  const getSTTMode = useCallback((): STTMode => {
    // Check Web Speech API
    const SpeechRecognitionAPI =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) return "webSpeech";

    // Fallback to Whisper if we have a transcription function
    if (onTranscribeAudio) return "whisper";

    return "unavailable";
  }, [onTranscribeAudio]);

  // ─── Web Speech API ───────────────────────────────────────────────────────

  const startWebSpeech = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;
      resolveRef.current = resolve;
      rejectRef.current = reject;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setState((s) => ({
          ...s,
          isListening: true,
          mode: "webSpeech",
          transcript: "",
          interimTranscript: "",
          error: null,
        }));
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }

        setState((s) => ({
          ...s,
          transcript: s.transcript + final,
          interimTranscript: interim,
        }));
      };

      recognition.onend = () => {
        setState((s) => {
          const finalText = s.transcript || s.interimTranscript;
          if (finalText) {
            resolve(finalText.trim());
          } else {
            resolve("");
          }
          return { ...s, isListening: false, interimTranscript: "" };
        });
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        const error = new Error(`Speech recognition error: ${event.error}`);
        setState((s) => ({ ...s, isListening: false, error: error.message }));
        reject(error);
      };

      recognition.start();
    });
  }, []);

  // ─── Whisper (MediaRecorder → server transcription) ──────────────────────

  const startWhisper = useCallback(async (): Promise<string> => {
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Microphone access denied");
      setState((s) => ({ ...s, error: error.message }));
      throw error;
    }

    streamRef.current = stream;
    audioChunksRef.current = [];

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";

    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;

    return new Promise<string>((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        setState((s) => ({ ...s, isListening: false }));

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        if (audioBlob.size < 100) {
          resolve("");
          return;
        }

        try {
          setState((s) => ({ ...s, interimTranscript: "Transcribing..." }));
          const transcript = await onTranscribeAudio!(audioBlob);
          setState((s) => ({
            ...s,
            transcript: transcript,
            interimTranscript: "",
          }));
          resolve(transcript);
        } catch (err: unknown) {
          const error = err instanceof Error ? err : new Error("Transcription failed");
          setState((s) => ({ ...s, error: error.message, interimTranscript: "" }));
          reject(error);
        }
      };

      recorder.onerror = (_e) => {
        stream.getTracks().forEach((t) => t.stop());
        reject(new Error("Recording error"));
      };

      recorder.start(250);
      setState((s) => ({
        ...s,
        isListening: true,
        mode: "whisper",
        transcript: "",
        interimTranscript: "",
        error: null,
      }));
    });
  }, [onTranscribeAudio]);

  // ─── Public API ──────────────────────────────────────────────────────────

  const startListening = useCallback((): Promise<string> => {
    const mode = getSTTMode();
    setState((s) => ({ ...s, mode, error: null }));

    if (mode === "webSpeech") return startWebSpeech();
    if (mode === "whisper") return startWhisper();
    return Promise.reject(new Error("No STT available"));
  }, [getSTTMode, startWebSpeech, startWhisper]);

  const stopListening = useCallback(() => {
    // Stop Web Speech API
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch {}
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  return {
    state,
    startListening,
    stopListening,
    mode: getSTTMode(),
  };
}
