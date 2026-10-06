import type { Meta, StoryObj } from "@storybook/react";

import { Button, VariantType } from ":/cunningham";
import { Alert } from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    children: "Alert component info",
  },
};

export const CustomButtons: Story = {
  args: {
    children: "Alert component info",
    canClose: true,
    buttons: (
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button color="brand" variant="primary" size="small">
          Primary
        </Button>
        <Button color="brand" variant="secondary" size="small">
          Secondary
        </Button>
      </div>
    ),
  },
};

export const LabelledButtons: Story = {
  args: {
    children: "Alert component info",
    tertiaryLabel: "Later",
    primaryLabel: "Retry",
    canClose: true,
  },
};

export const Actions: Story = {
  args: {
    children: "Document moved",
    actions: [{ label: "Undo", onClick: () => {} }],
    canClose: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    children: "Alert component without icon",
    hideIcon: true,
  },
};

export const Success: Story = {
  args: {
    children: "Alert component Success",
    type: VariantType.SUCCESS,
  },
};

export const Warning: Story = {
  args: {
    children: "Alert component Warning",
    type: VariantType.WARNING,
  },
};

export const Error: Story = {
  args: {
    children: "Alert component Error",
    type: VariantType.ERROR,
  },
};

export const Neutral: Story = {
  args: {
    children: "Alert component Neutral",
    type: VariantType.NEUTRAL,
  },
};
