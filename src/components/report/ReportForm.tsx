"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MapPin, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CIVIC_CATEGORIES, DEFAULT_COORDINATES } from "@/lib/constants";
import { saveReport } from "@/lib/firebase/reports";
import type { CivicCategory, SeverityLevel } from "@/lib/types";
import { fileToBase64 } from "@/lib/utils";
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
      const base64 = await fileToBase64(file);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image: base64, mimeType: file.type }),
      });

      if (!response.ok) {
        throw new Error("AI tagging failed");
      }

      const data = await response.json();
      if (!data?.result) {
        setAnalysisMessage("Gemini didn't spot a civic issue. You can still file manually.");
        return;
      }

      setCategory(data.result.category);
      setSeverity(data.result.severity);
      setDescription(data.result.description);
      setAnalysisMessage(`Tagging complete -> ${data.result.category} (${data.result.severity}).`);
    } catch (error) {
      console.error(error);
      setAnalysisMessage("Couldn't talk to Gemini. Try again or submit manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    setSuccessId(null);
    try {
      const result = await saveReport({
        file,
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
      className="space-y-6 rounded-3xl border border-white/10 bg-white/80 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur"
    >
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Upload</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setAnalysisMessage(null);
          }}
          className="w-full rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:font-semibold file:text-white"
          required
        />
        <p className="text-xs text-slate-500">Tip: point at the issue and let Gemini auto-tag it for you.</p>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4" />
          {locating ? "Locking your location..." : `Lat ${coords.lat.toFixed(4)}, Lng ${coords.lng.toFixed(4)}`}
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-1 rounded-full border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-600"
          >
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        </div>
        {locationError && <p className="text-xs text-red-500">{locationError}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Category</label>
          <div className="flex flex-wrap gap-2">
            {CIVIC_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === item ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Severity</label>
          <div className="flex flex-wrap gap-2">
            {severityOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSeverity(option)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  severity === option ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">AI Summary</label>
        <textarea
          placeholder="Gemini will drop a one-liner summary here."
          className="h-24 w-full rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm focus:border-emerald-400 focus:outline-none"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <Button type="button" disabled={!file || isAnalyzing} onClick={handleAnalyze} variant="secondary">
          {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Run Gemini Vision
        </Button>
        <AnimatePresence mode="wait">
          {analysisMessage && (
            <motion.p
              key={analysisMessage}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="text-sm text-slate-500"
            >
              {analysisMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={!file || isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Report Issue
        </Button>
        {successId && (
          <Badge label={`Logged #${successId.slice(-6)}`} className="border-emerald-200 bg-emerald-50 text-emerald-700" />
        )}
        {isSubmitting && <p className="text-xs text-slate-500">Uploading photo to Firebase Storage...</p>}
      </div>
    </form>
  );
}
