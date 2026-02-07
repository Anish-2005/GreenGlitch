"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { ReportForm } from "@/components/report/ReportForm";
import { ReportHistory } from "@/components/report/ReportHistory";
import { TAGLINE } from "@/lib/constants";
import { motion } from "framer-motion";
import { Camera, ShieldCheck, Sparkles } from "lucide-react";

export function ReportScreen() {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen">
        <Navbar />

        {/* Background Accents */}
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-sky-500/10 blur-[120px] rounded-full" />

        <main className="mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">
              <Camera className="h-4 w-4" />
              <span>Instant Reporting</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Drop a civic issue <span className="text-gradient">in seconds.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
              {TAGLINE}
            </p>
          </motion.header>

          <div className="grid gap-12 lg:grid-cols-[1.3fr,0.7fr]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-[2rem] p-1 shadow-2xl overflow-hidden"
            >
              <div className="bg-background rounded-[1.8rem] p-6 md:p-8">
                <ReportForm />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div className="glass rounded-[2rem] p-8 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                    <Sparkles className="h-4 w-4" />
                    How it works
                  </div>
                  <h2 className="mt-4 text-2xl font-bold">Intelligent Capture</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Powered by <span className="text-foreground font-semibold">Gemini Vision</span>, every photo is automatically analyzed for context, severity, and precise location.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "Capture", desc: "Open the camera and focus on the issue.", icon: Camera, color: "text-emerald-500" },
                    { title: "Auto-tag", desc: "Gemini suggests category and severity.", icon: Sparkles, color: "text-sky-500" },
                    { title: "Broadcast", desc: "Instantly shared to the authorities.", icon: ShieldCheck, color: "text-indigo-500" },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50">
                      <div className={`h-10 w-10 rounded-xl bg-background flex items-center justify-center shadow-sm ${step.color}`}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{step.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-[2rem] p-8 bg-primary/5 border-primary/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Your Reports
                </h3>
                <ReportHistory />
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
