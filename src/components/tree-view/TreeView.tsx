import { NodeApi, NodeRendererProps, Tree } from "react-arborist";
import { TreeViewSeparator } from "./TreeViewSeparator";
import {
  BaseTreeViewData,
  TreeViewDataType,
  TreeViewMoveModeEnum,
  TreeViewMoveResult,
} from "./types";

export const treeDemoData = [
  { id: "1", name: "Unread" },
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

export type TreeViewProps<T> = {
  treeData: TreeViewDataType<T>[];
  width?: number | string;
  selectedNodeId?: string;
  rootNodeId: string;
  renderNode: (
    props: NodeRendererProps<TreeViewDataType<T>>
  ) => React.ReactNode;
  afterMove?: (
    result: TreeViewMoveResult,
    newTreeData: TreeViewDataType<T>[]
  ) => void;
};

export const TreeView = <T,>({
  treeData,
  width,
  selectedNodeId,
  rootNodeId,
  renderNode,
  afterMove,
}: TreeViewProps<T>) => {
  const getMovePosition = (args: {
    dragIds: string[];
    dragNodes: NodeApi<BaseTreeViewData<T>>[];
    parentId: string | null;
    parentNode: NodeApi<BaseTreeViewData<T>> | null;
    index: number;
  }): TreeViewMoveResult | null => {
    const newData = JSON.parse(
      JSON.stringify(treeData)
    ) as TreeViewDataType<T>[];

    const sourceNodeId = args.dragNodes[0].data.id;
    const sourceNode = args.dragNodes[0].data;
    const oldParentId = sourceNode.parentId ?? rootNodeId;
    const newIndex = args.index;
    const targetNodeId = args.parentId ?? rootNodeId;

    const children = args.parentId ? args.parentNode?.children ?? [] : newData;

    let result: TreeViewMoveResult | null = null;

    if (newIndex === 0) {
      result = {
        targetNodeId: targetNodeId ?? rootNodeId,
        mode: TreeViewMoveModeEnum.FIRST_CHILD,
        sourceNodeId,
        oldParentId,
      };
    }
    if (newIndex === children.length) {
      result = {
        targetNodeId: targetNodeId ?? rootNodeId,
        mode: TreeViewMoveModeEnum.LAST_CHILD,
        sourceNodeId,
        oldParentId,
      };
    }

    const siblingIndex = newIndex - 1;
    const sibling = children[siblingIndex];

    if (sibling) {
      result = {
        targetNodeId: sibling.id,
        mode: TreeViewMoveModeEnum.RIGHT,
        sourceNodeId,
        oldParentId,
      };
    }

    const nextSiblingIndex = newIndex + 1;
    const nextSibling = children[nextSiblingIndex];
    if (nextSibling) {
      result = {
        targetNodeId: nextSibling.id,
        mode: TreeViewMoveModeEnum.LEFT,
        sourceNodeId,
        oldParentId,
      };
    }

    return result;
  };

  const onMove = (args: {
    dragIds: string[];
    dragNodes: NodeApi<BaseTreeViewData<T>>[];
    parentId: string | null;
    parentNode: NodeApi<BaseTreeViewData<T>> | null;
    index: number;
  }) => {
    // Création d'une copie profonde pour éviter les mutations directes
    const newData = JSON.parse(
      JSON.stringify(treeData)
    ) as TreeViewDataType<T>[];
    const draggedId = args.dragIds[0];

    // Fonction helper pour trouver et supprimer un nœud dans l'arbre
    const findAndRemoveNode = (
      items: TreeViewDataType<T>[],
      parentId?: string
    ): {
      currentIndex: number;
      newIndex: number;
      parentId?: string;
      draggedNode: TreeViewDataType<T>;
    } | null => {
      items.forEach((item, index) => {
        if (item.id === draggedId) {
          return {
            currentIndex: index,
          };
        }
      });

      for (let i = 0; i < items.length; i++) {
        if (items[i].id === draggedId) {
          const currentIndex = i;
          let newIndex = args.index;
          if (currentIndex < newIndex) {
            newIndex -= 1;
          }
          return {
            currentIndex: i,
            parentId,
            newIndex,
            draggedNode: items.splice(i, 1)[0],
          };
        }
        if (items[i].children?.length) {
          const found = findAndRemoveNode(
            items[i]?.children ?? [],
            items[i].id
          );
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    // Trouver et supprimer le nœud déplacé
    const r = findAndRemoveNode(newData);
    const draggedNode = r?.draggedNode;
    const currentIndex = r?.currentIndex ?? -1;
    const newIndex = r?.newIndex ?? -1;
    if (!draggedNode || currentIndex < 0 || newIndex < 0) {
      return;
    }

    // Cas 1: Déplacement à la racine
    if (!args.parentNode) {
      draggedNode.parentId = rootNodeId;
      newData.splice(newIndex, 0, draggedNode);
    }
    // Cas 2: Déplacement dans un dossier
    else {
      const targetParent = args.parentNode.data;
      draggedNode.parentId = targetParent.id;
      const findParentAndInsert = (items: TreeViewDataType<T>[]) => {
        for (const item of items) {
          if (item.id === targetParent.id) {
            item.children = item.children || [];
            item.children.splice(
              r.parentId === targetParent.id ? r.newIndex : args.index,
              0,
              draggedNode
            );

            return true;
          }
          if (item.children?.length) {
            if (findParentAndInsert(item.children)) {
              return true;
            }
          }
        }
        return false;
      };

      findParentAndInsert(newData);
    }

    const moveResult = getMovePosition(args);
    if (moveResult) {
      afterMove?.(moveResult, newData);
    }
  };

  return (
    <Tree
      data={treeData}
      openByDefault={false}
      disableEdit={true}
      onMove={onMove}
      rowHeight={35}
      disableDrop={({ parentNode }) => {
        if (parentNode.data.id === "__REACT_ARBORIST_INTERNAL_ROOT__") {
          return false;
        }
        const isOpen = parentNode?.isOpen;
        let hasChildrenLoaded =
          parentNode.data.childrenCount &&
          parentNode.data.childrenCount > 0 &&
          parentNode?.data.children &&
          parentNode.data.children.length > 0;
        hasChildrenLoaded = hasChildrenLoaded ?? true;

        if (isOpen && hasChildrenLoaded) {
          return false;
        }

        return true;
      }}
      padding={25}
      overscanCount={20}
      selection={selectedNodeId}
      renderCursor={TreeViewSeparator}
    >
      {(props) => renderNode(props)}
    </Tree>
  );
};
