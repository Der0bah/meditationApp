// app/(tabs)/index.tsx
import React from "react";
import {
  Image,
  FlatList,
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import Header from "../../components/Header";
import { Card, PillTag } from "../../components/ui";
import { theme } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import { useAuth } from "../../hook/useAuth";
import { MEDITATIONS } from "../../constants/meditations";

export default function Home() {
  const { hydrated, user, done, toggleDone } = useAuth();
  const router = useRouter();

  const renderCard = (item: (typeof MEDITATIONS)[number], compact = false) => {
    const isDone = !!done[item.id];
    return (
      <Card style={{ width: compact ? 260 : undefined }}>
        <Pressable onPress={() => router.push(`/details/${item.id}`)}>
          <Image
            source={{ uri: item.image }}
            style={[s.cardImage, compact && { height: 140 }]}
          />

          {/* Action icons (Done / Edit) */}
          <View style={s.iconRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isDone ? "Mark as not done" : "Mark as done"}
              onPress={() => toggleDone(item.id)}
              style={[s.iconPill, isDone && s.iconPillDone]}
            >
              <Text style={[s.iconPillText, isDone && s.iconPillTextDone]}>
                {isDone ? "✓ Done" : "○ To-do"}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit meditation"
              onPress={() =>
                Alert.alert("Edit", `Edit settings for “${item.title}”`)
              }
              style={s.iconGhost}
            >
              <Text style={s.iconGhostText}>⋯</Text>
            </Pressable>
          </View>

          <View style={{ padding: 12 }}>
            <PillTag text={item.tag} />
            <Text style={s.cardTitle}>{item.title}</Text>
            {!compact && <Text style={s.cardDesc}>{item.about}</Text>}
            <Text style={s.duration}>{item.duration} minutes</Text>
          </View>
        </Pressable>
      </Card>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
    >
      <Header
        title="Find your perfect meditation"
        showBack={false}
        right={
          <Pressable onPress={() => router.push("/settings")}>
            <Text>⚙️</Text>
          </Pressable>
        }
      />

      {/* Conditional: show loading until storage has hydrated */}
      {!hydrated ? (
        <View style={{ paddingTop: 24 }}>
          <ActivityIndicator />
          <Text style={{ textAlign: "center", color: theme.mutetext, marginTop: 8, fontFamily: fonts.regular }}>
            Loading your data…
          </Text>
        </View>
      ) : (
        <>
          {/* Welcome */}
          <Text style={s.hi}>Hello {user?.name?.split(" ")[0] || "friend"}!</Text>
          <Text style={s.subtitle}>Find your perfect meditation</Text>

          {/* Popular – horizontal */}
          <Text style={s.sectionTitle}>Popular Meditations</Text>
          <FlatList
            data={MEDITATIONS.slice(0, 5)}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 14, paddingVertical: 8 }}
            renderItem={({ item }) => renderCard(item, true)}
          />

          {/* Daily – horizontal */}
          <Text style={[s.sectionTitle, { marginTop: 6 }]}>Daily Meditation</Text>
          <FlatList
            data={MEDITATIONS}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 14, paddingVertical: 8 }}
            renderItem={({ item }) => renderCard(item, true)}
          />
        </>
      )}

      {/* Empty-state hint (if ever empty) */}
      {hydrated && MEDITATIONS.length === 0 && (
        <Text style={s.placeholder}>
          Swipe right on an activity to mark as done.
        </Text>
      )}

      {/* FAB */}
      <Pressable
        accessibilityLabel="Add meditation"
        onPress={() =>
          Alert.alert("Add meditation", "This action will add a new meditation.")
        }
        style={s.fab}
      >
        <Text style={s.fabPlus}>＋</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hi: { fontSize: 22, color: theme.primary, marginTop: 4, fontFamily: fonts.extrabold },
  subtitle: { fontSize: 16, color: theme.mutetext, marginBottom: 6, fontFamily: fonts.regular },

  sectionTitle: {
    fontSize: 18,
    color: theme.primary,
    marginTop: 8,
    marginBottom: 8,
    fontFamily: fonts.extrabold,
  },

  cardImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  cardTitle: { fontSize: 18, color: theme.primary, marginTop: 6, fontFamily: fonts.extrabold },
  cardDesc: { color: theme.mutetext, marginTop: 4, fontFamily: fonts.regular },
  duration: { color: theme.mutetext, marginTop: 6, fontFamily: fonts.regular },

  // Action icons row (over image)
  iconRow: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconPill: {
    backgroundColor: "#ffffffEE",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  iconPillDone: { backgroundColor: "#E9FCEB", borderColor: "#b6e3bd" },
  iconPillText: { color: theme.text, fontFamily: fonts.bold, fontSize: 12 },
  iconPillTextDone: { color: "#157F3B" },

  iconGhost: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffffEE",
    borderWidth: 1,
    borderColor: theme.border,
  },
  iconGhostText: { color: theme.primary, fontSize: 16, fontFamily: fonts.bold },

  placeholder: {
    marginTop: 8,
    color: theme.mutetext,
    textAlign: "center",
    fontFamily: fonts.regular,
  },

  // FAB
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  fabPlus: { color: "#fff", fontSize: 28, lineHeight: 28, fontFamily: fonts.extrabold },
});
