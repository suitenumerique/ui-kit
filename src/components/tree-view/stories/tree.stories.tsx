import type { Meta, StoryObj } from "@storybook/react";
import { TreeView } from ":/components/tree-view/TreeView";
import { TreeViewExemple, TreeViewExempleData } from "./tree-view-exemple";
import {
  complexTreeData,
  simpleTreeData,
  simpleWithChildrenTreeData,
} from "./data";

import { ReactNode } from "react";
import { TreeProvider } from "../providers/TreeContext";
import { TreeViewNodeTypeEnum } from "../types";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof TreeView> = {
  title: "Components/TreeView [WIP]",
  component: TreeView,
};
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
const Wrapper = ({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: TreeViewExempleData[];
}) => {
  return (
    <TreeProvider<TreeViewExempleData>
      initialTreeData={initialData}
      initialNodeId="ROOT_NODE_ID"
      onLoadChildren={async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: Math.floor(
                  Math.random() * (10000 - 100 + 1) + 100
                ).toString(),
                name: "children",
                childrenCount: 0,
                nodeType: TreeViewNodeTypeEnum.NODE,
                children: [],
              },
            ]);
          }, 1000);
        });
      }}
      onRefresh={async (id) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              name: "updated value " + id,
            });
          }, 1000);
        });
      }}
    >
      {children}
    </TreeProvider>
  );
};

export const Simple: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <Wrapper initialData={simpleTreeData}>
        <TreeViewExemple treeData={simpleTreeData} />
      </Wrapper>
    );
  },
};

export const SimpleWithChildren: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <Wrapper initialData={simpleWithChildrenTreeData}>
        <TreeViewExemple treeData={simpleWithChildrenTreeData} />
      </Wrapper>
    );
  },
};

export const Exemple: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <Wrapper initialData={complexTreeData}>
        <TreeViewExemple treeData={complexTreeData} withRightPanel />
      </Wrapper>
    );
  },
};
