import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAudioSession } from "../hooks/useAudioSession";

export default function RootLayout() {
  useAudioSession(); // P3.2: configure background audio session on init

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0a0a0a" },
          headerTintColor: "#e2e8f0",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#0a0a0a" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "OVI" }} />
      </Stack>
    </>
  );
}
