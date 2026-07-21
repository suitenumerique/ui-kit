export type BaseTreeViewData<T> = {
    id: string;
    childrenCount?: number;
    hasLoadedChildren?: boolean;
    children?: BaseTreeViewData<T>[] ;
    pagination?: {
        currentPage: number;
        totalCount?: number;
        hasMore: boolean;
    };
    canDrop?: boolean;
} & (
  | ({ nodeType: TreeViewNodeTypeEnum.SIMPLE_NODE , label: string } )
  | ({ nodeType: TreeViewNodeTypeEnum.TITLE; headerTitle: string } )
  | ({ nodeType: TreeViewNodeTypeEnum.SEPARATOR } )
  | ({ nodeType: TreeViewNodeTypeEnum.VIEW_MORE;  label?: string } )
  | ({ nodeType?: Exclude<TreeViewNodeTypeEnum, TreeViewNodeTypeEnum.TITLE | TreeViewNodeTypeEnum.SEPARATOR | TreeViewNodeTypeEnum.VIEW_MORE | TreeViewNodeTypeEnum.SIMPLE_NODE> } & T)
);


  
export type TreeViewDataType<T> = BaseTreeViewData<T>;

export type TreeDataItem<T> = {
    /** A unique key for the tree node. */
    key: string;
    /** The key of the parent node. */
    parentKey?: string | null;
    /** The value object for the tree node. */
    value: TreeViewDataType<T>;
    /** Children of the tree node. */
    children: TreeDataItem<T>[] | null;
};
  
export enum TreeViewNodeTypeEnum {
  NODE = 'node',
  SEPARATOR = 'separator',
  TITLE = 'title',
  SIMPLE_NODE = 'simpleNode',
  VIEW_MORE = 'viewMore',
}

export enum TreeViewMoveModeEnum {
  FIRST_CHILD = 'first-child',
  LAST_CHILD = 'last-child',
  LEFT = 'left',
  RIGHT = 'right',
}

export type TreeViewMoveResult = {
  targetModeId: string;
  mode: TreeViewMoveModeEnum;
  oldParentId?: string;
  index: number;
  newParentId: string | null;
  sourceId: string;
};


