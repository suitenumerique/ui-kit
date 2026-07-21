import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: "dist",
    copyPublicDir: false,
    lib: {
      entry: {
        fonts: "./src/fonts-lasuite.scss",
      },
      formats: ["es"],
    },
    rollupOptions: {
      input: "src/fonts-lasuite.scss",
      output: {
        assetFileNames: "fonts/lasuite.css",
      },
    },
  },
});
