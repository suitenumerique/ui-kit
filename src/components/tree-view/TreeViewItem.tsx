import { NodeRendererProps } from "react-arborist";
import { TreeDataItem, TreeViewNodeTypeEnum } from "./types";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Spinner } from "../loader/Spinner";
import { Droppable } from "../dnd/Droppable";
import { useTreeContext } from "./providers/TreeContext";

export type TreeViewNodeProps<T> = NodeRendererProps<TreeDataItem<T>> & {
  onClick?: () => void;
  forceLoading?: boolean;
};

export const TreeViewItem = <T,>({
  children,
  onClick,
  node,
  dragHandle,
  style,
  forceLoading,
}: PropsWithChildren<TreeViewNodeProps<T>>) => {
  const context = useTreeContext<T>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [externalOver, setExternalOver] = useState(false);
  const loading = forceLoading ?? isLoading;
  const isOver = node.willReceiveDrop || externalOver;
  const hasChildren =
    (node.data.value.childrenCount !== undefined &&
      node.data.value.childrenCount > 0) ||
    (node.data.children?.length ?? 0) > 0;

  const hasLoadedChildren = node.children?.length ?? 0 > 0;

  const isLeaf = node.isLeaf || !hasChildren;

  useEffect(() => {
    if (isLeaf || hasLoadedChildren || node.data.value.hasLoadedChildren) {
      return;
    }

    if (node.isOpen) {
      setIsLoading(true);
      context?.treeData
        .handleLoadChildren(node.data.value.id)
        .then(() => setIsLoading(false));
    }
  }, [
    node.isOpen,
    isLeaf,
    hasLoadedChildren,
    node.data.value.hasLoadedChildren,
    node.data.value.id,
    context?.treeData,
  ]);

  useEffect(() => {
    const shouldOpenNode = isOver && !node.isOpen && !node.isDragging;

    if (shouldOpenNode) {
      timeoutRef.current = setTimeout(() => {
        node.open();
      }, 500);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOver, node.isOpen, node.isDragging, node]);

  if (node.data.value.nodeType === TreeViewNodeTypeEnum.SEPARATOR) {
    return <div className="c__tree-view--node__separator" />;
  }

  if (node.data.value.nodeType === TreeViewNodeTypeEnum.TITLE) {
    return (
      <div className="c__tree-view--node__title">
        {node.data.value.headerTitle}
      </div>
    );
  }

  return (
    <Droppable
      id={node.id}
      data={{ data: node.data, nodeApi: node }}
      onOver={setExternalOver}
    >
      <div
        onClick={(e) => {
          // We stop all propagation if it's not a tree view item
          const target = e.target as HTMLElement;
          const isItem = target.closest(".c__tree-view--node");
          if (!isItem) {
            e.stopPropagation();
            return;
          }
          onClick?.();
        }}
        onKeyDown={(e) => {
          // We stop all propagation if it's not a tree view item
          const target = e.target as HTMLElement;
          const isItem = target.closest(".c__tree-view--node");
          if (!isItem) {
            e.stopPropagation();
          }
        }}
        ref={dragHandle}
        style={style}
        className={clsx("c__tree-view--node", {
          ...node.state,
          ["canDrop"]: node.data.value.canDrop ?? true,
          ["externalDrop"]: externalOver,
        })}
      >
        {isLeaf && <div className="c__tree-view--node__leaf" />}
        {!isLeaf && (
          <>
            {loading && (
              <div className="c__tree-view--node__loading">
                <Spinner />
              </div>
            )}
            {!loading && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  node.toggle();
                }}
                className="c__tree-view--node__arrow material-icons"
              >
                {node.isOpen ? "keyboard_arrow_down" : "keyboard_arrow_right"}
              </span>
            )}
          </>
        )}
        {children}
      </div>
    </Droppable>
  );
};
