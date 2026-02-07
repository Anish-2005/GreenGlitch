"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { TAGLINE } from "@/lib/constants";
import { ScrollReveal, ParallaxSection } from "@/components/ui/ScrollReveal";
import { Hero3D } from "@/components/ui/Hero3D";
import { LiveImpactChart } from "@/components/ui/LiveImpactChart";
import { CoreEngine3D } from "@/components/ui/CoreEngine3D";
import {
  ArrowRight, Camera, Cpu, Globe, Shield, Sparkles,
  Zap, ChevronRight, BarChart3, Users, Leaf,
  MousePointer2, Fingerprint, Layers, Rocket
} from "lucide-react";
import { useRef } from "react";

const highlights = [
  { label: "30s", detail: "Fast Signal Capture", accent: "text-emerald-500", icon: Zap },
  { label: "3K+", detail: "Active Hotspots", accent: "text-sky-500", icon: Globe },
  { label: "24/7", detail: "AI Monitoring", accent: "text-indigo-500", icon: Cpu },
];

const features = [
  {
    title: "Intelligence First",
    copy: "Gemini Vision recursively analyzes metadata to ensure 99.9% report accuracy before it touches our DB.",
    icon: Sparkles,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Edge Processing",
    copy: "Cloud Functions trigger instant alerting pipelines across Telegram, Discord, and internal dashboards.",
    icon: Zap,
    color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    title: "Civic Ledger",
    copy: "Immutable record of city improvements, providing transparent progress metrics to every citizen.",
    icon: Layers,
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Quantum Security",
    copy: "Enterprise-grade Firebase rules and custom security layers protect citizen anonymity and data integrity.",
    icon: Shield,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
];

const stats = [
  { value: "0.4s", label: "Latency", icon: Rocket },
  { value: "50+", label: "Cities Live", icon: Globe },
  { value: "8M", label: "Api Calls", icon: Cpu },
  { value: "100%", label: "Open Source", icon: Fingerprint },
];

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scale = useTransform(smoothProgress, [0, 0.2], [1, 0.9]);
  const opacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const yNormal = useTransform(smoothProgress, [0, 1], [0, -200]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Dynamic Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="absolute inset-0 bg-noise opacity-[0.02] dark:opacity-[0.05]" />

        {/* Animated Ambient Glows */}
        <motion.div
          style={{ y: useTransform(smoothProgress, [0, 1], [0, 500]) }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"
        />
        <motion.div
          style={{ y: useTransform(smoothProgress, [0, 1], [0, -400]) }}
          className="absolute top-[40%] -right-[10%] w-[35%] h-[35%] bg-sky-500/10 blur-[120px] rounded-full"
        />
        <motion.div
          style={{ y: useTransform(smoothProgress, [0, 1], [0, 200]) }}
          className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-primary/5 blur-[120px] rounded-full"
        />
      </div>

      <Navbar />

      {/* 3D Background Layer */}
      <Hero3D />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[140px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div style={{ scale, opacity }} className="space-y-12">
              <ScrollReveal direction="right">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md text-primary text-xs font-black tracking-[0.2em] uppercase">
                  <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                  <span>V4 Infrastructure Now Live</span>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.1}>
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-foreground">
                  BEYOND <br />
                  <span className="text-gradient">SMART.</span> <br />
                  CIVIC.
                </h1>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.2}>
                <p className="max-w-xl text-lg md:text-2xl text-muted-foreground/80 font-medium leading-relaxed tracking-tight">
                  <span className="text-foreground">GreenGlitch</span> is the decentralized nervous system for modern cities. Powered by multimodal AI and hyperscale infrastructure.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <Link
                    href="/report"
                    className="group relative inline-flex items-center justify-center gap-4 rounded-3xl bg-primary px-8 py-4 md:px-12 md:py-6 text-lg md:text-xl font-black text-primary-foreground shadow-[0_20px_60px_rgba(var(--primary),0.4)] hover:shadow-primary/60 hover:-translate-y-1 active:translate-y-0 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative">Deploy Signal</span>
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6 relative transition-transform group-hover:translate-x-3" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center justify-center gap-4 rounded-3xl border-2 border-border bg-background/20 backdrop-blur-2xl px-8 py-4 md:px-12 md:py-6 text-lg md:text-xl font-black hover:bg-secondary hover:border-primary/30 transition-all duration-500"
                  >
                    <span>Intelligence Radar</span>
                    <Globe className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-hover:text-primary transition-colors group-hover:rotate-12" />
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.5}>
                <div className="flex items-center gap-8 pt-6">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-12 w-12 rounded-full border-4 border-background bg-secondary relative overflow-hidden">
                        <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" fill unoptimized />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-bold text-muted-foreground">
                    <span className="text-foreground">2,400+</span> citizens reporting today
                  </div>
                </div>
              </ScrollReveal>
            </motion.div>

            <ScrollReveal direction="left" delay={0.2} width="100%">
              <div className="relative perspective-1000 group">
                <ParallaxSection offset={-50}>
                  <motion.div
                    whileHover={{ rotateY: 8, rotateX: -5, scale: 1.02 }}
                    className="relative rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_60px_120px_rgba(0,0,0,0.4)] glass p-4 ring-1 ring-white/10 cursor-none"
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2670&auto=format&fit=crop"
                      alt="Neural Smart City infrastructure"
                      width={1200}
                      height={1000}
                      className="rounded-[2.5rem] shadow-inner grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
                    />

                    {/* UI Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-12 left-12 p-6 glass rounded-[2rem] border border-white/20 animate-float pointer-events-none">
                      <div className="flex items-center gap-4">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-black tracking-widest text-white uppercase">Live Telemetry</span>
                      </div>
                    </div>

                    <div className="absolute bottom-12 right-12 p-8 glass rounded-[2.5rem] border border-white/20 pointer-events-none max-w-[240px]">
                      <div className="space-y-4">
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            animate={{ width: ["20%", "80%", "50%"] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="h-full bg-primary"
                          />
                        </div>
                        <p className="text-xs font-bold text-white/70 uppercase leading-relaxed">System Health: Optimal Efficiency 99.4%</p>
                      </div>
                    </div>
                  </motion.div>
                </ParallaxSection>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50"
        >
          <div className="w-[2px] h-12 bg-gradient-to-b from-primary to-transparent" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">SCROLL</span>
        </motion.div>
      </section>

      {/* Stats Board */}
      <section className="relative py-20 lg:py-32 bg-secondary/20 border-y border-border/50 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-24">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1} direction="up">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative space-y-4">
                    <div className="flex justify-center md:justify-start">
                      <div className="p-3 md:p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:rotate-12 transition-transform">
                        <stat.icon className="h-6 w-6 md:h-8 md:w-8" />
                      </div>
                    </div>
                    <div className="text-4xl md:text-6xl font-black tracking-tighter text-center md:text-left">{stat.value}</div>
                    <div className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.2em] text-center md:text-left">{stat.label}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Capabilities & 3D Visualization */}
      <section className="py-32 lg:py-60 bg-background relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center mb-24 lg:mb-48 text-center lg:text-left">
            <div className="order-2 lg:order-1 flex justify-center">
              <ScrollReveal direction="right">
                <CoreEngine3D />
              </ScrollReveal>
            </div>

            <div className="order-1 lg:order-2 space-y-8 lg:space-y-12">
              <ScrollReveal direction="left">
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] italic">
                  THE CORE <br />
                  <span className="text-gradient">ENGINE.</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="left" delay={0.2}>
                <p className="text-lg md:text-2xl text-muted-foreground/80 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Our neural infrastructure balances local processing with global consensus. Every node in the GreenGlitch network contributes to a real-time, self-healing urban nervous system.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={0.3}>
                <LiveImpactChart />
              </ScrollReveal>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <ScrollReveal
                key={feature.title}
                direction="up"
                delay={idx * 0.1}
              >
                <div className="group relative p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] border border-border bg-card/30 hover:bg-card transition-all duration-500 overflow-hidden h-full">
                  <div className={`h-10 w-10 md:h-12 md:w-12 rounded-2xl flex items-center justify-center mb-6 md:mb-8 ${feature.color}`}>
                    <feature.icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4">{feature.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-medium">{feature.copy}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      {/* Super CTA */}
      <section className="py-20 lg:py-40 px-4">
        <ScrollReveal direction="up">
          <div className="mx-auto max-w-7xl relative rounded-[2rem] md:rounded-[5rem] overflow-hidden bg-foreground px-6 py-20 md:px-8 md:py-32 text-center text-background shadow-2xl">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-primary/20 rounded-full blur-[100px] md:blur-[160px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 max-w-5xl mx-auto space-y-12 md:space-y-16">
              <ScrollReveal direction="up">
                <h2 className="text-4xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                  READY TO <br />
                  LAUNCH <span className="text-primary italic">THE FUTURE?</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.2}>
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center">
                  <Link
                    href="/report"
                    className="w-full md:w-auto rounded-3xl bg-primary px-10 py-5 md:px-16 md:py-8 text-lg md:text-2xl font-black text-primary-foreground hover:scale-110 hover:-rotate-2 transition-all duration-500 shadow-2xl shadow-primary/40"
                  >
                    DEPLOY NOW
                  </Link>
                  <Link
                    href="/dashboard"
                    className="w-full md:w-auto rounded-3xl border-2 border-background/20 backdrop-blur-3xl px-10 py-5 md:px-16 md:py-8 text-lg md:text-2xl font-black hover:bg-white/10 transition-all duration-500"
                  >
                    SYSTEM OVERVIEW
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Ultra Footer */}
      <footer className="relative pt-32 lg:pt-60 pb-20 bg-background border-t border-border overflow-hidden">
        {/* Animated Background Highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24 mb-24 lg:mb-32">
            <ScrollReveal direction="right" width="fit-content">
              <div className="max-w-md space-y-8 lg:space-y-12 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="h-16 w-16 md:h-20 md:w-20 relative p-4 rounded-3xl bg-secondary/50 border border-border glass group hover:scale-105 transition-transform duration-500 mx-auto lg:mx-0">
                    <Image
                      src="/greenglitch-logo.svg"
                      alt="Logo"
                      fill
                      className="object-contain p-2 dark:invert-0 invert"
                    />
                  </div>
                  <div>
                    <span className="text-3xl md:text-5xl font-black tracking-tighter block leading-none text-foreground">Green<br /><span className="text-primary italic">Glitch.</span></span>
                  </div>
                </div>
                <p className="text-lg md:text-2xl font-medium text-muted-foreground leading-relaxed italic pr-0 lg:pr-8">
                  Engineering the next generation of decentralized civic infrastructure with sub-millisecond precision.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-20">
              {['Nexus', 'Company', 'Social'].map((group, groupIdx) => (
                <ScrollReveal key={group} direction="up" delay={groupIdx * 0.1}>
                  <div className="space-y-6 lg:space-y-10">
                    <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary">{group}</h4>
                    <ul className="space-y-4 lg:space-y-6">
                      {['Network', 'Fleet', 'Uptime'].map((link, i) => (
                        <li key={link}>
                          <Link
                            href="#"
                            className="group flex items-center gap-2 text-lg lg:text-xl font-bold text-muted-foreground hover:text-foreground transition-all duration-300"
                          >
                            <span className="h-[2px] w-0 bg-primary group-hover:w-4 transition-all duration-300" />
                            {link}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="pt-12 md:pt-16 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 text-[9px] md:text-[10px] font-black tracking-[0.4em] text-muted-foreground uppercase text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p>© MMXXV GreenGlitch Systems. All Protocols Operational.</p>
              </div>
              <div className="flex gap-8 md:gap-16">
                {['TW', 'GH', 'DS'].map((social) => (
                  <Link
                    key={social}
                    href="#"
                    className="hover:text-primary hover:scale-110 transition-all duration-300"
                  >
                    {social}
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </footer>
    </div >
  );
}
