/**
 * useSpeech — Microphone recording + Whisper transcription (React Native / expo-audio port)
 * Adapted from PWA useSpeech.ts: replaced Web Speech API with expo-audio recording
 */

import { useState, useCallback, useRef } from "react";
import { Audio } from "expo-av";

type SpeechState = "idle" | "listening" | "processing" | "error";

export function useSpeech() {
  const [state, setState] = useState<SpeechState>("idle");
  const [transcript, setTranscript] = useState<string>("");
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startListening = useCallback(async () => {
    if (state !== "idle") return;

    try {
      // Request permissions
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        console.error("[OVI Speech] Microphone permission denied");
        setState("error");
        return;
      }

      // Configure audio session for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setState("listening");
    } catch (err) {
      console.error("[OVI Speech] Failed to start recording:", err);
      setState("error");
    }
  }, [state]);

  const stopListening = useCallback(async (
    transcribeAudio?: (blob: Blob) => Promise<string>
  ): Promise<string | null> => {
    if (state !== "listening" || !recordingRef.current) return null;

    setState("processing");

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      if (!uri) throw new Error("No recording URI");

      // Restore audio session for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      // Fetch recording and send to Whisper transcription
      if (transcribeAudio) {
        const response = await fetch(uri);
        const audioBlob = await response.blob();
        const result = await transcribeAudio(audioBlob);
        setTranscript(result);
        setState("idle");
        return result;
      }

      setState("idle");
      return null;
    } catch (err) {
      console.error("[OVI Speech] Stop/transcribe error:", err);
      setState("error");
      return null;
    }
  }, [state]);

  const reset = useCallback(async () => {
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (_) {}
      recordingRef.current = null;
    }
    setState("idle");
    setTranscript("");
  }, []);

  return {
    state,
    transcript,
    isListening: state === "listening",
    isProcessing: state === "processing",
    startListening,
    stopListening,
    reset,
  };
}
