/**
 * workspaceParser — P3.5: Agent state → terrain mapping
 * Parses workspace directory structure into HexCell data for Cyberscape view.
 * Connects to OVI backend to get live agent activity.
 */

import { HexCell, HexStatus } from "../types/hex";

const API_BASE = "http://127.0.0.1:3721/api";

// Known workspace modules with display metadata
const MODULE_REGISTRY: Record<string, { label: string; color?: string }> = {
  "sparks":         { label: "Sparks" },
  "legion":         { label: "Legion" },
  "office-space":   { label: "Office" },
  "ovi-pwa":        { label: "OVI PWA" },
  "ovi-native":     { label: "OVI App" },
  "ovi-skill":      { label: "OVI Skill" },
  "Dev-Brain":      { label: "Dev Brain" },
  "v0-automation":  { label: "v0 Auto" },
  "lovable-automation": { label: "Lovable" },
};

export interface WorkspaceState {
  hexes: HexCell[];
  lastUpdated: Date;
  activeAgents: number;
}

/**
 * Fetch live agent state from OVI backend
 */
export async function fetchWorkspaceState(): Promise<WorkspaceState> {
  try {
    const res = await fetch(`${API_BASE}/workspace-state`, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        hexes: data.hexes,
        lastUpdated: new Date(data.timestamp),
        activeAgents: data.hexes.filter((h: HexCell) => h.status === "active").length,
      };
    }
  } catch {
    // Backend not responding — use static snapshot
  }

  // Fallback: static workspace snapshot
  return buildStaticSnapshot();
}

/**
 * Static snapshot based on known workspace structure
 * Used when backend /api/workspace-state is not yet implemented
 */
function buildStaticSnapshot(): WorkspaceState {
  const hexes: HexCell[] = [
    { id: "ovi-pwa",      label: "OVI PWA",     status: "idle",   agentCount: 0, row: 0, col: 0 },
    { id: "ovi-native",   label: "OVI App",     status: "active", agentCount: 1, row: 0, col: 1 },
    { id: "ovi-skill",    label: "OVI Skill",   status: "idle",   agentCount: 0, row: 0, col: 2 },
    { id: "sparks",       label: "Sparks",      status: "active", agentCount: 2, row: 1, col: 0 },
    { id: "legion",       label: "Legion",      status: "idle",   agentCount: 0, row: 1, col: 1 },
    { id: "office-space", label: "Office",      status: "idle",   agentCount: 0, row: 1, col: 2 },
    { id: "dev-brain",    label: "Dev Brain",   status: "idle",   agentCount: 0, row: 2, col: 0 },
    { id: "v0-auto",      label: "v0 Auto",     status: "idle",   agentCount: 0, row: 2, col: 1 },
    { id: "lovable",      label: "Lovable",     status: "idle",   agentCount: 0, row: 2, col: 2 },
    { id: "openclaw",     label: "OpenClaw",    status: "active", agentCount: 1, row: 3, col: 0 },
    { id: "legion-eng",   label: "Engineering", status: "idle",   agentCount: 0, row: 3, col: 1 },
    { id: "cyberscape",   label: "Cyberscape",  status: "idle",   agentCount: 0, row: 3, col: 2 },
  ];

  return {
    hexes,
    lastUpdated: new Date(),
    activeAgents: hexes.filter(h => h.status === "active").length,
  };
}

/**
 * Poll workspace state at interval, call onUpdate with fresh data
 */
export function pollWorkspaceState(
  onUpdate: (state: WorkspaceState) => void,
  intervalMs = 10000
): () => void {
  let active = true;

  const tick = async () => {
    if (!active) return;
    const state = await fetchWorkspaceState();
    if (active) onUpdate(state);
    if (active) setTimeout(tick, intervalMs);
  };

  tick();
  return () => { active = false; };
}
