
import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme/colors";

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: 12, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
      <LinearGradient colors={["#fb923c", "#f97316"]} start={{ x: 0.2, y: 0.2 }} end={{ x: 0.9, y: 0.9 }} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: theme.onPrimary, fontSize: size * 0.6, fontFamily: "Inter_800ExtraBold", lineHeight: size * 0.8 }}>m</Text>
      </LinearGradient>
    </View>
  );
}
