import { nemotronStopAgent } from "@/lib/models/nemotron";
import type { CriticScore, StopDecision } from "@/types/agents";

export async function runStopAgent(score: CriticScore, iteration: number): Promise<StopDecision> {
  return nemotronStopAgent(score, iteration);
}
