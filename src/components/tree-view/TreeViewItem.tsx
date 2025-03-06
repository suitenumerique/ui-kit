import { NodeRendererProps } from "react-arborist";
import {TreeDataItem, TreeViewDataType, TreeViewNodeTypeEnum} from "./types";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { Spinner } from "../loader/Spinner";
import { Droppable } from "../dnd/Droppable";

export type TreeViewNodeProps<T> = NodeRendererProps<TreeDataItem<T>> & {
  onClick?: () => void;
  forceLoading?: boolean;
  loadChildren?: (node: TreeViewDataType<T>) => Promise<TreeViewDataType<T>[]>;
};

export const TreeViewItem = <T,>({
  children,
  onClick,
  node,
  dragHandle,
  style,
  loadChildren,
  forceLoading,
}: PropsWithChildren<TreeViewNodeProps<T>>) => {
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
  const handleClick = useCallback(async () => {
    if (isLeaf) {
      return;
    }

    if (hasLoadedChildren || node.data.value.hasLoadedChildren) {
      node.toggle();
      return;
    }

    setIsLoading(true);
    await loadChildren?.(node.data.value);
    setIsLoading(false);
    node.open();
  }, [hasLoadedChildren, loadChildren, node, isLeaf]);

  const handleOver = useCallback(
    (isOver: boolean) => {
      if (isOver && !node.isOpen && !node.isDragging) {
        timeoutRef.current = setTimeout(() => {
          void handleClick();
        }, 500);
      }

      if (timeoutRef.current && !isOver) {
        clearTimeout(timeoutRef.current);
      }
    },
    [handleClick, node.isOpen, node.isDragging]
  );

  useEffect(() => {
    handleOver(isOver);
  }, [isOver, handleOver]);

  if (node.data.value.type === TreeViewNodeTypeEnum.SEPARATOR) {
    return <div className="c__tree-view--node__separator" />;
  }

  if (node.data.value.type === TreeViewNodeTypeEnum.TITLE) {
    return (
      <div className="c__tree-view--node__title">{node.data.value.title}</div>
    );
  }

  return (
    <Droppable
      id={node.id}
      data={{ data: node.data, nodeApi: node }}
      onOver={setExternalOver}
    >
      <div
        onClick={onClick}
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
                  void handleClick();
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
