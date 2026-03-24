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

export const Compact: Story = {
  args: {
    compact: true,
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
