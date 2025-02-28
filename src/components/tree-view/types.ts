export type BaseTreeViewData<T> = T & {
    id: string;
    childrenCount?: number;
    parentId?: string;
    children?: BaseTreeViewData<T>[];
  };
  
  export type TreeViewDataType<T> = BaseTreeViewData<T>;
  
  export enum TreeViewMoveModeEnum {
    FIRST_CHILD = 'first-child',
    LAST_CHILD = 'last-child',
    LEFT = 'left',
    RIGHT = 'right',
  }
  
  export type TreeViewMoveResult = {
    targetNodeId: string;
    mode: TreeViewMoveModeEnum;
    sourceNodeId: string;
    oldParentId?: string;
  };
  