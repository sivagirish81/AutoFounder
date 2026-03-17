import { NextResponse } from "next/server";
import { loadState } from "@/lib/orchestrator/state";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = loadState();
  return NextResponse.json(state);
}
