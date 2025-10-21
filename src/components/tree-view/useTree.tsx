import { useEffect, useState } from "react";
import {
  TreeDataItem,
  TreeViewDataType,
  TreeViewMoveResult,
  PaginatedChildrenResult,
  TreeViewNodeTypeEnum,
} from "./types";
import { Key, useTreeData } from "react-stately";

export const useTree = <T,>(
  initialItems: TreeViewDataType<T>[],
  refreshCallback?: (id: string) => Promise<Partial<TreeViewDataType<T>>>,
  loadChildrenCallback?: (id: string) => Promise<TreeViewDataType<T>[]>,
  loadChildrenPaginatedCallback?: (
    id: string,
    page: number,
    pageSize: number
  ) => Promise<PaginatedChildrenResult<T>>,
  defaultPageSize: number = 10
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
    console.log("item", item);
    if (!item) {
      console.error("No item found");
      return;
    }

    let newSubItems: TreeViewDataType<T>[] | null =
      item.children?.map((child) => child.value) ?? null;
    console.log("new sub items 1", newSubItems);
    const childrenCount =
      updatedData.childrenCount ?? item.value.childrenCount ?? 0;

    if (newSubItems?.length === 0 && childrenCount > 0) {
      newSubItems = null;
    }

    if (updatedData.children) {
      newSubItems = [...(newSubItems ?? []), ...updatedData.children];
    }

    console.log("newSubItems", newSubItems);

    const updatedItem: TreeViewDataType<T> = {
      ...item.value,
      ...updatedData,
      children: newSubItems,
      childrenCount: newSubItems?.length ?? childrenCount,
    } as TreeViewDataType<T>;

    update(nodeId, updatedItem);
  };

  const deleteNode = (nodeId: string) => {
    remove(nodeId);
  };

  const deleteNodes = (nodeIds: string[]) => {
    remove(...nodeIds);
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

  const addRootNodes = (newNodes: TreeViewDataType<T>[], index?: number) => {
    insert(null, index ?? treeData.length, ...newNodes);
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

  const moveNode = (
    nodeId: string,
    newParentId: string | null,
    newIndex: number
  ) => {
    move(nodeId, newParentId, newIndex);
  };

  const handleMove = (result: TreeViewMoveResult) => {
    moveNode(result.sourceId, result.newParentId, result.index);
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

  const handleLoadChildrenPaginated = async (
    nodeId: string,
    page: number = 1
  ) => {
    if (!loadChildrenPaginatedCallback) {
      return [];
    }

    console.log(`Loading page ${page} for node ${nodeId}`);

    const result = await loadChildrenPaginatedCallback(
      nodeId,
      page,
      defaultPageSize
    );
    const item = getItem(nodeId);

    if (!item) {
      console.error("No item found");
      return [];
    }

    console.log("\n\n\n");
    console.log("item", item);
    console.log("result", result);
    console.log(`Received ${result.children.length} children for page ${page}`);
    console.log(`Existing children count: ${item.children?.length ?? 0}`);

    // Remove existing VIEW_MORE nodes first
    const existingViewMoreNodes =
      item.children?.filter(
        (child) => child.value.nodeType === TreeViewNodeTypeEnum.VIEW_MORE
      ) ?? [];

    console.log(`Removing ${existingViewMoreNodes.length} VIEW_MORE nodes`);

    existingViewMoreNodes.forEach((viewMoreNode) => {
      remove(viewMoreNode.key);
    });

    // Get existing children (excluding VIEW_MORE nodes)
    const existingChildren =
      item.children
        ?.filter(
          (child) => child.value.nodeType !== TreeViewNodeTypeEnum.VIEW_MORE
        )
        .map((child) => child.value) ?? [];

    console.log(
      `Existing children (non-VIEW_MORE): ${existingChildren.length}`
    );

    // Combine existing children with new ones
    const allChildren = [...existingChildren, ...result.children];

    console.log(`Total children after combining: ${allChildren.length}`);
    console.log("allChildren", allChildren);

    // Update the node with all children and pagination info
    updateNode(nodeId, {
      children: allChildren,
      hasLoadedChildren: true,
      childrenCount: result.pagination.totalCount,
      pagination: result.pagination,
    });

    console.log(`Updated node ${nodeId} with ${allChildren.length} children`);

    // Add VIEW_MORE button if there are more pages
    if (result.pagination.hasMore) {
      const viewMoreNode: TreeViewDataType<T> = {
        id: `${nodeId}-view-more-${page}`,
        nodeType: TreeViewNodeTypeEnum.VIEW_MORE,
        parentId: nodeId,
        onLoadMore: async () => {
          await handleLoadChildrenPaginated(nodeId, page + 1);
        },
        children: [],
        childrenCount: 0,
      } as TreeViewDataType<T>;

      addChild(nodeId, viewMoreNode);
      console.log(`Added VIEW_MORE button for page ${page + 1}`);
    }

    console.log("\n\n\n");
    return result.children;
  };

  /**
   * This effect is used to replace the children references in the tree data with the children references in the tree data items
   * Because the useTreeData hook doesn't do it automatically. and we add childrenCount logic to avoid loading the children again.
   */
  useEffect(() => {
    const replaceChildrenReferences = (
      items: TreeDataItem<TreeViewDataType<T>>[]
    ) => {
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          /**
           * The tree might have already been loaded without going through loadChildren. (if we loaded the entire tree or part of the tree for example)
           * In this case, hasLoadedChildren is not set but the children are loaded.
           */
          const hasLoadedChildren =
            item.value.hasLoadedChildren ||
            item.children?.length > 0 ||
            (item.value.children && item.value.children.length > 0);

          item.value.children = item.children.map((child) => child.value);

          const childrenCount = hasLoadedChildren
            ? item.children.length
            : item.value.childrenCount ?? 0;

          item.value.childrenCount = childrenCount;

          // If the children have been loaded but the hasLoadedChildren is not set, set it to true.
          if (hasLoadedChildren && !item.value.hasLoadedChildren) {
            item.value.hasLoadedChildren = true;
          }

          replaceChildrenReferences(item.children);
        } else {
          // Same as above
          const hasLoadedChildren =
            item.value.hasLoadedChildren ||
            (item.value.children && item.value.children.length > 0);

          const childrenCount = hasLoadedChildren
            ? 0
            : item.value.childrenCount;

          item.value.children = [];
          item.value.childrenCount = childrenCount;
        }
      });
    };

    replaceChildrenReferences(treeData as TreeDataItem<TreeViewDataType<T>>[]);
    console.log("treeData", treeData);
  }, [treeData]);

  return {
    nodes: treeData as TreeDataItem<TreeViewDataType<T>>[],
    addChild,
    updateNode,
    deleteNode,
    deleteNodes,
    addRootNode,
    addRootNodes,
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
    handleLoadChildrenPaginated,
    selectNodeById,
    getParent,
    getNode,
    getParentId,
    getAncestors,
  };
};
