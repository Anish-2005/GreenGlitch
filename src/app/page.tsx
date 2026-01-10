import Image from "next/image";
import Link from "next/link";

import { TAGLINE } from "@/lib/constants";

const highlights = [
  { label: "30s", detail: "Average time to submit a report", accent: "text-emerald-300" },
  { label: "3K+", detail: "Signals plotted across campuses", accent: "text-rose-300" },
  { label: "24/7", detail: "Realtime Firestore + heatmap sync", accent: "text-sky-300" },
];

const features = [
  {
    title: "One-tap capture",
    copy: "Camera-first UX with automatic geolocation so citizens can report while walking.",
  },
  {
    title: "Gemini auto-tagging",
    copy: "Google's multimodal engine labels the category, severity, and summary instantly.",
  },
  {
    title: "Live civic radar",
    copy: "Authorities get a heatmap of hotspots with severity-weighted pinpoints.",
  },
  {
    title: "Secure Firebase core",
    copy: "Firestore + Storage keep every upload traceable without exposing raw infra.",
  },
];

const testimonials = [
  {
    quote: "GreenGlitch helped us respond to litter pileups before students even filed formal tickets.",
    name: "Facilities Ops, SRM University",
  },
  {
    quote: "The dashboard heatmap is basically our morning stand-up.",
    name: "Municipal Cleanliness Taskforce",
  },
];

const steps = [
  "Snap a photo and lock coordinates automatically.",
  "Gemini Vision suggests the issue and severity in structured JSON.",
  "Firestore pushes the alert to the live heatmap + mobile history feed.",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16 sm:px-6 sm:py-20">
        <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6 text-balance">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-emerald-200">
              <Image src="/greenglitch-logo.svg" alt="GreenGlitch logo" width={36} height={36} className="h-9 w-9 rounded-full" />
              <span>Clean cities need instant signals</span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Civic maintenance alerts powered by Gemini + Firebase.</h1>
            <p className="text-base text-slate-300 sm:text-lg">{TAGLINE}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/report" className="w-full rounded-full bg-emerald-400 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide text-slate-950 transition hover:bg-emerald-300 sm:w-auto">
                Submit an issue
              </Link>
              <Link href="/dashboard" className="w-full rounded-full border border-white/25 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white/60 sm:w-auto">
                Explore heatmap
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {highlights.map((item) => (
                <div key={item.label} className="min-w-[120px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className={`text-2xl font-semibold ${item.accent}`}>{item.label}</p>
                  <p className="text-sm text-slate-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Live snapshot</p>
              <h2 className="mt-3 text-2xl font-semibold">Gemini Vision + Firestore</h2>
              <p className="mt-3 text-sm text-slate-200">
                Every photo is auto-tagged, stored securely, and plotted onto the city radar in under a second.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Captured</p>
                  <p className="mt-1 font-semibold text-white">Overflowing bins</p>
                  <p className="text-xs text-slate-400">High severity • 13.052° N</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-200">Broadcast</p>
                  <p className="mt-1 font-semibold text-white">Map + push alert</p>
                  <p className="text-xs text-slate-400">Ops team notified</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-slate-300">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">Integrates with</p>
              <p className="mt-3 text-lg font-semibold text-white">Gemini • Firebase • Leaflet • Vercel Edge</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur sm:grid-cols-2 sm:p-8">
          {features.map((feature) => (
            <div key={feature.title} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Feature</p>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-slate-300">{feature.copy}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/15 via-slate-950 to-slate-950 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">How it works</p>
            <ul className="mt-6 space-y-6 text-slate-100">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <div className="text-lg font-semibold text-emerald-300">0{index + 1}</div>
                  <p className="text-sm text-slate-200">{step}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
                <p className="text-lg text-white">“{item.quote}”</p>
                <p className="mt-3 text-xs uppercase tracking-[0.35em] text-emerald-200">{item.name}</p>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/20 via-slate-900 to-rose-500/10 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">Ready to deploy</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Give every citizen a civic hotline in their pocket.</h2>
          <p className="mt-3 text-sm text-slate-200">Launch GreenGlitch, invite your crews to the dashboard, and watch hotspots disappear.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/report" className="w-full rounded-full bg-white px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-slate-100 sm:w-auto">
              Start reporting
            </Link>
            <Link href="/dashboard" className="w-full rounded-full border border-white/30 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white/60 sm:w-auto">
              View live radar
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
