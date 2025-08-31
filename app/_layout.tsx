// app/_layout.tsx
import React, { useEffect } from "react";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../hook/useAuth";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { View } from "react-native";
import { MenuProvider } from "../components/MenuProvider";

function Gate() {
  const { user } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // If not logged in and not already on /auth → go to /auth
    const onAuth = segments[0] === "auth" || pathname === "/auth";
    if (!user && !onAuth) {
      router.replace("/auth");
    }
    // If logged in and on /auth → go to tabs
    if (user && onAuth) {
      router.replace("/(tabs)");
    }
  }, [user, segments, pathname]);

  return <Stack screenOptions={{ headerShown: false }} />;
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
