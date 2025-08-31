// components/MenuProvider.tsx
import React, { createContext, useContext, useState } from "react";
import { Modal, Pressable, Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../theme/colors";
import { fonts } from "../theme/typography";
import { useAuth } from "../hook/useAuth";

type MenuCtx = { openMenu: () => void; closeMenu: () => void };
const Ctx = createContext<MenuCtx | null>(null);
export const useMenu = () => useContext(Ctx)!;

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const router = useRouter();
  const { logout } = useAuth();

  const go = (path: string) => {
    closeMenu();
    router.push(path);
  };

  return (
    <Ctx.Provider value={{ openMenu, closeMenu }}>
      {children}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={closeMenu}>
        <Pressable style={s.backdrop} onPress={closeMenu} />
        <View style={s.sheet}>
          <Text style={s.title}>Quick actions</Text>

          <Pressable style={s.row} onPress={() => go("/(tabs)")}>
            <Text style={s.emoji}>🏠</Text><Text style={s.rowText}>Home</Text>
          </Pressable>
          <Pressable style={s.row} onPress={() => go("/favorites")}>
            <Text style={s.emoji}>⭐</Text><Text style={s.rowText}>My Favorites</Text>
          </Pressable>
          <Pressable style={s.row} onPress={() => go("/reminders")}>
            <Text style={s.emoji}>🕒</Text><Text style={s.rowText}>Daily Reminders</Text>
          </Pressable>
          <Pressable style={s.row} onPress={() => go("/settings")}>
            <Text style={s.emoji}>⚙️</Text><Text style={s.rowText}>Settings</Text>
          </Pressable>

          <View style={{ height: 8 }} />
          <Pressable style={[s.row, s.danger]} onPress={async () => { closeMenu(); await logout(); }}>
            <Text style={s.emoji}>🚪</Text><Text style={[s.rowText, { color: "#8B0000" }]}>Logout</Text>
          </Pressable>
        </View>
      </Modal>
    </Ctx.Provider>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  sheet: {
    position: "absolute", right: 16, top: 56, width: 260,
    backgroundColor: theme.card, borderRadius: 14, borderWidth: 1, borderColor: theme.border,
    shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12, padding: 12
  },
  title: { fontFamily: fonts.bold, color: theme.primary, fontSize: 14, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, paddingHorizontal: 6, borderRadius: 10 },
  rowText: { color: theme.text, fontFamily: fonts.bold, fontSize: 14 },
  emoji: { width: 20, textAlign: "center" },
  danger: { backgroundColor: "#FFF1F2", borderWidth: 1, borderColor: "#ffe2e6" },
});
