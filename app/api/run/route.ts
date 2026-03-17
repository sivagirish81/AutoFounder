import { NextResponse } from "next/server";
import { loadState, resetState, saveState } from "@/lib/orchestrator/state";
import { runIteration } from "@/lib/orchestrator/runIteration";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const action = payload?.action ?? "run";

  if (action === "reset") {
    const idea = payload?.idea ?? "AI travel planner for digital nomads";
    const state = resetState(idea);
    return NextResponse.json(state);
  }

  const state = loadState();
  const iteration = await runIteration(state);
  state.iterations.unshift(iteration);
  state.lastUpdated = new Date().toISOString();
  saveState(state);

  return NextResponse.json(state);
}
