import { CursorProps } from "react-arborist";

export const TreeViewSeparator = ({ top, left }: CursorProps) => {
  return (
    <div
      className="c__tree-view__cursor"
      style={{
        top: top - 2,
        left: left + 10,
        width: `calc(100% - ${24 + left}px)`,
      }}
    ></div>
  );
};
