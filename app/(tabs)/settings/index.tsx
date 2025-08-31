// app/(tabs)/settings/index.tsx
import React from "react";
import { Pressable, ScrollView, Text, View, StyleSheet, Switch } from "react-native";
import Header from "../../../components/Header";
import { Card } from "../../../components/ui";
import { theme } from "../../../theme/colors";
import { fonts } from "../../../theme/typography";
import { useAuth } from "../../../hook/useAuth";
import { useRouter } from "expo-router";

export default function SettingsMenu() {
  const { hydrated, user, logout, settings, toggleDarkMode, toggleNotifications } = useAuth();
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 16 }}>
      <Header title="Settings" showBack />

      {!hydrated ? (
        <Text style={{ color: theme.mutetext, fontFamily: fonts.regular, marginTop: 8 }}>
          Loading settings…
        </Text>
      ) : (
        <>
          <Text style={s.hi}>Hello {user?.name?.split(" ")[0] || "friend"}!</Text>
          <Text style={s.subtitle}>Would you like to change any settings?</Text>

          <View style={{ gap: 12, marginTop: 8 }}>
            <Card>
              <Pressable onPress={() => router.push("/settings/settings")} style={s.row}>
                <Text>⚙️</Text>
                <Text style={s.rowLabel}>Settings</Text>
              </Pressable>
            </Card>
            <Card>
              <Pressable onPress={() => router.push("/favorites")} style={s.row}>
                <Text>⭐</Text>
                <Text style={s.rowLabel}>My Favorites</Text>
              </Pressable>
            </Card>
            <Card>
              <Pressable onPress={() => router.push("/reminders")} style={s.row}>
                <Text>🕒</Text>
                <Text style={s.rowLabel}>Daily Reminders</Text>
              </Pressable>
            </Card>

            {/* Stored Settings Toggles */}
            <Card>
              <View style={s.row}>
                <Text style={s.rowLabel}>Dark Mode</Text>
                <Switch value={!!settings.darkMode} onValueChange={toggleDarkMode} />
              </View>
            </Card>
            <Card>
              <View style={s.row}>
                <Text style={s.rowLabel}>Notifications</Text>
                <Switch value={!!settings.notifications} onValueChange={toggleNotifications} />
              </View>
            </Card>
          </View>

          <Pressable onPress={logout} style={s.logout}>
            <Text>◀</Text>
            <Text style={s.logoutText}>Logout</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hi: { fontSize: 22, color: theme.primary, marginTop: 4, fontFamily: fonts.extrabold },
  subtitle: { fontSize: 16, color: theme.mutetext, marginBottom: 6, fontFamily: fonts.regular },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, padding: 14 },
  rowLabel: { fontSize: 16, color: theme.text, fontFamily: fonts.bold },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: theme.dangerLight,
    padding: 16,
    borderRadius: 18,
    marginTop: 18,
  },
  logoutText: { fontFamily: fonts.extrabold, color: theme.text },
});
