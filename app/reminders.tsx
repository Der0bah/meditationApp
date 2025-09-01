// app/reminders.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Header from "../components/Header";
import { theme } from "../theme/colors";
import { fonts } from "../theme/typography";
import { requestNotificationPermissions, scheduleAt } from "../lib/notifications";

/** Parse "HH:mm" -> hours/minutes or null */
function parseHHmm(input: string): { hours: number; minutes: number } | null {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(input.trim());
  if (!m) return null;
  return { hours: Number(m[1]), minutes: Number(m[2]) };
}

export default function Reminders() {
  const [dateOnly, setDateOnly] = useState<Date>(new Date());          // date part
  const [showPicker, setShowPicker] = useState(false);
  const [timeText, setTimeText] = useState<string>("20:40");           // "HH:mm"
  const [title, setTitle] = useState("Daily Meditation");
  const [body, setBody] = useState("It's time to breathe and relax.");

  const onChangeDate = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS !== "ios") setShowPicker(false);
    if (selected) {
      const normalized = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
      setDateOnly(normalized);
    }
  };

  const combinedDateTime = (): Date | null => {
    const parsed = parseHHmm(timeText);
    if (!parsed) return null;
    return new Date(
      dateOnly.getFullYear(),
      dateOnly.getMonth(),
      dateOnly.getDate(),
      parsed.hours,
      parsed.minutes,
      0,
      0
    );
  };

  const onSchedule = async () => {
    const dt = combinedDateTime();
    if (!dt) {
      Alert.alert("Invalid time", "Please use the format HH:mm (e.g., 08:05 or 20:40).");
      return;
    }
    if (dt.getTime() <= Date.now() + 2000) {
      Alert.alert("Please select a future time.");
      return;
    }

    const ok = await requestNotificationPermissions();
    if (!ok) {
      Alert.alert(
        "Permission needed",
        Platform.OS === "web"
          ? "Please allow browser notifications for this site."
          : "Notifications are only available on the web in this build."
      );
      return;
    }

    await scheduleAt(dt, title, body);
    Alert.alert(
      "Scheduled",
      `Reminder set for ${dt.toLocaleString()}${
        Platform.OS === "web" ? "\nA browser notification will appear at that time." : ""
      }`
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <Header title="Daily Reminders" showBack />

      <View style={{ padding: 16 }}>
        <Text style={s.label}>Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={s.input} placeholder="e.g., Daily Meditation" />

        <Text style={s.label}>Body</Text>
        <TextInput value={body} onChangeText={setBody} style={s.input} placeholder="Short message…" />

        <Text style={s.label}>Date</Text>
        <Pressable style={s.input} onPress={() => setShowPicker(true)}>
          <Text style={{ color: theme.text, fontFamily: fonts.regular }}>
            {dateOnly.toLocaleDateString()}
          </Text>
        </Pressable>

        {showPicker && (
          <DateTimePicker value={dateOnly} mode="date" onChange={onChangeDate} display="default" />
        )}

        <Text style={s.label}>Time (HH:mm)</Text>
        <TextInput
          value={timeText}
          onChangeText={setTimeText}
          style={s.input}
          placeholder="HH:mm"
          keyboardType="numeric"
        />

        <Pressable style={s.primary} onPress={onSchedule}>
          <Text style={s.primaryText}>Add Reminder</Text>
        </Pressable>

        <View style={{ marginTop: 16 }}>
          <Text style={s.caption}>
            Selected: {combinedDateTime() ? combinedDateTime()!.toLocaleString() : "—"}
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={s.subtle}>
            Notifications are **web-only** in this build. Grant permission when prompted.
          </Text>
        </View>
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
  caption: { color: theme.text, fontFamily: fonts.regular },
  subtle: { color: theme.mutetext, fontFamily: fonts.regular, fontSize: 12 },
});
