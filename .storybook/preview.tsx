import { CunninghamProvider } from "../src/components/Provider/Provider";
import "./../src/index.scss";
import "./../src/styles/fonts.scss";
import "./../src/style-stories.scss";
import type { Preview } from "@storybook/react";
import { DocsContainer } from "@storybook/blocks";
import React from "react";
import { BACKGROUND_COLOR_TO_THEME, getThemeFromGlobals, Themes, themes } from "./theme";

const DocsWithTheme = (props) => {
  const theme = getThemeFromGlobals(props.context.store.userGlobals.globals);
  return (
    <CunninghamProvider theme={theme}>
      <DocsContainer {...props} theme={themes[theme]} />
    </CunninghamProvider>
  );
};

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <CunninghamProvider currentLocale="en-US" theme={getThemeFromGlobals(context.globals)}>
        <div>
          <Story />
        </div>
      </CunninghamProvider>
    ),
  ],
  parameters: {
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
