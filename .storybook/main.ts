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
};
export default config;
