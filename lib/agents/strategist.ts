import { nemotronStrategist } from "@/lib/models/nemotron";
import type { ProductBrief } from "@/types/agents";

export async function runStrategist(idea: string): Promise<ProductBrief> {
  return nemotronStrategist(idea);
}
