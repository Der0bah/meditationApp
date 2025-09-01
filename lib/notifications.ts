// lib/notifications.ts
// Web-only notifications via the Browser Notifications API.
// On iOS/Android these helpers no-op and show a friendly message.

import { Alert, Platform } from "react-native";

const isWeb = Platform.OS === "web";

/* ----------------------------- WEB HELPERS ----------------------------- */

function webSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

async function requestWebPermission(): Promise<boolean> {
  if (!webSupported()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const res = await Notification.requestPermission();
  return res === "granted";
}

function showWebNotification(title: string, body: string) {
  if (webSupported() && Notification.permission === "granted") {
    // Display the browser notification
    // eslint-disable-next-line no-new
    new Notification(title, { body });
  } else {
    // Fallback if denied or unsupported
    // eslint-disable-next-line no-alert
    alert(`${title}\n\n${body}`);
  }
}

/* -------------------------- PUBLIC API (UNIFIED) ----------------------- */

// Kept for compatibility (does nothing on native and nothing required on web)
export function initNotificationHandler() {
  /* no-op */
}

// Ask permission (web only). Native always returns false + shows info.
export async function requestNotificationPermissions(): Promise<boolean> {
  if (isWeb) return requestWebPermission();
  Alert.alert("Notifications not available", "Notifications are only supported on the web in this build.");
  return false;
}

/** Schedule after N seconds (web) or no-op on native. */
export async function scheduleNotification(
  title: string,
  body: string,
  inSeconds = 10
) {
  if (isWeb) {
    const ok = await requestWebPermission();
    if (!ok) {
      // eslint-disable-next-line no-alert
      alert("Browser notifications are blocked. Please allow them for this site.");
    }
    setTimeout(() => showWebNotification(title, body), Math.max(0, inSeconds) * 1000);
    return "web-notification-id";
  }

  Alert.alert("Notifications not available", "This feature only shows notifications on the web.");
  return "native-noop";
}

/** Schedule at a Date (web) or no-op on native. */
export async function scheduleAt(date: Date, title: string, body: string) {
  if (isWeb) {
    const ok = await requestWebPermission();
    if (!ok) {
      // eslint-disable-next-line no-alert
      alert("Browser notifications are blocked. Please allow them for this site.");
    }
    const delay = Math.max(0, date.getTime() - Date.now());
    setTimeout(() => showWebNotification(title, body), delay);
    return "web-notification-id";
  }

  Alert.alert("Notifications not available", "This feature only shows notifications on the web.");
  return "native-noop";
}
