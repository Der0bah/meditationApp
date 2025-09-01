// app/(tabs)/settings/index.tsx
import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, Button, Switch, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import Header from "../../../components/Header";               // ← three dots up
import { Card } from "../../../components/ui";                // ← three dots up
import { theme } from "../../../theme/colors";                // ← three dots up
import { fonts } from "../../../theme/typography";            // ← three dots up
import { useAuth } from "../../../hook/useAuth";              // ← three dots up
import {
  requestNotificationPermissions,
  scheduleNotification,
} from "../../../lib/notifications";                          // ← three dots up

export default function SettingsMenu() {
  const router = useRouter();
  const { user, logout, settings, toggleNotifications } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth");
  };

  const Item = ({
    icon,
    label,
    onPress,
  }: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    onPress: () => void;
  }) => (
    <Card>
      <Pressable onPress={onPress} style={s.row}>
        <MaterialIcons name={icon} size={22} color={theme.primary} />
        <Text style={s.rowLabel}>{label}</Text>
        <MaterialIcons name="chevron-right" size={22} color={theme.mutetext} style={{ marginLeft: "auto" }} />
      </Pressable>
    </Card>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      <Header title="Settings" showBack />

      {/* Greeting */}
      <View style={s.hero}>
        <MaterialIcons name="person" size={28} color="#fff" />
        <View style={{ marginLeft: 10 }}>
          <Text style={s.hello}>Hello, {user?.name?.split(" ")[0] || user?.username || "User"}!</Text>
          <Text style={s.subHello}>Would you like to change any settings?</Text>
        </View>
      </View>

      <View style={{ gap: 12, marginTop: 14 }}>
        {/* Notifications toggle (web-only) */}
        <Card>
          <View style={s.row}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <MaterialIcons name="notifications-active" size={22} color={theme.primary} />
              <Text style={s.rowLabel}>Notifications</Text>
            </View>
            <Switch
              value={!!settings.notifications}
              onValueChange={async () => {
                if (Platform.OS !== "web") {
                  Alert.alert("Not available", "Notifications are only supported on the web in this build.");
                  return;
                }
                if (!settings.notifications) {
                  const granted = await requestNotificationPermissions();
                  if (!granted) {
                    Alert.alert("Permission needed", "Allow browser notifications to use reminders.");
                    return;
                  }
                }
                await toggleNotifications();
                if (!settings.notifications) {
                  Alert.alert("Notifications enabled", "You can test a notification below.");
                }
              }}
            />
          </View>
        </Card>

        {/* Test notification (web only) */}
        <Card>
          <View style={{ padding: 14, gap: 8 }}>
            <Button
              title="Test Notification"
              onPress={() => {
                if (Platform.OS !== "web") {
                  Alert.alert("Not available", "Notifications are only supported on the web in this build.");
                  return;
                }
                scheduleNotification("Time to Relax", "This is a test notification.", 3);
              }}
            />
            <Text style={s.hint}>On web, this shows a browser notification after ~3 seconds.</Text>
          </View>
        </Card>

        {/* Navigation items */}
        <Item icon="schedule" label="Daily Reminders" onPress={() => router.push("/reminders")} />
        <Item icon="star-border" label="My Favorites" onPress={() => router.push("/favorites")} />
        <Item icon="settings" label="Account Settings" onPress={() => router.push("/settings/settings")} />
      </View>

      {/* Logout */}
      <Pressable onPress={handleLogout} style={s.logout}>
        <MaterialIcons name="logout" size={20} color={theme.danger} />
        <Text style={s.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hero: {
    backgroundColor: theme.primary,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  hello: { color: "#fff", fontSize: 18, fontFamily: fonts.extrabold, lineHeight: 22 },
  subHello: { color: "#eef", fontFamily: fonts.regular, marginTop: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  rowLabel: { fontSize: 16, color: theme.text, fontFamily: fonts.bold },
  hint: { marginTop: 4, color: theme.mutetext, fontFamily: fonts.regular, textAlign: "center" },
  logout: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: theme.dangerLight,
    borderWidth: 1,
    borderColor: theme.border,
  },
  logoutText: { color: theme.danger, fontFamily: fonts.extrabold, fontSize: 16 },
});
