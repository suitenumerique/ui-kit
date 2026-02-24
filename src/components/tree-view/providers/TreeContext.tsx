import { createContext, useContext, useRef, useState } from "react";
import { TreeApi } from "react-arborist";
import { TreeDataItem, TreeViewDataType } from "../types";
import { PaginatedChildrenResult, useTree } from "../useTree";

export type TreeContextType<T> = {
  treeApiRef: React.RefObject<TreeApi<TreeDataItem<T>> | null>;
  treeData: ReturnType<typeof useTree<T>>;
  root: T | null;
  initialTargetId: string | null;
  setInitialTargetId: (id: string) => void;
  setRoot: (root: T) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TreeContext = createContext<TreeContextType<any> | null>(null);

export type TreeProviderProps<T> = {
  children: React.ReactNode;
  initialTreeData?: TreeViewDataType<T>[];
  initialNodeId?: string;
  onRefresh?: (id: string) => Promise<Partial<TreeViewDataType<T>>>;
  onLoadChildren?: (
    id: string,
    page: number
  ) => Promise<PaginatedChildrenResult<T>>;
};
export const TreeProvider = <T,>({
  children,
  onRefresh: refreshCallback,
  initialNodeId,
  onLoadChildren,
  initialTreeData,
}: TreeProviderProps<T>) => {
  const treeApiRef = useRef<TreeApi<TreeDataItem<T>>>(null);
  const [root, setRoot] = useState<T | null>(null);
  const [initialTargetId, setInitialTargetId] = useState<string | null>(
    initialNodeId ?? null
  );

  const treeData = useTree<T>(
    initialTreeData ?? [],
    refreshCallback,
    onLoadChildren
  );

  return (
    <TreeContext.Provider
      value={{
        treeApiRef: treeApiRef,
        treeData,
        root,
        initialTargetId,
        setInitialTargetId,
        setRoot,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
};

export const useTreeContext = <T,>() => {
  const Context = useContext(TreeContext);
  if (!Context) {
    return null
  }
  return Context as TreeContextType<T> | null;
};
