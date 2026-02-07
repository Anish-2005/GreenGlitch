import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { PROJECT_NAME, TAGLINE } from "@/lib/constants";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: PROJECT_NAME,
  description: TAGLINE,
  metadataBase: new URL("https://greenglitch.dev"),
  openGraph: {
    title: PROJECT_NAME,
    description: TAGLINE,
    url: "https://greenglitch.dev",
    siteName: PROJECT_NAME,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/greenglitch-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/greenglitch-logo.svg",
    apple: "/greenglitch-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${mono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
