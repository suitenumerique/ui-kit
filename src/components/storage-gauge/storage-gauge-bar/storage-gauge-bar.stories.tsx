import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { StorageGaugeBar } from "./StorageGaugeBar";

const meta: Meta<typeof StorageGaugeBar> = {
  title: "Components/StorageGauge/Bar",
  component: StorageGaugeBar,
  args: {
    used: 1.83,
    total: 10,
  },
  render: (args) => (
    <div style={{ display: "flex", width: "300px" }}>
      <StorageGaugeBar {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof StorageGaugeBar>;

/**
 * Below 80% usage the fill uses the neutral color.
 */
export const Default: Story = {};

/**
 * Empty quota — nothing is filled.
 */
export const Empty: Story = {
  args: {
    used: 0,
    total: 10,
  },
};

/**
 * From 80% the fill switches to the warning color.
 */
export const Warning: Story = {
  args: {
    used: 8.5,
    total: 10,
  },
};

/**
 * At 100% the fill switches to the error color.
 */
export const Full: Story = {
  args: {
    used: 10,
    total: 10,
  },
};

/**
 * `used` may exceed `total`; the bar simply caps at 100%.
 */
export const Overfilled: Story = {
  args: {
    used: 15,
    total: 10,
  },
};

/**
 * Loops from 0% to 100% over five seconds so you can watch the fill cross each
 * color threshold (neutral → warning at 80% → error at 100%).
 */
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

    return (
      <div style={{ display: "flex", width: "300px" }}>
        <StorageGaugeBar {...args} used={used} />
      </div>
    );
  },
};
