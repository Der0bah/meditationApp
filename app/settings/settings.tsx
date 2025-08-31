import React from "react";
import { ScrollView, Text } from "react-native";
import Header from "../../components/Header";
import { Card } from "../../components/ui";
import { theme } from "../../theme/colors";
import { fonts } from "../../theme/typography";

export default function Settings() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 16 }}>
      <Header title="Settings" showBack />
      <Card>
        <Text style={{ padding: 14, fontFamily: fonts.regular }}>Dark Mode (coming soon)</Text>
      </Card>
      <Card>
        <Text style={{ padding: 14, fontFamily: fonts.regular }}>Push Notifications (coming soon)</Text>
      </Card>
    </ScrollView>
  );
}
