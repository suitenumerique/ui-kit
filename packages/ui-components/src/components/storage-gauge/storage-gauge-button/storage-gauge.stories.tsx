import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { StorageGaugeButton } from "./StorageGaugeButton";
import { IconSize } from "../../icon";
import { Warning } from ":/icons";

const meta: Meta<typeof StorageGaugeButton> = {
  title: "Components/StorageGauge/Button",
  component: StorageGaugeButton,
  args: {
    used: 1.83,
    total: 10,
    unit: "Go",
    onClick: () => alert("clicked"),
  },
  render: (args) => (
    <div style={{ width: "300px" }}>
      <StorageGaugeButton {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof StorageGaugeButton>;

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

export const Locked: Story = {
  args: {
    locked: true,
  },
};

export const LockedCustomContent: Story = {
  args: {
    locked: true,
    lockedContent: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
        }}
      >
        <Warning size={IconSize.SMALL} /> Org. quota exceeded
      </div>
    ),
  },
};

export const Animated: Story = {
  args: {
    total: 10,
  },
  render: (args) => {
    const total = args.total;
    const durationMs = 5000;
    const stepMs = 50;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [used, setUsed] = useState(0);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      let start = performance.now();
      const id = setInterval(() => {
        const elapsed = performance.now() - start;
        const progress = Math.min(elapsed / durationMs, 1);
        setUsed(progress * total);
        if (progress >= 1) {
          // Loop: restart the animation from 0%.
          start = performance.now();
        }
      }, stepMs);
      return () => clearInterval(id);
    }, [total]);

    return <StorageGaugeButton {...args} used={used} />;
  },
};
