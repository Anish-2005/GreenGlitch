"use client";

import { useEffect, useRef, useState } from "react";
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { coords, loading: locating, error: locationError, refresh } = useGeolocation(DEFAULT_COORDINATES);

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
    const stream = streamRef.current;
    if (!video || !stream) {
      return;
    }

    video.srcObject = stream;
    video.muted = true;
    video.setAttribute("playsInline", "true");
    video.setAttribute("autoplay", "true");
    if (video.readyState >= 2) {
      await video.play().catch(() => undefined);
    } else {
      await new Promise<void>((resolve) => {
        const handleLoaded = () => {
          video.removeEventListener("loadedmetadata", handleLoaded);
          video.play().catch(() => undefined);
          resolve();
        };
        video.addEventListener("loadedmetadata", handleLoaded, { once: true });
      });
    }
    if (video.videoWidth === 0) {
      await new Promise<void>((resolve) => {
        const checkReady = () => {
          if (video.videoWidth > 0) {
            video.removeEventListener("resize", checkReady);
            resolve();
          }
        };
        video.addEventListener("resize", checkReady, { once: true });
      });
    }
    setIsCameraReady(true);
  };

  const startCamera = async () => {
    if (isCameraOpen) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera not supported in this browser. Use the uploader instead.");
      return;
    }

    const constraintAttempts: MediaStreamConstraints[] = [
      { video: { facingMode: { ideal: "environment" } }, audio: false },
      { video: { facingMode: "user" }, audio: false },
      { video: true, audio: false },
    ];

    setCameraError(null);
    setIsCameraReady(false);
    let stream: MediaStream | null = null;
    let lastError: unknown = null;

    for (const constraints of constraintAttempts) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!stream) {
      console.error(lastError);
      setCameraError("Unable to access camera. Check permissions or another app using it.");
      return;
    }

    streamRef.current = stream;
    setIsCameraOpen(true);
    await attachStreamToVideo();
  };

  const capturePhoto = () => {
    if (!isCameraReady) {
      setCameraError("Camera stream is still warming up. Wait a second and try again.");
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    if (width === 0 || height === 0) {
      setCameraError("No pixels from camera yet. Give it a moment and try again.");
      return;
    }

    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) {
        setCameraError("Unable to capture photo. Please try again.");
        return;
      }

      const capturedFile = new File([blob], `greenglitch-${Date.now()}.jpg`, { type: "image/jpeg" });
      setFile(capturedFile);
      setPreviewUrl(URL.createObjectURL(capturedFile));
      setAnalysisMessage("Snapshot captured. Run Gemini Vision to auto-tag.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, "image/jpeg", 0.9);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setAnalysisMessage(null);
    try {
      const result = await analyzeImageWithPuter(file);
      if (!result) {
        setAnalysisMessage("Gemini Vision didn't spot a civic issue. You can still file manually.");
        return;
      }

      setCategory(result.category);
      setSeverity(result.severity);
      setDescription(result.description);
      setAnalysisMessage(`Tagging complete -> ${result.category} (${result.severity}).`);
    } catch (error) {
      console.error(error);
      setAnalysisMessage("Couldn't talk to Gemini Vision. Try again or submit manually.");
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
      setPreviewUrl(null);
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
            const selected = event.target.files?.[0] ?? null;
            setFile(selected);
            setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
            setAnalysisMessage(null);
          }}
          className="w-full rounded-2xl border border-dashed border-emerald-200/70 bg-white/10 p-4 text-sm text-white placeholder:text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:font-semibold file:text-slate-900"
          required
        />
        <p className="text-xs text-slate-400">Tip: point at the issue and let Gemini Vision auto-tag it for you. Photos stay local.</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Button type="button" onClick={startCamera} disabled={isCameraOpen} className="bg-white/10 text-white hover:bg-white/20">
            Enable Camera
          </Button>
          {isCameraOpen ? (
            <>
              <Button
                type="button"
                onClick={capturePhoto}
                disabled={!isCameraReady}
                className={`bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/50 disabled:text-slate-200`}
              >
                Capture Snapshot
              </Button>
              <Button type="button" onClick={stopCamera} variant="secondary">
                Close Camera
              </Button>
            </>
          ) : null}
        </div>
        {cameraError && <p className="text-xs text-red-400">{cameraError}</p>}
        {isCameraOpen ? (
          <div className="space-y-2 rounded-2xl border border-white/10 bg-black/50 p-3">
            <video ref={videoRef} autoPlay playsInline muted className="h-52 w-full rounded-xl bg-slate-900 object-cover" />
            <p className="text-[11px] text-slate-400">
              {isCameraReady
                ? "Frame the issue, then click “Capture Snapshot”."
                : "Camera warming up... grant permission and wait for the live feed before capturing."}
            </p>
          </div>
        ) : null}
        {previewUrl ? (
          <div className="space-y-2 rounded-2xl border border-emerald-500/20 bg-white/5 p-3">
            <p className="text-xs font-semibold text-white">Preview</p>
            <img src={previewUrl} alt="Issue preview" className="h-52 w-full rounded-xl object-cover" />
          </div>
        ) : null}
        <canvas ref={canvasRef} className="hidden" />
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
          placeholder="Gemini Vision will drop a one-liner summary here."
          className="h-24 w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
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
