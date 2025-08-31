// components/Header.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { theme } from "../theme/colors";
import { fonts } from "../theme/typography";
import Logo from "./Logo";
import { useRouter } from "expo-router";
import { useMenu } from "./MenuProvider";

type Props = {
  title?: string;
  right?: React.ReactNode;
  showLogo?: boolean;
  showBack?: boolean;       // NEW
};

export default function Header({
  title = "Find your perfect meditation",
  right,
  showLogo = true,
  showBack = false,
}: Props) {
  const router = useRouter();
  const { openMenu } = useMenu();

  return (
    <View style={s.header}>
      <Pressable
        onPress={showBack ? router.back : openMenu}
        hitSlop={12}
        style={s.iconBox}
      >
        <Text style={s.iconText}>{showBack ? "◀" : "☰"}</Text>
      </Pressable>

      <View style={s.center}>
        {showLogo && <Logo size={22} />}
        {!!title && <Text style={s.headerTitle}>{title}</Text>}
      </View>

      <View style={[s.iconBox, { flexDirection: "row", gap: 8 }]}>
        {/* If this page asked for a back button, still expose the hamburger on the right */}
        {showBack && !right && (
          <Pressable onPress={openMenu} hitSlop={12}>
            <Text style={s.iconText}>☰</Text>
          </Pressable>
        )}
        {right}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  iconBox: { width: 44, alignItems: "center", justifyContent: "center" },
  iconText: { fontSize: 20, color: theme.primary, fontFamily: fonts.bold },
  center: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center" },
  headerTitle: { fontSize: 16, color: theme.primary, fontFamily: fonts.bold },
});
