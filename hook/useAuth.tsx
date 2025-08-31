
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { readJSON, writeJSON } from "../lib/storage";

type User = { name: string; username: string; email: string; age?: string; country?: string; };
type Reminder = { id: string; date: string; time: string; };

type Ctx = {
  user: User | null;
  favorites: string[];
  reminders: Reminder[];
  signup: (p: User & { password: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  addReminder: (r: Reminder) => void;
};

const AuthContext = createContext<Ctx | null>(null);
export const useAuth = () => useContext(AuthContext)!;

const USERS_KEY = "meditation.users";
const USER_KEY  = "meditation.currentUser";
const FAV_KEY   = "meditation.favorites";
const REM_KEY   = "meditation.reminders";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => { (async () => {
    setUser(await readJSON<User | null>(USER_KEY, null));
    setFavorites(await readJSON<string[]>(FAV_KEY, []));
    setReminders(await readJSON<Reminder[]>(REM_KEY, []));
  })(); }, []);
  useEffect(() => { writeJSON(FAV_KEY, favorites); }, [favorites]);
  useEffect(() => { writeJSON(REM_KEY, reminders); }, [reminders]);

  const value = useMemo<Ctx>(() => ({
    user, favorites, reminders,
    toggleFavorite: (id) => setFavorites((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
    addReminder: (r) => setReminders((p) => (p.some((x) => x.id === r.id) ? p : [...p, r])),
    signup: async (payload) => {
      const users = await readJSON<Record<string, { user: User; password: string }>>(USERS_KEY, {});
      if (users[payload.email]) { Alert.alert("Email already registered"); return; }
      users[payload.email] = { user: { name: payload.name, username: payload.username, email: payload.email, age: payload.age, country: payload.country }, password: payload.password };
      await writeJSON(USERS_KEY, users);
    },
    login: async (email, password) => {
      const users = await readJSON<Record<string, { user: User; password: string }>>(USERS_KEY, {});
      if (!users[email] || users[email].password !== password) return false;
      await writeJSON(USER_KEY, users[email].user);
      setUser(users[email].user);
      return true;
    },
    logout: async () => { setUser(null); await writeJSON(USER_KEY, null as any); },
  }), [user, favorites, reminders]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
