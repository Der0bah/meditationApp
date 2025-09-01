// app/login.tsx
import React from "react";
import { Redirect } from "expo-router";

/** Redirect legacy /login to your combined /auth screen */
export default function LoginRedirect() {
  return <Redirect href="/auth" />;
}
