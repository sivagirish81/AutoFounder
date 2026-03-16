import { nemotronCritic } from "@/lib/models/nemotron";

export async function runCritic(idea: string, iteration: number) {
  return nemotronCritic(idea, iteration);
}
