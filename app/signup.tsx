// app/signup.tsx
import React from "react";
import { Redirect } from "expo-router";

/** Redirect legacy /signup to your combined /auth screen */
export default function SignupRedirect() {
  return <Redirect href="/auth" />;
}
