import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: './src/index.ts'
      },
      name: "@lasuite/ui-kit",
      formats: ['es', 'cjs'],
      cssFileName: 'style'
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
      copyPublicDir: false,
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
      }
    ],
  },
  
});