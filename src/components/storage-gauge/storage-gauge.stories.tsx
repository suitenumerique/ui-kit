import type { Meta, StoryObj } from "@storybook/react";
import { StorageGauge } from "./StorageGauge";

const meta: Meta<typeof StorageGauge> = {
  title: "Components/StorageGauge",
  component: StorageGauge,
  args: {
    used: 1.83,
    total: 10,
    unit: "Go",
  },
};

export default meta;
type Story = StoryObj<typeof StorageGauge>;

export const Default: Story = {};

/** Clickable gauge button: a trailing arrow hints it opens more details. */
export const WithArrow: Story = {
  args: {
    showArrow: true,
  },
};

export const Compact: Story = {
  args: {
    compact: true,
  },
};

/** Warning color once usage crosses the warning threshold (default 90%). */
export const Warning: Story = {
  args: {
    used: 9.1,
    total: 10,
    showArrow: true,
  },
};

export const AlmostFull: Story = {
  args: {
    used: 9.2,
    total: 10,
  },
};

export const AlmostFullCompact: Story = {
  args: {
    used: 9.2,
    total: 10,
    compact: true,
  },
};

export const Empty: Story = {
  args: {
    used: 0,
    total: 10,
  },
};

export const Full: Story = {
  args: {
    used: 10,
    total: 10,
  },
};
