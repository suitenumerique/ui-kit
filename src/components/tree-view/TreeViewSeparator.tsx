import { CursorProps } from "react-arborist";

export const TreeViewSeparator = ({ top, left }: CursorProps) => {
  return (
    <div
      className="c__tree-view__cursor"
      style={{
        top,
        left: left + 10,
      }}
    ></div>
  );
};
