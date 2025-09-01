// app/index.tsx
import React from "react";
import { Redirect } from "expo-router";

/**
 * Root redirect. Your Gate in app/_layout.tsx will push unauthenticated users
 * to /auth and authenticated users to /(tabs). Pointing to /(tabs) is safe.
 */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
