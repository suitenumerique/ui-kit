import { TreeView, TreeViewDataType } from ":/components/tree-view";
import { useTree } from ":/components/tree-view/useTree";
import { TreeViewItemExemple } from "./tree-view-item-exemple";

export type ExempleData = {
  name: string;
};

export type TreeViewExempleData = TreeViewDataType<ExempleData>;

const treeDemoData: TreeViewExempleData[] = [
  { id: "1", name: "Je suis un titre assez long en vrai de vraiment long" },
  { id: "2", name: "Threads" },
  { id: "2.1", name: "load children", childrenCount: 1, children: [] },
  {
    id: "3",
    name: "Chat Rooms",
    children: [
      { id: "c1", name: "General" },
      { id: "c2", name: "Random" },
      { id: "c3", name: "Open Source Projects" },
    ],
  },
  {
    id: "4",
    name: "Direct Messages",
    children: [
      { id: "d1", name: "Alice" },
      { id: "d2", name: "Bob" },
      { id: "d3", name: "Charlie" },
    ],
  },
];

export const TreeViewExemple = () => {
  const { treeData, setTreeData, deleteNode, refreshNode, updateNode } =
    useTree(treeDemoData, async (id) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            name: "New " + id,
          });
        }, 1000);
      });
    });

  const loadChildren = async (
    node: TreeViewExempleData
  ): Promise<TreeViewExempleData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const childrens = [{ id: "2.2", name: "children" }];
        updateNode(node.id, { children: childrens });
        resolve(childrens);
      }, 1000);
    });
  };

  return (
    <TreeView
      treeData={treeData}
      rootNodeId="1"
      afterMove={(_result, newTreeData) => {
        setTreeData(newTreeData);
      }}
      renderNode={({ ...props }) => (
        <TreeViewItemExemple
          loadChildren={loadChildren}
          deleteNode={deleteNode}
          {...props}
        />
      )}
    />
  );
};
