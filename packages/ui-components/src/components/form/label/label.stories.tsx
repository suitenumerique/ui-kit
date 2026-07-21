import type { Meta, StoryObj } from "@storybook/react";

import { WithLabel } from "./WithLabel";
import { Label } from "./label";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Forms/Label",
  component: Label,
  tags: ["autodocs"],

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof WithLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label",
    text: "Description liée à ce label sur plusieurs lignes",
  },
};
