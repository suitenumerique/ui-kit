import {useState} from "react";
import {TreeDataItem, TreeViewDataType, TreeViewMoveResult} from "./types";
import {useTreeData} from "react-stately";

export const useTree = <T extends object>(
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
    initialItems: initialItems,
    getKey: (item) => {
      return item.id;
    },
    getChildren: (item) => item.subItems || [],
  });

  const [selectedNode, setSelectedNode] = useState<TreeViewDataType<T>>();

  // Ajouter un enfant à un nœud spécifique
  const addChild = (parentId: string | null, newNode: TreeViewDataType<T>) => {
    append(parentId, newNode);
    if (parentId) {
      addToSubItems(parentId, newNode);
    }
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

    let newSubItems = item.children?.map((child) => child.value) ?? [];
    if (updatedData.subItems) {
      newSubItems = [...newSubItems, ...updatedData.subItems];
    }

    const updatedItem: TreeViewDataType<T> = {
      ...item.value,
      ...updatedData,
      subItems: newSubItems,
      childrenCount: newSubItems.length,
    } as TreeViewDataType<T>;

    update(nodeId, updatedItem);
  };

  // Supprimer un nœud
  const deleteNode = (nodeId: string) => {
    const toDelete = getItem(nodeId);
    const oldParentId = toDelete?.parentKey as string;
    if (oldParentId && toDelete) {
      removeFromSubItems(oldParentId, toDelete.value.id);
    }
    remove(nodeId);
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
    insert(null, treeData.length, newNode);
  };

  // Définir ou fusionner les enfants d'un nœud
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
      subItems: newChildren,
      childrenCount: newChildren.length,
    } as TreeViewDataType<T>;

    update(parentId, updatedItem);
  };

  const insertBeforeNode = (nodeId: string, newNode: TreeViewDataType<T>) => {
    insertBefore(nodeId, newNode);
  };

  const insertAfterNode = (nodeId: string, newNode: TreeViewDataType<T>) => {
    insertAfter(nodeId, newNode);
  };

  const prependToNode = (nodeId: string, newNode: TreeViewDataType<T>) => {
    prepend(nodeId, newNode);
  };

  const removeFromSubItems = (parentId: string, subItemId: string) => {
    const item = getItem(parentId);
    if (!item) {
      return;
    }
    const subItems = item.value.subItems ?? [];
    const newSubItems = subItems.filter((subItem) => subItem.id !== subItemId);
    item.value.subItems = newSubItems;
    item.value.childrenCount = newSubItems.length;
  };

  const addToSubItems = (parentId: string, subItem: TreeViewDataType<T>) => {
    const item = getItem(parentId);
    if (!item) {
      return;
    }
    const subItems = item.value.subItems ?? [];
    const newSubItems = [...subItems, subItem];
    item.value.subItems = newSubItems;
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
      subItems: children,
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
    move,
    handleLoadChildren,
  };
};
