export function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-slate/60 px-6 py-4 shadow-glow">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-neon">AutoFounder</p>
        <h1 className="text-2xl font-semibold text-haze">Autonomous AI Agents That Turn Ideas Into Deployed Products</h1>
      </div>
      <div className="rounded-full border border-ember/40 bg-ember/10 px-4 py-2 text-xs text-ember">
        Nemotron + v0 + Vercel Loop
      </div>
    </header>
  );
}
