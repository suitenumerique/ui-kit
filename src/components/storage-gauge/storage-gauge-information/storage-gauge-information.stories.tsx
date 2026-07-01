import type { Meta, StoryObj } from "@storybook/react";
import { IconSize } from "../../icon";
import { Info } from ":/icons";
import { StorageGaugeInformation } from "./StorageGaugeInformation";
import { Button, Tooltip } from "@gouvfr-lasuite/cunningham-react";

const meta: Meta<typeof StorageGaugeInformation> = {
  title: "Components/StorageGauge/Information",
  component: StorageGaugeInformation,
  args: {
    used: 1.83,
    total: 10,
    unit: "Go",
    onMoreInfoClick: () => {
      alert("More info");
    },
  },
  render: (args) => (
    <div style={{ width: "400px" }}>
      <StorageGaugeInformation {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof StorageGaugeInformation>;

/**
 * Default layout: a title, the `used / total` usage label, and the bar below.
 */
export const Default: Story = {};

/**
 * Empty quota — the bar is empty and the neutral color is used.
 */
export const Empty: Story = {
  args: {
    used: 0,
    total: 10,
  },
};

/**
 * From 80% the bar switches to the warning color.
 */
export const AlmostFull: Story = {
  args: {
    used: 8.5,
    total: 10,
  },
};

/**
 * At 100% the bar switches to the error color.
 */
export const Full: Story = {
  args: {
    used: 10,
    total: 10,
  },
};

/**
 * Pass `onMoreInfoClick` to render the "more info" action button.
 */
export const WithoutMoreInfo: Story = {
  args: {
    onMoreInfoClick: undefined,
  },
};

/**
 * Override the default heading with `title`, and append extra nodes after it
 * with `titleChildren` (e.g. a badge or icon).
 */
export const CustomTitle: Story = {
  args: {
    title: "Custom title",
  },
};

/**
 * Override the default heading with `title`, and append extra nodes after it
 * with `titleChildren` (e.g. a badge or icon).
 */
export const CustomLabelChildren: Story = {
  args: {
    labelChildren: (
      <Tooltip content="Storage is shared across your organization">
        <Button
          icon={<Info size={IconSize.SMALL} />}
          size="nano"
          color="neutral"
          variant="tertiary"
        />
      </Tooltip>
    ),
  },
};

/**
 * When the quota cannot be displayed, pass `locked`. The usage label is replaced
 * by a default warning icon.
 */
export const Locked: Story = {
  args: {
    locked: true,
  },
};

/**
 * Provide `lockedContent` to replace the default icon with your own message.
 */
export const LockedCustomContent: Story = {
  args: {
    locked: true,
    title: "Organization quota exceeded",
    label: "Please contact admin to unlock storage",
    labelChildren: (
      <Tooltip content="Storage is shared across your organization">
        <Button
          icon={<Info size={IconSize.SMALL} />}
          size="nano"
          color="neutral"
          variant="tertiary"
        />
      </Tooltip>
    ),
  },
};
