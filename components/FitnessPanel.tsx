import type { IterationRecord } from "@/types/iteration";

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs text-white/70">
      <span>{label}</span>
      <span className="font-mono text-neon">{value}</span>
    </div>
  );
}

export function FitnessPanel({ iteration, history }: { iteration?: IterationRecord; history: IterationRecord[] }) {
  return (
    <div className="flex h-full flex-col gap-4 border border-white/10 bg-ink/70 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-neon">Fitness Panel</p>
        <span className="text-[10px] text-white/40">Score history</span>
      </div>
      <div className="rounded-lg border border-white/10 bg-ink/60 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Total Score</p>
        <p className="text-3xl font-semibold text-haze">{iteration?.criticScore.total ?? 0}</p>
        <div className="mt-3 flex flex-col gap-2">
          <ScoreRow label="Clarity" value={iteration?.criticScore.clarity ?? 0} />
          <ScoreRow label="Completeness" value={iteration?.criticScore.completeness ?? 0} />
          <ScoreRow label="Conversion" value={iteration?.criticScore.conversion ?? 0} />
          <ScoreRow label="Polish" value={iteration?.criticScore.polish ?? 0} />
          <ScoreRow label="Credibility" value={iteration?.criticScore.credibility ?? 0} />
        </div>
      </div>
      <div className="flex-1 rounded-lg border border-white/10 bg-slate/60 p-3">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Iteration History</p>
        <div className="mt-2 space-y-2">
          {history.length === 0 ? (
            <p className="text-xs text-white/40">No iterations yet.</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs text-white/70">
                <span>Iteration {item.iteration}</span>
                <span className="font-mono text-aura">{item.criticScore.total}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-ink/60 p-3 text-xs text-white/60">
        <p className="uppercase tracking-[0.2em] text-white/50">Stop Decision</p>
        <p className="mt-2 text-neon">{iteration?.stopDecision.decision ?? "--"}</p>
        <p className="mt-1">{iteration?.stopDecision.reason ?? "Awaiting decision."}</p>
      </div>
    </div>
  );
}
