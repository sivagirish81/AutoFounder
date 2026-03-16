import { nemotronOptimizer } from "@/lib/models/nemotron";
import type { CriticNotes } from "@/types/agents";

export async function runOptimizer(notes: CriticNotes) {
  return nemotronOptimizer(notes);
}
