"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MapPin, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CIVIC_CATEGORIES, DEFAULT_COORDINATES } from "@/lib/constants";
import { analyzeImageWithPuter } from "@/lib/puter";
import { saveReport } from "@/lib/firebase/reports";
import type { CivicCategory, SeverityLevel } from "@/lib/types";
import { useGeolocation } from "@/hooks/useGeolocation";

const severityOptions: SeverityLevel[] = ["Low", "Medium", "High"];

export function ReportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<CivicCategory>("Garbage");
  const [severity, setSeverity] = useState<SeverityLevel>("Medium");
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { coords, loading: locating, error: locationError, refresh } = useGeolocation(DEFAULT_COORDINATES);

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setAnalysisMessage(null);
    try {
      const result = await analyzeImageWithPuter(file);
      if (!result) {
        setAnalysisMessage("Puter AI didn't spot a civic issue. You can still file manually.");
        return;
      }

      setCategory(result.category);
      setSeverity(result.severity);
      setDescription(result.description);
      setAnalysisMessage(`Tagging complete -> ${result.category} (${result.severity}).`);
    } catch (error) {
      console.error(error);
      setAnalysisMessage("Couldn't talk to Puter AI. Try again or submit manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessId(null);
    try {
      const result = await saveReport({
        lat: coords.lat,
        lng: coords.lng,
        category,
        severity,
        description: description || "Unspecified civic issue",
      });
      setSuccessId(result.id);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setDescription("");
      setAnalysisMessage("Report published to Firebase.");
      setCategory("Garbage");
      setSeverity("Medium");
    } catch (error) {
      console.error(error);
      setAnalysisMessage("Upload failed. Check your Firebase config and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[28px] border border-white/10 bg-[#040915] p-10 text-white shadow-[0_20px_60px_-25px_rgba(16,185,129,0.6)]"
    >
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Upload</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setAnalysisMessage(null);
          }}
          className="w-full rounded-2xl border border-dashed border-emerald-200/70 bg-white/10 p-4 text-sm text-white placeholder:text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:font-semibold file:text-slate-900"
          required
        />
        <p className="text-xs text-slate-400">Tip: point at the issue and let Puter AI auto-tag it for you. Photos stay local.</p>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
          <MapPin className="h-4 w-4" />
          {locating ? "Locking your location..." : `Lat ${coords.lat.toFixed(4)}, Lng ${coords.lng.toFixed(4)}`}
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200"
          >
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        </div>
        {locationError && <p className="text-xs text-red-400">{locationError}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white">Category</label>
          <div className="flex flex-wrap gap-2">
            {CIVIC_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === item
                    ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30"
                    : "bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white">Severity</label>
          <div className="flex flex-wrap gap-2">
            {severityOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSeverity(option)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  severity === option
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/40"
                    : "bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">AI Summary</label>
        <textarea
          placeholder="Puter AI will drop a one-liner summary here."
          className="h-24 w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <Button type="button" disabled={!file || isAnalyzing} onClick={handleAnalyze} variant="secondary">
          {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Run Puter Vision
        </Button>
        <AnimatePresence mode="wait">
          {analysisMessage && (
            <motion.p
              key={analysisMessage}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="text-sm text-slate-300"
            >
              {analysisMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Report Issue
        </Button>
        {successId && (
          <Badge label={`Logged #${successId.slice(-6)}`} className="border-emerald-400/40 bg-emerald-400/10 text-emerald-200" />
        )}
        {isSubmitting && <p className="text-xs text-slate-400">Uploading photo to Firebase Storage...</p>}
      </div>
    </form>
  );
}
