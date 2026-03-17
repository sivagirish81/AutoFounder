export type ProductBrief = {
  summary: string;
  audience: string;
  valueProposition: string;
  requiredSections: string[];
  optionalSections: string[];
};

export type UXPlan = {
  sectionOrder: string[];
  uxRationale: string;
  conversionRationale: string;
  contentEmphasis: string[];
};

export type PromptPlan = {
  prompt: string;
  constraints: string[];
  iterationDelta?: string;
};

export type CriticScore = {
  clarity: number;
  completeness: number;
  conversion: number;
  polish: number;
  credibility: number;
  total: number;
};

export type CriticNotes = {
  strengths: string[];
  weaknesses: string[];
  nextChanges: string[];
  rationale: string;
};

export type StopDecision = {
  decision: "CONTINUE" | "SHIP";
  reason: string;
};
