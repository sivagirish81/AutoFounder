import { nemotronUXPlan } from "@/lib/models/nemotron";
import type { ProductBrief, UXPlan } from "@/types/agents";

export async function runUXAgent(brief: ProductBrief): Promise<UXPlan> {
  return nemotronUXPlan(brief);
}
