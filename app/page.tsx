"use client";

import { useEffect, useMemo, useState } from "react";
import { AgentConsole } from "@/components/AgentConsole";
import { FitnessPanel } from "@/components/FitnessPanel";
import { Header } from "@/components/Header";
import { IdeaInput } from "@/components/IdeaInput";
import { IterationCard } from "@/components/IterationCard";
import { LivePreview } from "@/components/LivePreview";
import type { OrchestratorState } from "@/types/iteration";

const emptyState: OrchestratorState = {
  idea: "AI travel planner for digital nomads",
  iterations: [],
  lastUpdated: new Date().toISOString()
};

export default function HomePage() {
  const [state, setState] = useState<OrchestratorState>(emptyState);
  const [isRunning, setIsRunning] = useState(false);

  const latest = state.iterations[0];
  const events = useMemo(() => state.iterations.flatMap((iteration) => iteration.events), [state.iterations]);

  async function fetchState() {
    const response = await fetch("/api/state");
    const data = (await response.json()) as OrchestratorState;
    setState(data);
  }

  async function runIteration() {
    setIsRunning(true);
    const response = await fetch("/api/run", {\n      method: \"POST\",\n      headers: { \"Content-Type\": \"application/json\" },\n      body: JSON.stringify({ action: \"run\" })\n    });
    const data = (await response.json()) as OrchestratorState;
    setState(data);
    setIsRunning(false);
  }

  async function resetLoop(idea: string) {
    setIsRunning(true);
    const response = await fetch(\"/api/run\", {\n      method: \"POST\",\n      headers: { \"Content-Type\": \"application/json\" },\n      body: JSON.stringify({ action: \"reset\", idea })\n    });
    const data = (await response.json()) as OrchestratorState;
    setState(data);
    setIsRunning(false);
  }

  useEffect(() => {
    fetchState();
    const timer = setInterval(fetchState, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <Header />
        <IdeaInput
          idea={state.idea}
          onReset={resetLoop}
          onRun={runIteration}
          isRunning={isRunning}
          stopDecision={latest?.stopDecision.decision}
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr_1fr]">
          <div className="flex h-[620px] flex-col">
            <AgentConsole events={events} />
          </div>
          <div className="flex h-[620px] flex-col">
            <LivePreview iteration={latest} />
          </div>
          <div className="flex h-[620px] flex-col">
            <FitnessPanel iteration={latest} history={state.iterations} />
          </div>
        </div>
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-ink/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-flux">Latest Reasoning</p>
            {latest ? (
              <div className="mt-3 space-y-3 text-sm text-white/70">
                <div>
                  <p className="text-white/50">Strategist Summary</p>
                  <p>{latest.strategist.summary}</p>
                </div>
                <div>
                  <p className="text-white/50">UX Plan</p>
                  <p>{latest.uxPlan.uxRationale}</p>
                </div>
                <div>
                  <p className="text-white/50">Optimizer Notes</p>
                  <p>{latest.optimizerNotes.join(" ")}</p>
                </div>
                <div>
                  <p className="text-white/50">Critic Rationale</p>
                  <p>{latest.criticNotes.rationale}</p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-white/40">Run the first iteration to see reasoning.</p>
            )}
          </div>
          <div className="rounded-lg border border-white/10 bg-slate/60 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-aura">Iteration Archive</p>
            <div className="mt-3 space-y-3">
              {state.iterations.length === 0 ? (
                <p className="text-sm text-white/40">No iterations yet.</p>
              ) : (
                state.iterations.map((iteration) => (
                  <IterationCard key={iteration.id} iteration={iteration} />
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
