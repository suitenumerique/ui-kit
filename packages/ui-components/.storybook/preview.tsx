import { CunninghamProvider } from "../src/components/provider/Provider";
import { Locales } from "../src/components/provider/Locales";
import "./../src/index.scss";
import "./../src/styles/fonts.scss";
import "./../src/style-stories.scss";
import type { Preview } from "@storybook/react";
import { DocsContainer } from "@storybook/blocks";
import { I18nProvider } from "@react-aria/i18n";
import React from "react";
import {
  BACKGROUND_COLOR_TO_THEME,
  getThemeFromGlobals,
  Themes,
  themes,
} from "./theme";

const DocsWithTheme = (props) => {
  const globals = props.context.store.userGlobals.globals;
  const theme = getThemeFromGlobals(globals);
  return (
    <CunninghamProvider
      currentLocale={globals.locale ?? Locales.enUS}
      theme={theme}
    >
      <I18nProvider locale={globals.locale ?? Locales.enUS}>
        <DocsContainer {...props} theme={themes[theme]} />
      </I18nProvider>
    </CunninghamProvider>
  );
};

const preview: Preview = {
  globalTypes: {
    locale: {
      description: "Component language",
      toolbar: {
        title: "Language",
        icon: "globe",
        dynamicTitle: true,
        items: [
          { value: Locales.enUS, title: "English" },
          { value: Locales.frFR, title: "Français" },
          { value: Locales.nlNL, title: "Nederlands" },
          { value: Locales.deDE, title: "Deutsch" },
          { value: Locales.esES, title: "Español" },
        ],
      },
    },
  },
  initialGlobals: {
    locale: Locales.enUS,
  },
  decorators: [
    (Story, context) => (
      <CunninghamProvider
        currentLocale={context.globals.locale ?? Locales.enUS}
        theme={getThemeFromGlobals(context.globals)}
      >
        <I18nProvider locale={context.globals.locale ?? Locales.enUS}>
          <div>
            <Story />
          </div>
        </I18nProvider>
      </CunninghamProvider>
    ),
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          "Getting Started",
          [
            "Installation",
            "First steps",
            "Theming",
            "Customization",
            "Colors",
            "Spacings",
            "Typography",
          ],
          "Components",
          "Migrating",
          "Misc",
        ],
      },
    },
    backgrounds: {
      default: null,
      values: Object.entries(BACKGROUND_COLOR_TO_THEME).map(([key, value]) => ({
        name: Themes[value][1],
        value: key,
      })),
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      container: DocsWithTheme,
    },
  },
};

export default preview;
