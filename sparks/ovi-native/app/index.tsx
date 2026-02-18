/**
 * OVI Native — Main Voice Screen
 * Phase 3: Native mobile app with expo-router
 */

import { useState, useCallback, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { useOVI } from "../hooks/useOVI";
import { styles } from "./index.styles";

type Message = { role: "user" | "assistant"; content: string; timestamp: number };

export default function VoiceScreen() {
  const { sendMessage, status } = useOVI();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission Required", "Microphone access is required for voice input");
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      Alert.alert("Recording Error", (err as Error).message);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recordingRef.current) return;

    try {
      const recording = recordingRef.current;
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      setIsProcessing(true);

      const uri = recording.getURI();
      if (uri) {
        const transcript = await sendAudioForTranscription(uri);
        if (transcript?.trim()) {
          addMessage("user", transcript.trim());
          const response = await sendMessage(transcript.trim());
          if (response) {
            addMessage("assistant", response);
          }
        }
      }
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setIsProcessing(false);
      recordingRef.current = null;
    }
  }, [sendMessage]);

  const sendAudioForTranscription = async (uri: string): Promise<string> => {
    // Upload to OVI backend for Whisper transcription
    const formData = new FormData();
    formData.append("audio", {
      uri,
      name: "recording.m4a",
      type: "audio/m4a",
    } as any);

    const res = await fetch("http://127.0.0.1:3721/api/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Transcription failed");
    const data = await res.json();
    return data.transcript;
  };

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages(prev => [...prev, { role, content, timestamp: Date.now() }]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Message Feed */}
      <ScrollView style={styles.messageFeed} contentContainerStyle={styles.messageFeedContent}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>◈ OVI</Text>
            <Text style={styles.emptyStateHint}>Hold to talk</Text>
          </View>
        ) : (
          messages.map((msg, i) => (
            <View key={i} style={[styles.message, msg.role === "user" ? styles.messageUser : styles.messageAssistant]}>
              <View style={[styles.bubble, msg.role === "user" ? styles.bubbleUser : styles.bubbleAssistant]}>
                <Text style={styles.messageText}>{msg.content}</Text>
              </View>
              <Text style={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Voice Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.voiceButton, isRecording && styles.voiceButtonActive, isProcessing && styles.voiceButtonProcessing]}
          onPressIn={startRecording}
          onPressOut={stopRecording}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          <Text style={styles.voiceButtonIcon}>{isRecording ? "🔴" : "🎤"}</Text>
        </TouchableOpacity>
        <Text style={styles.voiceButtonLabel}>
          {isProcessing ? "Processing..." : isRecording ? "Release to send" : "Hold to talk"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
