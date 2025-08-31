// lib/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Generic typed helpers
 */
export async function saveData<T>(key: string, value: T): Promise<void> {
  try {
    const payload = JSON.stringify(value);
    await AsyncStorage.setItem(key, payload);
  } catch (e) {
    // no-op; you can add Sentry or console.warn in dev
  }
}

export async function getData<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Domain keys (keep them centralized)
 */
export const STORAGE_KEYS = {
  USER: "meditation.currentUser",                 // User | null
  USERS: "meditation.users",                      // Record<email, { user, password }>
  FAVORITES: "meditation.favorites",              // string[]
  REMINDERS: "meditation.reminders",              // Reminder[]
  DONE_MAP: "meditation.done",                    // Record<string, boolean>
  SETTINGS: "meditation.settings",                // { darkMode?: boolean, notifications?: boolean, ... }
} as const;

/**
 * Structured helpers: save/get per data type
 */
export type User = {
  name: string;
  username: string;
  email: string;
  age?: string;
  country?: string;
};

export type Reminder = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
};

export type Settings = {
  darkMode?: boolean;
  notifications?: boolean;
};

export async function saveUserProfile(user: User | null) {
  return saveData(STORAGE_KEYS.USER, user);
}
export async function getUserProfile() {
  return getData<User | null>(STORAGE_KEYS.USER, null);
}

export async function saveUsersTable(table: Record<string, { user: User; password: string }>) {
  return saveData(STORAGE_KEYS.USERS, table);
}
export async function getUsersTable() {
  return getData<Record<string, { user: User; password: string }>>(STORAGE_KEYS.USERS, {});
}

export async function saveFavorites(ids: string[]) {
  return saveData(STORAGE_KEYS.FAVORITES, ids);
}
export async function getFavorites() {
  return getData<string[]>(STORAGE_KEYS.FAVORITES, []);
}

export async function saveReminders(list: Reminder[]) {
  return saveData(STORAGE_KEYS.REMINDERS, list);
}
export async function getReminders() {
  return getData<Reminder[]>(STORAGE_KEYS.REMINDERS, []);
}

export async function saveDoneMap(map: Record<string, boolean>) {
  return saveData(STORAGE_KEYS.DONE_MAP, map);
}
export async function getDoneMap() {
  return getData<Record<string, boolean>>(STORAGE_KEYS.DONE_MAP, {});
}

export async function saveSettings(s: Settings) {
  return saveData(STORAGE_KEYS.SETTINGS, s);
}
export async function getSettings() {
  return getData<Settings>(STORAGE_KEYS.SETTINGS, {});
}
