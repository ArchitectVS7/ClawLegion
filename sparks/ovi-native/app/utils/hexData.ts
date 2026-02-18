// hexData.ts — placeholder hex data generator for Cyberscape proto pass
// Represents real top-level directories in /root/.openclaw/workspace

import { HexCell } from '../types/hex';

export function generateHexData(): HexCell[] {
  return [
    { id: 'sparks',          label: 'sparks',       status: 'active', agentCount: 3, path: 'sparks' },
    { id: 'legion',          label: 'legion',        status: 'active', agentCount: 2, path: 'legion' },
    { id: 'office-space',    label: 'office',        status: 'idle',   agentCount: 0, path: 'office-space' },
    { id: 'agents',          label: 'agents',        status: 'active', agentCount: 1, path: 'agents' },
    { id: 'agency-agents',   label: 'agency',        status: 'idle',   agentCount: 0, path: 'agency-agents' },
    { id: 'todo-api',        label: 'todo-api',      status: 'error',  agentCount: 0, path: 'todo-api' },
    { id: 'testing',         label: 'testing',       status: 'idle',   agentCount: 0, path: 'testing' },
    { id: 'legion-fresh',    label: 'lg-fresh',      status: 'idle',   agentCount: 0, path: 'legion-fresh' },
    { id: 'legion-repo',     label: 'lg-repo',       status: 'idle',   agentCount: 0, path: 'legion-repo' },
    { id: 'memory',          label: 'memory',        status: 'active', agentCount: 1, path: 'memory' },
    { id: 'ovi-native',      label: 'ovi',           status: 'active', agentCount: 2, path: 'sparks/ovi-native' },
    { id: 'gateway',         label: 'gateway',       status: 'idle',   agentCount: 0, path: 'sparks/gateway' },
  ];
}
