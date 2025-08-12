import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@openfun/cunningham-react";
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

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const All: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Button color="primary" size="medium">
          Primary
        </Button>
        <Button color="primary-text" size="medium">
          Primary text
        </Button>
        <Button color="secondary" size="medium">
          Secondary
        </Button>
        <Button color="tertiary" size="medium">
          Tertiary
        </Button>
        <Button color="danger" size="medium">
          Danger
        </Button>
      </div>
    );
  },
};

export const AllAsLink: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Button href="#" color="primary" size="medium">
          Primary link
        </Button>
        <Button href="#" color="primary-text" size="medium">
          Primary text link
        </Button>
        <Button href="#" color="secondary" size="medium">
          Secondary link
        </Button>
        <Button href="#" color="tertiary" size="medium">
          Tertiary link
        </Button>
        <Button href="#" color="danger" size="medium">
          Danger link
        </Button>
        </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Button color="primary" size="medium" disabled>
            Primary
          </Button>
          <Button color="primary-text" size="medium" disabled>
            Primary text
          </Button>
          <Button color="secondary" size="medium" disabled>
            Secondary
          </Button>
          <Button color="tertiary" size="medium" disabled>
            Tertiary
          </Button>
          <Button color="danger" size="medium" disabled>
            Danger
          </Button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Button href="#" color="primary" size="medium" disabled>
            Primary link
          </Button>
          <Button href="#" color="primary-text" size="medium" disabled>
            Primary text link
          </Button>
          <Button href="#" color="secondary" size="medium" disabled>
            Secondary link
          </Button>
          <Button href="#" color="tertiary" size="medium" disabled>
            Tertiary link
          </Button>
          <Button href="#" color="danger" size="medium" disabled>
            Danger link
          </Button>
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
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Button
          color="primary"
          size="medium"
          icon={<span className="material-icons">add</span>}
        >
          Primary
        </Button>
        <Button
          color="primary-text"
          size="medium"
          icon={<span className="material-icons">add</span>}
        >
          Primary text
        </Button>
        <Button
          color="secondary"
          size="medium"
          icon={<span className="material-icons">add</span>}
        >
          Secondary
        </Button>
        <Button
          color="tertiary"
          size="medium"
          icon={<span className="material-icons">add</span>}
        >
          Tertiary
        </Button>
        <Button
          color="danger"
          size="medium"
          icon={<span className="material-icons">add</span>}
        >
          Danger
        </Button>
      </div>
    );
  },
};

export const AllWithIconsSmall: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Button
          color="primary"
          size="small"
          icon={<span className="material-icons">add</span>}
        >
          Primary
        </Button>
        <Button
          color="primary-text"
          size="small"
          icon={<span className="material-icons">add</span>}
        >
          Primary text
        </Button>
        <Button
          color="secondary"
          size="small"
          icon={<span className="material-icons">add</span>}
        >
          Secondary
        </Button>
        <Button
          color="tertiary"
          size="small"
          icon={<span className="material-icons">add</span>}
        >
          Tertiary
        </Button>
        <Button
          color="danger"
          size="small"
          icon={<span className="material-icons">add</span>}
        >
          Danger
        </Button>
      </div>
    );
  },
};
