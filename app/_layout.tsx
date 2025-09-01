// app/_layout.tsx
import React, { useEffect } from "react";
import { Slot, usePathname, useRouter, useSegments } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { View, Platform } from "react-native";

import { AuthProvider, useAuth } from "../hook/useAuth";
import { MenuProvider } from "../components/MenuProvider";

import * as Notifications from "expo-notifications";

/** Show alert while app is foregrounded */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/** Auth gate that protects routes and redirects */
function Gate() {
  const { user } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    ensureAndroidChannel();
  }, []);

  useEffect(() => {
    const onAuth = segments[0] === "auth" || pathname === "/auth";
    if (!user && !onAuth) router.replace("/auth");
    if (user && onAuth) router.replace("/(tabs)");
  }, [user, segments, pathname]);

  // Render children (all routes) INSIDE the provider/context
  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) return <View />;

  return (
    <AuthProvider>
      <MenuProvider>
        <Gate />
      </MenuProvider>
    </AuthProvider>
  );
}
