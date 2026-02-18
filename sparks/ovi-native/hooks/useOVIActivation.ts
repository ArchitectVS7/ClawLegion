/**
 * useOVIActivation — P3.3: Notification-triggered activation
 * iOS/Android limitation: true always-listening requires VoIP entitlement.
 * Realistic path: OVI sends push notification → user taps → app opens in listening mode.
 * 
 * This hook:
 * 1. Registers for push notifications on mount
 * 2. Listens for incoming notifications with action="listen"
 * 3. Auto-triggers recording when notification is tapped
 */

import { useEffect, useRef, useCallback } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,  // OVI uses its own TTS
    shouldSetBadge: false,
  }),
});

export function useOVIActivation(onActivate: () => void) {
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const registerForPushNotifications = useCallback(async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("[OVI Activation] Push notification permission denied");
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  }, []);

  useEffect(() => {
    registerForPushNotifications().then(token => {
      if (token) {
        console.log("[OVI Activation] Push token registered:", token.slice(0, 20) + "...");
        // Send token to OVI server so it can push proactive briefings
        fetch("http://127.0.0.1:3721/api/register-push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }).catch(console.error);
      }
    });

    // Listen for notification received while app is open
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const { action } = notification.request.content.data as { action?: string };
      if (action === "listen") {
        onActivate(); // Trigger listening mode
      }
    });

    // Listen for notification tap (app in background/closed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { action } = response.notification.request.content.data as { action?: string };
      if (action === "listen") {
        router.push("/"); // Navigate to voice screen
        onActivate();
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [onActivate, registerForPushNotifications]);
}
