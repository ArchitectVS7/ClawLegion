/**
 * StatusBar — Connection status indicator
 */

import type { OVIStatus } from "../hooks/useOVI";

interface StatusBarProps {
  status: OVIStatus;
}

export function StatusBar({ status }: StatusBarProps) {
  const getStatusDot = () => {
    if (status.gateway === "connected") return "status-dot--connected";
    if (status.connected) return "status-dot--partial";
    return "status-dot--disconnected";
  };

  const getStatusText = () => {
    if (status.gateway === "connected") return "Connected";
    if (status.connected) return "Server up, gateway reconnecting…";
    return "Offline";
  };

  return (
    <div className="status-bar">
      <span className={`status-dot ${getStatusDot()}`} />
      <span className="status-text">{getStatusText()}</span>
    </div>
  );
}
