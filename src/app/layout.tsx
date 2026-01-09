import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

import { PROJECT_NAME, TAGLINE } from "@/lib/constants";
import "./globals.css";

const grotesk = Space_Grotesk({
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${grotesk.variable} ${mono.variable} bg-slate-950 text-white antialiased`}>
        <div className="fixed left-1/2 top-8 z-50 hidden -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.4em] text-emerald-200 md:inline-flex">
          {PROJECT_NAME}
        </div>
        {children}
      </body>
    </html>
  );
}
