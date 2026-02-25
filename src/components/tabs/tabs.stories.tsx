import type { Meta, StoryObj } from "@storybook/react";

import { Tabs } from "./Tabs";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultSelectedTab: "Tpr",
    tabs: [
      { id: "FoR", label: "Infos" },
      { id: "Emp", label: "Activités"},
      { id: "Tpr", label: "Notifications" },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    defaultSelectedTab: "Emp",
    tabs: [
      { id: "FoR", label: "Infos", icon: "info" },
      { id: "Emp", label: "Activités", icon: "list" },
      { id: "Tpr", label: "Notifications", icon: "notifications" },
    ],
  },
};

export const WithSubtext: Story = {
  args: {
    defaultSelectedTab: "Emp",
    tabs: [
      { id: "FoR", label: "Infos", subtext: "Voir plus d'infos", icon: "info" },
      { id: "Emp", label: "Activités", subtext: "Description courte", icon: "list" },
      {
        id: "Tpr",
        label: "Notifications",
        subtext: "Voir plus de notifications",
        icon: "notifications",
      },
    ],
  },
};

