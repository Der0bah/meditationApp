// app/_layout.tsx
import React from "react";
import { Slot, usePathname, useRouter, useSegments } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { View } from "react-native";

import { AuthProvider, useAuth } from "../hook/useAuth";
import { MenuProvider } from "../components/MenuProvider";
// We keep a no-op init for compatibility; it does nothing on web/native.
import { initNotificationHandler } from "../lib/notifications";

function Gate() {
  const { user } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    initNotificationHandler(); // no-op; safe to leave
  }, []);

  React.useEffect(() => {
    const onAuth = segments[0] === "auth" || pathname === "/auth";
    if (!user && !onAuth) router.replace("/auth");
    if (user && onAuth) router.replace("/(tabs)");
  }, [user, segments, pathname]);

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
