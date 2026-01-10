"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { TAGLINE } from "@/lib/constants";

const HeatmapPanel = dynamic(
  () => import("@/components/dashboard/HeatmapPanel").then((mod) => mod.HeatmapPanel),
  {
    ssr: false,
    loading: () => (
      <div className="h-[480px] w-full rounded-3xl border border-white/10 bg-slate-900/60" aria-label="Loading heatmap" />
    ),
  },
);

export function DashboardScreen() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <header className="space-y-3 text-center lg:text-left">
            
            <div className="mx-auto flex w-fit items-center gap-3  text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200 lg:mx-0">
              <Image src="/greenglitch-logo.svg" alt="GreenGlitch logo" width={32} height={32} className="h-8 w-8 rounded-full" />
              <span>GreenGlitch</span>
            </div>
            <p className="text-base text-slate-300">{TAGLINE}</p>
          </header>
          <HeatmapPanel />
        </div>
      </div>
    </ProtectedRoute>
  );
}
