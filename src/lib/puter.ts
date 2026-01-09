import { z } from "zod";

import { AUTO_TAG_PROMPT, CIVIC_CATEGORIES } from "./constants";
import type { AITaggingResult } from "./types";

type PuterSdk = {
  ai?: {
    chat<T = unknown>(prompt: string, input?: File | Blob | string | null, options?: Record<string, unknown>): Promise<T>;
  };
};

const PuterResponseSchema = z
  .object({
    category: z.string(),
    severity: z.enum(["High", "Medium", "Low"]),
    description: z.string(),
  })
  .nullable();

const PUTER_SCRIPT_URL = "https://js.puter.com/v2/";
const PUTER_MODEL = "gemini-2.5-flash-lite";

let puterSdkPromise: Promise<PuterSdk> | null = null;

function extractJsonBlock(raw: unknown) {
  if (raw == null) {
    return null;
  }

  const text = typeof raw === "string" ? raw : JSON.stringify(raw);
  const trimmed = text.trim().toLowerCase();
  if (trimmed === "null") return "null";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch?.[0] ?? text;
}

async function ensurePuterSdk(): Promise<PuterSdk> {
  if (typeof window === "undefined") {
    throw new Error("Puter SDK requires a browser environment");
  }

  if (window.puter) {
    return window.puter;
  }

  if (!puterSdkPromise) {
    puterSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = PUTER_SCRIPT_URL;
      script.async = true;
      script.onload = () => {
        if (window.puter) {
          resolve(window.puter);
        } else {
          reject(new Error("Puter SDK failed to initialize"));
          puterSdkPromise = null;
        }
      };
      script.onerror = () => {
        reject(new Error("Unable to load Puter SDK"));
        puterSdkPromise = null;
      };
      document.head.appendChild(script);
    });
  }

  return puterSdkPromise;
}

export async function analyzeImageWithPuter(file: File): Promise<AITaggingResult | null> {
  const puter = await ensurePuterSdk();
  if (!puter?.ai?.chat) {
    throw new Error("Puter AI interface unavailable");
  }

  const response = await puter.ai.chat(AUTO_TAG_PROMPT, file, {
    model: PUTER_MODEL,
  });

  const rawText =
    typeof response === "string"
      ? response
      : (typeof response === "object" && response !== null && "message" in response
          ? (response as { message?: string }).message
          : (response as { output?: string }).output);
  const jsonBlock = extractJsonBlock(rawText);

  if (!jsonBlock || jsonBlock === "null") {
    return null;
  }

  const parsed = PuterResponseSchema.safeParse(JSON.parse(jsonBlock));
  if (!parsed.success) {
    console.warn("Puter response mismatch", parsed.error.flatten());
    return null;
  }

  if (!parsed.data) {
    return null;
  }
  const { category, severity, description } = parsed.data;
  const normalizedCategory = CIVIC_CATEGORIES.includes(category as AITaggingResult["category"])
    ? (category as AITaggingResult["category"])
    : "Other";

  return { category: normalizedCategory, severity, description };
}
