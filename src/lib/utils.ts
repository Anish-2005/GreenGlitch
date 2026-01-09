import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SeverityLevel } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}

export async function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function severityToWeight(severity: SeverityLevel) {
  if (severity === "High") return 5;
  if (severity === "Medium") return 3;
  return 1;
}
