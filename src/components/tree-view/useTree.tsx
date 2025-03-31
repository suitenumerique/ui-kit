import { useState } from "react";
import { TreeDataItem, TreeViewDataType, TreeViewMoveResult } from "./types";
import { Key, useTreeData } from "react-stately";

export const useTree = <T,>(
  initialItems: TreeViewDataType<T>[],
  refreshCallback?: (id: string) => Promise<Partial<TreeViewDataType<T>>>,
  loadChildrenCallback?: (id: string) => Promise<TreeViewDataType<T>[]>
) => {
  const {
    remove,
    update,
    insert,
    insertBefore,
    insertAfter,
    append,
    prepend,
    getItem,
    move,
    items: treeData,
  } = useTreeData({
    initialItems: JSON.parse(
      JSON.stringify(initialItems)
    ) as TreeViewDataType<T>[],
    getKey: (item) => {
      return item.id;
    },
    getChildren: (item) => item.children || [],
  });

  const [selectedNode, setSelectedNode] = useState<T>();

  const resetTree = (newItems: TreeViewDataType<T>[] = []) => {
    const allNodes = treeData.map((node) => {
      return node.key;
    });

    remove(...allNodes);
    const data = JSON.parse(JSON.stringify(newItems)) as TreeViewDataType<T>[];
    if (data.length > 0) {
      insert(null, 0, ...data);
    }

    setSelectedNode(undefined);
  };

  const addToSubItems = (
    parentId: string,
    subItem: TreeViewDataType<T>,
    index?: number
  ) => {
    const item = getItem(parentId);
    if (!item) {
      return;
    }
    const subItems = item.value.children ?? [];
    const newSubItems = [...subItems];
    if (index) {
      newSubItems.splice(index, 0, subItem);
    } else {
      newSubItems.push(subItem);
    }
    item.value.children = newSubItems;
    item.value.childrenCount = newSubItems.length;
  };

  const selectNodeById = (nodeId: string) => {
    const item = getItem(nodeId);
    if (!item) {
      return;
    }
    setSelectedNode(item.value as T);
  };

  const addChild = (
    parentId: string | null,
    newNode: TreeViewDataType<T>,
    index?: number
  ) => {
    if (parentId) {
      const parent = getItem(parentId);
      if (parent) {
        insert(parentId, index ?? parent.children?.length ?? 0, newNode);
        addToSubItems(parentId, newNode, index);
      }
    } else {
      insert(null, index ?? treeData.length, newNode);
    }
  };

  const getNode = (nodeId: string) => {
    return getItem(nodeId)?.value;
  };

  // Mettre à jour un nœud
  const updateNode = (
    nodeId: string,
    updatedData: Partial<TreeViewDataType<T>>
  ) => {
    const item = getItem(nodeId);
    if (!item) {
      console.error("No item found");
      return;
    }

    let newSubItems: TreeViewDataType<T>[] | null = item.value.children ?? null;

    if (updatedData.children) {
      newSubItems = [...(newSubItems ?? []), ...updatedData.children];
    }
    const updatedItem: TreeViewDataType<T> = {
      ...item.value,
      ...updatedData,
      children: newSubItems,
      childrenCount: newSubItems?.length ?? item.value.childrenCount,
    } as TreeViewDataType<T>;

    update(nodeId, updatedItem);
    if (item.parentKey) {
      updateSubItems(item.parentKey as string, nodeId, updatedData);
    }
  };

  const deleteNode = (nodeId: string) => {
    const toDelete = getItem(nodeId);
    const oldParentId = toDelete?.parentKey as string;
    if (oldParentId && toDelete) {
      removeFromSubItems(oldParentId, toDelete.value.id);
    }
    remove(nodeId);
  };

  //  It's just a helper to remove a value inside the value children array. Because the react-stately library doesn't provide a way to do it.
  const updateSubItems = (
    parentId: string,
    subItemId: string,
    updatedData: Partial<TreeViewDataType<T>>
  ) => {
    const item = getItem(parentId);
    if (!item) {
      return;
    }
    const subItems = item.value.children ?? [];
    const subItemIndex = subItems.findIndex(
      (subItem) => subItem.id === subItemId
    );
    if (subItemIndex === -1) {
      return;
    }

    const updatedSubItem = {
      ...subItems[subItemIndex],
      ...updatedData,
    } as TreeViewDataType<T>;

    subItems[subItemIndex] = updatedSubItem;
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

  const addRootNode = (newNode: TreeViewDataType<T>, index?: number) => {
    insert(null, index ?? treeData.length, newNode);
  };

  const setChildren = (
    parentId: string,
    newChildren: TreeViewDataType<T>[]
  ) => {
    const item = getItem(parentId);
    if (!item) {
      console.error("No item found");
      return;
    }

    const updatedItem = {
      ...item.value,
      children: newChildren,
      childrenCount: newChildren.length,
      hasLoadedChildren: newChildren.length > 0,
    } as TreeViewDataType<T>;

    update(parentId, updatedItem);

    if (item.parentKey) {
      updateSubItems(item.parentKey as string, parentId, updatedItem);
    }
  };

  const getAncestors = (nodeId: string): TreeViewDataType<T>[] => {
    const ancestors: TreeViewDataType<T>[] = [];

    const node = getItem(nodeId);
    if (!node) {
      return [];
    }

    ancestors.push(node.value);
    const findAncestors = (id: Key): void => {
      const parentId = getParentId(id as string);
      if (!parentId) return;

      const parent = getItem(parentId);
      if (!parent) return;

      ancestors.push(parent.value);
      findAncestors(parentId);
    };

    findAncestors(nodeId);
    return ancestors.reverse();
  };

  const getParentId = (nodeId: string): Key | null => {
    return getItem(nodeId)?.parentKey ?? null;
  };

  const getParent = (nodeId: string): TreeViewDataType<T> | null => {
    const parentId = getParentId(nodeId);
    if (!parentId) {
      return null;
    }

    const parent = getItem(parentId);
    if (!parent) {
      return null;
    }

    return parent.value;
  };

  const insertBeforeNode = (nodeId: string, newNode: TreeViewDataType<T>) => {
    insertBefore(nodeId, newNode);
  };

  const insertAfterNode = (nodeId: string, newNode: TreeViewDataType<T>) => {
    insertAfter(nodeId, newNode);
  };

  const appendToNode = (nodeId: string, newNode: TreeViewDataType<T>) => {
    append(nodeId, newNode);
  };

  const prependToNode = (nodeId: string, newNode: TreeViewDataType<T>) => {
    prepend(nodeId, newNode);
  };

  //  It's just a helper to remove a value inside the value children array. Because the react-stately library doesn't provide a way to do it.
  const removeFromSubItems = (parentId: string, subItemId: string) => {
    const item = getItem(parentId);
    if (!item) {
      return;
    }
    const subItems = item.value.children ?? [];
    const newSubItems = subItems.filter((subItem) => subItem.id !== subItemId);
    item.value.children = newSubItems;
    item.value.childrenCount = newSubItems.length;
  };

  const moveNode = (
    nodeId: string,
    newParentId: string | null,
    newIndex: number,
    oldParentId?: string | null
  ) => {
    const toMove = getItem(nodeId)?.value;
    move(nodeId, newParentId, newIndex);

    if (newParentId && toMove) {
      addToSubItems(newParentId, toMove);
    }

    if (oldParentId) {
      removeFromSubItems(oldParentId, nodeId);
    }
  };

  const handleMove = (result: TreeViewMoveResult) => {
    moveNode(
      result.sourceId,
      result.newParentId,
      result.index,
      result.oldParentId
    );
  };

  const handleLoadChildren = async (nodeId: string) => {
    if (!loadChildrenCallback) {
      return [];
    }
    const children = await loadChildrenCallback(nodeId);

    updateNode(nodeId, {
      children: children,
      hasLoadedChildren: true,
      childrenCount: children.length,
    });
    return children;
  };

  return {
    nodes: treeData as TreeDataItem<TreeViewDataType<T>>[],
    addChild,
    updateNode,
    deleteNode,
    addRootNode,
    selectedNode,
    setSelectedNode,
    refreshNode,
    setChildren,
    insertBeforeNode,
    insertAfterNode,
    handleMove,
    prependToNode,
    moveNode,
    appendToNode,
    move,
    resetTree,
    handleLoadChildren,
    selectNodeById,
    getParent,
    getNode,
    getParentId,
    getAncestors,
  };
};
