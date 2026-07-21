import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox } from "@gouvfr-lasuite/cunningham-react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    checked: true,
  },
};

export const IndeterminateDisable: Story = {
  args: {
    indeterminate: true,
    checked: true,
    disabled: true,
  },
};

export const WithLabel: Story = {
  args: {
    checked: true,
    label: "Label",
    text: "Description liée à ce label sur plusieurs lignes",
  },
};
