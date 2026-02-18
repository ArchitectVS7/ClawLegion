// HexCell type for Cyberscape hex grid visualization

export type HexStatus = 'idle' | 'active' | 'error';

export interface HexCell {
  id: string;
  label: string;
  status: HexStatus;
  agentCount: number;
  /** Optional: directory path this hex represents */
  path?: string;
}
