import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "src/lib/index.ts",
      formats: ["es"],
      fileName: () => "index.mjs",
    },
    outDir: "dist/lib",
  },
});
