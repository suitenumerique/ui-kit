import { mergeConfig } from "vite";
import type { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

const normalizeBasePath = (basePath?: string) => {
  const path = basePath?.trim().replace(/^\/+|\/+$/g, "");

  return path ? `/${path}/` : "/";
};

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  // Fonts are copied to both the output root and its assets directory. Vite's
  // base then keeps their public URLs inside the configured Storybook path.
  staticDirs: [
    "../src/assets/fonts/Marianne",
    { from: "../src/assets/fonts/Marianne", to: "/assets" },
    // FilePreviewExample points to this worker through import.meta.env.BASE_URL.
    { from: "../../../node_modules/pdfjs-dist/build", to: "/" },
  ],
  docs: {
    autodocs: false,
  },
  async viteFinal(viteConfig, { configType }) {
    viteConfig.base =
      configType === "PRODUCTION"
        ? normalizeBasePath(process.env.STORYBOOK_BASE_PATH)
        : "/";
    viteConfig.plugins = viteConfig.plugins?.filter((plugin) => {
      return !(
        typeof plugin === "object" &&
        plugin !== null &&
        "name" in plugin &&
        plugin.name === "vite:dts"
      );
    });
    viteConfig.build = {
      ...viteConfig.build,
      commonjsOptions: {
        ...viteConfig.build?.commonjsOptions,
        include: [/node_modules/, /packages\/ui-tokens\/dist\/lib/],
      },
    };
    // Pre-bundle addon previews up front so Vite does not discover them lazily and
    // trigger a mid-session dep re-optimization + reload, which races with the
    // browser and breaks dynamic imports ("Failed to fetch dynamically imported module").
    return mergeConfig(viteConfig, {
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
    });
  },
};
export default config;
