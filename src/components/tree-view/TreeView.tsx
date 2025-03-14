import { NodeApi, NodeRendererProps, Tree } from "react-arborist";
import { TreeViewSeparator } from "./TreeViewSeparator";
import useResizeObserver from "use-resize-observer";

import {
  TreeDataItem,
  TreeViewMoveModeEnum,
  TreeViewMoveResult,
  TreeViewNodeTypeEnum,
} from "./types";
import { isNode, isSeparator, isTitle } from "./utils";

export type OpenMap = {
  [id: string]: boolean;
};

export type TreeViewProps<T> = {
  treeData: TreeDataItem<T>[];
  initialOpenState?: OpenMap;
  selectedNodeId?: string;
  rootNodeId: string;
  canDrop?: (args: {
    parentNode: NodeApi<TreeDataItem<T>> | null;
    dragNodes: NodeApi<TreeDataItem<T>>[];
    index: number;
  }) => boolean;
  canDrag?: (node: TreeDataItem<T>) => boolean;
  handleMove?: (result: TreeViewMoveResult) => void;
  renderNode: (props: NodeRendererProps<TreeDataItem<T>>) => React.ReactNode;
};

export const TreeView = <T,>({
  treeData,
  initialOpenState,
  selectedNodeId,
  rootNodeId,
  renderNode,
  handleMove,
  canDrop,
  canDrag,
}: TreeViewProps<T>) => {
  const { ref, width, height } = useResizeObserver();

  const getMovePosition = (args: {
    dragIds: string[];
    dragNodes: NodeApi<TreeDataItem<T>>[];
    parentId: string | null;
    parentNode: NodeApi<TreeDataItem<T>> | null;
    index: number;
  }): TreeViewMoveResult | null => {
    const newData = JSON.parse(JSON.stringify(treeData)) as TreeDataItem<T>[];
    const source = args.dragNodes[0];
    const children = args.parentId
      ? args.parentNode?.data.children ?? []
      : newData;
    const sourceNodeId = args.dragNodes[0].data.value.id;
    const sourceNode = args.dragNodes[0].data;
    const parentNode = args.parentNode?.data;

    if (parentNode?.value.type === TreeViewNodeTypeEnum.TITLE) {
      return null;
    }

    if (parentNode?.value.type === TreeViewNodeTypeEnum.SEPARATOR) {
      return null;
    }

    const oldParentId = sourceNode.parentKey ?? rootNodeId;
    const defaultTargetNodeId = args.parentId ?? rootNodeId;
    let newIndex = args.index + 0;
    let mode: TreeViewMoveModeEnum | null = null;
    let targetModeId: string | null = defaultTargetNodeId;
    const currentIndex =
      source.parent?.children?.findIndex((child) => {
        return child.data.value.id === sourceNodeId;
      }) ?? 0;

    if (oldParentId === defaultTargetNodeId) {
      if (currentIndex === newIndex) {
        return null;
      }

      newIndex = newIndex < currentIndex ? newIndex : newIndex - 1;
    }

    const siblingIndex = args.index - 1;
    const sibling = children[siblingIndex];

    const nextSiblingIndex = args.index;
    const nextSibling = children[nextSiblingIndex];

    if (args.index === 0) {
      // First child
      targetModeId = rootNodeId;
      mode = TreeViewMoveModeEnum.FIRST_CHILD;
    } else if (!parentNode && args.index === 1 && !isNode(sibling.value)) {
      // First child of root node and the first node is a separator or a title
      targetModeId = rootNodeId;
      newIndex = 1;
      mode = TreeViewMoveModeEnum.FIRST_CHILD;
    } else if (args.index === children.length) {
      // Last child
      targetModeId = targetModeId ?? rootNodeId;
      mode = TreeViewMoveModeEnum.LAST_CHILD;
    } else if (sibling && isNode(sibling.value)) {
      // If the sibling is a node, move to the right
      targetModeId = sibling.value.id;
      mode = TreeViewMoveModeEnum.RIGHT;
    } else if (nextSibling && isNode(nextSibling.value)) {
      // If the next sibling is a node, move to the left
      mode = TreeViewMoveModeEnum.LEFT;
      targetModeId = nextSibling.value.id;
    }

    if (mode && targetModeId) {
      return {
        targetModeId: targetModeId,
        mode,
        oldParentId,
        index: newIndex,
        newParentId: args.parentId,
        sourceId: sourceNodeId,
      };
    }

    return null;
  };

  const onMove = (args: {
    dragIds: string[];
    dragNodes: NodeApi<TreeDataItem<T>>[];
    parentId: string | null;
    parentNode: NodeApi<TreeDataItem<T>> | null;
    index: number;
  }) => {
    const moveResult = getMovePosition(args);
    if (moveResult) {
      handleMove?.(moveResult);
    }
  };

  return (
    <div ref={ref} className="c__tree-view--container">
      <Tree
        data={treeData}
        openByDefault={false}
        disableEdit={true}
        className="c__tree-view"
        idAccessor="key"
        onMove={onMove}
        rowHeight={35}
        disableDrag={(node) => {
          if (canDrag) {
            return !canDrag(node);
          }
          return false;
        }}
        disableDrop={({ parentNode, dragNodes, index }) => {
          if (canDrop) {
            const canDropResult = canDrop({ parentNode, dragNodes, index });
            if (!canDropResult) {
              parentNode.data.value.canDrop = false;
              return true;
            }
          }
          if (parentNode.data.value?.type === TreeViewNodeTypeEnum.TITLE) {
            return true;
          }
          if (parentNode.data.value?.type === TreeViewNodeTypeEnum.SEPARATOR) {
            return true;
          }

          // If
          if (parentNode.id === "__REACT_ARBORIST_INTERNAL_ROOT__") {
            const nodeBefore = treeData[index - 1];
            const nodeAfter = treeData[index];
            const nodeNextAfter = treeData[index + 1];

            const nodeBeforeIsSeparator = isSeparator(nodeBefore?.value);
            const nodeAfterIsSeparator = isSeparator(nodeAfter?.value);
            const nodeBeforeIsTitle = isTitle(nodeBefore?.value);
            const nodeAfterIsTitle = isTitle(nodeAfter?.value);
            const nodeNextIsNode = isNode(nodeNextAfter?.value);
            if (index === 0 && (nodeAfterIsSeparator || nodeAfterIsTitle)) {
              return true;
            }

            if (nodeBeforeIsSeparator && nodeAfterIsTitle && nodeNextIsNode) {
              return true;
            }
            if (nodeBeforeIsTitle && nodeAfterIsSeparator && nodeNextIsNode) {
              return true;
            }

            return false;
          }
          const isOpen = parentNode?.isOpen;
          const hasChildren =
            (parentNode?.data.value.childrenCount &&
              parentNode.data.value.childrenCount > 0) ||
            (parentNode?.data.children && parentNode.data.children.length > 0);

          if (!hasChildren) {
            parentNode.data.value.canDrop = true;
            return false;
          }

          let hasChildrenLoaded =
            parentNode.data.value.childrenCount &&
            parentNode.data.value.childrenCount > 0 &&
            parentNode?.data.children &&
            parentNode.data.children.length > 0;
          hasChildrenLoaded = hasChildrenLoaded ?? true;

          if (!isOpen && !hasChildrenLoaded && hasChildren) {
            parentNode.data.value.canDrop = true;
            return true;
          }

          parentNode.data.value.canDrop = true;
          return false;
        }}
        paddingBottom={30}
        width={width}
        initialOpenState={initialOpenState}
        height={height}
        overscanCount={20}
        selection={selectedNodeId}
        renderCursor={TreeViewSeparator}
        renderRow={(props) => {
          const isTitle =
            props.node.data.value.type === TreeViewNodeTypeEnum.TITLE;
          const isSeparator =
            props.node.data.value.type === TreeViewNodeTypeEnum.SEPARATOR;

          const { style } = props.attrs;
          const newStyle = { ...style };
          if (isTitle || isSeparator) {
            return (
              <div
                {...props.attrs}
                style={newStyle}
                ref={props.innerRef}
                onFocus={(e) => e.stopPropagation()}
                onClick={props.node.handleClick}
              >
                {props.children}
              </div>
            );
          }

          return (
            <div
              {...props.attrs}
              style={newStyle}
              ref={props.innerRef}
              onFocus={(e) => e.stopPropagation()}
              onClick={props.node.handleClick}
            >
              <div style={{ padding: "0 12px" }}>{props.children}</div>
            </div>
          );
        }}
        rowClassName="c__tree-view--row"
      >
        {(props) => renderNode(props)}
      </Tree>
    </div>
  );
};
