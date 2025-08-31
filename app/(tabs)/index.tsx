
import React from "react";
import { Image, FlatList, ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { Card, PillTag } from "../../components/ui";
import { theme } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import { useAuth } from "../../hook/useAuth";
import { MEDITATIONS } from "../../constants/meditations";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const popular = MEDITATIONS.slice(0, 2);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 16 }}>
      <Header right={<Pressable onPress={() => router.push("/settings")}><Text>⚙️</Text></Pressable>} />
      <Text style={s.hi}>Hello {user?.name?.split(" ")[0] || "friend"}!</Text>
      <Text style={s.subtitle}>Find your perfect meditation</Text>

      <View style={s.quoteBox}>
        <Text style={{ color: theme.mutetext, fontStyle: "italic", textAlign: "center", fontFamily: fonts.regular }}>
          "Laziness May Appear Attractive, But Work Gives Satisfaction."
        </Text>
      </View>

      <Text style={s.sectionTitle}>Popular Meditations</Text>
      <View style={{ gap: 14 }}>
        {popular.map((m) => (
          <Card key={m.id}>
            <Pressable onPress={() => router.push(`/details/${m.id}`)}>
              <Image source={{ uri: m.image }} style={s.cardImage} />
              <View style={{ padding: 12 }}>
                <PillTag text={m.tag} />
                <Text style={s.cardTitle}>{m.title}</Text>
                <Text style={s.cardDesc}>{m.about}</Text>
                <Text style={s.duration}>{m.duration} minutes</Text>
              </View>
            </Pressable>
          </Card>
        ))}
      </View>

      <Text style={[s.sectionTitle, { marginTop: 18 }]}>Daily Meditation</Text>
      <FlatList
        data={MEDITATIONS}
        keyExtractor={(i) => i.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, paddingVertical: 8 }}
        renderItem={({ item }) => (
          <Card style={{ width: 260 }}>
            <Pressable onPress={() => router.push(`/details/${item.id}`)}>
              <Image source={{ uri: item.image }} style={[s.cardImage, { height: 140 }]} />
              <View style={{ padding: 12 }}>
                <PillTag text={item.tag} />
                <Text style={s.cardTitle}>{item.title}</Text>
                <Text style={s.duration}>{item.duration} minutes</Text>
              </View>
            </Pressable>
          </Card>
        )}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hi: { fontSize: 22, color: theme.primary, marginTop: 4, fontFamily: fonts.extrabold },
  subtitle: { fontSize: 16, color: theme.mutetext, marginBottom: 6, fontFamily: fonts.regular },
  quoteBox: { borderWidth: 1, borderColor: theme.border, borderRadius: 12, backgroundColor: theme.card, padding: 10, marginTop: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, color: theme.primary, marginTop: 8, marginBottom: 8, fontFamily: fonts.extrabold },
  cardImage: { width: "100%", height: 160, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  cardTitle: { fontSize: 18, color: theme.primary, marginTop: 6, fontFamily: fonts.extrabold },
  cardDesc: { color: theme.mutetext, marginTop: 4, fontFamily: fonts.regular },
  duration: { color: theme.mutetext, marginTop: 6, fontFamily: fonts.regular },
});
