import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Calendar2 } from "../icon/icons/Calendar2";
import { CustomTabs, TabsProps } from "./Tabs";
import { TabData } from "./types";

const tabs: TabData[] = [
  { id: "overview", label: "Overview", content: "Overview content" },
  { id: "activity", label: "Activity", content: "Activity content" },
  { id: "settings", label: "Settings", content: "Settings content" },
];

const meta = {
  title: "Components/Tabs",
  component: CustomTabs,
  args: { "aria-label": "Project", tabs },
  argTypes: {
    variant: { control: "select", options: ["default", "line"] },
    keyboardActivation: {
      control: "select",
      options: ["automatic", "manual"],
    },
    onSelectionChange: { action: "selectionChanged" },
  },
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/hPwxE24MEaX3mBQ0KXNTSY/UI-kit?node-id=13516-883",
    },
  },
} satisfies Meta<typeof CustomTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Line: Story = { args: { variant: "line" } };

export const WithIcons: Story = {
  args: { tabs: tabs.map((tab) => ({ ...tab, icon: <Calendar2 /> })) },
};

export const LineWithIcons: Story = {
  args: { ...WithIcons.args, variant: "line" },
};

export const IconOnly: Story = {
  args: {
    tabs: tabs.map((tab) => ({ ...tab, icon: <Calendar2 />, iconOnly: true })),
  },
};

export const Disabled: Story = {
  args: {
    tabs: tabs.map((tab) => ({ ...tab, isDisabled: tab.id === "activity" })),
  },
};

export const FullWidth: Story = { args: { fullWidth: true } };
export const FullWidthLine: Story = {
  args: { fullWidth: true, variant: "line" },
};
export const DefaultSelection: Story = {
  args: { defaultSelectedTab: "activity" },
};
export const ManualActivation: Story = {
  args: { keyboardActivation: "manual" },
};

const ControlledExample = (args: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  return (
    <div>
      <CustomTabs
        {...args}
        selectedTab={selectedTab}
        onSelectionChange={(id) => {
          setSelectedTab(id);
          args.onSelectionChange?.(id);
        }}
      />
      <p>Selected tab: {selectedTab}</p>
      <button onClick={() => setSelectedTab("settings")}>Open settings</button>
    </div>
  );
};

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
};

export const Overflow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 240, maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    variant: "line",
    tabs: [
      ...tabs,
      {
        id: "notifications",
        label: "Notifications",
        content: "Notifications content",
      },
      {
        id: "permissions",
        label: "Permissions",
        content: "Permissions content",
      },
    ],
  },
};
