// app/(tabs)/settings/index.tsx
import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, Button } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import Header from "../../../components/Header";
import { Card } from "../../../components/ui";
import { theme } from "../../../theme/colors";
import { fonts } from "../../../theme/typography";
import { useAuth } from "../../../hook/useAuth";

export default function SettingsMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();

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
        <MaterialIcons
          name="chevron-right"
          size={22}
          color={theme.mutetext}
          style={{ marginLeft: "auto" }}
        />
      </Pressable>
    </Card>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
    >
      <Header title="Settings" showBack />

      {/* User info / greeting */}
      <View style={s.hero}>
        <MaterialIcons name="person" size={28} color="#fff" />
        <View style={{ marginLeft: 10 }}>
          <Text style={s.hello}>
            Hello, {user?.name?.split(" ")[0] || user?.username || "User"}!
          </Text>
          <Text style={s.subHello}>Would you like to change any settings?</Text>
        </View>
      </View>

      {/* Menu items */}
      <View style={{ gap: 12, marginTop: 14 }}>
        <Item
          icon="settings"
          label="Account Settings"
          onPress={() => router.push("/settings/settings")}
        />
        <Item
          icon="notifications"
          label="Notifications / Daily Reminders"
          onPress={() => router.push("/reminders")}
        />
        <Item
          icon="info-outline"
          label="About"
          onPress={() => {
            // route to about page if you add one later
          }}
        />
      </View>

      {/* Navigate to Favorites via Button */}
      <View style={{ marginTop: 20 }}>
        <Button title="Favorites" onPress={() => router.push("/favorites")} />
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
  hello: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fonts.extrabold,
    lineHeight: 22,
  },
  subHello: {
    color: "#eef",
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  rowLabel: {
    fontSize: 16,
    color: theme.text,
    fontFamily: fonts.bold,
  },
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
  logoutText: {
    color: theme.danger,
    fontFamily: fonts.extrabold,
    fontSize: 16,
  },
});
