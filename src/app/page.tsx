"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { TAGLINE } from "@/lib/constants";
import { ScrollReveal, ParallaxSection, FadeIn } from "@/components/ui/ScrollReveal";
import { ArrowRight, Camera, Cpu, Globe, Shield, Sparkles, Zap, ChevronRight, BarChart3, Users, Leaf } from "lucide-react";

const highlights = [
  { label: "30s", detail: "Fast Signal Capture", accent: "text-emerald-500", icon: Zap },
  { label: "3K+", detail: "Active Hotspots", accent: "text-sky-500", icon: Globe },
  { label: "24/7", detail: "AI Monitoring", accent: "text-indigo-500", icon: Cpu },
];

const features = [
  {
    title: "One-tap capture",
    copy: "Camera-first UX with automatic geolocation so citizens can report while walking.",
    icon: Camera,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Gemini auto-tagging",
    copy: "Google's multimodal engine labels the category, severity, and summary instantly.",
    icon: Cpu,
    color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    title: "Live civic radar",
    copy: "Authorities get a heatmap of hotspots with severity-weighted pinpoints.",
    icon: Globe,
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Secure Firebase core",
    copy: "Firestore + Storage keep every upload traceable without exposing raw infra.",
    icon: Shield,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
];

const stats = [
  { value: "98%", label: "Accuracy", icon: Sparkles },
  { value: "45min", label: "Response Time", icon: Zap },
  { value: "12k", label: "Users Joined", icon: Users },
  { value: "1.2t", label: "Waste Reduced", icon: Leaf },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-emerald-500/30 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div style={{ scale, opacity }} className="space-y-10">
              <ScrollReveal direction="right">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span>The Future of Civic Action</span>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.1}>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
                  CLEANER <br />
                  <span className="text-gradient">CITIES.</span> <br />
                  FASTER.
                </h1>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.2}>
                <p className="max-w-xl text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
                  {TAGLINE} Transform your city into a living digital ecosystem.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link
                    href="/report"
                    className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-10 py-5 text-lg font-bold text-primary-foreground shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    Start Reporting
                    <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-border bg-background/50 backdrop-blur-xl px-10 py-5 text-lg font-bold hover:bg-secondary hover:border-primary/50 transition-all duration-300"
                  >
                    View Radar
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.4}>
                <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border/50">
                  {highlights.map((item) => (
                    <div key={item.label} className="space-y-2 group">
                      <item.icon className={`h-6 w-6 ${item.accent} transition-transform group-hover:scale-125`} />
                      <div className="text-3xl font-black">{item.label}</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </motion.div>

            <ScrollReveal direction="left" delay={0.2} width="100%">
              <div className="relative perspective-1000">
                <ParallaxSection offset={-30}>
                  <motion.div
                    whileHover={{ rotateY: 5, rotateX: -5 }}
                    className="relative rounded-[2.5rem] overflow-hidden border border-white/20 shadow-[0_40px_100px_rgba(0,0,0,0.3)] glass p-3 ring-1 ring-white/10"
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2670&auto=format&fit=crop"
                      alt="Smart City Technology"
                      width={1000}
                      height={800}
                      className="rounded-[2rem] shadow-inner"
                    />

                    {/* Floating Interaction Cards */}
                    <div className="absolute top-1/4 -right-10 pointer-events-none">
                      <ScrollReveal direction="left" delay={0.6}>
                        <div className="glass p-5 rounded-3xl border border-primary/20 shadow-2xl flex items-center gap-4 animate-float">
                          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <Zap className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-muted-foreground uppercase">Real-time</div>
                            <div className="text-base font-black">AI Signal Live</div>
                          </div>
                        </div>
                      </ScrollReveal>
                    </div>

                    <div className="absolute -bottom-10 -left-10 pointer-events-none">
                      <ScrollReveal direction="up" delay={0.8}>
                        <div className="glass p-5 rounded-3xl border border-sky-500/20 shadow-2xl flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-500">
                            <BarChart3 className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-muted-foreground uppercase">Analytics</div>
                            <div className="text-base font-black">+142% Effort</div>
                          </div>
                        </div>
                      </ScrollReveal>
                    </div>
                  </motion.div>
                </ParallaxSection>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Section with Fade In */}
      <section className="py-20 bg-secondary/30 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1} direction="up">
                <div className="space-y-2">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                      <stat.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="text-5xl font-black tracking-tight">{stat.value}</div>
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Features Grid */}
      <section className="py-40 bg-background relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-24">
            <ScrollReveal direction="right">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tighter">
                Built for the <span className="text-gradient">next generation</span> of city dwellers.
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <p className="text-xl text-muted-foreground">
                High-fidelity tools engineered for instant impact and long-term sustainability.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <ScrollReveal
                key={feature.title}
                direction="up"
                delay={idx * 0.1}
              >
                <div className="group h-full p-10 rounded-[2.5rem] border border-border bg-card hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-primary/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <feature.icon className="h-24 w-24" />
                  </div>
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:rotate-6 ${feature.color}`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{feature.copy}</p>

                  <div className="mt-8 flex items-center gap-2 text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    Learn More <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Visual CTA Section */}
      <section className="py-20 px-4">
        <ScrollReveal direction="up">
          <div className="mx-auto max-w-7xl relative rounded-[3.5rem] overflow-hidden bg-primary px-8 py-24 text-center text-primary-foreground shadow-[0_50px_100px_rgba(var(--primary),0.3)]">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20" />

            <div className="relative z-10 max-w-4xl mx-auto space-y-12">
              <ScrollReveal direction="up">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                  READY TO <br />FIX YOUR CITY?
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.2}>
                <p className="text-2xl text-primary-foreground/90 font-semibold max-w-2xl mx-auto">
                  Join thousands of citizens making real-time impacts every single day.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                  <Link
                    href="/report"
                    className="group rounded-2xl bg-white px-12 py-6 text-xl font-black text-primary hover:bg-slate-50 transition-all hover:scale-105 shadow-2xl"
                  >
                    Deploy GreenGlitch
                  </Link>
                  <Link
                    href="/dashboard"
                    className="rounded-2xl bg-black/20 border border-white/30 backdrop-blur-xl px-12 py-6 text-xl font-black hover:bg-black/30 transition-all"
                  >
                    View Active Map
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Advanced Footer */}
      <footer className="py-24 border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 relative">
                  <Image src="/greenglitch-logo.svg" alt="Logo" fill className="object-contain" />
                </div>
                <span className="text-2xl font-black tracking-tighter">GreenGlitch</span>
              </div>
              <p className="text-muted-foreground font-medium">
                Pioneering the intersection of artificial intelligence and civic duty to create cleaner, smarter urban environments.
              </p>
            </div>

            {['Product', 'Company', 'Legal'].map((group) => (
              <div key={group} className="space-y-8">
                <h4 className="text-sm font-black uppercase tracking-widest">{group}</h4>
                <ul className="space-y-4 font-bold text-muted-foreground">
                  <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">API Keys</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Success Stories</Link></li>
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-border flex flex-col md:row justify-between items-center gap-8 text-sm font-bold text-muted-foreground">
            <p>© 2026 GreenGlitch Systems. Engineered with passion.</p>
            <div className="flex gap-12">
              <Link href="#" className="hover:text-foreground transition-all">Twitter</Link>
              <Link href="#" className="hover:text-foreground transition-all">GitHub</Link>
              <Link href="#" className="hover:text-foreground transition-all">Discord</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
