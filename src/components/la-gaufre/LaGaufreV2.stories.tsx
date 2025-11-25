import type { Meta, StoryObj } from "@storybook/react";

import { LaGaufre } from "./LaGaufre";
import { LaGaufreV2 } from "./LaGaufreV2";

const meta = {
  title: "Components/LaGaufreV2",
  component: LaGaufreV2,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LaGaufre>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    widgetPath: "https://static.suite.anct.gouv.fr/widgets/lagaufre.js",
    apiUrl: "https://lasuite.numerique.gouv.fr/api/services",
  },
  render: (args) => {
    return (
      <div
        style={{ width: "100vw", display: "flex", justifyContent: "center" }}
      >
        <LaGaufreV2 {...args} />
      </div>
    );
  },
};
