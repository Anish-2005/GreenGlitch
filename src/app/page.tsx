import Link from "next/link";

import { TAGLINE } from "@/lib/constants";

const problemStatement =
  "Local communities and university campuses frequently suffer from maintenance neglect--whether it's overflowing dustbins, broken streetlights, or dangerous potholes. The current reporting mechanisms are often tedious, requiring users to navigate complex forms, manually type descriptions, and categorize issues. This friction discourages students and citizens from reporting problems, leaving authorities unaware of the ground reality.";

const solutionStatement =
  "GreenGlitch is a Progressive Web App (PWA) that streamlines civic reporting into a single click. Leveraging Google's Gemini 1.5 Flash, the app automatically analyzes user-uploaded photos to identify the issue (e.g., Garbage, Pothole) and assesses its severity. Combined with the Google Maps Platform, it visualizes these reports on a public heatmap, allowing authorities to identify high-priority zones instantly. It removes the need for manual data entry, making civic engagement effortless.";

const executionPlan = [
  {
    label: "Hour 1",
    detail: "Spin up Next.js + Tailwind, wire Firebase + API keys, and commit the base PWA shell.",
  },
  {
    label: "Hour 2",
    detail: "Ship the camera-first mobile UI with a giant \"Report\" CTA and capture input.",
  },
  {
    label: "Hour 3",
    detail: "Integrate Gemini Flash with the structured JSON prompt for auto-tagging.",
  },
  {
    label: "Hour 4",
    detail: "Persist metadata + images to Firestore and Firebase Storage.",
  },
  {
    label: "Hour 5",
    detail: "Render the Google Maps heatmap dashboard with weighted severity points.",
  },
  {
    label: "Hour 6",
    detail: "Add polish: loading shimmer, success animation, manifesto-ready copy, and demo hooks.",
  },
];

const futureScope = [
  "Automated work orders that push new tickets directly into municipal CRMs.",
  "Gamified leaderboards with \"Green Points\" to reward verified reporters.",
  "Predictive sanitation forecasts using historical heatmap trends (festivals, exams, etc.).",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-20">
        <section className="grid gap-10 lg:grid-cols-[1.3fr,1fr]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-400">
              Crowd-source cleanliness
            </p>
            <h1 className="text-5xl font-semibold leading-tight">
              GreenGlitch -- report civic issues in seconds with AI + Geolocation.
            </h1>
            <p className="text-lg text-slate-300">{TAGLINE}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/report"
                className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-950 transition hover:bg-emerald-300"
              >
                Launch Reporter
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide"
              >
                View Heatmap
              </Link>
            </div>
            <div className="grid gap-4 text-sm text-slate-400 sm:grid-cols-2">
              <div>
                <p className="text-xl font-semibold text-white">Gemini Flash</p>
                <p>Structured JSON tagging (category + severity + summary) in under 2 seconds.</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">Firebase + Maps</p>
                <p>Firestore stores each ping, Google Maps renders the live severity heatmap.</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Problem - Solution</h2>
            <p className="mt-4 text-sm text-slate-200">{problemStatement}</p>
            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <p className="text-sm text-slate-200">{solutionStatement}</p>
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur lg:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Tech Stack</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li><span className="font-semibold text-white">Frontend:</span> Next.js 14 + Tailwind CSS PWA shell.</li>
              <li><span className="font-semibold text-white">Backend:</span> Firebase Firestore & Storage (serverless + realtime).</li>
              <li><span className="font-semibold text-white">AI:</span> Gemini 1.5 Flash via Google AI Studio API key.</li>
              <li><span className="font-semibold text-white">Maps:</span> Google Maps JS API with Visualization heatmap.</li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Workflow</p>
            <ol className="mt-4 space-y-4 text-sm text-slate-200">
              <li>
                <span className="font-semibold text-white">Capture:</span> <code className="text-emerald-200">&lt;input type=&quot;file&quot; capture=&quot;environment&quot; /&gt;</code> opens the camera instantly.
              </li>
              <li><span className="font-semibold text-white">Analyze:</span> Image - Base64 - Gemini Flash - structured JSON tags.</li>
              <li><span className="font-semibold text-white">Store:</span> Upload photo to Firebase Storage, metadata to Firestore.</li>
              <li><span className="font-semibold text-white">Visualize:</span> Weighted Google Maps heatmap exposing civic hotspots.</li>
            </ol>
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-emerald-500/20 via-slate-900 to-slate-950 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">Hackathon Clock</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {executionPlan.map((slot) => (
              <div key={slot.label} className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">{slot.label}</p>
                <p className="mt-2 text-base text-slate-50">{slot.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-3xl border border-white/5 bg-white/10 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Future Scope</p>
            <ul className="mt-4 space-y-4 text-sm text-slate-100">
              {futureScope.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-emerald-300">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Killer Demo Moment</p>
            <p className="mt-4 text-sm text-slate-100">
              Record yourself snapping a photo of a messy area. Let the UI auto-fill with “Detected: Garbage (High
              Severity)” without typing a single word. Then jump to the dashboard and show the new red hotspot lighting up
              in real time.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
