
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { theme } from "../theme/colors";
import { fonts } from "../theme/typography";

export const Card = ({ children, style }: any) => (
  <View style={[styles.card, style]}>{children}</View>
);
export const PillTag = ({ text }: { text: string }) => (
  <View style={styles.tag}><Text style={styles.tagText}>{text}</Text></View>
);
export const PrimaryButton = ({ title, onPress, style }: any) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryBtn, style, pressed && { opacity: .9 }]}>
    <Text style={styles.primaryBtnText}>{title}</Text>
  </Pressable>
);
export const LinkText = ({ title, onPress }: any) => (
  <Pressable onPress={onPress}><Text style={styles.link}>{title}</Text></Pressable>
);

export const styles = StyleSheet.create({
  card: { backgroundColor: theme.card, borderRadius: 16, borderWidth: 1, borderColor: theme.border, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  tag: { alignSelf: "flex-start", backgroundColor: theme.secondary, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  tagText: { color: theme.onSecondary, fontFamily: fonts.bold, fontSize: 12 },
  primaryBtn: { backgroundColor: theme.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center", justifyContent: "center" },
  primaryBtnText: { color: theme.onPrimary, fontFamily: fonts.bold, fontSize: 16 },
  link: { color: theme.primary, fontFamily: fonts.bold, marginLeft: 6 },
});
