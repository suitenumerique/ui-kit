import { CunninghamProvider } from "@openfun/cunningham-react";
import "../src/index.scss";
import type { Preview } from "@storybook/react";
import React from "react";

const preview: Preview = {
  decorators: [
    (Story) => (
      <CunninghamProvider theme="dsfr">
        <Story />
      </CunninghamProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
