/**
 * useTTS — ElevenLabs TTS via backend API (React Native / expo-av port)
 * Adapted from PWA useTTS.ts: replaced HTMLAudioElement with expo-av Sound
 */

import { useState, useCallback, useRef } from "react";
import { Audio } from "expo-av";

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const speak = useCallback(async (text: string, apiBase = "http://localhost:3001/api"): Promise<void> => {
    if (!text.trim()) return;

    // Stop any current audio
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    setIsSpeaking(true);

    try {
      // Configure audio session for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Fetch audio from OVI TTS proxy
      const res = await fetch(`${apiBase}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `TTS failed: ${res.status}`);
      }

      // expo-av: load from URI (can use data URI or temp file)
      // Fetch as base64 and play via data URI
      const audioBuffer = await res.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(audioBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
      const dataUri = `data:audio/mpeg;base64,${base64}`;

      const { sound } = await Audio.Sound.createAsync(
        { uri: dataUri },
        { shouldPlay: true, isLooping: false }
      );

      soundRef.current = sound;

      // Wait for playback to complete
      await new Promise<void>((resolve, reject) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            resolve();
          }
          if ("error" in status) {
            reject(new Error("Audio playback error"));
          }
        });
      });

      await sound.unloadAsync();
      soundRef.current = null;
    } catch (err) {
      console.error("[OVI TTS] Error:", err);
      throw err;
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
