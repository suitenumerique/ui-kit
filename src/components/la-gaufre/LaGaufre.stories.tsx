import type { Meta, StoryObj } from "@storybook/react";

import { LaGaufre } from "./LaGaufre";

const meta = {
  title: "Components/LaGaufre",
  component: LaGaufre,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LaGaufre>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
