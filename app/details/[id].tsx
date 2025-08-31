
import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View, Share } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Header from "../../components/Header";
import { PillTag, PrimaryButton } from "../../components/ui";
import { theme } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import { MEDITATIONS } from "../../constants/meditations";
import { useAuth } from "../../hook/useAuth";

export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { favorites, toggleFavorite } = useAuth();
  const m = MEDITATIONS.find((x) => x.id === String(id))!;
  const [tab, setTab] = useState<"about" | "instructions">("instructions");
  const isFav = favorites.includes(String(id));

  const shareIt = async () => { try { await Share.share({ message: `${m.title} – ${m.about}` }); } catch {} };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        <Header right={<Pressable onPress={shareIt}><Text>🔗</Text></Pressable>} />
      </View>

      <Image source={{ uri: m.image }} style={s.heroImage} />
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={s.detailTitle}>{m.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <PillTag text={m.tag} />
          <Text style={{ color: theme.mutetext }}>•</Text>
          <Text style={{ color: theme.mutetext, fontFamily: fonts.regular }}>{m.duration} minutes</Text>
        </View>

        <View style={s.tabsRow}>
          <Pressable onPress={() => setTab("about")} style={[s.tabBtn, tab === "about" && s.tabActive]}>
            <Text style={[s.tabText, tab === "about" && s.tabTextActive]}>About</Text>
          </Pressable>
          <Pressable onPress={() => setTab("instructions")} style={[s.tabBtn, tab === "instructions" && s.tabActive]}>
            <Text style={[s.tabText, tab === "instructions" && s.tabTextActive]}>Instructions</Text>
          </Pressable>
        </View>

        {tab === "about" ? (
          <View style={{ paddingVertical: 8 }}>
            <Text style={s.sectionHeading}>About {m.title}</Text>
            <Text style={s.paragraph}>{m.about}</Text>
          </View>
        ) : (
          <View style={{ paddingVertical: 8 }}>
            <Text style={s.sectionHeading}>Instructions:</Text>
            {m.instructions.map((it, idx) => (
              <View key={idx} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
                <Text style={{ color: theme.primary }}>•</Text>
                <Text style={s.paragraph}>{it}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={s.favBar}>
        <Pressable onPress={() => toggleFavorite(String(id))} style={s.heartBtn}>
          <Text style={{ fontSize: 18 }}>{isFav ? "❤️" : "🤍"}</Text>
        </Pressable>
        <PrimaryButton title={isFav ? "Added to Favorites" : "Add to Favorites"} onPress={() => toggleFavorite(String(id))} style={{ flex: 1 }} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  heroImage: { width: "92%", alignSelf: "center", height: 220, borderRadius: 20, marginTop: 6, marginBottom: 12 },
  detailTitle: { fontSize: 22, color: theme.primary, marginBottom: 6, fontFamily: fonts.extrabold },
  tabsRow: { flexDirection: "row", gap: 8, marginTop: 6, marginBottom: 8 },
  tabBtn: { flex: 1, backgroundColor: "#F0EEF7", borderRadius: 12, paddingVertical: 10, alignItems: "center" },
  tabActive: { backgroundColor: theme.primary },
  tabText: { color: theme.primary, fontFamily: fonts.bold },
  tabTextActive: { color: "#fff", fontFamily: fonts.bold },
  sectionHeading: { fontSize: 16, color: theme.text, marginBottom: 6, fontFamily: fonts.bold },
  paragraph: { color: theme.text, lineHeight: 20, fontFamily: fonts.regular },
  favBar: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 12 },
  heartBtn: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF3EF", borderWidth: 1, borderColor: theme.border },
});
