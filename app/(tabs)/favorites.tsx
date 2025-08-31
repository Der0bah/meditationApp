
import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../../components/Header";
import { Card } from "../../components/ui";
import { theme } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import { useAuth } from "../../hook/useAuth";
import { MEDITATIONS } from "../../constants/meditations";
import { useRouter } from "expo-router";

export default function Favorites() {
  const { favorites } = useAuth();
  const router = useRouter();
  const favMed = MEDITATIONS.filter((m) => favorites.includes(m.id));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 16 }}>
      <Header right={<Text>⚙️</Text>} />
      <Header
  title="Favorites"
  showBack
/>
      <Text style={[s.sectionTitle, { textAlign: "center", color: theme.accent }]}>My Favourite Exercises</Text>
      <Text style={[s.sectionTitle, { marginTop: 8 }]}>Daily Meditation</Text>

      {favMed.length === 0 ? (
        <Card><Text style={{ color: theme.mutetext, padding: 12, fontFamily: fonts.regular }}>No favorites yet.</Text></Card>
      ) : (
        <View style={{ gap: 12 }}>
          {favMed.map((m) => (
            <Card key={m.id}>
              <Pressable onPress={() => router.push(`/details/${m.id}`)}>
                <Image source={{ uri: m.image }} style={{ width: "100%", height: 160, borderTopLeftRadius: 18, borderTopRightRadius: 18 }} />
                <View style={{ padding: 12 }}>
                  <Text style={s.cardTitle}>{m.title}</Text>
                  <Text style={{ color: theme.mutetext, fontFamily: fonts.regular }}>{m.tag} • {m.duration} minutes</Text>
                </View>
              </Pressable>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  sectionTitle: { fontSize: 18, color: theme.primary, marginTop: 8, marginBottom: 8, fontFamily: fonts.extrabold },
  cardTitle: { fontSize: 18, color: theme.primary, marginTop: 6, fontFamily: fonts.extrabold },
});
