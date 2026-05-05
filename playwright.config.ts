import { defineConfig, devices } from "@playwright/experimental-ct-react";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    viewport: { width: 1280, height: 720 },
    ctViteConfig: {
      publicDir: resolve(__dirname, "./public"),
      resolve: {
        alias: [
          { find: ":", replacement: resolve(__dirname, "./src") },
          { find: "src", replacement: resolve(__dirname, "./src") },
        ],
      },
    },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  ],
  reporter: [["html", { outputFolder: "./e2e/report" }]],
});
