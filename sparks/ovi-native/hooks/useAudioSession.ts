/**
 * useAudioSession — P3.2: Background audio mode
 * Configures iOS/Android audio session on app init.
 * Enables: background playback, silent mode bypass, mic access.
 */

import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import { AppState, AppStateStatus } from "react-native";

export type AudioSessionState = "idle" | "active" | "background" | "error";

export function useAudioSession() {
  const [sessionState, setSessionState] = useState<AudioSessionState>("idle");

  // Configure audio session for background operation
  const configureSession = async (background: boolean) => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,          // Keep mic available even in background
        playsInSilentModeIOS: true,        // Play through silent switch
        staysActiveInBackground: true,     // Keep session alive when screen locks
        interruptionModeIOS: 1,            // DO_NOT_MIX — OVI owns the audio session
        shouldDuckAndroid: false,          // Don't duck — OVI is the primary audio
        interruptionModeAndroid: 1,        // DO_NOT_MIX
        playThroughEarpieceAndroid: false, // Use speaker, not earpiece
      });
      setSessionState(background ? "background" : "active");
    } catch (err) {
      console.error("[OVI AudioSession] Config failed:", err);
      setSessionState("error");
    }
  };

  useEffect(() => {
    // Initialize on mount
    configureSession(false);

    // Track app state for background transitions
    const subscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      if (nextState === "background" || nextState === "inactive") {
        configureSession(true);
      } else if (nextState === "active") {
        configureSession(false);
      }
    });

    return () => subscription.remove();
  }, []);

  return { sessionState };
}
