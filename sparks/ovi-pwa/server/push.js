/**
 * OVI Push Notifications (P2.6: SPIKE — scaffold only)
 * Web Push API integration for proactive alerts from the AI system.
 * 
 * SPIKE FINDINGS (30-min exploration):
 * - Web Push requires VAPID keys (public/private pair)
 * - Browser subscribes via ServiceWorker.pushManager.subscribe()
 * - Server sends via web-push library to push service endpoint
 * - iOS 16.4+ supports Web Push in PWAs added to home screen
 * - Android Chrome supports it natively
 * 
 * Current state: Scaffolded. web-push library not yet installed.
 * To enable: pnpm add web-push && set VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY
 */

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const CONTACT_EMAIL = process.env.VAPID_EMAIL || "ovi@vs7.ai";

export class PushNotificationManager {
  constructor() {
    this.subscriptions = new Set();
    this.pushEnabled = false;

    if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
      this._initWebPush();
    } else {
      console.log("[OVI Push] VAPID keys not set — push notifications disabled");
      console.log("[OVI Push] Generate keys: node -e \"require('web-push').generateVAPIDKeys().then(k=>console.log(k))\"");
    }
  }

  async _initWebPush() {
    try {
      const webpush = await import("web-push");
      this.webpush = webpush.default || webpush;
      this.webpush.setVapidDetails(
        `mailto:${CONTACT_EMAIL}`,
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY,
      );
      this.pushEnabled = true;
      console.log("[OVI Push] Web Push initialized with VAPID keys");
    } catch (e) {
      console.warn("[OVI Push] web-push not installed:", e.message);
      console.log("[OVI Push] Run: pnpm add web-push");
    }
  }

  getPublicKey() {
    return VAPID_PUBLIC_KEY || "NOT_CONFIGURED";
  }

  addSubscription(subscription) {
    this.subscriptions.add(JSON.stringify(subscription));
    console.log(`[OVI Push] Added subscription (total: ${this.subscriptions.size})`);
  }

  async sendNotification({ title, body, data = {} }) {
    if (!this.pushEnabled) {
      console.log(`[OVI Push] Would send: "${title}" — ${body} (not configured)`);
      return { sent: 0, skipped: this.subscriptions.size };
    }

    const payload = JSON.stringify({ title, body, data });
    const results = { sent: 0, failed: 0 };

    for (const subStr of this.subscriptions) {
      const sub = JSON.parse(subStr);
      try {
        await this.webpush.sendNotification(sub, payload);
        results.sent++;
      } catch (err) {
        console.error("[OVI Push] Failed to send:", err.message);
        results.failed++;
        // Remove expired subscriptions (410 Gone)
        if (err.statusCode === 410) {
          this.subscriptions.delete(subStr);
        }
      }
    }

    return results;
  }
}

/**
 * SPIKE NOTES — Trigger conditions for proactive OVI alerts:
 * 
 * 1. Agent completes a long-running task → "Done: [task name]"
 * 2. A decision is needed from VS7 → "Input needed: [question]"
 * 3. Error state in any agent → "Alert: [agent] hit an error"
 * 4. Scheduled briefing (configurable, e.g., 9am daily) → "Morning briefing ready"
 * 5. Build failure / test failure → "Build broke in [repo]"
 * 
 * Hook into OpenClaw events: gw.onEvent("agent.event", handler)
 * Filter for completion/error events, push to all subscribed clients.
 */
