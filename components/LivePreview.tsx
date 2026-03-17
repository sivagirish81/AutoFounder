import type { IterationRecord } from "@/types/iteration";

export function LivePreview({ iteration }: { iteration?: IterationRecord }) {
  return (
    <div className="flex h-full flex-col gap-3 border border-white/10 bg-slate/60 p-4 shadow-ember">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-aura">Live Product Preview</p>
          <p className="text-sm text-white/60">Iteration {iteration?.iteration ?? 0}</p>
        </div>
        <a
          href={iteration?.deploymentUrl ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="text-xs uppercase tracking-[0.2em] text-flux hover:text-neon"
        >
          {iteration?.deploymentUrl ?? "No deployment yet"}
        </a>
      </div>
      <div className="flex-1 rounded-lg border border-white/10 bg-ink/50">
        {iteration?.deploymentUrl ? (
          <iframe
            title="Deployment preview"
            src={iteration.deploymentUrl}
            className="h-full w-full rounded-lg"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/40">
            Awaiting first deployment.
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>Auto-refreshes on each run</span>
        <span>Last update: {iteration ? new Date(iteration.timestamp).toLocaleTimeString() : "--"}</span>
      </div>
    </div>
  );
}
