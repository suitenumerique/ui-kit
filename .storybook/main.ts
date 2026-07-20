import { mergeConfig } from "vite";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  // Fonts are served at "/" for dev mode and "/assets" for production builds.
  // In production, Vite bundles CSS into "assets/preview-*.css" with relative
  // url(./Marianne-*.woff2) references, resolving to "/assets/".
  staticDirs: [
    "../src/assets/fonts/Marianne",
    { from: "../src/assets/fonts/Marianne", to: "/assets" },
    // pdfjs-dist worker so PdfPreview's default workerSrc ("/pdf.worker.mjs") resolves.
    { from: "../node_modules/pdfjs-dist/build", to: "/" },
  ],

  // Pre-bundle addon previews up front so Vite does not discover them lazily and
  // trigger a mid-session dep re-optimization + reload, which races with the
  // browser and breaks dynamic imports ("Failed to fetch dynamically imported module").
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      optimizeDeps: {
        include: [
          "@storybook/addon-interactions/preview",
          "@storybook/addon-a11y/preview",
          "@storybook/addon-essentials/actions/preview",
          "@storybook/addon-essentials/docs/preview",
          "@storybook/addon-essentials/backgrounds/preview",
          "@storybook/addon-essentials/viewport/preview",
          "@storybook/addon-essentials/measure/preview",
          "@storybook/addon-essentials/outline/preview",
          "@storybook/addon-essentials/highlight/preview",
        ],
      },
    }),
};
export default config;
