#!/usr/bin/env node
/**
 * OVI PWA Deploy Script
 * Copies build artifacts to the nginx serve directory.
 * Run: pnpm deploy
 */

import { execSync } from "child_process";
import { cpSync, mkdirSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

const DIST_DIR = join(process.cwd(), "dist");
const SERVER_DIR = join(process.cwd(), "server");
const WEB_ROOT = "/var/www/ovi";
const SERVER_ROOT = "/var/www/ovi-server";

console.log("🚀 Deploying OVI PWA...");

// 1. Verify build exists
if (!existsSync(DIST_DIR)) {
  console.error("❌ dist/ not found. Run: pnpm build");
  process.exit(1);
}

// 2. Deploy static files
console.log(`📦 Copying static files to ${WEB_ROOT}...`);
mkdirSync(WEB_ROOT, { recursive: true });
cpSync(DIST_DIR, WEB_ROOT, { recursive: true });
console.log("✅ Static files deployed");

// 3. Deploy server
console.log(`📦 Copying server to ${SERVER_ROOT}...`);
mkdirSync(SERVER_ROOT, { recursive: true });
cpSync(SERVER_DIR, join(SERVER_ROOT, "server"), { recursive: true });
cpSync("package.json", join(SERVER_ROOT, "package.json"));
console.log("✅ Server deployed");

// 4. Install server dependencies
console.log("📦 Installing server dependencies...");
execSync("pnpm install --prod", { cwd: SERVER_ROOT, stdio: "inherit" });
console.log("✅ Dependencies installed");

// 5. Deploy nginx config
console.log("⚙️  nginx config: nginx.conf");
console.log("   Run manually:");
console.log("   sudo cp nginx.conf /etc/nginx/sites-available/ovi");
console.log("   sudo ln -sf /etc/nginx/sites-available/ovi /etc/nginx/sites-enabled/ovi");
console.log("   sudo nginx -t && sudo systemctl reload nginx");

// 6. Deploy systemd service
console.log("⚙️  systemd service: ovi.service");
console.log("   Run manually:");
console.log("   sudo cp ovi.service /etc/systemd/system/ovi.service");
console.log("   sudo systemctl daemon-reload");
console.log("   sudo systemctl enable ovi && sudo systemctl start ovi");

console.log("");
console.log("✅ OVI PWA deployment complete!");
console.log(`   Static: ${WEB_ROOT}`);
console.log(`   Server: ${SERVER_ROOT}`);
