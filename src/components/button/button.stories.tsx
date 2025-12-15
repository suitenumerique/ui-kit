import type { Meta, StoryObj } from "@storybook/react";

import { Button, ButtonProps } from "@gouvfr-lasuite/cunningham-react";
import { ProConnectButton } from "./ProConnectButton";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
const colors: ButtonProps["color"][] = [
  "brand",
  "neutral",
  "info",
  "warning",
  "error",
  "success",
];
const variants: ButtonProps["variant"][] = [
  "primary",
  "secondary",
  "tertiary",
  "bordered",
];
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const All: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {colors.map((color) => (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {variants.map((variant) => (
              <Button variant={variant} color={color} size="medium">
                {variant} {color}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {variants.map((variant) => (
            <Button color="brand" variant={variant} size="medium" disabled>
              {variant}
            </Button>
          ))}
        </div>
      </div>
    );
  },
};

export const ProConnect: Story = {
  render: () => {
    return <ProConnectButton />;
  },
};

export const ProConnectDisabled: Story = {
  render: () => {
    return <ProConnectButton disabled />;
  },
};

export const AllWithIcons: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {colors.map((color) => (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {variants.map((variant) => (
              <Button
                icon={<span className="material-icons">add</span>}
                variant={variant}
                color={color}
                size="medium"
              >
                {variant} {color}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const AllWithIconsSmall: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {colors.map((color) => (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {variants.map((variant) => (
              <Button
                icon={<span className="material-icons">add</span>}
                variant={variant}
                color={color}
                size="small"
              >
                {variant} {color}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};
