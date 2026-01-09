"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { HeatmapPanel } from "@/components/dashboard/HeatmapPanel";
import { TAGLINE } from "@/lib/constants";

export function DashboardScreen() {
  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
}
