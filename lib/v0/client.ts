export type V0GenerationResult = {
  code: string;
  previewNotes: string;
};

export async function generateWithV0(prompt: string): Promise<V0GenerationResult> {
  // TODO: Replace with real v0 API call.
  return {
    code: `// v0 output placeholder\n// Prompt hash: ${prompt.length}`,
    previewNotes: "v0 generation simulated. Replace with live API response."
  };
}
