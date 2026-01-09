import { CIVIC_CATEGORIES, GEMINI_PROMPT } from "./constants";
import type { GeminiTaggingResult } from "./types";
import { z } from "zod";

const GeminiResponseSchema = z
  .object({
    category: z.string(),
    severity: z.enum(["High", "Medium", "Low"]),
    description: z.string(),
  })
  .nullable();

interface GeminiRequestPayload {
  base64Image: string;
  mimeType: string;
}

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

function extractJsonBlock(raw: string) {
  if (!raw) return null;
  const nullMatch = raw.trim().toLowerCase();
  if (nullMatch === "null") return "null";
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  return jsonMatch?.[0] ?? raw;
}

export async function analyzeImageWithGemini(
  payload: GeminiRequestPayload,
): Promise<GeminiTaggingResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY env variable");
  }

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: GEMINI_PROMPT },
            {
              inline_data: {
                mime_type: payload.mimeType,
                data: payload.base64Image,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API failed: ${response.status} ${error}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const jsonBlock = extractJsonBlock(rawText);

  if (!jsonBlock || jsonBlock === "null") {
    return null;
  }

  const parsed = GeminiResponseSchema.safeParse(JSON.parse(jsonBlock));
  if (!parsed.success) {
    throw new Error(`Gemini schema mismatch: ${parsed.error.message}`);
  }

  const { category, severity, description } = parsed.data;
  const normalizedCategory = CIVIC_CATEGORIES.includes(category as GeminiTaggingResult["category"])
    ? (category as GeminiTaggingResult["category"])
    : "Other";

  return { category: normalizedCategory, severity, description };
}
