import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: [
      "src/**/*.test.{ts,tsx}",
      "server/**/*.test.{js,mjs}",
    ],
    coverage: {
      include: ["src/**/*.{ts,tsx}", "server/**/*.js"],
      exclude: ["src/__tests__/**", "**/*.d.ts"],
    },
  },
});
