import { NodeRendererProps } from "react-arborist";
import { TreeDataItem, TreeViewNodeTypeEnum } from "./types";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { Spinner } from "../loader/Spinner";
import { Droppable } from "../dnd/Droppable";
import { useTreeContext } from "./providers/TreeContext";
import { useCunningham } from "@openfun/cunningham-react";

export type TreeViewNodeProps<T> = NodeRendererProps<TreeDataItem<T>> & {
  itemProps?: React.HTMLAttributes<HTMLDivElement>;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  forceLoading?: boolean;
};

export const TreeViewItem = <T,>({
  children,
  itemProps,
  onClick,
  onKeyDown,
  node,
  dragHandle,
  style,
  forceLoading,
}: PropsWithChildren<TreeViewNodeProps<T>>) => {
  const { t } = useCunningham();
  const context = useTreeContext<T>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [externalOver, setExternalOver] = useState(false);
  const loading = forceLoading ?? isLoading;
  const isOver = node.willReceiveDrop || externalOver;
  const hasChildren =
    (node.data.value.childrenCount !== undefined &&
      node.data.value.childrenCount > 0) ||
    (node.data.children?.length ?? 0) > 0;

  const hasLoadedChildren = node.children?.length ?? 0 > 0;

  const isLeaf = node.isLeaf || !hasChildren;

  const handleLoadMore = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (node.data.value.nodeType === TreeViewNodeTypeEnum.VIEW_MORE) {
        setIsLoadingMore(true);
        context?.treeData
          .handleLoadChildren(node.data.parentKey as string)
          .then(() => setIsLoadingMore(false))
          .catch(() => setIsLoadingMore(false));
      }
    },
    [node.data.value.nodeType, node.data.parentKey, context?.treeData]
  );

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

  if (node.data.value.nodeType === TreeViewNodeTypeEnum.VIEW_MORE) {
    return (
      <div className="c__tree-view--row-content">
        <div className="c__tree-view--node" style={style}>
          <div
            role="button"
            className="c__tree-view--node__view-more-button"
            style={{ paddingLeft: 0, marginLeft: 20 }}
            onClick={handleLoadMore}
          >
            {isLoadingMore ? (
              <div className="c__tree-view--node__loading">
                <Spinner />
              </div>
            ) : (
              <span className="material-icons c__tree-view--node__view-more-button__icon">
                arrow_downward
              </span>
            )}

            <span className="c__tree-view--node__view-more-text">
              {node.data.value.nodeType === TreeViewNodeTypeEnum.VIEW_MORE}

              {t("components.treeView.viewMore")}
            </span>
          </div>
        </div>
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
          onKeyDown?.(e);
          
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
          ["simpleNode"]:
            node.data.value.nodeType === TreeViewNodeTypeEnum.SIMPLE_NODE,
          ["canDrop"]: node.data.value.canDrop ?? true,
          ["externalDrop"]: externalOver,
        })}
        {...itemProps}
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
