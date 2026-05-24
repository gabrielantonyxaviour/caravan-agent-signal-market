import { NextResponse } from "next/server";
import { fetchMarketFrame } from "@/src/lib/caravan";

export async function GET() {
  try {
    const market = await fetchMarketFrame();
    return NextResponse.json({ ok: true, market });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: (error as Error).message || "Market fetch failed.",
      },
      { status: 502 },
    );
  }
}
