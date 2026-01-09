import { NextResponse } from "next/server";

import { analyzeImageWithGemini } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { base64Image, mimeType } = await request.json();
    if (!base64Image || !mimeType) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    const result = await analyzeImageWithGemini({ base64Image, mimeType });
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Gemini route error", error);
    return NextResponse.json({ error: "Unable to analyze image" }, { status: 500 });
  }
}
