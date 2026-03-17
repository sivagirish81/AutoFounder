import type { IterationRecord } from "@/types/iteration";

export function IterationCard({ iteration }: { iteration: IterationRecord }) {
  const strengths = Array.isArray(iteration.criticNotes.strengths)
    ? iteration.criticNotes.strengths
    : [String(iteration.criticNotes.strengths ?? "")].filter(Boolean);
  const nextChanges = Array.isArray(iteration.criticNotes.nextChanges)
    ? iteration.criticNotes.nextChanges
    : [String(iteration.criticNotes.nextChanges ?? "")].filter(Boolean);

  return (
    <div className="rounded-lg border border-white/10 bg-slate/60 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-flux">Iteration {iteration.iteration}</p>
          <p className="text-sm text-white/60">{new Date(iteration.timestamp).toLocaleString()}</p>
        </div>
        <span className="text-sm font-mono text-neon">Score {iteration.criticScore.total}</span>
      </div>
      <div className="mt-3 text-xs text-white/70">
        <p className="text-white/50">v0 Prompt</p>
        <p className="mt-1">{iteration.promptPlan.prompt}</p>
      </div>
      <div className="mt-3 grid gap-2 text-xs text-white/70">
        <div>
          <p className="text-white/50">Critic Strengths</p>
          <p>{strengths.join(" | ")}</p>
        </div>
        <div>
          <p className="text-white/50">Highest Priority Changes</p>
          <p>{nextChanges.join(" | ")}</p>
        </div>
      </div>
    </div>
  );
}
