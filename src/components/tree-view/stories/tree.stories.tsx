import type { Meta, StoryObj } from "@storybook/react";
import { TreeView } from ":/components/tree-view/TreeView";
import { TreeViewExemple } from "./tree-view-exemple";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof TreeView> = {
  title: "Components/TreeView [WIP]",
  component: TreeView,
};
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Controlled: Story = {
  render: () => {
    return <TreeViewExemple />;
  },
};
