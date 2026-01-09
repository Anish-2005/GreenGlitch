"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ReportForm } from "@/components/report/ReportForm";
import { TAGLINE } from "@/lib/constants";

export function ReportScreen() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-20">
          <header className="space-y-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">Click &amp; Report</p>
            <h1 className="text-5xl font-semibold leading-tight">Drop a civic issue in seconds.</h1>
            <p className="text-lg text-slate-300">{TAGLINE}</p>
          </header>

          <section className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-2 backdrop-blur">
              <div className="rounded-[26px] border border-white/10 bg-white/90 p-1 text-slate-900 shadow-2xl shadow-emerald-500/10">
                <ReportForm />
              </div>
            </div>
            <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">How it works</p>
                <h2 className="mt-2 text-2xl font-semibold">Camera → Gemini Vision → Firebase</h2>
                <p className="mt-3 text-sm text-slate-300">
                  Snap a photo, let Gemini&apos;s Vision model auto-tag the severity, and we instantly drop the details into Firestore for authorities.
                </p>
              </div>
              <ul className="space-y-4 text-sm text-slate-200">
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="font-semibold text-white">1. Capture</span>
                  <p className="text-slate-300">Open the camera-first input and focus directly on the civic issue.</p>
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="font-semibold text-white">2. Auto-tag</span>
                  <p className="text-slate-300">Gemini Vision suggests category, severity, and a one-line summary.</p>
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="font-semibold text-white">3. Publish</span>
                  <p className="text-slate-300">Uploads photo metadata to Firestore and broadcasts it to the heatmap.</p>
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
