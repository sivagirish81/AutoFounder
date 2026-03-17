import { randomUUID } from "crypto";
import { runBuilder } from "@/lib/agents/builder";
import { runCritic } from "@/lib/agents/critic";
import { runOptimizer } from "@/lib/agents/optimizer";
import { runPromptEngineer } from "@/lib/agents/promptEngineer";
import { runStopAgent } from "@/lib/agents/stopAgent";
import { runStrategist } from "@/lib/agents/strategist";
import { runUXAgent } from "@/lib/agents/uxAgent";
import { deployToVercel } from "@/lib/deploy/vercel";
import { persistGeneratedSite } from "@/lib/v0/persist";
import type { AgentEvent, IterationRecord, OrchestratorState } from "@/types/iteration";

const now = () => new Date().toISOString();

function event(agent: string, message: string): AgentEvent {
  return { id: randomUUID(), agent, message, timestamp: now() };
}

export async function runIteration(state: OrchestratorState): Promise<IterationRecord> {
  const iterationNumber = state.iterations.length + 1;
  const events: AgentEvent[] = [];

  events.push(event("Strategist", "Analyzing startup idea and defining product brief."));
  const strategist = await runStrategist(state.idea);

  events.push(event("UX Agent", "Selecting section order and conversion strategy."));
  const uxPlan = await runUXAgent(strategist);

  const previousIteration = state.iterations[state.iterations.length - 1];
  const iterationDelta = previousIteration
    ? `Improve based on critic feedback: ${previousIteration.criticNotes.nextChanges.join(", ")}`
    : undefined;

  events.push(event("Prompt Engineer", "Preparing structured v0 prompt."));
  const promptPlan = await runPromptEngineer(state.idea, strategist, uxPlan, iterationDelta);

  events.push(event("Builder", "Sending prompt to v0 for generation."));
  const v0Output = await runBuilder(promptPlan.prompt);

  events.push(event("Builder", "Writing generated output into generated-app."));
  persistGeneratedSite(v0Output.code);

  events.push(event("Deploy Agent", "Deploying iteration to Vercel."));
  const deployment = await deployToVercel(iterationNumber);

  events.push(event("Critic", "Scoring deployed result and capturing feedback."));
  const criticResult = await runCritic(state.idea, iterationNumber);

  events.push(event("Optimizer", "Deciding highest-impact improvements."));
  const optimizerNotes = await runOptimizer(criticResult.notes);

  events.push(event("Stop Agent", "Evaluating stop conditions."));
  const stopDecision = await runStopAgent(criticResult.score, iterationNumber);

  return {
    id: randomUUID(),
    iteration: iterationNumber,
    idea: state.idea,
    timestamp: now(),
    strategist,
    uxPlan,
    promptPlan,
    v0Output: `${v0Output.code}\n${v0Output.previewNotes}`,
    deploymentUrl: deployment.url,
    criticScore: criticResult.score,
    criticNotes: criticResult.notes,
    optimizerNotes,
    stopDecision,
    events
  };
}
