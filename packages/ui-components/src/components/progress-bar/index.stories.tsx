import { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from ":/components/progress-bar/index";

export default {
  title: "Components/ProgressBar",
  component: ProgressBar,
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof ProgressBar>;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    value: 45,
    "aria-label": "Uploading the document",
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    "aria-label": "Uploading the document",
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    "aria-label": "Uploading the document",
  },
};

export const Indeterminate: Story = {
  args: {
    "aria-label": "Preparing the export",
  },
};
