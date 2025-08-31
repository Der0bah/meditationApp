// lib/notifications.ts
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/** Show alerts/plays sound when app is foregrounded */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    return req.status === "granted";
  }
  return true;
}

/** schedule a simple notification after N seconds (default 10) */
export async function scheduleNotification(
  title: string,
  body: string,
  inSeconds = 10
) {
  await ensureAndroidChannel();
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds: inSeconds },
  });
}

/** schedule by ISO date/time (local) */
export async function scheduleAt(date: Date, title: string, body: string) {
  await ensureAndroidChannel();
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: date, // fires at local time
  });
}
