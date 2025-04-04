import {
  NodeApi,
  NodeRendererProps,
  RowRendererProps,
  Tree,
} from "react-arborist";
import { TreeViewSeparator } from "./TreeViewSeparator";
import useResizeObserver from "use-resize-observer";

import {
  TreeDataItem,
  TreeViewMoveModeEnum,
  TreeViewMoveResult,
  TreeViewNodeTypeEnum,
} from "./types";
import { isNode, isSeparator, isTitle } from "./utils";
import { useTreeContext } from "./providers/TreeContext";

export type OpenMap = {
  [id: string]: boolean;
};

export type TreeViewProps<T> = {
  initialOpenState?: OpenMap;
  selectedNodeId?: string;
  rootNodeId: string;
  canDrop?: (args: {
    parentNode: NodeApi<TreeDataItem<T>> | null;
    dragNodes: NodeApi<TreeDataItem<T>>[];
    index: number;
  }) => boolean;
  canDrag?: (node: TreeDataItem<T>) => boolean;
  afterMove?: (result: TreeViewMoveResult) => void;
  renderNode: (props: NodeRendererProps<TreeDataItem<T>>) => React.ReactNode;
};

export const TreeView = <T,>({
  initialOpenState,
  selectedNodeId,
  rootNodeId,
  renderNode,
  canDrop,
  canDrag,
  afterMove,
}: TreeViewProps<T>) => {
  const { ref, width, height } = useResizeObserver();
  const context = useTreeContext<T>();
  const treeData = context?.treeData.nodes ?? [];

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

    if (parentNode?.value.nodeType === TreeViewNodeTypeEnum.TITLE) {
      return null;
    }

    if (parentNode?.value.nodeType === TreeViewNodeTypeEnum.SEPARATOR) {
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
      targetModeId = args.parentId ?? rootNodeId;
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
      context?.treeData.handleMove(moveResult);
      afterMove?.(moveResult);
    }
  };

  if (!context) {
    return;
  }

  return (
    <div ref={ref} className="c__tree-view--container">
      <Tree
        data={treeData}
        ref={context.treeApiRef}
        openByDefault={false}
        selectionFollowsFocus={false}
        disableMultiSelection={true}
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
              // Is the root node set by react arborist
              if (parentNode.id !== "__REACT_ARBORIST_INTERNAL_ROOT__") {
                parentNode.data.value.canDrop = false;
              }
              return true;
            }
          }

          const draggedNode = dragNodes[0];

          if (
            draggedNode &&
            draggedNode.isDragging &&
            draggedNode.willReceiveDrop
          ) {
            return true;
          }

          if (parentNode.data.value?.nodeType === TreeViewNodeTypeEnum.TITLE) {
            return true;
          }
          if (
            parentNode.data.value?.nodeType === TreeViewNodeTypeEnum.SEPARATOR
          ) {
            return true;
          }

          // Is the root node set by react arborist
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
        paddingTop={2}
        width={width}
        initialOpenState={initialOpenState}
        height={height}
        overscanCount={20}
        selection={selectedNodeId}
        renderCursor={TreeViewSeparator}
        renderRow={Row}
        rowClassName="c__tree-view--row"
      >
        {renderNode}
      </Tree>
    </div>
  );
};

type RowProps<T> = RowRendererProps<TreeDataItem<T>>;

const Row = <T,>({ children, ...props }: RowProps<T>) => {
  const isTitle = props.node.data.value.nodeType === TreeViewNodeTypeEnum.TITLE;
  const isSeparator =
    props.node.data.value.nodeType === TreeViewNodeTypeEnum.SEPARATOR;

  const { style } = props.attrs;
  const newStyle = { ...style };
  if (isTitle || isSeparator) {
    return (
      <div
        {...props.attrs}
        key={props.node.id}
        style={newStyle}
        ref={props.innerRef}
        onFocus={(e) => e.stopPropagation()}
        onClick={props.node.handleClick}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      {...props.attrs}
      style={newStyle}
      key={props.node.id}
      ref={props.innerRef}
      onFocus={(e) => e.stopPropagation()}
      onClick={props.node.handleClick}
    >
      {/*  The bottom padding is to make the drop more precise when dropping below the last child */}
      <div style={{ padding: "0 12px", paddingBottom: "100px" }}>
        {children}
      </div>
    </div>
  );
};
