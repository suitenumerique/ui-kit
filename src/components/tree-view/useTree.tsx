import { useState } from "react";
import { TreeViewDataType } from "./types";

export const useTree = <T,>(
  tree: TreeViewDataType<T>[],
  refreshCallback?: (id: string) => Promise<Partial<TreeViewDataType<T>>>
) => {
  const [treeData, setTreeData] = useState<TreeViewDataType<T>[]>(tree);
  const [selectedNode, setSelectedNode] = useState<TreeViewDataType<T>>();

  // Ajouter un enfant à un nœud spécifique
  const addChild = (parentId: string, newNode: TreeViewDataType<T>) => {
    const updateTree = (
      nodes: TreeViewDataType<T>[]
    ): TreeViewDataType<T>[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), newNode],
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateTree(node.children),
          };
        }
        return node;
      });
    };

    setTreeData(updateTree(treeData));
  };

  // Mettre à jour un nœud
  const updateNode = (
    nodeId: string,
    updatedData: Partial<TreeViewDataType<T>>
  ) => {
    const updateTree = (
      nodes: TreeViewDataType<T>[]
    ): TreeViewDataType<T>[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            ...updatedData,
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateTree(node.children),
          };
        }
        return node;
      });
    };

    setTreeData(updateTree(treeData));
  };

  // Supprimer un nœud
  const deleteNode = (nodeId: string) => {
    const deleteFromTree = (
      nodes: TreeViewDataType<T>[]
    ): TreeViewDataType<T>[] => {
      return nodes.filter((node) => {
        if (node.id === nodeId) {
          return false;
        }
        if (node.children) {
          node.children = deleteFromTree(node.children);
        }
        return true;
      });
    };

    setTreeData(deleteFromTree(treeData));
  };

  const refreshNode = async (nodeId: string) => {
    if (!refreshCallback) {
      console.error("No refresh callback provided");
      return;
    }
    try {
      const updatedData = await refreshCallback(nodeId);
      updateNode(nodeId, updatedData);
    } catch (error) {
      console.error("error while refreshing node:", error);
    }
  };

  const addRootNode = (newNode: TreeViewDataType<T>) => {
    setTreeData([...treeData, newNode]);
  };

  // Définir ou fusionner les enfants d'un nœud
  const setChildren = (
    parentId: string,
    newChildren: TreeViewDataType<T>[],
    mergeStrategy: "replace" | "merge" = "merge"
  ) => {
    const updateTree = (
      nodes: TreeViewDataType<T>[]
    ): TreeViewDataType<T>[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          const existingChildren = node.children || [];
          const updatedChildren =
            mergeStrategy === "merge"
              ? [
                  ...existingChildren.filter(
                    (existing) =>
                      !newChildren.some(
                        (newChild) => newChild.id === existing.id
                      )
                  ),
                  ...newChildren,
                ]
              : newChildren;

          return {
            ...node,
            children: updatedChildren,
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateTree(node.children),
          };
        }
        return node;
      });
    };

    setTreeData(updateTree(treeData));
  };

  return {
    treeData,
    setTreeData,
    addChild,
    updateNode,
    deleteNode,
    addRootNode,
    selectedNode,
    setSelectedNode,
    refreshNode,
    setChildren,
  };
};
