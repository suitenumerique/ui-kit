import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./Icon";
import { IconSize, IconType } from "./types";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "The name of the Material Icon to display",
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large", "xlarge"],
      description: "The size of the icon",
    },
    color: {
      control: "color",
      description: "Custom color for the icon",
    },
    clickable: {
      control: "boolean",
      description: "Whether the icon should be clickable",
    },
    onClick: {
      action: "clicked",
      description: "Click handler for the icon",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic icon story
export const Default: Story = {
  args: {
    name: "home",
    size: IconSize.MEDIUM,
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Icon name="home" size={IconSize.X_SMALL} />
        <Icon name="home" size={IconSize.SMALL} />
        <Icon name="home" size={IconSize.MEDIUM} />
        <Icon name="home" size={IconSize.LARGE} />
        <Icon name="home" size={IconSize.X_LARGE} />
        <Icon name="home" size={84} />
      </div>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Icon name="home" size={IconSize.X_SMALL} type={IconType.OUTLINED} />
        <Icon name="home" size={IconSize.SMALL} type={IconType.OUTLINED} />
        <Icon name="home" size={IconSize.MEDIUM} type={IconType.OUTLINED} />
        <Icon name="home" size={IconSize.LARGE} type={IconType.OUTLINED} />
        <Icon name="home" size={IconSize.X_LARGE} type={IconType.OUTLINED} />
        <Icon name="home" size={84} type={IconType.OUTLINED} />
      </div>
    </div>
  ),
};

export const Outlined: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Icon name="home" type={IconType.OUTLINED} />
      <Icon name="check_circle" type={IconType.OUTLINED} />
      <Icon name="info" type={IconType.OUTLINED} />
    </div>
  ),
};

// Different colors
export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Icon name="favorite" color="#e74c3c" />
      <Icon name="star" color="#f39c12" />
      <Icon name="check_circle" color="#27ae60" />
      <Icon name="info" color="#3498db" />
      <Icon name="warning" color="#9b59b6" />
    </div>
  ),
};

// Clickable icons
export const Clickable: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Icon
        name="favorite"
        clickable
        onClick={() => alert("Favorite clicked!")}
        color="#e74c3c"
      />
      <Icon
        name="delete"
        clickable
        onClick={() => alert("Delete clicked!")}
        color="#e74c3c"
      />
      <Icon
        name="edit"
        clickable
        onClick={() => alert("Edit clicked!")}
        color="#3498db"
      />
      <Icon
        name="share"
        clickable
        onClick={() => alert("Share clicked!")}
        color="#27ae60"
      />
    </div>
  ),
};

// Common icons showcase
export const CommonIcons: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "16px",
      }}
    >
      <Icon name="home" />
      <Icon name="search" />
      <Icon name="settings" />
      <Icon name="person" />
      <Icon name="notifications" />
      <Icon name="menu" />
      <Icon name="close" />
      <Icon name="check" />
      <Icon name="add" />
      <Icon name="remove" />
      <Icon name="edit" />
      <Icon name="delete" />
      <Icon name="favorite" />
      <Icon name="star" />
      <Icon name="share" />
      <Icon name="download" />
      <Icon name="upload" />
      <Icon name="refresh" />
      <Icon name="info" />
      <Icon name="warning" />
      <Icon name="error" />
      <Icon name="help" />
      <Icon name="visibility" />
      <Icon name="visibility_off" />
      <Icon name="lock" />
      <Icon name="unlock" />
    </div>
  ),
};

// Interactive playground
export const Playground: Story = {
  args: {
    name: "home",
    size: IconSize.MEDIUM,
    clickable: false,
  },
};
