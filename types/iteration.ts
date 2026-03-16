import type { CriticNotes, CriticScore, ProductBrief, PromptPlan, StopDecision, UXPlan } from "./agents";

export type AgentEvent = {
  id: string;
  agent: string;
  message: string;
  timestamp: string;
};

export type IterationRecord = {
  id: string;
  iteration: number;
  idea: string;
  timestamp: string;
  strategist: ProductBrief;
  uxPlan: UXPlan;
  promptPlan: PromptPlan;
  v0Output: string;
  deploymentUrl: string;
  criticScore: CriticScore;
  criticNotes: CriticNotes;
  optimizerNotes: string[];
  stopDecision: StopDecision;
  events: AgentEvent[];
};

export type OrchestratorState = {
  idea: string;
  iterations: IterationRecord[];
  lastUpdated: string;
};
