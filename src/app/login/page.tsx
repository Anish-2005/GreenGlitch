import type { Metadata } from "next";

import { LoginScreen } from "@/components/auth/LoginScreen";

export const metadata: Metadata = {
  title: "Login • GreenGlitch",
  description: "Authenticate with Google to access the reporter and dashboard.",
};

export default function LoginPage() {
  return <LoginScreen />;
}
