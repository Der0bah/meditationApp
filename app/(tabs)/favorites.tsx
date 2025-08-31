// app/(tabs)/favorites.tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Header from "../../components/Header";
import { Card, PillTag } from "../../components/ui";
import { theme } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import { useAuth } from "../../hook/useAuth";
import { MEDITATIONS } from "../../constants/meditations";

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useAuth();

  const favItems = useMemo(
    () => MEDITATIONS.filter((m) => favorites.includes(m.id)),
    [favorites]
  );

  const renderItem = ({ item }: { item: (typeof MEDITATIONS)[number] }) => (
    <Card>
      <Pressable onPress={() => router.push(`/details/${item.id}`)}>
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: 140, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
        />

        <View style={s.iconRow}>
          <Pressable
            onPress={() => toggleFavorite(item.id)}
            style={s.iconGhost}
            accessibilityLabel="Remove from favorites"
          >
            <MaterialIcons name="favorite" size={18} color="#d12d2d" />
          </Pressable>
        </View>

        <View style={{ padding: 12 }}>
          <PillTag text={item.tag} />
          <Text style={s.title}>{item.title}</Text>
          <Text style={s.meta}>{item.duration} minutes</Text>
        </View>
      </Pressable>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <Header title="My Favorites" />

      <FlatList
        contentContainerStyle={{ padding: 16, gap: 12 }}
        data={favItems}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={s.empty}>
            You haven’t added any favorites yet. Explore meditations and tap “Add to Favorites”.
          </Text>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  iconRow: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 8,
  },
  iconGhost: {
    backgroundColor: "#ffffffEE",
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 999,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 18, color: theme.primary, marginTop: 6, fontFamily: fonts.extrabold },
  meta: { color: theme.mutetext, marginTop: 4, fontFamily: fonts.regular },
  empty: {
    marginTop: 40,
    textAlign: "center",
    color: theme.mutetext,
    fontFamily: fonts.regular,
  },
});
