import type { Metadata } from "next";

import { ReportForm } from "@/components/report/ReportForm";
import { TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Report an Issue • GreenGlitch",
  description: "Capture, auto-tag, and publish civic maintenance issues in seconds.",
};

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white px-4 py-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Click & Report</p>
          <h1 className="text-4xl font-semibold text-slate-900">File a civic ticket in one tap</h1>
          <p className="text-lg text-slate-600">{TAGLINE}</p>
        </header>
        <ReportForm />
      </div>
    </div>
  );
}
