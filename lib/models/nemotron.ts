import type { ProductBrief, UXPlan, PromptPlan, CriticScore, CriticNotes, StopDecision } from "@/types/agents";

const now = () => new Date().toISOString();

export async function nemotronStrategist(idea: string): Promise<ProductBrief> {
  return {
    summary: `AutoFounder will build a fast, credible landing page for: ${idea}.`,
    audience: "Hackathon judges, early adopters, and product builders evaluating the idea.",
    valueProposition: "Turn an idea into a deployed, iteration-ready product site with autonomous agent feedback.",
    requiredSections: ["Hero", "Problem", "Solution", "How it works", "Key features", "Workflow", "Pricing or Waitlist", "FAQ", "Footer"],
    optionalSections: ["Testimonials", "Metrics", "Security", "Integrations"]
  };
}

export async function nemotronUXPlan(brief: ProductBrief): Promise<UXPlan> {
  return {
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
}

export async function nemotronPromptEngineer(
  idea: string,
  brief: ProductBrief,
  uxPlan: UXPlan,
  iterationDelta?: string
): Promise<PromptPlan> {
  const base = [
    `Product summary: ${brief.summary}`,
    `Target audience: ${brief.audience}`,
    `Goal: convert visitors into demo requests or waitlist signups.`,
    `Required sections: ${brief.requiredSections.join(", ")}.`,
    `Section order: ${uxPlan.sectionOrder.join(" > ")}.`,
    `Design style: bold terminal-inspired dashboard + clean startup landing page, dark gradient background, neon accents, strong typography.`,
    `Functional constraints: responsive, accessible, include a mock live preview section and a score panel.`,
    `Conversion goals: highlight value prop, show workflow steps, add trust indicators and pricing CTA.`,
    `Tone: confident, autonomous, builder-grade.`
  ];

  if (iterationDelta) {
    base.push(`Iteration improvements: ${iterationDelta}`);
  }

  return {
    prompt: base.join("\n"),
    constraints: ["Use semantic HTML", "Polished landing page with sections", "No external data dependencies"],
    iterationDelta
  };
}

export async function nemotronCritic(_idea: string, iteration: number): Promise<{ score: CriticScore; notes: CriticNotes }> {
  const clarity = Math.min(25, 14 + iteration * 2);
  const completeness = Math.min(20, 12 + iteration * 1.5);
  const conversion = Math.min(20, 11 + iteration * 1.8);
  const polish = Math.min(20, 10 + iteration * 1.7);
  const credibility = Math.min(15, 8 + iteration * 1.2);
  const total = Math.min(100, Math.round(clarity + completeness + conversion + polish + credibility));

  const score: CriticScore = {
    clarity,
    completeness,
    conversion,
    polish,
    credibility,
    total
  };

  return {
    score,
    notes: {
      strengths: ["Clear narrative arc", "Strong CTA placement", "Good visual hierarchy"],
      weaknesses: ["Need clearer proof points", "Pricing section could be sharper"],
      nextChanges: ["Add metrics block", "Refine testimonials copy"],
      rationale: `Iteration ${iteration} improved layout clarity but still needs sharper credibility signals. (${now()})`
    }
  };
}

export async function nemotronOptimizer(notes: CriticNotes): Promise<string[]> {
  return [
    `Tighten messaging around ${notes.nextChanges[0] ?? "proof points"}.`,
    `Add a compact trust bar with recognizable logos.`,
    `Upgrade pricing CTA microcopy for urgency.`
  ];
}

export async function nemotronStopAgent(score: CriticScore, iteration: number): Promise<StopDecision> {
  if (score.total >= 85) {
    return { decision: "SHIP", reason: "Score threshold reached with strong conversion and polish." };
  }
  if (iteration >= 5) {
    return { decision: "SHIP", reason: "Max iterations reached; further gains likely marginal." };
  }
  return { decision: "CONTINUE", reason: "Quality improving; continue refining." };
}
