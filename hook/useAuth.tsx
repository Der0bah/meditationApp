// hook/useAuth.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import { readJSON, writeJSON } from "../lib/storage";

/** Domain models */
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

/** Context shape */
type AuthContextShape = {
  user: User | null;

  favorites: string[];
  reminders: Reminder[];
  done: Record<string, boolean>;

  /** Auth */
  signup: (payload: User & { password: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;

  /** App actions */
  toggleFavorite: (id: string) => void;
  addReminder: (r: Reminder) => void;
  toggleDone: (id: string) => void;
};

/** Keys for AsyncStorage */
const USERS_KEY = "meditation.users";        // Record<email, { user, password }>
const USER_KEY  = "meditation.currentUser";  // User | null
const FAV_KEY   = "meditation.favorites";    // string[]
const REM_KEY   = "meditation.reminders";    // Reminder[]
const DONE_KEY  = "meditation.done";         // Record<string, boolean>

/** Create context + hook */
const AuthContext = createContext<AuthContextShape | null>(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [done, setDone] = useState<Record<string, boolean>>({});

  /** Load persisted state once */
  useEffect(() => {
    (async () => {
      setUser(await readJSON<User | null>(USER_KEY, null));
      setFavorites(await readJSON<string[]>(FAV_KEY, []));
      setReminders(await readJSON<Reminder[]>(REM_KEY, []));
      setDone(await readJSON<Record<string, boolean>>(DONE_KEY, {}));
    })();
  }, []);

  /** Persist slices when they change */
  useEffect(() => {
    writeJSON(FAV_KEY, favorites);
  }, [favorites]);

  useEffect(() => {
    writeJSON(REM_KEY, reminders);
  }, [reminders]);

  useEffect(() => {
    writeJSON(DONE_KEY, done);
  }, [done]);

  /** Public API */
  const value = useMemo<AuthContextShape>(
    () => ({
      user,
      favorites,
      reminders,
      done,

      toggleFavorite: (id) =>
        setFavorites((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        ),

      addReminder: (r) =>
        setReminders((prev) => (prev.some((x) => x.id === r.id) ? prev : [...prev, r])),

      toggleDone: (id) =>
        setDone((prev) => ({ ...prev, [id]: !prev[id] })),

      signup: async (payload) => {
        const users = await readJSON<
          Record<string, { user: User; password: string }>
        >(USERS_KEY, {});

        if (users[payload.email]) {
          Alert.alert("Email already registered");
          return;
        }

        users[payload.email] = {
          user: {
            name: payload.name,
            username: payload.username,
            email: payload.email,
            age: payload.age,
            country: payload.country,
          },
          password: payload.password,
        };

        await writeJSON(USERS_KEY, users);
      },

      login: async (email, password) => {
        const users = await readJSON<
          Record<string, { user: User; password: string }>
        >(USERS_KEY, {});

        const rec = users[email];
        if (!rec || rec.password !== password) return false;

        await writeJSON(USER_KEY, rec.user);
        setUser(rec.user);
        return true;
      },

      logout: async () => {
        setUser(null);
        await writeJSON(USER_KEY, null as any);
      },
    }),
    [user, favorites, reminders, done]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
