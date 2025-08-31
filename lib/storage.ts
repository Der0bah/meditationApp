
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try { const v = await AsyncStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
export async function writeJSON<T>(key: string, value: T) {
  try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch {}
}
