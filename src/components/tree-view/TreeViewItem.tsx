import { NodeRendererProps } from "react-arborist";
import { TreeViewDataType } from "./types";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { Spinner } from "../loader/Spinner";

export type TreeViewNodeProps<T> = NodeRendererProps<TreeViewDataType<T>> & {
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
  const loading = forceLoading ?? isLoading;
  const hasChildren =
    (node.data.childrenCount !== undefined && node.data.childrenCount > 0) ||
    (node.data.children?.length ?? 0) > 0;

  const hasLoadedChildren = node.children?.length ?? 0 > 0;

  const isLeaf = node.isLeaf || !hasChildren;
  const handleClick = useCallback(async () => {
    if (isLeaf) {
      return;
    }

    if (hasLoadedChildren) {
      node.toggle();
      return;
    }

    setIsLoading(true);
    await loadChildren?.(node.data);
    setIsLoading(false);
    node.open();
  }, [hasLoadedChildren, loadChildren, node, isLeaf]);

  useEffect(() => {
    if (node.willReceiveDrop && !node.isOpen) {
      timeoutRef.current = setTimeout(() => {
        void handleClick();
      }, 200);
    }

    if (timeoutRef.current && !node.willReceiveDrop) {
      clearTimeout(timeoutRef.current);
    }
  }, [node, handleClick]);

  return (
    <div
      role="button"
      onClick={onClick}
      ref={dragHandle}
      style={style}
      className={clsx("c__tree-view--node", {
        willReceiveDrop: node.willReceiveDrop,
        selected: node.isSelected,
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
  );
};
