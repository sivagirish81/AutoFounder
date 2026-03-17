import fs from "fs";
import path from "path";
import type { OrchestratorState } from "@/types/iteration";

const DATA_PATH = path.join(process.cwd(), "data", "state.json");

const defaultState: OrchestratorState = {
  idea: "AI travel planner for digital nomads",
  iterations: [],
  lastUpdated: new Date().toISOString()
};

function ensureDataFile() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(defaultState, null, 2));
  }
}

export function loadState(): OrchestratorState {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as OrchestratorState;
}

export function saveState(state: OrchestratorState) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(state, null, 2));
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
