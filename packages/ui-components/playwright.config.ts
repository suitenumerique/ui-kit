import { defineConfig, devices } from "@playwright/experimental-ct-react";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  // Playwright uses half the CPUs on CI by default: 2 workers on the 4 vCPU
  // GitHub runners. The tests mostly wait on the browsers, so one worker per
  // vCPU keeps them busy.
  workers: process.env.CI ? 4 : undefined,
  // A test slowed down by the busy runner gets a second chance. Playwright
  // still reports it as flaky, so the slow tests stay visible.
  retries: process.env.CI ? 1 : 0,
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
  // Goldens are keyed by browser only: the visual specs check bitmaps that
  // pdfjs produces itself, so the same golden serves macOS and the Linux CI.
  snapshotPathTemplate:
    "{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}",
  reporter: [["html", { outputFolder: "./e2e/report" }]],
});
