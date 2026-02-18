/**
 * useCyberspaceNarrator — P3.6: OVI narrates Cyberscape state in real time
 * Monitors agent activity changes, generates briefings, speaks via TTS.
 * 
 * Briefing triggers:
 * - Agent becomes active (was idle, now working)
 * - Agent count changes significantly
 * - Error state detected
 * - Periodic summary (every 5 minutes if anything changed)
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { WorkspaceState, pollWorkspaceState } from "../utils/workspaceParser";
import { HexCell } from "../types/hex";

const SUMMARY_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const API_BASE = "http://127.0.0.1:3721/api";

interface NarratorOptions {
  onBriefing: (text: string) => void; // callback to trigger TTS
  enabled: boolean;
}

export function useCyberspaceNarrator({ onBriefing, enabled }: NarratorOptions) {
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState | null>(null);
  const prevStateRef = useRef<WorkspaceState | null>(null);
  const lastSummaryRef = useRef<number>(0);
  const stopPollingRef = useRef<(() => void) | null>(null);

  const detectChanges = useCallback((prev: WorkspaceState | null, next: WorkspaceState) => {
    if (!prev) return null;

    const prevActive = new Set(prev.hexes.filter(h => h.status === "active").map(h => h.id));
    const nextActive = new Set(next.hexes.filter(h => h.status === "active").map(h => h.id));
    const errors = next.hexes.filter(h => h.status === "error");

    const newlyActive = next.hexes.filter(h => nextActive.has(h.id) && !prevActive.has(h.id));
    const newlyIdle = prev.hexes.filter(h => prevActive.has(h.id) && !nextActive.has(h.id));

    return { newlyActive, newlyIdle, errors };
  }, []);

  const generateBriefing = useCallback((
    changes: { newlyActive: HexCell[]; newlyIdle: HexCell[]; errors: HexCell[] },
    state: WorkspaceState
  ): string | null => {
    const parts: string[] = [];

    if (changes.errors.length > 0) {
      parts.push(`Error detected in ${changes.errors.map(h => h.label).join(", ")}.`);
    }

    if (changes.newlyActive.length > 0) {
      const names = changes.newlyActive.map(h => h.label).join(", ");
      parts.push(`${names} now active.`);
    }

    if (changes.newlyIdle.length > 0 && changes.newlyIdle.length <= 3) {
      const names = changes.newlyIdle.map(h => h.label).join(", ");
      parts.push(`${names} complete.`);
    }

    // Periodic summary
    const now = Date.now();
    if (now - lastSummaryRef.current > SUMMARY_INTERVAL_MS && state.activeAgents > 0) {
      const activeNames = state.hexes
        .filter(h => h.status === "active")
        .map(h => h.label)
        .join(", ");
      parts.push(`${state.activeAgents} agent${state.activeAgents > 1 ? "s" : ""} running: ${activeNames}.`);
      lastSummaryRef.current = now;
    }

    return parts.length > 0 ? parts.join(" ") : null;
  }, []);

  const handleStateUpdate = useCallback((next: WorkspaceState) => {
    setWorkspaceState(next);

    if (!enabled) {
      prevStateRef.current = next;
      return;
    }

    const changes = detectChanges(prevStateRef.current, next);
    if (changes) {
      const briefing = generateBriefing(changes, next);
      if (briefing) {
        onBriefing(briefing);
      }
    }

    prevStateRef.current = next;
  }, [enabled, detectChanges, generateBriefing, onBriefing]);

  useEffect(() => {
    // Start polling workspace state every 10 seconds
    stopPollingRef.current = pollWorkspaceState(handleStateUpdate, 10000);

    return () => {
      stopPollingRef.current?.();
    };
  }, [handleStateUpdate]);

  // Manual briefing: summarize current state on demand
  const requestBriefing = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "/ovi status",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.response) onBriefing(data.response);
      }
    } catch (err) {
      console.error("[OVI Narrator] Briefing request failed:", err);
    }
  }, [onBriefing]);

  return {
    workspaceState,
    requestBriefing,
  };
}
