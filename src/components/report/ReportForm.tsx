"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MapPin, RefreshCw, Camera, Upload, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CIVIC_CATEGORIES, DEFAULT_COORDINATES } from "@/lib/constants";
import { analyzeImageWithPuter } from "@/lib/puter";
import { saveReport } from "@/lib/firebase/reports";
import type { CivicCategory, SeverityLevel } from "@/lib/types";
import { useGeolocation } from "@/hooks/useGeolocation";
import { cn } from "@/lib/utils";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { user } = useAuth();

  const { coords, loading: locating, refresh } = useGeolocation(DEFAULT_COORDINATES);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setIsCameraReady(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const attachStreamToVideo = async () => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;
    video.srcObject = streamRef.current;
    await video.play().catch(() => undefined);
    setIsCameraReady(true);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setIsCameraOpen(true);
      await attachStreamToVideo();
    } catch {
      setCameraError("Camera access denied.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const capturedFile = new File([blob], `report-${Date.now()}.jpg`, { type: "image/jpeg" });
      setFile(capturedFile);
      setPreviewUrl(URL.createObjectURL(capturedFile));
      stopCamera();
    }, "image/jpeg");
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeImageWithPuter(file);
      if (result) {
        setCategory(result.category);
        setSeverity(result.severity);
        setDescription(result.description);
        setAnalysisMessage("Gemini analysis successful.");
      }
    } catch {
      setAnalysisMessage("AI analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await saveReport({
        lat: coords.lat,
        lng: coords.lng,
        category,
        severity,
        description,
        userId: user?.uid ?? "anon",
        userEmail: user?.email ?? null,
        userName: user?.displayName ?? null,
      });
      setSuccessId(result.id);
      setFile(null);
      setPreviewUrl(null);
      setDescription("");
    } catch {
      setAnalysisMessage("Upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Photo Section */}
      <div className="space-y-4">
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Issue Evidence</label>

        <div className="grid gap-4 sm:grid-cols-2">
          {!previewUrl && !isCameraOpen && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-48 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-border bg-muted/20 hover:bg-muted/30 transition-all group"
            >
              <div className="h-12 w-12 rounded-2xl bg-background flex items-center justify-center border border-border group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">Upload Photo</p>
                <p className="text-xs text-muted-foreground">JPEG, PNG up to 10MB</p>
              </div>
            </button>
          )}

          {!previewUrl && !isCameraOpen && (
            <button
              type="button"
              onClick={startCamera}
              className="flex h-48 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all group"
            >
              <div className="h-12 w-12 rounded-2xl bg-background flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Camera className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="text-center text-emerald-600 dark:text-emerald-400">
                <p className="font-bold text-sm">Use Camera</p>
                <p className="text-xs">Direct capture</p>
              </div>
            </button>
          )}

          {isCameraOpen && (
            <div className="relative h-48 sm:col-span-2 overflow-hidden rounded-3xl bg-black border border-border mt-2">
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
                <Button type="button" onClick={capturePhoto} disabled={!isCameraReady} size="sm">
                  Capture Snapshot
                </Button>
                <Button type="button" onClick={stopCamera} variant="secondary" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {previewUrl && (
            <div className="relative h-48 sm:col-span-2 overflow-hidden rounded-3xl border border-border bg-muted/20">
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => { setFile(null); setPreviewUrl(null); }}
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files?.[0] ?? null;
            if (selected) {
              setFile(selected);
              setPreviewUrl(URL.createObjectURL(selected));
            }
          }}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Details Section */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
          <div className="flex flex-wrap gap-2">
            {CIVIC_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                  category === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-muted/10 border-border hover:bg-muted/20"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Severity</label>
          <div className="flex flex-wrap gap-2">
            {severityOptions.map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverity(sev)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                  severity === sev
                    ? "bg-foreground text-background border-foreground shadow-lg"
                    : "bg-muted/10 border-border hover:bg-muted/20"
                )}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description & Analysis</label>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            Run Gemini Auto-Tag
          </button>
        </div>
        <textarea
          placeholder="Detailed description of the issue..."
          className="w-full min-h-[120px] rounded-[1.5rem] border border-border bg-muted/10 p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {analysisMessage && <p className="text-[11px] font-medium text-muted-foreground ml-1 italic">{analysisMessage}</p>}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <MapPin className="h-4 w-4 text-rose-500" />
          {locating ? "Locking GPS..." : `Coordinates: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`}
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {successId && (
            <div className="hidden sm:flex items-center gap-2 text-emerald-500 text-sm font-bold animate-in fade-in slide-in-from-right-4 duration-500">
              <CheckCircle2 className="h-5 w-5" />
              <span>Reported #{successId.slice(-6)}</span>
            </div>
          )}
          <Button type="submit" disabled={isSubmitting || !file} className="w-full sm:w-auto min-w-[160px]">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Submit Report
          </Button>
        </div>
      </div>
    </form>
  );
}
