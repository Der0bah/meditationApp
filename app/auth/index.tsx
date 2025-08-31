// app/auth/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hook/useAuth";
import { theme } from "../../theme/colors";
import { fonts } from "../../theme/typography";
import { Country, fetchCountriesDetailed } from "../../lib/api";

type Tab = "login" | "signup";

export default function AuthScreen() {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<Tab>("signup"); // open signup by default for testing

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign Up fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState<Country | null>(null);
  const [password, setPassword] = useState("");

  // Countries state
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchCountriesDetailed();
        setCountries(list);
      } catch (e: any) {
        setCountriesError(e?.message || "Failed to fetch countries");
      } finally {
        setLoadingCountries(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => {
      const inName = c.name.toLowerCase().includes(q);
      const inCapital = (c.capital || "").toLowerCase().includes(q);
      return inName || inCapital;
    });
  }, [query, countries]);

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
      return Alert.alert("Missing info", "Please fill in all required fields.");
    }
    if (!country) {
      return Alert.alert("Country required", "Please select your country.");
    }
    try {
      await signup({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        age: age.trim(),
        country: country.name, // store the name; expand if you want
        password,
      });
      Alert.alert("Success", "Account created. You can now log in.");
      setTab("login");
      setLoginEmail(email.trim());
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not create account.");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Tabs */}
      <View style={s.tabs}>
        <Pressable onPress={() => setTab("login")} style={[s.tab, tab === "login" && s.tabActive]}>
          <Text style={[s.tabText, tab === "login" && s.tabTextActive]}>Login</Text>
        </Pressable>
        <Pressable onPress={() => setTab("signup")} style={[s.tab, tab === "signup" && s.tabActive]}>
          <Text style={[s.tabText, tab === "signup" && s.tabTextActive]}>Sign Up</Text>
        </Pressable>
      </View>

      {tab === "login" ? (
        <View style={{ marginTop: 12 }}>
          <Text style={s.label}>Email</Text>
          <TextInput
            value={loginEmail}
            onChangeText={setLoginEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor={theme.mutetext}
            style={s.input}
          />

          <Text style={s.label}>Password</Text>
          <TextInput
            value={loginPassword}
            onChangeText={setLoginPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={theme.mutetext}
            style={s.input}
          />

          <Pressable onPress={onLogin} style={s.primaryBtn}>
            <Text style={s.primaryBtnText}>Login</Text>
          </Pressable>

          <Pressable onPress={() => setTab("signup")} style={{ marginTop: 12 }}>
            <Text style={{ color: theme.primary, textAlign: "center", fontFamily: fonts.bold }}>
              Don’t have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ marginTop: 12 }}>
          <Text style={s.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
            placeholderTextColor={theme.mutetext}
            style={s.input}
          />

          <Text style={s.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder="username"
            placeholderTextColor={theme.mutetext}
            style={s.input}
          />

          <Text style={s.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor={theme.mutetext}
            style={s.input}
          />

          <Text style={s.label}>Age</Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            placeholder="e.g. 25"
            placeholderTextColor={theme.mutetext}
            style={s.input}
          />

          {/* Country dropdown (detailed) */}
          <Text style={s.label}>Country</Text>

          {loadingCountries ? (
            <View style={{ marginTop: 6, alignItems: "center" }}>
              <ActivityIndicator />
              <Text style={s.helper}>Loading countries…</Text>
            </View>
          ) : countriesError ? (
            <>
              <Text style={[s.helper, { color: "red" }]}>{countriesError}</Text>
              <Pressable
                onPress={async () => {
                  setCountriesError(null);
                  setLoadingCountries(true);
                  try {
                    setCountries(await fetchCountriesDetailed());
                  } catch (e: any) {
                    setCountriesError(e?.message || "Failed to fetch countries");
                  } finally {
                    setLoadingCountries(false);
                  }
                }}
                style={[s.secondaryBtn, { marginTop: 6 }]}
              >
                <Text style={s.secondaryBtnText}>Retry</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={() => setPickerOpen(true)} style={[s.input, { justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 8 }]}>
                {!!country?.flagPng && (
                  <Image source={{ uri: country.flagPng }} style={{ width: 20, height: 14, borderRadius: 2 }} />
                )}
                <Text style={{ color: country ? theme.text : theme.mutetext, fontFamily: fonts.regular }}>
                  {country ? `${country.name}${country.capital ? ` — ${country.capital}` : ""}` : "Select your country"}
                </Text>
              </Pressable>

              {/* Modal dropdown with search + details */}
              <Modal visible={pickerOpen} animationType="slide" onRequestClose={() => setPickerOpen(false)}>
                <View style={s.modalHeader}>
                  <Text style={s.modalTitle}>Choose a country</Text>
                  <Pressable onPress={() => setPickerOpen(false)} hitSlop={8}>
                    <Text style={s.close}>✕</Text>
                  </Pressable>
                </View>

                <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                  <TextInput
                    placeholder="Search by name or capital…"
                    placeholderTextColor={theme.mutetext}
                    value={query}
                    onChangeText={setQuery}
                    style={s.search}
                  />
                  <Text style={s.helper}>Loaded {countries.length} countries</Text>
                </View>

                <FlatList
                  data={filtered}
                  keyExtractor={(item) => item.cca2 ?? item.name}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        setCountry(item);
                        setPickerOpen(false);
                      }}
                      style={s.row}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                        {!!item.flagPng && (
                          <Image source={{ uri: item.flagPng }} style={{ width: 28, height: 20, borderRadius: 3 }} />
                        )}
                        <View style={{ flex: 1 }}>
                          <Text style={s.rowTitle}>{item.name}</Text>
                          <Text style={s.rowSub}>
                            {item.capital ? `Capital: ${item.capital}` : "Capital: —"} ·{" "}
                            {typeof item.population === "number"
                              ? `Pop: ${item.population.toLocaleString()}`
                              : "Pop: —"}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  )}
                  ItemSeparatorComponent={() => <View style={s.sep} />}
                />
              </Modal>
            </>
          )}

          <Text style={s.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Create a password"
            placeholderTextColor={theme.mutetext}
            style={s.input}
          />

          <Pressable onPress={onSignup} style={s.primaryBtn}>
            <Text style={s.primaryBtnText}>Register</Text>
          </Pressable>

          <Pressable onPress={() => setTab("login")} style={{ marginTop: 12 }}>
            <Text style={{ color: theme.primary, textAlign: "center", fontFamily: fonts.bold }}>
              Already have an account? Log In
            </Text>
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
  tabActive: { backgroundColor: theme.primary },
  tabText: { color: theme.primary, fontFamily: fonts.bold },
  tabTextActive: { color: "#fff", fontFamily: fonts.bold },

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
  helper: { color: theme.mutetext, textAlign: "center", marginTop: 8, fontFamily: fonts.regular },

  primaryBtn: {
    marginTop: 16,
    backgroundColor: theme.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontFamily: fonts.extrabold, fontSize: 16 },

  secondaryBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryBtnText: { color: theme.text, fontFamily: fonts.bold },

  // Modal
  modalHeader: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: theme.border,
    borderBottomWidth: 1,
    backgroundColor: "#fff",
  },
  modalTitle: { fontFamily: fonts.extrabold, color: theme.primary, fontSize: 18 },
  close: { fontSize: 18, color: theme.text, fontFamily: fonts.bold },

  search: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: theme.text,
    fontFamily: fonts.regular,
  },

  row: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: "#fff" },
  rowTitle: { color: theme.text, fontFamily: fonts.bold, fontSize: 16 },
  rowSub: { color: theme.mutetext, fontFamily: fonts.regular, marginTop: 2, fontSize: 12 },
  sep: { height: 1, backgroundColor: theme.border },
});
