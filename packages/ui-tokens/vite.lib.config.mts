import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // build-lib first emits the tsc output (.js + .d.ts) into dist/lib, then
    // runs this vite build into the same directory for the .mjs bundle.
    emptyOutDir: false,
    lib: {
      entry: "src/lib/index.ts",
      formats: ["es"],
      fileName: () => "index.mjs",
    },
    outDir: "dist/lib",
  },
});
