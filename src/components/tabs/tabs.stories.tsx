import type { Meta, StoryObj } from "@storybook/react";

import { CustomTabs } from "./Tabs";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Tabs",
  component: CustomTabs,
  tags: ["autodocs"],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof CustomTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultSelectedTab: "Tpr",
    tabs: [
      { id: "FoR", label: "Infos", content: "Infos", icon: "info" },
      { id: "Emp", label: "Activités", content: "Activités", icon: "list" },
      {
        id: "Tpr",
        label: "Notifications",
        content: "Notifications",
        icon: "notifications",
      },
    ],
  },
};

export const ThemeNeutral: Story = {
  args: {
    theme: "neutral",
    defaultSelectedTab: "Tpr",
    tabs: [
      { id: "FoR", label: "Infos", content: "Infos", icon: "info" },
      { id: "Emp", label: "Activités", content: "Activités", icon: "list" },
      {
        id: "Tpr",
        label: "Notifications",
        content: "Notifications",
        icon: "notifications",
      },
    ],
  },
};

export const FullWidth: Story = {
  parameters: {
    layout: "fullscreen",
  },
  args: {
    fullWidth: true,
    defaultSelectedTab: "Tpr",
    tabs: [
      { id: "FoR", label: "Infos", content: "Infos", icon: "info" },
      { id: "Emp", label: "Activités", content: "Activités", icon: "list" },
      {
        id: "Tpr",
        label: "Notifications",
        content: "Notifications",
        icon: "notifications",
      },
    ],
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    defaultSelectedTab: "Emp",
    tabs: [
      { id: "FoR", label: "Infos", content: "Infos", subtext: "Voir plus d'infos", icon: "info" },
      { id: "Emp", label: "Activités", content: "Activités", subtext: "Description courte", icon: "list" },
      {
        id: "Tpr",
        label: "Notifications",
        content: "Notifications",
        subtext: "Voir plus de notifications",
        icon: "notifications",
      },
    ],
  },
};

export const VerticalSmall: Story = {
  args: {
    orientation: 'vertical',
    defaultSelectedTab: "Emp",
    tabs: [
      { id: "FoR", label: "Infos", content: "Infos" },
      { id: "Emp", label: "Activités", content: "Activités" },
      {
        id: "Tpr",
        label: "Notifications",
        content: "Notifications",
      },
    ],
  },
};
