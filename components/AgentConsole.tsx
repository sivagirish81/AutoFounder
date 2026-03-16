import type { AgentEvent } from "@/types/iteration";

const agentColors: Record<string, string> = {
  Strategist: "text-neon",
  "UX Agent": "text-flux",
  "Prompt Engineer": "text-aura",
  Builder: "text-ember",
  "Deploy Agent": "text-flux",
  Critic: "text-neon",
  Optimizer: "text-aura",
  "Stop Agent": "text-ember"
};

export function AgentConsole({ events }: { events: AgentEvent[] }) {
  return (
    <div className="flex h-full flex-col gap-3 border border-white/10 bg-ink/70 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-flux">Agent Console</p>
        <span className="text-[10px] text-white/40">Streaming rationale</span>
      </div>
      <div className="terminal-scrollbar flex-1 overflow-y-auto rounded-lg border border-white/10 bg-ink/60 p-3 font-mono text-xs">
        {events.length === 0 ? (
          <p className="text-white/40">No events yet. Run the first iteration.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="mb-2">
              <span className={agentColors[event.agent] ?? "text-neon"}>{event.agent}</span>
              <span className="text-white/40"> · {new Date(event.timestamp).toLocaleTimeString()}</span>
              <p className="text-white/80">{event.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
