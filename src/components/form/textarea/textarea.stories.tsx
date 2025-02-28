import type { Meta, StoryObj } from "@storybook/react";

import { TextArea } from "@openfun/cunningham-react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Forms/TextArea",
  component: TextArea,
  tags: ["autodocs"],

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "Hello world",
    label: "Describe your job",
  },
};
