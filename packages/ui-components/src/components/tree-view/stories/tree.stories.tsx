import type { Meta, StoryObj } from "@storybook/react";
import { TreeView } from ":/components/tree-view/TreeView";
import { TreeViewExample, TreeViewExampleData } from "./tree-view-example";
import {
  complexTreeData,
  simpleTreeData,
  simpleWithChildrenTreeData,
  treeDataWithViewMore,
} from "./data";

import { ReactNode } from "react";
import { TreeProvider } from "../providers/TreeContext";
import { TreeViewNodeTypeEnum } from "../types";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof TreeView> = {
  title: "Components/TreeView [WIP]",
  component: TreeView,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
const Wrapper = ({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: TreeViewExampleData[];
}) => {
  return (
    <TreeProvider<TreeViewExampleData>
      initialTreeData={initialData}
      initialNodeId="ROOT_NODE_ID"
      onLoadChildren={async (_id, page) => {
        return new Promise((resolve) => {
          const children: TreeViewExampleData[] = [];
          for (let i = (page - 1) * 5; i < page * 5; i++) {
            children.push({
              id: `child-${i}`,
              name: `children ${i}`,
              childrenCount: 0,
              nodeType: TreeViewNodeTypeEnum.NODE,
              children: [],
            });
          }

          setTimeout(() => {
            resolve({
              children: children,
              pagination: {
                currentPage: page,
                hasMore: page < 3,
              },
            });
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
        <TreeViewExample treeData={simpleTreeData} />
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
        <TreeViewExample treeData={simpleWithChildrenTreeData} />
      </Wrapper>
    );
  },
};

export const Example: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <Wrapper initialData={complexTreeData}>
        <TreeViewExample treeData={complexTreeData} withRightPanel />
      </Wrapper>
    );
  },
};

export const WithViewMore: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <Wrapper initialData={treeDataWithViewMore}>
        <TreeViewExample treeData={treeDataWithViewMore} />
      </Wrapper>
    );
  },
};
