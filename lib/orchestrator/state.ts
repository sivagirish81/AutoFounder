import fs from "fs";
import path from "path";
import type { OrchestratorState } from "@/types/iteration";

const DATA_PATH =
  process.env.VERCEL === "1" || process.env.NODE_ENV === "production"
    ? path.join("/tmp", "autofounder-state.json")
    : path.join(process.cwd(), "data", "state.json");

const defaultState: OrchestratorState = {
  idea: "AI travel planner for digital nomads",
  iterations: [],
  lastUpdated: new Date().toISOString()
};

function ensureDataFile() {
  if (!fs.existsSync(DATA_PATH)) {
    try {
      const dir = path.dirname(DATA_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_PATH, JSON.stringify(defaultState, null, 2));
    } catch {
      // Ignore write errors (e.g., during build); fallback to in-memory default.
    }
  }
}

export function loadState(): OrchestratorState {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw) as OrchestratorState;
  } catch {
    return { ...defaultState, lastUpdated: new Date().toISOString() };
  }
}

export function saveState(state: OrchestratorState) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(state, null, 2));
  } catch {
    // Ignore write errors in read-only environments.
  }
}

export function resetState(idea: string): OrchestratorState {
  const state: OrchestratorState = {
    idea,
    iterations: [],
    lastUpdated: new Date().toISOString()
  };
  saveState(state);
  return state;
}
