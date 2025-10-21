import type { Meta, StoryObj } from "@storybook/react";
import { TreeView } from ":/components/tree-view/TreeView";
import { TreeViewExemple, TreeViewExempleData } from "./tree-view-exemple";
import {
  complexTreeData,
  simpleTreeData,
  simpleWithChildrenTreeData,
  paginatedTreeData,
} from "./data";

import { ReactNode } from "react";
import { TreeProvider } from "../providers/TreeContext";
import { TreeViewNodeTypeEnum, PaginatedChildrenResult } from "../types";

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

const WrapperWithPagination = ({
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
      defaultPageSize={5}
      onLoadChildrenPaginated={async (
        id: string,
        page: number,
        pageSize: number
      ): Promise<PaginatedChildrenResult<TreeViewExempleData>> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            // Simulate paginated data - different total counts based on node ID
            let totalCount = 25; // Default
            if (id === "demo.1") totalCount = 15;
            else if (id === "demo.2") totalCount = 3;
            else if (id === "demo.3") totalCount = 0;

            const startIndex = (page - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalCount);
            const hasMore = endIndex < totalCount;

            console.log(
              `Loading page ${page} for node ${id}: items ${startIndex}-${
                endIndex - 1
              } of ${totalCount}`
            );

            const children = [];
            for (let i = startIndex; i < endIndex; i++) {
              children.push({
                id: `${id}-child-${i}`,
                name: `📄 Fichier ${i + 1}`,
                childrenCount: 0,
                nodeType: TreeViewNodeTypeEnum.NODE,
                children: [],
              } as TreeViewExempleData);
            }

            resolve({
              children,
              pagination: {
                page,
                pageSize,
                totalCount,
                hasMore,
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

export const WithPagination: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <WrapperWithPagination initialData={paginatedTreeData}>
        <TreeViewExemple treeData={paginatedTreeData} />
      </WrapperWithPagination>
    );
  },
};

export const SimplePaginationTest: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const testData: TreeViewExempleData[] = [
      {
        id: "test.1",
        name: "Test Node (10 enfants)",
        nodeType: TreeViewNodeTypeEnum.NODE,
        childrenCount: 10,
        children: [],
      },
    ];

    return (
      <TreeProvider<TreeViewExempleData>
        initialTreeData={testData}
        initialNodeId="ROOT_NODE_ID"
        defaultPageSize={3}
        onLoadChildrenPaginated={async (
          id: string,
          page: number,
          pageSize: number
        ): Promise<PaginatedChildrenResult<TreeViewExempleData>> => {
          console.log(`🔍 Loading page ${page} for node ${id}`);

          return new Promise((resolve) => {
            setTimeout(() => {
              const totalCount = 10;
              const startIndex = (page - 1) * pageSize;
              const endIndex = Math.min(startIndex + pageSize, totalCount);
              const hasMore = endIndex < totalCount;

              const children = [];
              for (let i = startIndex; i < endIndex; i++) {
                children.push({
                  id: `${id}-child-${i}`,
                  name: `Enfant ${i + 1}`,
                  childrenCount: 0,
                  nodeType: TreeViewNodeTypeEnum.NODE,
                  children: [],
                } as TreeViewExempleData);
              }

              console.log(
                `✅ Returning ${children.length} children for page ${page}`
              );

              resolve({
                children,
                pagination: {
                  page,
                  pageSize,
                  totalCount,
                  hasMore,
                },
              });
            }, 500);
          });
        }}
      >
        <TreeViewExemple treeData={testData} />
      </TreeProvider>
    );
  },
};
