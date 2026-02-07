"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { TAGLINE } from "@/lib/constants";
import { ArrowRight, Camera, Cpu, Globe, Shield, Sparkles, Zap } from "lucide-react";

const highlights = [
  { label: "30s", detail: "Average time to submit a report", accent: "text-emerald-500 dark:text-emerald-400" },
  { label: "3K+", detail: "Signals plotted across campuses", accent: "text-sky-500 dark:text-sky-400" },
  { label: "24/7", detail: "Realtime Firestore sync", accent: "text-indigo-500 dark:text-indigo-400" },
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />

      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <main className="relative pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
                <Sparkles className="h-4 w-4" />
                <span>Next-Gen Civic Infrastructure</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Clean cities need <br />
                <span className="text-gradient">instant signals.</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-muted-foreground leading-relaxed">
                {TAGLINE} Powered by <span className="text-foreground font-semibold">Gemini Vision</span> and <span className="text-foreground font-semibold">Firebase</span>.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/report"
                  className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Submit an Issue
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/50 backdrop-blur px-8 py-4 font-bold hover:bg-secondary transition-colors"
                >
                  Explore Heatmap
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                {highlights.map((item) => (
                  <div key={item.label} className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                    <div className={`text-2xl font-bold ${item.accent}`}>{item.label}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{item.detail}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative lg:block"
            >
              <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl glass p-2 group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image
                  src="https://images.unsplash.com/photo-1595273670150-db0a3d39609f?q=80&w=2600&auto=format&fit=crop"
                  alt="City Management"
                  width={800}
                  height={600}
                  className="rounded-2xl shadow-inner transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 -right-6 p-4 rounded-2xl glass border border-primary/20 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-muted-foreground uppercase">Alert</div>
                      <div className="text-sm font-bold">Hotspot Detected</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* Features Grid */}
          <section className="mt-40 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need to <span className="text-gradient">fix the city.</span></h2>
              <p className="max-w-2xl mx-auto text-muted-foreground">High-fidelity tools for citizen reporting and administrative response.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative p-8 rounded-3xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
                >
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.copy}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="mt-40">
            <div className="relative rounded-[3rem] overflow-hidden bg-primary px-8 py-16 text-center text-primary-foreground">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-30" />
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Ready to make an impact?</h2>
                <p className="text-xl text-primary-foreground/80 font-medium">
                  Launch GreenGlitch in your community today and start building a cleaner, safer tomorrow.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/report"
                    className="rounded-full bg-white px-8 py-4 font-bold text-primary hover:bg-slate-50 transition-colors shadow-2xl"
                  >
                    Get Started Now
                  </Link>
                  <Link
                    href="/dashboard"
                    className="rounded-full bg-primary-foreground/10 border border-white/20 backdrop-blur px-8 py-4 font-bold hover:bg-white/10 transition-colors"
                  >
                    View Heatmap
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-40 py-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground tracking-wide font-medium">
            <div className="flex items-center gap-2">
              <Image src="/greenglitch-logo.svg" alt="Logo" width={24} height={24} />
              <span className="text-foreground font-bold">GreenGlitch</span>
              <span>© 2026. All rights reserved.</span>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
