/**
 * OVI Help Panel — in-app reference
 */

import { useState } from "react";
import "./HelpPanel.css";

export function HelpPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="help-trigger" onClick={() => setOpen(true)} aria-label="Help">
        ?
      </button>

      {open && (
        <div className="help-overlay" onClick={() => setOpen(false)}>
          <div className="help-panel" onClick={(e) => e.stopPropagation()}>
            <div className="help-header">
              <span className="help-logo">◈</span>
              <span className="help-title">OVI</span>
              <button className="help-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="help-body">
              <p className="help-tagline">Orchestrated Voice Interface — your AI system's voice.</p>

              <section>
                <h3>What is this?</h3>
                <p>OVI connects you to LG2 and the agent system running on your droplet. Talk to it — it talks back. Behind the scenes, agents are working. OVI is how you check in.</p>
              </section>

              <section>
                <h3>How to use it</h3>
                <ul>
                  <li><strong>Hold</strong> the button → speak → <strong>release</strong> to send</li>
                  <li>Responses appear in the feed as text</li>
                  <li>Voice responses play automatically when available</li>
                  <li>Tap a message to copy it</li>
                </ul>
              </section>

              <section>
                <h3>Voice commands</h3>
                <ul>
                  <li><code>/ovi</code> — full system briefing</li>
                  <li><code>/ovi status</code> — one-line health check</li>
                  <li><code>/ovi spec</code> — current OVI build progress</li>
                  <li><code>/ovi roll</code> — roll d20, consult table, take action</li>
                  <li>Anything else — direct message to LG2</li>
                </ul>
              </section>

              <section>
                <h3>Status indicators</h3>
                <ul>
                  <li><span className="dot green" /> <strong>Connected</strong> — gateway live</li>
                  <li><span className="dot yellow" /> <strong>Connecting</strong> — establishing link</li>
                  <li><span className="dot red" /> <strong>Offline</strong> — no gateway connection</li>
                </ul>
              </section>

              <section>
                <h3>Current version</h3>
                <p>Phase 2 — PWA voice interface. Phase 3 (native app + Cyberscape) in progress.</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
