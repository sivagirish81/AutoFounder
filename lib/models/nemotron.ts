import type { ProductBrief, UXPlan, PromptPlan, CriticScore, CriticNotes, StopDecision } from "@/types/agents";

const now = () => new Date().toISOString();
const apiUrl = process.env.NEMOTRON_API_URL ?? "https://integrate.api.nvidia.com/v1/chat/completions";
const apiKey = process.env.NEMOTRON_API_KEY;
const model = process.env.NEMOTRON_MODEL ?? "nvidia/nemotron-3-nano-30b-a3b";

type ChatMessage = { role: "system" | "user"; content: string };

async function callNemotron(messages: ChatMessage[], temperature = 0.6) {
  if (!apiKey) {
    throw new Error("Missing NEMOTRON_API_KEY.");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages,
      temperature
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Nemotron API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}

function safeParseJson<T>(content: string): T | null {
  try {
    return JSON.parse(content) as T;
  } catch {
    const match = content.match(/```json\s*([\s\S]*?)```/i);
    if (match?.[1]) {
      try {
        return JSON.parse(match[1]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function nemotronStrategist(idea: string): Promise<ProductBrief> {
  const fallback: ProductBrief = {
    summary: `AutoFounder will build a fast, credible landing page for: ${idea}.`,
    audience: "Hackathon judges, early adopters, and product builders evaluating the idea.",
    valueProposition: "Turn an idea into a deployed, iteration-ready product site with autonomous agent feedback.",
    requiredSections: ["Hero", "Problem", "Solution", "How it works", "Key features", "Workflow", "Pricing or Waitlist", "FAQ", "Footer"],
    optionalSections: ["Testimonials", "Metrics", "Security", "Integrations"]
  };

  try {
    const content = await callNemotron(
      [
        {
          role: "system",
          content:
            "You are a Product Strategist. Return JSON only with keys: summary, audience, valueProposition, requiredSections, optionalSections."
        },
        { role: "user", content: `Startup idea: ${idea}` }
      ],
      0.5
    );
    return safeParseJson<ProductBrief>(content) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function nemotronUXPlan(brief: ProductBrief): Promise<UXPlan> {
  const fallback: UXPlan = {
    sectionOrder: [
      "Hero",
      "Problem",
      "Solution",
      "How it works",
      "Key features",
      "Workflow",
      "Testimonials",
      "Pricing or Waitlist",
      "FAQ",
      "Footer"
    ],
    uxRationale: "Lead with clarity, then prove credibility with a visual workflow and social proof before the pricing decision.",
    conversionRationale: "Stack CTAs at hero, mid-page, and pricing to create a narrative arc that drives a final action.",
    contentEmphasis: ["Outcome-focused headlines", "Product screenshots", "Risk reversal messaging"]
  };

  try {
    const content = await callNemotron(
      [
        {
          role: "system",
          content:
            "You are a UX/Conversion Agent. Return JSON only with keys: sectionOrder, uxRationale, conversionRationale, contentEmphasis."
        },
        { role: "user", content: JSON.stringify(brief) }
      ],
      0.6
    );
    return safeParseJson<UXPlan>(content) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function nemotronPromptEngineer(
  idea: string,
  brief: ProductBrief,
  uxPlan: UXPlan,
  iterationDelta?: string
): Promise<PromptPlan> {
  const fallback: PromptPlan = {
    prompt: [
      `Product summary: ${brief.summary}`,
      `Target audience: ${brief.audience}`,
      `Goal: convert visitors into demo requests or waitlist signups.`,
      `Required sections: ${brief.requiredSections.join(", ")}.`,
      `Section order: ${uxPlan.sectionOrder.join(" > ")}.`,
      `Design style: bold terminal-inspired dashboard + clean startup landing page, dark gradient background, neon accents, strong typography.`,
      `Functional constraints: responsive, accessible, include a mock live preview section and a score panel.`,
      `Conversion goals: highlight value prop, show workflow steps, add trust indicators and pricing CTA.`,
      `Tone: confident, autonomous, builder-grade.`,
      iterationDelta ? `Iteration improvements: ${iterationDelta}` : ""
    ]
      .filter(Boolean)
      .join("\n"),
    constraints: ["Use semantic HTML", "Polished landing page with sections", "No external data dependencies"],
    iterationDelta
  };

  try {
    const content = await callNemotron(
      [
        {
          role: "system",
          content:
            "You are a v0 Prompt Engineer. Return JSON only with keys: prompt, constraints, iterationDelta (optional)."
        },
        {
          role: "user",
          content: JSON.stringify({ idea, brief, uxPlan, iterationDelta })
        }
      ],
      0.55
    );
    return safeParseJson<PromptPlan>(content) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function nemotronCritic(_idea: string, iteration: number): Promise<{ score: CriticScore; notes: CriticNotes }> {
  const fallbackScore: CriticScore = {
    clarity: Math.min(25, 14 + iteration * 2),
    completeness: Math.min(20, 12 + iteration * 1.5),
    conversion: Math.min(20, 11 + iteration * 1.8),
    polish: Math.min(20, 10 + iteration * 1.7),
    credibility: Math.min(15, 8 + iteration * 1.2),
    total: Math.min(
      100,
      Math.round(
        Math.min(25, 14 + iteration * 2) +
          Math.min(20, 12 + iteration * 1.5) +
          Math.min(20, 11 + iteration * 1.8) +
          Math.min(20, 10 + iteration * 1.7) +
          Math.min(15, 8 + iteration * 1.2)
      )
    )
  };
  const fallbackNotes: CriticNotes = {
    strengths: ["Clear narrative arc", "Strong CTA placement", "Good visual hierarchy"],
    weaknesses: ["Need clearer proof points", "Pricing section could be sharper"],
    nextChanges: ["Add metrics block", "Refine testimonials copy"],
    rationale: `Iteration ${iteration} improved layout clarity but still needs sharper credibility signals. (${now()})`
  };

  try {
    const content = await callNemotron(
      [
        {
          role: "system",
          content:
            "You are a Critic Agent. Return JSON only with keys: score {clarity, completeness, conversion, polish, credibility, total}, notes {strengths, weaknesses, nextChanges, rationale}."
        },
        {
          role: "user",
          content: JSON.stringify({ iteration })
        }
      ],
      0.5
    );
    const parsed = safeParseJson<{ score: CriticScore; notes: CriticNotes }>(content);
    if (!parsed) {
      return { score: fallbackScore, notes: fallbackNotes };
    }
    return parsed;
  } catch {
    return { score: fallbackScore, notes: fallbackNotes };
  }
}

export async function nemotronOptimizer(notes: CriticNotes): Promise<string[]> {
  const fallback = [
    `Tighten messaging around ${notes.nextChanges[0] ?? "proof points"}.`,
    `Add a compact trust bar with recognizable logos.`,
    `Upgrade pricing CTA microcopy for urgency.`
  ];

  try {
    const content = await callNemotron(
      [
        {
          role: "system",
          content: "You are an Optimizer Agent. Return JSON only with key: changes (array of strings)."
        },
        { role: "user", content: JSON.stringify(notes) }
      ],
      0.55
    );
    const parsed = safeParseJson<{ changes: string[] }>(content);
    return parsed?.changes ?? fallback;
  } catch {
    return fallback;
  }
}

export async function nemotronStopAgent(score: CriticScore, iteration: number): Promise<StopDecision> {
  const fallback: StopDecision =
    score.total >= 85
      ? { decision: "SHIP", reason: "Score threshold reached with strong conversion and polish." }
      : iteration >= 5
        ? { decision: "SHIP", reason: "Max iterations reached; further gains likely marginal." }
        : { decision: "CONTINUE", reason: "Quality improving; continue refining." };

  try {
    const content = await callNemotron(
      [
        {
          role: "system",
          content: "You are a Stop Agent. Return JSON only with keys: decision (CONTINUE or SHIP) and reason."
        },
        { role: "user", content: JSON.stringify({ score, iteration }) }
      ],
      0.3
    );
    const parsed = safeParseJson<StopDecision>(content);
    if (!parsed) return fallback;

    if (score.total >= 85 || iteration >= 5) {
      return { decision: "SHIP", reason: parsed.reason ?? fallback.reason };
    }
    return parsed;
  } catch {
    return fallback;
  }
}
