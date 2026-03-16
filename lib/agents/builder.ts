import { generateWithV0 } from "@/lib/v0/client";

export async function runBuilder(prompt: string) {
  return generateWithV0(prompt);
}
