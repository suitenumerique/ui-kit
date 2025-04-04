import { CunninghamProvider } from "../src/components/Provider/Provider";
import "./../src/index.scss";
import "./../src/style-stories.scss";
import type { Preview } from "@storybook/react";
import React from "react";

const preview: Preview = {
  decorators: [
    (Story) => (
      <CunninghamProvider currentLocale="fr-FR">
        <div>
          <Story />
        </div>
      </CunninghamProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      values: [
        // 👇 Add your own
        { name: "Gray", value: "#F7F9F2" },
      ],
      // 👇 Specify which background is shown by default
      default: "light",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
