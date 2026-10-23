import clsx from "clsx";
import { Separator } from "react-aria-components";
import { DropdownMenuSeparatorProps } from "./types";

export const DropdownMenuSeparator = ({ className, ...props }: DropdownMenuSeparatorProps) => (
  <Separator {...props} className={clsx("c__dropdown-menu-separator", className)} />
);
