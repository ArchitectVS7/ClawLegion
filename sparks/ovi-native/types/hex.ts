export type HexStatus = "idle" | "active" | "error" | "warning";

export interface HexCell {
  id: string;
  label: string;
  status: HexStatus;
  agentCount: number;
  row: number;
  col: number;
}
