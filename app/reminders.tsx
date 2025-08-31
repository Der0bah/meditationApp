// app/reminders.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Header from "../components/Header";
import { theme } from "../theme/colors";
import { fonts } from "../theme/typography";
import * as Notifications from "expo-notifications";

async function requestPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    return req.status === "granted";
  }
  return true;
}

async function scheduleAt(date: Date, title: string, body: string) {
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: date, // local time
  });
}

export default function Reminders() {
  const [date, setDate] = useState<Date>(new Date(Date.now() + 5 * 60 * 1000)); // default +5 min
  const [showPicker, setShowPicker] = useState(false);
  const [title, setTitle] = useState("Daily Meditation");
  const [body, setBody] = useState("It's time to breathe and relax.");

  const onChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS !== "ios") setShowPicker(false);
    if (selected) setDate(selected);
  };

  const onSchedule = async () => {
    const ok = await requestPermission();
    if (!ok) {
      Alert.alert("Permission needed", "Enable notifications to schedule reminders.");
      return;
    }
    if (date.getTime() <= Date.now()) {
      Alert.alert("Choose a future time", "Please pick a time in the future.");
      return;
    }
    await scheduleAt(date, title, body);
    Alert.alert("Scheduled", `Reminder set for ${date.toLocaleString()}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <Header title="Daily Reminders" showBack />
      <View style={{ padding: 16 }}>
        <Text style={s.label}>Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={s.input} placeholder="e.g., Daily Meditation" />

        <Text style={s.label}>Body</Text>
        <TextInput value={body} onChangeText={setBody} style={s.input} placeholder="Short message…" />

        <Text style={s.label}>When</Text>
        <Pressable style={s.input} onPress={() => setShowPicker(true)}>
          <Text style={{ color: theme.text, fontFamily: fonts.regular }}>{date.toLocaleString()}</Text>
        </Pressable>

        {showPicker && (
          <DateTimePicker value={date} mode="datetime" onChange={onChange} display="default" />
        )}

        <Pressable style={s.primary} onPress={onSchedule}>
          <Text style={s.primaryText}>Schedule Reminder</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  label: { color: theme.text, fontFamily: fonts.bold, marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  primary: {
    marginTop: 16,
    backgroundColor: theme.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontFamily: fonts.extrabold, fontSize: 16 },
});
