// app/details/[id].tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { theme } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import { useAuth } from "../../hook/useAuth";
import { MEDITATIONS } from "../../constants/meditations";
import Header from "../../components/Header";
import { Card, PillTag } from "../../components/ui";

export default function MeditationDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { favorites, toggleFavorite } = useAuth();

  const item = useMemo(
    () => MEDITATIONS.find((m) => m.id === id),
    [id]
  );

  const [tab, setTab] = useState<"about" | "instructions">("about");
  const isFav = !!(id && favorites.includes(id));

  if (!item) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <Header title="Meditation" showBack />
        <View style={{ padding: 20 }}>
          <Text style={{ color: theme.text, fontFamily: fonts.bold }}>
            Meditation not found.
          </Text>
        </View>
      </View>
    );
  }

  const onToggleFav = () => {
    if (!id) return;
    toggleFavorite(id);
    if (!isFav) {
      Alert.alert("Added", `“${item.title}” added to your favorites.`);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ paddingBottom: 28 }}
    >
      <Header
        title=""
        showBack
        right={
          <Pressable onPress={() => Alert.alert("Share", "Share this meditation")}>
            <MaterialIcons name="ios-share" size={20} color={theme.primary} />
          </Pressable>
        }
      />

      {/* Hero image */}
      <Card style={{ margin: 16, padding: 0 }}>
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: 220, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
        />

        {/* On-image quick actions */}
        <View style={s.actionRow}>
          <Pressable style={[s.iconPill]} onPress={onToggleFav}>
            <MaterialIcons
              name={isFav ? "favorite" : "favorite-border"}
              size={18}
              color={isFav ? "#d12d2d" : theme.primary}
            />
            <Text style={s.iconPillText}>{isFav ? "Favorited" : "Add to favorites"}</Text>
          </Pressable>
        </View>

        <View style={{ padding: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <PillTag text={item.tag} />
            <PillTag text={`${item.duration} min`} />
          </View>

          <Text style={s.title}>{item.title}</Text>
          <Text style={s.subtitle}>{item.subtitle ?? "Mindful Breathing"}</Text>
        </View>
      </Card>

      {/* Tabs */}
      <View style={{ marginHorizontal: 16, marginTop: 4, flexDirection: "row", gap: 8 }}>
        <Pressable
          onPress={() => setTab("about")}
          style={[s.tab, tab === "about" && s.tabActive]}
        >
          <Text style={[s.tabText, tab === "about" && s.tabTextActive]}>About</Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("instructions")}
          style={[s.tab, tab === "instructions" && s.tabActive]}
        >
          <Text style={[s.tabText, tab === "instructions" && s.tabTextActive]}>Instructions</Text>
        </Pressable>
      </View>

      {/* Content */}
      <Card style={{ margin: 16 }}>
        {tab === "about" ? (
          <>
            <Text style={s.sectionTitle}>About {item.title}</Text>
            <Text style={s.body}>
              {item.about ||
                "Focus on your breath and maintain a steady rhythm to clear your mind and reduce stress."}
            </Text>
          </>
        ) : (
          <>
            <Text style={s.sectionTitle}>How to practice</Text>
            <Text style={s.body}>
              {item.instructions ||
                "Sit comfortably. Close your eyes. Inhale through the nose for 4 counts, exhale for 6. Repeat for the full duration."}
            </Text>
          </>
        )}
      </Card>

      {/* Bottom actions */}
      <View style={s.bottomBar}>
        <Pressable onPress={() => router.back()} style={s.secondary}>
          <MaterialIcons name="arrow-back" size={20} color={theme.primary} />
          <Text style={s.secondaryText}>Back</Text>
        </Pressable>

        <Pressable onPress={onToggleFav} style={s.primary}>
          <MaterialIcons
            name={isFav ? "favorite" : "favorite-border"}
            size={20}
            color="#fff"
          />
          <Text style={s.primaryText}>{isFav ? "Remove Favorite" : "Add to Favorites"}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  actionRow: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ffffffEE",
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  iconPillText: { color: theme.text, fontFamily: fonts.bold, fontSize: 12 },

  title: { fontSize: 22, color: theme.primary, marginTop: 6, fontFamily: fonts.extrabold },
  subtitle: { color: theme.mutetext, fontFamily: fonts.regular },

  tab: {
    flex: 1,
    backgroundColor: "#EEEAF7",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabActive: { backgroundColor: theme.primary },
  tabText: { color: theme.primary, fontFamily: fonts.bold },
  tabTextActive: { color: "#fff", fontFamily: fonts.bold },

  sectionTitle: { fontSize: 16, color: theme.primary, fontFamily: fonts.extrabold, marginBottom: 6 },
  body: { color: theme.text, fontFamily: fonts.regular, lineHeight: 20 },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  secondary: {
    flex: 1,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
  },
  secondaryText: { color: theme.primary, fontFamily: fonts.bold },

  primary: {
    flex: 2,
    backgroundColor: theme.accent,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  primaryText: { color: "#fff", fontFamily: fonts.extrabold },
});
