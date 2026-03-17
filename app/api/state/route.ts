import { NextResponse } from "next/server";
import { loadState } from "@/lib/orchestrator/state";

export async function GET() {
  const state = loadState();
  return NextResponse.json(state);
}
