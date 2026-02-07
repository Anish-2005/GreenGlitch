"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { ReportForm } from "@/components/report/ReportForm";
import { ReportHistory } from "@/components/report/ReportHistory";
import { TAGLINE } from "@/lib/constants";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Camera, ShieldCheck, Sparkles, Send, MapPin, Zap } from "lucide-react";
import { ScrollReveal, ParallaxSection } from "@/components/ui/ScrollReveal";
import { useRef } from "react";

export function ReportScreen() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <ProtectedRoute>
      <div ref={containerRef} className="relative min-h-screen">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 pt-32 lg:pt-48 pb-32 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-24 space-y-8">
            <ScrollReveal direction="up">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md text-emerald-500 text-[10px] font-black tracking-[0.2em] uppercase">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Encrypted Feedback Channel Operational</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] text-foreground italic">
                DROP A SIGNAL. <br />
                <span className="text-gradient">IN SECONDS.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <p className="max-w-2xl mx-auto text-lg md:text-2xl text-muted-foreground/80 font-medium leading-relaxed tracking-tight">
                Instantly capture civic friction. Our AI-powered infrastructure handles tagging, geolocation, and priority routing in sub-millisecond cycles.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid gap-12 lg:gap-24 lg:grid-cols-[1fr,0.6fr] items-start">
            {/* Main Form Container */}
            <ScrollReveal direction="up" delay={0.3}>
              <div className="relative group">
                {/* Architectural Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-sky-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="relative glass rounded-[3rem] p-1 shadow-2xl overflow-hidden border border-white/10 dark:border-white/5">
                  <div className="bg-background/80 dark:bg-background/40 backdrop-blur-3xl rounded-[2.9rem] p-6 md:p-12">
                    <ReportForm />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Sidebar Info */}
            <div className="space-y-12">
              <ScrollReveal direction="up" delay={0.4}>
                <div className="glass rounded-[3rem] p-10 border border-white/10 dark:border-white/5 space-y-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                  <div>
                    <div className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6">
                      <Sparkles className="h-4 w-4" />
                      Protocol Guide
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter italic">INTELLIGENT <br />CAPTURE.</h2>
                    <p className="mt-4 text-muted-foreground font-medium leading-relaxed">
                      Powered by <span className="text-foreground">Vision Intelligence</span>, every signal is parsed for context and precise urban coordinates.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: "CAPTURE", desc: "Focus on the friction point.", icon: Camera, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                      { title: "AUTO-TAG", desc: "Neural parsing determines severity.", icon: Zap, color: "text-sky-500", bg: "bg-sky-500/10" },
                      { title: "BROADCAST", desc: "Immediate routing to civic nodes.", icon: Send, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                    ].map((step, i) => (
                      <div key={i} className="group/item flex gap-5 p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all duration-300">
                        <div className={`h-12 w-12 rounded-xl ${step.bg} flex items-center justify-center shadow-sm ${step.color} group-hover/item:scale-110 group-hover/item:rotate-12 transition-transform duration-500`}>
                          <step.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-black text-xs tracking-widest uppercase">{step.title}</div>
                          <div className="text-xs text-muted-foreground mt-1 font-medium italic">{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.5}>
                <div className="glass rounded-[3rem] p-10 bg-primary/5 border border-primary/10 space-y-8">
                  <h3 className="text-xs font-black tracking-[0.3em] uppercase flex items-center gap-3 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                    DEACTIVE SIGNALS
                  </h3>
                  <div className="min-h-[200px]">
                    <ReportHistory />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </main>

        {/* Floating Architectural Indicators */}
        <div className="fixed bottom-12 right-12 z-50 hidden xl:flex flex-col gap-4 items-end">
          <div className="px-5 py-2.5 rounded-2xl glass border border-white/10 text-[10px] font-black tracking-widest uppercase flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Live Telemetry: Operational
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
