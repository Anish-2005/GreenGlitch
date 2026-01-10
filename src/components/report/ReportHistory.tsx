"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { subscribeToUserReports } from "@/lib/firebase/reports";
import type { CivicReport, SeverityLevel } from "@/lib/types";

const severityAccent: Record<SeverityLevel, string> = {
  Low: "bg-emerald-500/10 text-emerald-200 border-emerald-400/30",
  Medium: "bg-amber-500/10 text-amber-200 border-amber-400/30",
  High: "bg-rose-500/10 text-rose-200 border-rose-400/30",
};

const INDEX_HELP_URL =
  "https://console.firebase.google.com/v1/r/project/greenglitch-241eb/firestore/indexes?create_composite=ClFwcm9qZWN0cy9ncmVlbmdsaXRjaC0yNDFlYi9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcmVwb3J0cy9pbmRleGVzL18QARoKCgZ1c2VySWQQARoTCg9jcmVhdGVkQXRTZXJ2ZXIQAhoMCghfX25hbWVfXxAC";

export function ReportHistory() {
  const { user } = useAuth();
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  );

  useEffect(() => {
    if (!user) {
      setReports([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserReports(
      user.uid,
      (next) => {
        setReports(next);
        setLoading(false);
      },
      (firestoreError) => {
        setError(firestoreError.message ?? "Failed to load history");
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  if (!user) {
    return null;
  }

  const latestReports = reports.slice(0, 5);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <header className="mb-4 space-y-1 text-balance">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Your trail</p>
        <h3 className="text-xl font-semibold text-white">Recent reports</h3>
        <p className="text-sm text-slate-300 break-words">Only visible to you. Stored securely in Firebase.</p>
      </header>

      {loading ? (
        <p className="text-sm text-slate-400">Fetching your submissions…</p>
      ) : error ? (
        error.toLowerCase().includes("index") ? (
          <div className="space-y-2 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100 break-words">
            <p>Firestore needs a quick composite index before we can load your personal history.</p>
            <a
              href={INDEX_HELP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full flex-wrap items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-white/10"
            >
              Create index in Firebase Console
            </a>
            <p className="text-xs text-rose-200/80">Once the index finishes building this panel updates automatically.</p>
          </div>
        ) : (
          <p className="text-sm text-rose-300 break-words">{error}</p>
        )
      ) : latestReports.length === 0 ? (
        <p className="text-sm text-slate-400">No reports yet. Your first submission will land here.</p>
      ) : (
        <ul className="space-y-3">
          {latestReports.map((report) => (
            <li key={report.id ?? `${report.lat}-${report.lng}-${report.createdAt}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-white break-words">{report.category}</span>
                <Badge label={report.severity} className={`border ${severityAccent[report.severity]}`} />
              </div>
              <p className="mt-2 text-sm text-slate-200 break-words">{report.description}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs text-slate-400">
                <span className="break-words">
                  {report.lat.toFixed(3)}, {report.lng.toFixed(3)}
                </span>
                <span>{dateFormatter.format(report.createdAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
