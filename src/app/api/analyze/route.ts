import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Image analysis now runs entirely on the client via Gemini Vision.",
    },
    { status: 410 },
  );
}
