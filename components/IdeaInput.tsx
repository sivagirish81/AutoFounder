"use client";

import { useState } from "react";

type IdeaInputProps = {
  idea: string;
  onReset: (idea: string) => void;
  onRun: () => void;
  isRunning: boolean;
  stopDecision?: string;
};

export function IdeaInput({ idea, onReset, onRun, isRunning, stopDecision }: IdeaInputProps) {
  const [value, setValue] = useState(idea);

  return (
    <div className="flex flex-col gap-3 border border-white/10 bg-slate/50 p-4">
      <label className="text-xs uppercase tracking-[0.3em] text-flux">Startup Idea</label>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="min-h-[80px] w-full resize-none rounded-lg border border-white/10 bg-ink/80 p-3 text-sm text-haze focus:border-flux/60 focus:outline-none"
      />
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onReset(value)}
          className="rounded-full border border-flux/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-flux hover:bg-flux/10"
        >
          Reset Loop
        </button>
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className="rounded-full border border-neon/60 bg-neon/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neon hover:bg-neon/20 disabled:opacity-50"
        >
          {isRunning ? "Running..." : "Run Next Iteration"}
        </button>
        {stopDecision ? (
          <span className="rounded-full border border-aura/40 bg-aura/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-aura">
            {stopDecision}
          </span>
        ) : null}
      </div>
    </div>
  );
}
