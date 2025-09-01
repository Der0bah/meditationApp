// app/(tabs)/index.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/Header"; // ✅ fixed path
import { theme } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import { MaterialIcons } from "@expo/vector-icons";

// Demo data (replace with your real source)
const POPULAR = [
  {
    id: "breath-10",
    title: "Mindful Breathing",
    tag: "calmness",
    duration: 10,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "body-15",
    title: "Body Scan",
    tag: "relaxation",
    duration: 15,
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop",
  },
];

const DAILY = [
  {
    id: "focus-12",
    title: "Focus Booster",
    tag: "focus",
    duration: 12,
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "sleep-20",
    title: "Deep Sleep",
    tag: "sleep",
    duration: 20,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "energy-08",
    title: "Morning Energy",
    tag: "energy",
    duration: 8,
    image:
      "https://images.unsplash.com/photo-1520975693416-35a8c1df9a97?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function Home() {
  const router = useRouter();

  const Card = ({
    item,
  }: {
    item: { id: string; title: string; tag: string; duration: number; image: string };
  }) => (
    <Pressable onPress={() => router.push(`/details/${item.id}`)} style={s.card}>
      <Image source={{ uri: item.image }} style={s.cardImg} />
      <View style={{ padding: 12 }}>
        <View style={s.tagRow}>
          <Text style={s.tag}>{item.tag}</Text>
          <Text style={s.tag}>{item.duration} min</Text>
        </View>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.desc}>Find your rhythm and unwind.</Text>
        <View style={s.actions}>
          <MaterialIcons name="check-circle-outline" size={20} color={theme.primary} />
          <MaterialIcons name="edit" size={20} color={theme.mutetext} />
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }}>
      <Header
        title="Find your perfect meditation"
        leftIcon="menu"
        rightIcon="settings"
        onLeftPress={() => router.push("/(tabs)/settings")}
        onRightPress={() => router.push("/(tabs)/settings")}
        subtitle="Hello there! Find your perfect meditation."
      />

      {/* Popular */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Text style={s.section}>Popular Meditations</Text>
        <FlatList
          data={POPULAR}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <Card item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
        />
      </View>

      {/* Daily */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}>
        <Text style={s.section}>Daily Meditation</Text>
        <FlatList
          data={DAILY}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <Card item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
        />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  section: {
    fontFamily: fonts.extrabold,
    fontSize: 18,
    color: theme.primary,
    marginBottom: 8,
  },
  card: {
    width: 240,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: "hidden",
  },
  cardImg: { width: "100%", height: 120 },
  tagRow: { flexDirection: "row", gap: 8 },
  tag: {
    backgroundColor: "#EEEAF7",
    color: theme.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  title: { marginTop: 6, color: theme.text, fontFamily: fonts.extrabold, fontSize: 16 },
  desc: { color: theme.mutetext, marginTop: 2, fontFamily: fonts.regular, fontSize: 12 },
  actions: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 12 },
});
