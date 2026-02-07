"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { subscribeToUserReports } from "@/lib/firebase/reports";
import type { CivicReport, SeverityLevel } from "@/lib/types";
import { MapPin, Clock, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";

const severityAccent: Record<SeverityLevel, string> = {
  Low: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-sky-500 bg-sky-500/10 border-sky-500/20",
  High: "text-rose-500 bg-rose-500/10 border-rose-500/20",
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

    return () => unsubscribe();
  }, [user?.uid]);

  if (!user) return null;

  const latestReports = reports.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 italic">Personal Signal Archive</span>
        </div>
        {reports.length > 0 && <span className="text-[9px] font-black tracking-widest text-primary/50 uppercase">{reports.length} Signals Captured</span>}
      </div>

      <AnimatePresence mode="popLayout">
        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-12 gap-4">
            <div className="h-10 w-10 border-t-2 border-primary rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Decrypting Archive...</p>
          </motion.div>
        ) : error ? (
          error.toLowerCase().includes("index") ? (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 rounded-[2rem] border border-rose-500/20 bg-rose-500/5 space-y-6">
              <div className="flex items-center gap-3 text-rose-500">
                <AlertCircle className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-widest">Protocol Sync Required</span>
              </div>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed italic">Firestore requires a composite index to link your personal identity to the signal database.</p>
              <a
                href={INDEX_HELP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
              >
                <ExternalLink className="h-4 w-4" /> Initialize Index
              </a>
            </motion.div>
          ) : (
            <p className="text-xs font-black uppercase tracking-widest text-rose-500">Error: {error}</p>
          )
        ) : latestReports.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center justify-center text-center px-8 border border-dashed border-white/10 rounded-[2.5rem] bg-white/5 opacity-50 italic">
            <ShieldCheck className="h-8 w-8 text-muted-foreground mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">No Active Signals Linked</p>
            <p className="text-[9px] font-medium mt-1">Archive is currently empty. Direct reports will materialize here.</p>
          </motion.div>
        ) : (
          <ul className="space-y-4">
            {latestReports.map((report, i) => (
              <motion.li
                key={report.id ?? i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group relative glass bg-secondary/20 hover:bg-secondary/40 border border-white/5 p-6 rounded-[1.8rem] transition-all duration-500"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black italic tracking-tighter uppercase group-hover:text-primary transition-colors">{report.category}</h4>
                    <div className="flex items-center gap-3 text-muted-foreground/60 text-[9px] font-bold">
                      <Clock className="h-3 w-3" />
                      {dateFormatter.format(report.createdAt)}
                    </div>
                  </div>
                  <Badge label={report.severity} className={`${severityAccent[report.severity]} !rounded-full !px-3 !py-0.5 !text-[8px] !font-black !tracking-[0.2em] uppercase`} />
                </div>

                <p className="text-xs text-muted-foreground/80 font-medium leading-relaxed italic line-clamp-2 mb-4">"{report.description}"</p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <MapPin className="h-3 w-3 text-rose-500" />
                  <span className="text-[9px] font-black tracking-widest text-muted-foreground/40">{report.lat.toFixed(4)} / {report.lng.toFixed(4)}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </AnimatePresence>
    </div>
  );
}
