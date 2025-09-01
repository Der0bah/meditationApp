// lib/notifications.ts
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Web doesn't support native scheduling via expo-notifications.
 * We provide safe fallbacks (alert + setTimeout) on web.
 */
const isWeb = Platform.OS === "web";

export function initNotificationHandler() {
  // This exists on web as a no-op; safe to call.
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (isWeb) {
    // On web, expo-notifications permissions are not relevant to our fallback.
    return true;
  }
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    return req.status === "granted";
  }
  return true;
}

/**
 * Schedule a simple local notification after N seconds.
 * - Native (iOS/Android): uses expo-notifications scheduling
 * - Web: setTimeout + alert() as a soft fallback
 */
export async function scheduleNotification(
  title: string,
  body: string,
  inSeconds = 10
) {
  if (isWeb) {
    setTimeout(() => {
      // best-effort web fallback
      // eslint-disable-next-line no-alert
      alert(`${title}\n\n${body}`);
    }, Math.max(0, inSeconds) * 1000);
    return "web-fallback-id";
  }

  await ensureAndroidChannel();
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds: inSeconds },
  });
}

/**
 * Schedule at a specific local date/time.
 * - Native: uses date trigger
 * - Web: computes delay and uses setTimeout + alert()
 */
export async function scheduleAt(date: Date, title: string, body: string) {
  if (isWeb) {
    const delay = Math.max(0, date.getTime() - Date.now());
    setTimeout(() => {
      // eslint-disable-next-line no-alert
      alert(`${title}\n\n${body}`);
    }, delay);
    return "web-fallback-id";
  }

  await ensureAndroidChannel();
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: date,
  });
}
