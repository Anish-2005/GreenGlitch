import type { Metadata } from "next";

import { HeatmapPanel } from "@/components/dashboard/HeatmapPanel";
import { TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Heatmap Dashboard • GreenGlitch",
  description: "Monitor real-time civic cleanliness hotspots across your community.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-3 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">Civic Radar</p>
          <h1 className="text-4xl font-semibold">Realtime Heatmap Dashboard</h1>
          <p className="text-base text-slate-300">{TAGLINE}</p>
        </header>
        <HeatmapPanel />
      </div>
    </div>
  );
}
