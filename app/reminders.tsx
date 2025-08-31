
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Header from "../components/Header";
import { Card, PrimaryButton } from "../components/ui";
import { theme } from "../theme/colors";
import { fonts } from "../theme/typography";
import { useAuth } from "../hook/useAuth";

export default function Reminders() {
  const { reminders, addReminder } = useAuth();
  const [current, setCurrent] = useState(() => new Date());
  const [selected, setSelected] = useState<string | null>(null);
  const [time, setTime] = useState("");

  const monthLabel = current.toLocaleString("default", { month: "long", year: "numeric" });
  const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
  const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
  const startWeekday = firstDay.getDay();
  const days: (number | null)[] = Array.from({ length: startWeekday }, () => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  while (days.length % 7 !== 0) days.push(null);

  const changeMonth = (delta: number) => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));

  const add = () => {
    if (!selected || !(/^\d{2}:\d{2}$/.test(time))) return Alert.alert("Missing info", "Select a date and enter time as HH:mm");
    addReminder({ id: `${selected}_${time}`, date: selected, time });
    setTime("");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 16 }}>
      <Header right={<Text>⚙️</Text>} />

      <Card>
        <View style={s.calendarHeader}>
          <Pressable onPress={() => changeMonth(-1)}><Text>◀</Text></Pressable>
          <Text style={s.calendarTitle}>{monthLabel}</Text>
          <Pressable onPress={() => changeMonth(1)}><Text>▶</Text></Pressable>
        </View>
        <View style={s.weekRow}>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (<Text key={d} style={s.weekDay}>{d}</Text>))}</View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {days.map((d, idx) => {
            const dateStr = d ? new Date(current.getFullYear(), current.getMonth(), d).toISOString().slice(0,10) : "";
            const active = selected === dateStr;
            return (
              <Pressable key={idx} disabled={!d} onPress={() => setSelected(dateStr)} style={[s.dayCell, active && s.dayActive]}>
                <Text style={[s.dayText, active && { color: "#fff" }]}>{d ?? ""}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <TextInput placeholder="Enter Time (HH:mm)" value={time} onChangeText={setTime} placeholderTextColor={theme.mutetext} style={[s.input, { marginTop: 12 }]} />
      <Text style={{ color: theme.text, marginTop: 8, fontFamily: fonts.regular }}>Date: <Text style={{ color: theme.mutetext }}>{selected ?? "None"}</Text></Text>
      <Text style={{ color: theme.text, marginBottom: 8, fontFamily: fonts.regular }}>Time: <Text style={{ color: theme.mutetext }}>{time || "None"}</Text></Text>
      <PrimaryButton title="Add Reminder" onPress={add} />

      <Text style={[s.sectionTitle, { marginTop: 16 }]}>All Reminders:</Text>
      <Card>
        {reminders.length === 0 ? (
          <Text style={{ color: theme.mutetext, padding: 10, fontFamily: fonts.regular }}>No reminders yet.</Text>
        ) : (
          reminders.map((r) => (
            <View key={r.id} style={{ flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderTopWidth: 1, borderColor: theme.border }}>
              <Text>🕒</Text><Text style={{ color: theme.text, fontFamily: fonts.regular }}>{r.date} at {r.time}</Text>
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  input: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: theme.text, fontFamily: fonts.regular },
  sectionTitle: { fontSize: 18, color: theme.primary, marginTop: 8, marginBottom: 8, fontFamily: fonts.extrabold },
  calendarHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12 },
  calendarTitle: { fontSize: 16, color: theme.primary, fontFamily: fonts.bold },
  weekRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 8, marginBottom: 6 },
  weekDay: { width: `${100/7}%`, textAlign: "center", color: theme.mutetext, fontSize: 12, fontFamily: fonts.bold },
  dayCell: { width: `${100/7}%`, aspectRatio: 1, justifyContent: "center", alignItems: "center", borderRadius: 10, marginBottom: 6 },
  dayActive: { backgroundColor: theme.primary },
  dayText: { color: theme.text, fontFamily: fonts.regular },
});
