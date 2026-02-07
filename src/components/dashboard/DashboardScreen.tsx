"use client";

import dynamic from "next/dynamic";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { TAGLINE } from "@/lib/constants";
import { motion } from "framer-motion";
import { Globe, Shield } from "lucide-react";

const HeatmapPanel = dynamic(
  () => import("@/components/dashboard/HeatmapPanel").then((mod) => mod.HeatmapPanel),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full rounded-3xl border border-border bg-muted/20 animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Globe className="h-8 w-8 animate-spin-slow" />
          <p className="text-sm font-medium">Initializing Civic Radar...</p>
        </div>
      </div>
    ),
  },
);

export function DashboardScreen() {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase">
                <Globe className="h-4 w-4" />
                <span>Live Heatmap</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Civic <span className="text-gradient">Radar.</span>
              </h1>
              <p className="max-w-xl text-muted-foreground">
                {TAGLINE} Real-time insights into city health and hotspot signals.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 items-center gap-3 rounded-2xl border border-border bg-card px-4 shadow-sm">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-bold tracking-wide">SYSTEM ACTIVE</span>
              </div>
              <div className="flex h-12 items-center gap-3 rounded-2xl border border-border bg-card px-4 shadow-sm">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold tracking-wide">SECURE FEED</span>
              </div>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-[2rem] p-4 shadow-2xl"
          >
            <div className="overflow-hidden rounded-[1.6rem] border border-border">
              <HeatmapPanel />
            </div>
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
