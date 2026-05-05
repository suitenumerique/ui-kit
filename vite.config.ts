/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    // Playwright Component Tests under e2e/ also use `.spec.tsx` and would
    // otherwise be picked up by vitest's default glob — they're driven by
    // `yarn test:ct` (playwright.config.ts), not vitest.
    include: ["src/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
  },
  build: {
    lib: {
      entry: {
        index: "./src/index.ts",
      },
      name: "@lasuite/ui-kit",
      formats: ["es", "cjs"],
      cssFileName: "style",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@gouvfr-lasuite/cunningham-react",
        "@tanstack/react-query",
        "react-pdf",
        /^react-pdf\//,
        "pdfjs-dist",
        /^pdfjs-dist\//,
        "react-virtualized",
        /^react-virtualized\//,
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [tsconfigPaths(), dts({ rollupTypes: true }), react()],
  resolve: {
    alias: [
      {
        find: ":",
        replacement: resolve(__dirname, "./src"),
      },
      {
        find: "src",
        replacement: resolve(__dirname, "./src"),
      },
    ],
  },
});
