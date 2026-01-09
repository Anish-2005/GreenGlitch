import type { CivicCategory, SeverityLevel } from "./types";

export const PROJECT_NAME = "GreenGlitch";
export const TAGLINE =
  "Empowering communities to report civic issues in seconds using AI and geolocation.";

export const CIVIC_CATEGORIES: CivicCategory[] = [
  "Garbage",
  "Pothole",
  "Broken Light",
  "Waterlogging",
  "Safety Hazard",
  "Other",
];

export const SEVERITY_BADGES: Record<SeverityLevel, string> = {
  High: "text-red-950 bg-red-100 border-red-200",
  Medium: "text-amber-900 bg-amber-100 border-amber-200",
  Low: "text-emerald-900 bg-emerald-100 border-emerald-200",
};

export const DEFAULT_COORDINATES = {
  lat: Number(process.env.NEXT_PUBLIC_DEFAULT_LAT ?? 22.5726),
  lng: Number(process.env.NEXT_PUBLIC_DEFAULT_LNG ?? 88.3639),
};

export const HEATMAP_MAX_INTENSITY = 5;

export const GEMINI_PROMPT =
  "Analyze this image. Identify if there is a civic issue (Garbage, Pothole, Broken Light, Waterlogging, Safety Hazard). Return a JSON object with: { \"category\": \"...\", \"severity\": \"High/Medium/Low\", \"description\": \"Short 1 sentence summary\" }. If no issue is found, return null.";
