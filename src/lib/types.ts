export type CivicCategory =
  | "Garbage"
  | "Pothole"
  | "Broken Light"
  | "Waterlogging"
  | "Safety Hazard"
  | "Other";

export type SeverityLevel = "Low" | "Medium" | "High";

export interface AITaggingResult {
  category: CivicCategory;
  severity: SeverityLevel;
  description: string;
  confidence?: number;
}

export interface CivicReport {
  id?: string;
  lat: number;
  lng: number;
  category: CivicCategory;
  severity: SeverityLevel;
  description: string;
  imageUrl: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: number;
  reporterNote?: string;
}

export interface UploadProgress {
  stage: "idle" | "analyzing" | "uploading" | "complete" | "error";
  message: string;
}
