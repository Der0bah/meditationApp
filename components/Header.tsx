// components/Header.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../theme/colors";
import { fonts } from "../theme/typography";

type Props = {
  title?: string;
  subtitle?: string;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showBack?: boolean;
};

export default function Header({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showBack,
}: Props) {
  return (
    <View style={s.wrap}>
      <View style={s.row}>
        {showBack ? (
          <Pressable hitSlop={10} onPress={onLeftPress}>
            <MaterialIcons name="arrow-back" size={22} color={theme.primary} />
          </Pressable>
        ) : leftIcon ? (
          <Pressable hitSlop={10} onPress={onLeftPress}>
            <MaterialIcons name={leftIcon} size={22} color={theme.primary} />
          </Pressable>
        ) : (
          <View style={{ width: 22 }} />
        )}

        <View style={s.center}>
          {!!title && <Text style={s.title}>{title}</Text>}
          {!!subtitle && <Text style={s.sub}>{subtitle}</Text>}
        </View>

        {rightIcon ? (
          <Pressable hitSlop={10} onPress={onRightPress}>
            <MaterialIcons name={rightIcon} size={22} color={theme.primary} />
          </Pressable>
        ) : (
          <View style={{ width: 22 }} />
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, backgroundColor: "#fff" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  center: { flex: 1, alignItems: "center" },
  title: { color: theme.text, fontFamily: fonts.extrabold, fontSize: 16 },
  sub: { color: theme.mutetext, fontFamily: fonts.regular, fontSize: 12, marginTop: 2 },
});
