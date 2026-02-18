/**
 * Cyberscape Terminal — Phase 1
 * Live ASCII hex grid visualizer for OVI workspace agent state.
 * Fetches from /api/workspace-state every 3 seconds, renders in terminal.
 */

const API_URL = process.env.OVI_API || "http://127.0.0.1:3721/api/workspace-state";
const REFRESH_MS = 3000;

// ANSI helpers
const ansi = {
  clear:   "\x1b[2J\x1b[H",
  reset:   "\x1b[0m",
  bold:    "\x1b[1m",
  dim:     "\x1b[2m",
  blink:   "\x1b[5m",
  idle:    "\x1b[2;37m",    // dim white
  active:  "\x1b[1;95m",   // bright magenta bold
  error:   "\x1b[1;91m",   // bright red bold
  warning: "\x1b[1;93m",   // bright yellow bold
  cyan:    "\x1b[1;96m",
  gray:    "\x1b[90m",
};

function colorForStatus(status) {
  return ansi[status] || ansi.idle;
}

// Render a single hex cell as ASCII art (7 wide, 4 tall)
function renderHex(hex, colOffset) {
  const color = colorForStatus(hex.status);
  const label = hex.label.slice(0, 5).padEnd(5);
  const badge = hex.agentCount > 0 ? `${ansi.cyan}${ansi.bold}${hex.agentCount}${ansi.reset}` : " ";
  const blink = hex.status === "active" ? ansi.blink : "";

  const pad = " ".repeat(colOffset);
  return [
    `${pad}  ${color}╱‾‾‾╲${ansi.reset}`,
    `${pad} ${color}│${blink}${label}${ansi.reset}${color}│${ansi.reset}${badge}`,
    `${pad}  ${color}╲___╱${ansi.reset}`,
  ];
}

function render(data) {
  const { hexes, timestamp } = data;
  const activeCount = hexes.filter(h => h.status === "active").length;
  const ts = new Date(timestamp).toLocaleTimeString();

  const lines = [];

  // Header
  lines.push(`${ansi.bold}${ansi.cyan}◈ CYBERSCAPE TERMINAL${ansi.reset}  ${ansi.gray}${ts}${ansi.reset}`);
  lines.push(`${ansi.gray}${"─".repeat(40)}${ansi.reset}`);
  lines.push(`Agents active: ${activeCount > 0 ? `${ansi.active}${activeCount}${ansi.reset}` : `${ansi.dim}0${ansi.reset}`}  │  Modules: ${hexes.length}`);
  lines.push("");

  // Group into rows
  const rows = {};
  hexes.forEach(hex => {
    if (!rows[hex.row]) rows[hex.row] = [];
    rows[hex.row].push(hex);
  });

  Object.keys(rows).sort((a, b) => a - b).forEach(rowKey => {
    const rowHexes = rows[rowKey].sort((a, b) => a.col - b.col);
    const rowNum = parseInt(rowKey);
    const rowOffset = rowNum % 2 === 1 ? 4 : 0; // stagger odd rows

    // Each hex is 3 lines tall — collect all lines for this row
    const hexLines = rowHexes.map(hex => renderHex(hex, 0));

    // Merge hex lines side by side
    const rowHeight = 3;
    for (let li = 0; li < rowHeight; li++) {
      let line = " ".repeat(rowOffset);
      hexLines.forEach((hl, i) => {
        line += (hl[li] || "        ");
        if (i < hexLines.length - 1) line += "  ";
      });
      lines.push(line);
    }
    lines.push(""); // spacing between rows
  });

  // Legend
  lines.push(`${ansi.gray}${"─".repeat(40)}${ansi.reset}`);
  lines.push(`${ansi.idle}■${ansi.reset} idle  ${ansi.active}■${ansi.reset} active  ${ansi.error}■${ansi.reset} error  ${ansi.cyan}N${ansi.reset} agent count`);
  lines.push(`${ansi.gray}Ctrl+C to exit${ansi.reset}`);

  process.stdout.write(ansi.clear + lines.join("\n") + "\n");
}

async function fetchState() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      hexes: [],
      timestamp: new Date().toISOString(),
      error: err.message,
    };
  }
}

async function main() {
  process.stdout.write(ansi.clear);
  console.log(`${ansi.cyan}◈ Cyberscape Terminal starting...${ansi.reset}`);
  console.log(`${ansi.gray}Connecting to ${API_URL}${ansi.reset}\n`);

  // Graceful exit
  process.on("SIGINT", () => {
    process.stdout.write(ansi.clear);
    console.log(`${ansi.cyan}◈ Cyberscape offline.${ansi.reset}\n`);
    process.exit(0);
  });

  // Main loop
  const loop = async () => {
    const data = await fetchState();
    if (data.error) {
      process.stdout.write(ansi.clear);
      console.log(`${ansi.error}◈ Connection failed: ${data.error}${ansi.reset}`);
      console.log(`${ansi.gray}Retrying in ${REFRESH_MS / 1000}s...${ansi.reset}`);
    } else {
      render(data);
    }
    setTimeout(loop, REFRESH_MS);
  };

  loop();
}

main();
