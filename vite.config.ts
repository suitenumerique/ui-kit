/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { readFileSync } from "fs";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8"),
) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

// Treat every dependency and peer dependency as external so the kit never
// bundles a copy of a third-party library. Consumers install these (they are
// declared as deps/peerDeps) and their bundler dedupes shared ones — which also
// keeps context-bearing libraries (react-aria-components / react-stately) as
// singletons. `pdfjs-dist` is a transitive dep of react-pdf to keep external too.
// Dependency CSS that belongs in the published stylesheet is pulled in via
// library.scss, so externalizing the JS does not drop any styles.
const externalPackages = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  "pdfjs-dist",
];

const isExternal = (id: string) =>
  externalPackages.some((dep) => id === dep || id.startsWith(`${dep}/`));

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    // Playwright Component Tests under e2e/ also use `.spec.tsx` and would
    // otherwise be picked up by vitest's default glob — they're driven by
    // `yarn test:ct` (playwright.config.ts), not vitest.
    include: ["src/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
  },
  build: {
    // Keep all CSS in a single stylesheet (dist/style.css) rather than splitting
    // it per preserved module.
    cssCodeSplit: false,
    lib: {
      entry: {
        index: "./src/index.ts",
        icons: "./src/icons.ts",
      },
      name: "@lasuite/ui-kit",
      cssFileName: "style",
    },
    rollupOptions: {
      external: isExternal,
      // `preserveModules` keeps the source module graph in the output (one file
      // per source module) instead of bundling everything into one mega-chunk.
      // Combined with `"sideEffects"` in package.json, this lets consumers
      // tree-shake: importing a single component no longer drags in the whole kit.
      output: [
        {
          format: "es",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js",
          chunkFileNames: "[name]-[hash].js",
        },
        {
          format: "cjs",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].cjs",
          chunkFileNames: "[name]-[hash].cjs",
          exports: "named",
        },
      ],
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
