
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, View, StyleSheet } from "react-native";
import Header from "../components/Header";
import { Card, LinkText, PrimaryButton } from "../components/ui";
import { theme } from "../theme/colors";
import { fonts } from "../theme/typography";
import { useAuth } from "../hook/useAuth";

export default function Auth() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onLogin = async () => {
    setError(null);
    const ok = await login(email.trim().toLowerCase(), password);
    if (!ok) setError("Incorrect email or password.");
  };

  const onRegister = async () => {
    setError(null);
    if (!email || !password || !name || !username) {
      setError("Please fill in name, username, email and password.");
      return;
    }
    const emailOk = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);
    if (!emailOk) { setError("Please enter a valid email address."); return; }
    await signup({ name, username, email: email.trim().toLowerCase(), age, country, password });
    setMode("login");
    Alert.alert("Account created", "You can now log in.");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 16 }}>
      <Header />
      <Text style={{ fontSize: 28, alignSelf: "center", marginVertical: 12, color: theme.primary, fontFamily: fonts.extrabold }}>
        {mode === "login" ? "Login" : "Sign Up"}
      </Text>

      {mode === "login" ? (
        <Card>
          <TextInput style={s.input} placeholder="Email" placeholderTextColor={theme.mutetext} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <TextInput style={s.input} placeholder="Password" placeholderTextColor={theme.mutetext} value={password} secureTextEntry onChangeText={setPassword} />
          {error ? <Text style={{ color: "#C0392B", marginBottom: 10, fontFamily: fonts.regular }}>{error}</Text> : null}
          <PrimaryButton title="Login" onPress={onLogin} />
          <View style={s.switchRow}><Text style={{ color: theme.mutetext, fontFamily: fonts.regular }}>Don't have an account?</Text><LinkText title="Sign Up" onPress={() => setMode("register")} /></View>
        </Card>
      ) : (
        <Card>
          <TextInput style={s.input} placeholder="Name" placeholderTextColor={theme.mutetext} value={name} onChangeText={setName} />
          <TextInput style={s.input} placeholder="UserName" placeholderTextColor={theme.mutetext} value={username} onChangeText={setUsername} />
          <TextInput style={s.input} placeholder="Email" placeholderTextColor={theme.mutetext} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <TextInput style={s.input} placeholder="Password" placeholderTextColor={theme.mutetext} secureTextEntry value={password} onChangeText={setPassword} />
          <TextInput style={s.input} placeholder="Age" placeholderTextColor={theme.mutetext} value={age} onChangeText={setAge} keyboardType="numeric" />
          <TextInput style={s.input} placeholder="Country" placeholderTextColor={theme.mutetext} value={country} onChangeText={setCountry} />
          {error ? <Text style={{ color: "#C0392B", marginBottom: 10, fontFamily: fonts.regular }}>{error}</Text> : null}
          <PrimaryButton title="Sign Up" onPress={onRegister} />
          <View style={s.switchRow}><Text style={{ color: theme.mutetext, fontFamily: fonts.regular }}>Already have an account?</Text><LinkText title="Login" onPress={() => setMode("login")} /></View>
        </Card>
      )}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  input: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10, color: theme.text, fontFamily: fonts.regular },
  switchRow: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 10 },
});
