import { useEffect, useState } from "react";
import {
  BaseTreeViewData,
  TreeDataItem,
  TreeViewDataType,
  TreeViewMoveResult,
  TreeViewNodeTypeEnum,
} from "./types";
import { Key, useTreeData } from "react-stately";
import { useCunningham } from "@openfun/cunningham-react";

export type PaginatedChildrenResult<T> = {
  children?: TreeViewDataType<T>[];
  pagination?: BaseTreeViewData<T>["pagination"];
};

export const useTree = <T,>(
  initialItems: TreeViewDataType<T>[],
  refreshCallback?: (id: string) => Promise<Partial<TreeViewDataType<T>>>,
  onLoadChildren?: (
    id: string,
    page: number
  ) => Promise<PaginatedChildrenResult<T>>
) => {
  const { t } = useCunningham();
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
        const lastChild = parent.children?.[parent.children?.length - 1];
        let insertIndex = index ?? parent.children?.length ?? 0;
        const indexIsLast = index === parent.children?.length;
        if (
          indexIsLast &&
          lastChild &&
          lastChild.value.nodeType === TreeViewNodeTypeEnum.VIEW_MORE
        ) {
          insertIndex = insertIndex - 1;
        }

        insert(parentId, insertIndex, newNode);
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

    let newSubItems: TreeViewDataType<T>[] | null =
      item.children?.map((child) => child.value) ?? null;

    const childrenCount =
      updatedData.childrenCount ?? item.value.childrenCount ?? 0;

    if (newSubItems?.length === 0 && childrenCount > 0) {
      newSubItems = null;
    }

    if (updatedData.children) {
      const mergedChildren = [...(newSubItems ?? []), ...updatedData.children];
      const uniqueChildrenMap = new Map();
      for (const child of mergedChildren) {
        uniqueChildrenMap.set(child.id, child);
      }
      newSubItems = Array.from(uniqueChildrenMap.values());
    }
    // Si on a des enfants, on met les VIEW_MORE à la fin du tableau newSubItems
    if (newSubItems) {
      // Place VIEW_MORE items at the end using sort
      newSubItems = newSubItems.sort((a, b) => {
        if (
          a.nodeType === TreeViewNodeTypeEnum.VIEW_MORE &&
          b.nodeType !== TreeViewNodeTypeEnum.VIEW_MORE
        ) {
          return 1;
        }
        if (
          a.nodeType !== TreeViewNodeTypeEnum.VIEW_MORE &&
          b.nodeType === TreeViewNodeTypeEnum.VIEW_MORE
        ) {
          return -1;
        }
        return 0;
      });
    }

    const hasMore = updatedData.pagination?.hasMore ?? false;

    if (newSubItems) {
      // enlève les types load more
      newSubItems = newSubItems.filter(
        (child) => child.nodeType !== TreeViewNodeTypeEnum.VIEW_MORE
      );
    }

    if (hasMore && newSubItems) {
      newSubItems.push({
        id: `view-more-${nodeId}`,
        nodeType: TreeViewNodeTypeEnum.VIEW_MORE,
        label: t("components.treeView.viewMore"),
      });
    }

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
    if (!onLoadChildren) {
      console.error("No load paginated children callback provided");
      return [];
    }

    const parent = getItem(nodeId);
    if (!parent) {
      console.error("No parent found");
      return;
    }
    const itemCurrentPage = parent?.value.pagination?.currentPage ?? 0;
    const nextPage = itemCurrentPage + 1;

    const result = await onLoadChildren(nodeId, nextPage);
    if (!result) {
      console.error("No result found");
      return;
    }
    const children = result.children;
    const pagination = result.pagination;
    const currentPage = nextPage;
    const hasMore = pagination?.hasMore ?? false;

    updateNode(nodeId, {
      children: children,
      hasLoadedChildren: true,

      pagination: {
        currentPage: currentPage,
        hasMore: hasMore,
      },
    });
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
    selectNodeById,
    getParent,
    getNode,
    getParentId,
    getAncestors,
  };
};
