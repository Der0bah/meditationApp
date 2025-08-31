// hook/useAuth.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import {
  STORAGE_KEYS,
  User,
  Reminder,
  Settings,
  getUserProfile,
  saveUserProfile,
  getUsersTable,
  saveUsersTable,
  getFavorites,
  saveFavorites,
  getReminders,
  saveReminders,
  getDoneMap,
  saveDoneMap,
  getSettings,
  saveSettings,
} from "../lib/storage";

type AuthContextShape = {
  /** hydration flag so UI can conditionally render when storage is ready */
  hydrated: boolean;

  /** core data */
  user: User | null;
  favorites: string[];
  reminders: Reminder[];
  done: Record<string, boolean>;
  settings: Settings;

  /** auth */
  signup: (payload: User & { password: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;

  /** app actions */
  toggleFavorite: (id: string) => void;
  addReminder: (r: Reminder) => void;
  toggleDone: (id: string) => void;

  /** settings actions */
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
};

const AuthContext = createContext<AuthContextShape | null>(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reminders, setRemindersState] = useState<Reminder[]>([]);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [settings, setSettings] = useState<Settings>({});

  /** Load all slices on mount */
  useEffect(() => {
    (async () => {
      const [u, fav, rem, dmap, setts] = await Promise.all([
        getUserProfile(),
        getFavorites(),
        getReminders(),
        getDoneMap(),
        getSettings(),
      ]);

      setUser(u);
      setFavorites(fav);
      setRemindersState(rem);
      setDone(dmap);
      setSettings(setts || {});

      setHydrated(true);
    })();
  }, []);

  /** Persist slices when they change (after hydration) */
  useEffect(() => {
    if (!hydrated) return;
    saveFavorites(favorites);
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveReminders(reminders);
  }, [reminders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveDoneMap(done);
  }, [done, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveSettings(settings);
  }, [settings, hydrated]);

  const toggleFavorite = (id: string) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const addReminder = (r: Reminder) =>
    setRemindersState((prev) => (prev.some((x) => x.id === r.id) ? prev : [...prev, r]));

  const toggleDone = (id: string) =>
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleDarkMode = () => setSettings((s) => ({ ...s, darkMode: !s.darkMode }));
  const toggleNotifications = () => setSettings((s) => ({ ...s, notifications: !s.notifications }));

  const signup = async (payload: User & { password: string }) => {
    const table = await getUsersTable();
    if (table[payload.email]) {
      Alert.alert("Email already registered");
      return;
    }
    table[payload.email] = {
      user: {
        name: payload.name,
        username: payload.username,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      },
      password: payload.password,
    };
    await saveUsersTable(table);
  };

  const login = async (email: string, password: string) => {
    const table = await getUsersTable();
    const rec = table[email];
    if (!rec || rec.password !== password) return false;

    await saveUserProfile(rec.user);
    setUser(rec.user);
    return true;
  };

  const logout = async () => {
    setUser(null);
    await saveUserProfile(null);
  };

  const value = useMemo<AuthContextShape>(
    () => ({
      hydrated,
      user,
      favorites,
      reminders,
      done,
      settings,

      signup,
      login,
      logout,

      toggleFavorite,
      addReminder,
      toggleDone,

      toggleDarkMode,
      toggleNotifications,
    }),
    [hydrated, user, favorites, reminders, done, settings]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
