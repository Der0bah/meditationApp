
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme/colors";
import { fonts } from "../theme/typography";
import Logo from "./Logo";

export default function Header({ title, right, showLogo = true }: any) {
  return (
    <View style={s.header}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {showLogo && <Logo />}
        {title ? <Text style={s.headerTitle}>{title}</Text> : null}
      </View>
      <View>{right}</View>
    </View>
  );
}
const s = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  headerTitle: { fontSize: 18, color: theme.primary, fontFamily: fonts.bold },
});
