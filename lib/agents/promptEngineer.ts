import { nemotronPromptEngineer } from "@/lib/models/nemotron";
import type { ProductBrief, PromptPlan, UXPlan } from "@/types/agents";

export async function runPromptEngineer(
  idea: string,
  brief: ProductBrief,
  uxPlan: UXPlan,
  iterationDelta?: string
): Promise<PromptPlan> {
  return nemotronPromptEngineer(idea, brief, uxPlan, iterationDelta);
}
