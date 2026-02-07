"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MapPin, RefreshCw, Camera, Upload, CheckCircle2, Zap, Send, X, Plus } from "lucide-react";

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

const severityColorMap: Record<SeverityLevel, string> = {
  Low: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-sky-500 bg-sky-500/10 border-sky-500/20",
  High: "text-rose-500 bg-rose-500/10 border-rose-500/20",
};

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

  const { coords, loading: locating } = useGeolocation(DEFAULT_COORDINATES);

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
    return () => stopCamera();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
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
      setCameraError("ACCESS_DENIED: CAMERA_MODULE_LOCKED");
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
    setAnalysisMessage("INITIALIZING_NEURAL_PARSER...");
    try {
      const result = await analyzeImageWithPuter(file);
      if (result) {
        setCategory(result.category);
        setSeverity(result.severity);
        setDescription(result.description);
        setAnalysisMessage("ANALYSIS_COMPLETE: DATA_SYNCHRONIZED");
      }
    } catch {
      setAnalysisMessage("CRITICAL_ERROR: AI_LINK_INTERRUPTED");
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
      setAnalysisMessage("SIGNAL_DEPLOED_SUCCESSFULLY");
      setTimeout(() => setSuccessId(null), 5000);
    } catch {
      setAnalysisMessage("PACKET_LOSS: UPLOAD_FAILED");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Evidence Capture Module */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Module 01 / Visual Evidence</label>
          {previewUrl && (
            <button type="button" onClick={() => { setFile(null); setPreviewUrl(null); }} className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2 hover:opacity-70 transition-opacity">
              <X className="h-3.5 w-3.5" /> Clear Buffer
            </button>
          )}
        </div>

        <div className="relative min-h-[240px]">
          <AnimatePresence mode="wait">
            {!previewUrl && !isCameraOpen && (
              <motion.div
                key="choice"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="grid gap-4 md:grid-cols-2"
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex h-60 flex-col items-center justify-center gap-4 rounded-[2rem] border border-white/10 bg-secondary/20 hover:bg-secondary/40 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="h-14 w-14 rounded-2xl bg-background border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                    <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-xs tracking-widest uppercase">Select Media</p>
                    <p className="text-[10px] font-bold text-muted-foreground/50 mt-1 italic">ENCRYPTED_UPLOAD_CHANNEL</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={startCamera}
                  className="group relative flex h-60 flex-col items-center justify-center gap-4 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="h-14 w-14 rounded-2xl bg-background border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-xl">
                    <Camera className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-xs tracking-widest uppercase text-emerald-500">Enable Optical</p>
                    <p className="text-[10px] font-bold text-emerald-500/30 mt-1 italic">REALTIME_VISUAL_CAPTURE</p>
                  </div>
                </button>
              </motion.div>
            )}

            {isCameraOpen && (
              <motion.div
                key="camera"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative h-[400px] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl"
              >
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover grayscale-[0.3] contrast-125" />

                {/* HUD Overlays */}
                <div className="absolute inset-0 pointer-events-none z-10 border-[1.5rem] border-transparent">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary" />
                </div>

                <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 px-4 z-20">
                  <Button type="button" onClick={capturePhoto} disabled={!isCameraReady} className="h-16 rounded-2xl bg-primary text-primary-foreground px-8 font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(16,185,129,0.3)]">
                    Trigger Link
                  </Button>
                  <Button type="button" onClick={stopCamera} variant="secondary" className="h-16 rounded-2xl px-8 font-black uppercase tracking-widest glass">
                    Abort
                  </Button>
                </div>
              </motion.div>
            )}

            {previewUrl && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group h-[400px] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
              >
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#10b981]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Visual Buffer Sync'd</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
          const selected = e.target.files?.[0] ?? null;
          if (selected) {
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
          }
        }} />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Logic Protocols Section */}
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 px-1">Module 02 / Taxonomy</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CIVIC_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-4 py-4 rounded-2xl text-[10px] font-black italic tracking-widest transition-all duration-500 border uppercase shadow-sm",
                  category === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_10px_20px_rgba(16,185,129,0.15)] scale-[1.02]"
                    : "bg-secondary/30 border-white/5 text-muted-foreground hover:bg-secondary/50 hover:border-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 px-1">Module 03 / Threat Level</label>
          <div className="grid grid-cols-3 gap-3">
            {severityOptions.map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverity(sev)}
                className={cn(
                  "px-4 py-4 rounded-2xl text-[10px] font-black italic tracking-widest transition-all duration-500 border uppercase shadow-sm",
                  severity === sev
                    ? cn("shadow-lg scale-[1.02]",
                      sev === 'Low' && "bg-emerald-500 text-white border-emerald-500",
                      sev === 'Medium' && "bg-sky-500 text-white border-sky-500",
                      sev === 'High' && "bg-rose-500 text-white border-rose-500")
                    : "bg-secondary/30 border-white/5 text-muted-foreground hover:bg-secondary/50"
                )}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Semantic Parser Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Module 04 / Descriptive Logic</label>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary disabled:opacity-30 transition-all"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all">
              {isAnalyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            </div>
            <span>Init Neural Scan</span>
          </button>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-transparent rounded-[2rem] blur opacity-50 transition-opacity" />
          <textarea
            placeholder="DESCRIPTIVE_INPUT_REQUIRED..."
            className="relative w-full min-h-[160px] rounded-[2rem] border border-white/10 bg-secondary/20 p-8 text-sm font-medium tracking-tight focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all resize-none italic placeholder:text-muted-foreground/30 placeholder:italic dark:bg-black/20 backdrop-blur-xl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <AnimatePresence>
          {analysisMessage && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-2 flex items-center gap-3"
            >
              <Zap className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-[9px] font-black tracking-[0.2em] text-muted-foreground uppercase italic">{analysisMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Deployment Action */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-white/5">
        <div className="flex items-center gap-4 px-6 py-3 rounded-2xl glass border border-white/5">
          <div className="h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Telemetry Status</span>
            <span className="text-[10px] font-black tracking-widest italic lowercase">
              {locating ? "LOCKING_GPS..." : `${coords.lat.toFixed(6)} / ${coords.lng.toFixed(6)}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto">
          <AnimatePresence>
            {successId && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 text-emerald-500 bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-500/20"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">SIGNAL_ACCEPTED: #{successId.slice(-6)}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            disabled={isSubmitting || !file}
            className="relative w-full md:w-auto h-20 min-w-[240px] rounded-[1.8rem] bg-foreground text-background hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 overflow-hidden group shadow-2xl"
          >
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center justify-center gap-4">
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="text-sm font-black uppercase tracking-[0.3em]">Deploy Signal</span>
            </div>
          </Button>
        </div>
      </div>
    </form>
  );
}
