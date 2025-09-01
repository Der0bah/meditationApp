// app/auth/index.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../hook/useAuth";
import { theme } from "../../theme/colors";
import { fonts } from "../../theme/typography";

export default function Auth() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: "login" | "signup" }>();
  const { login, signup } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup");

  // login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // signup
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (tab === "login" || tab === "signup") setActiveTab(tab);
  }, [tab]);

  const onLogin = async () => {
    if (!loginEmail || !loginPassword) {
      return Alert.alert("Missing info", "Please enter email and password.");
    }
    const ok = await login(loginEmail.trim(), loginPassword);
    if (!ok) return Alert.alert("Login failed", "Incorrect email or password.");
    router.replace("/(tabs)");
  };

  const onSignup = async () => {
    if (!name || !username || !email || !password) {
      return Alert.alert("Missing info", "Please fill in all fields.");
    }
    await signup({
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
    });
    Alert.alert("Success", "Account created. You can now log in.");
    setActiveTab("login");
    setLoginEmail(email.trim());
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {/* Tabs */}
      <View style={s.tabs}>
        <Pressable onPress={() => setActiveTab("login")} style={[s.tab, activeTab === "login" && s.active]}>
          <Text style={[s.tabText, activeTab === "login" && s.activeText]}>Login</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab("signup")} style={[s.tab, activeTab === "signup" && s.active]}>
          <Text style={[s.tabText, activeTab === "signup" && s.activeText]}>Sign Up</Text>
        </Pressable>
      </View>

      {activeTab === "login" ? (
        <View style={{ marginTop: 12 }}>
          <Text style={s.label}>Email</Text>
          <TextInput style={s.input} value={loginEmail} onChangeText={setLoginEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" placeholderTextColor={theme.mutetext} />
          <Text style={s.label}>Password</Text>
          <TextInput style={s.input} value={loginPassword} onChangeText={setLoginPassword} secureTextEntry placeholder="••••••••" placeholderTextColor={theme.mutetext} />
          <Pressable onPress={onLogin} style={s.primary}>
            <Text style={s.primaryText}>Login</Text>
          </Pressable>
          <Pressable onPress={() => setActiveTab("signup")} style={{ marginTop: 12 }}>
            <Text style={s.link}>Don’t have an account? Sign Up</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ marginTop: 12 }}>
          <Text style={s.label}>Name</Text>
          <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Your full name" placeholderTextColor={theme.mutetext} />
          <Text style={s.label}>Username</Text>
          <TextInput style={s.input} value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="username" placeholderTextColor={theme.mutetext} />
          <Text style={s.label}>Email</Text>
          <TextInput style={s.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" placeholderTextColor={theme.mutetext} />
          <Text style={s.label}>Password</Text>
          <TextInput style={s.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Create a password" placeholderTextColor={theme.mutetext} />
          <Pressable onPress={onSignup} style={s.primary}>
            <Text style={s.primaryText}>Register</Text>
          </Pressable>
          <Pressable onPress={() => setActiveTab("login")} style={{ marginTop: 12 }}>
            <Text style={s.link}>Already have an account? Log In</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  tabs: { flexDirection: "row", gap: 8 },
  tab: {
    flex: 1,
    backgroundColor: "#EEEAF7",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  active: { backgroundColor: theme.primary },
  tabText: { color: theme.primary, fontFamily: fonts.bold },
  activeText: { color: "#fff", fontFamily: fonts.bold },

  label: { color: theme.text, marginTop: 12, marginBottom: 6, fontFamily: fonts.bold },
  input: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: theme.text,
    fontFamily: fonts.regular,
  },
  primary: {
    marginTop: 16,
    backgroundColor: theme.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontFamily: fonts.extrabold, fontSize: 16 },
  link: { color: theme.primary, textAlign: "center", fontFamily: fonts.bold },
});
