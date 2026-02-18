/**
 * StatusBar — Connection status indicator
 * P4.4: Added reconnecting state with pulse animation (#1)
 */

import type { OVIStatus } from "../hooks/useOVI";
import "./StatusBar.css";

interface StatusBarProps {
  status: OVIStatus;
}

export function StatusBar({ status }: StatusBarProps) {
  const getStatusDotClass = () => {
    if (status.reconnecting) return "status-dot--reconnecting";
    if (status.gateway === "connected") return "status-dot--connected";
    if (status.connected) return "status-dot--partial";
    return "status-dot--disconnected";
  };

  const getStatusText = () => {
    if (status.reconnecting) return "Reconnecting…";
    if (status.gateway === "connected") return "Connected";
    if (status.connected) return "Server up, gateway offline";
    return "Offline";
  };

  return (
    <div className="status-bar">
      <span className={`status-dot ${getStatusDotClass()}`} />
      <span className="status-text">{getStatusText()}</span>
    </div>
  );
}
