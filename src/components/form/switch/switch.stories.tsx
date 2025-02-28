import type { Meta, StoryObj } from "@storybook/react";

import { Switch } from "@openfun/cunningham-react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Forms/Switch",
  component: Switch,
  tags: ["autodocs"],

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof Switch>;

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

export const WithLabel: Story = {
  render: () => (
    <div style={{ maxWidth: "300px" }}>
      <Switch
        labelSide="right"
        label="Label"
        text="Description liée à ce label sur plusieurs lignes"
      />
    </div>
  ),
};

export const WithLabelRight: Story = {
  render: () => (
    <div style={{ maxWidth: "300px" }}>
      <Switch
        labelSide="left"
        label="Label"
        text="Description liée à ce label sur plusieurs lignes"
      />
    </div>
  ),
};
