// hook/useAuth.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

type User = {
  name: string;
  username: string;
  email: string;
  age?: string;
  country?: string;
  /** Demo only — do NOT store plaintext passwords in production */
  password: string;
};

type Settings = {
  notifications: boolean;
};

type AuthContextShape = {
  user: User | null;
  favorites: string[];
  settings: Settings;

  login: (email: string, password: string) => Promise<boolean>;
  signup: (u: User) => Promise<void>;
  logout: () => Promise<void>;

  toggleFavorite: (id: string) => void;
  toggleNotifications: () => Promise<void>;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
};

const AuthContext = createContext<AuthContextShape | null>(null);

const K_USER = "med:user";
const K_FAVORITES = "med:favorites";
const K_SETTINGS = "med:settings";

async function saveJSON<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
async function getJSON<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
async function removeKey(key: string) {
  await AsyncStorage.removeItem(key);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>({ notifications: false });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const [u, f, s] = await Promise.all([
        getJSON<User | null>(K_USER, null),
        getJSON<string[]>(K_FAVORITES, []),
        getJSON<Settings>(K_SETTINGS, { notifications: false }),
      ]);
      setUser(u);
      setFavorites(f);
      setSettings(s);
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveJSON(K_FAVORITES, favorites);
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveJSON(K_SETTINGS, settings);
  }, [settings, hydrated]);

  const login = async (email: string, password: string) => {
    const stored = await getJSON<User | null>(K_USER, null);
    if (stored && stored.email.toLowerCase() === email.toLowerCase() && stored.password === password) {
      setUser(stored);
      await saveJSON(K_USER, stored);
      return true;
    }
    return false;
  };

  const signup = async (u: User) => {
    setUser(u);
    await saveJSON(K_USER, u);
  };

  const logout = async () => {
    setUser(null);
    await removeKey(K_USER);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleNotifications = async () => {
    if (!settings.notifications) {
      const current = await Notifications.getPermissionsAsync();
      if (current.status !== "granted") {
        const req = await Notifications.requestPermissionsAsync();
        if (req.status !== "granted") return; // keep off if denied
      }
    }
    setSettings((s) => ({ ...s, notifications: !s.notifications }));
  };

  const value = useMemo<AuthContextShape>(
    () => ({
      user,
      favorites,
      settings,
      login,
      signup,
      logout,
      toggleFavorite,
      toggleNotifications,
      setSettings,
    }),
    [user, favorites, settings]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
