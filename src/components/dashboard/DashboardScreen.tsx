"use client";

import dynamic from "next/dynamic";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { TAGLINE } from "@/lib/constants";
import { motion } from "framer-motion";
import { Globe, Shield, Activity, Radio, Database } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useRef } from "react";

const HeatmapPanel = dynamic(
  () => import("@/components/dashboard/HeatmapPanel").then((mod) => mod.HeatmapPanel),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full rounded-[2.5rem] border border-border bg-muted/20 animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-muted-foreground p-12 text-center">
          <Globe className="h-12 w-12 animate-spin-slow text-primary opacity-50" />
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.4em]">Initializing Civic Radar</p>
            <p className="text-[10px] font-bold opacity-50">SYNCING TERRAIN PROTOCOLS...</p>
          </div>
        </div>
      </div>
    ),
  },
);

export function DashboardScreen() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <ProtectedRoute>
      <div ref={containerRef} className="relative min-h-screen">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 pt-32 lg:pt-48 pb-32 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-12">
            <div className="space-y-8">
              <ScrollReveal direction="right">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md text-indigo-500 text-[10px] font-black tracking-[0.3em] uppercase">
                  <Radio className="h-3.5 w-3.5 animate-pulse" />
                  <span>Real-time Network Mesh Active</span>
                </div>
              </ScrollReveal>

              <div className="space-y-4">
                <ScrollReveal direction="right" delay={0.1}>
                  <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] italic">
                    CIVIC <span className="text-gradient">RADAR.</span>
                  </h1>
                </ScrollReveal>
                <ScrollReveal direction="right" delay={0.2}>
                  <p className="max-w-xl text-lg md:text-2xl text-muted-foreground/80 font-medium leading-relaxed tracking-tight">
                    Hyper-accurate intelligence feed mapping local friction signals across the urban lattice.
                  </p>
                </ScrollReveal>
              </div>
            </div>

            <ScrollReveal direction="left" delay={0.3}>
              <div className="flex flex-col items-end gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-16 items-center gap-4 rounded-3xl border border-white/10 glass bg-card/30 px-6 shadow-xl group hover:border-emerald-500/30 transition-all duration-500">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase leading-none">Status</span>
                      <span className="text-xs font-black tracking-widest mt-1">PROTOCOLS NOMINAL</span>
                    </div>
                  </div>
                  <div className="flex h-16 items-center gap-4 rounded-3xl border border-white/10 glass bg-card/30 px-6 shadow-xl group hover:border-sky-500/30 transition-all duration-500">
                    <Shield className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform duration-500" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase leading-none">Security</span>
                      <span className="text-xs font-black tracking-widest mt-1">AES-256 ENCRYPTED</span>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-4 opacity-70">
                  <div className="flex items-center gap-3 px-4 py-2 glass rounded-xl border border-white/5">
                    <Activity className="h-3 w-3 text-primary animate-pulse" />
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase">98.4 MHZ NOMINAL</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 glass rounded-xl border border-white/5">
                    <Database className="h-3 w-3 text-sky-500" />
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase">2,481 ACTIVE NODES</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="relative group">
              {/* Outer Architectural Halo */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-indigo-500/10 rounded-[3.2rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              <div className="relative glass rounded-[3rem] p-2 shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10">
                <div className="overflow-hidden rounded-[2.6rem] border border-white/5 bg-background/20 backdrop-blur-3xl min-h-[400px] lg:min-h-[600px]">
                  <HeatmapPanel />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </main>
      </div>
    </ProtectedRoute>
  );
}
