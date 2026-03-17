export type V0GenerationResult = {
  code: string;
  previewNotes: string;
};

export async function generateWithV0(prompt: string): Promise<V0GenerationResult> {
  const apiKey = process.env.V0_API_KEY;
  const apiUrl = process.env.V0_API_URL ?? "https://api.v0.dev/v1/chat/completions";
  const model = process.env.V0_MODEL ?? "v0-1.5-md";

  if (!apiKey) {
    return {
      code: `// v0 output placeholder\n// Missing V0_API_KEY. Prompt hash: ${prompt.length}`,
      previewNotes: "Set V0_API_KEY to enable live v0 generations."
    };
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are Vercel v0. Generate a polished, production-ready Next.js + Tailwind landing page/app shell. Return only the TSX for app/page.tsx with no markdown."
        },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      code: `// v0 error: ${response.status} ${response.statusText}\n// ${errorText}`,
      previewNotes: "v0 API request failed."
    };
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "";

  return {
    code: content,
    previewNotes: "v0 generation completed via Model API."
  };
}
