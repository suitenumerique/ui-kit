import clsx from "clsx";
import { Separator } from "react-aria-components";
import { MenuSeparatorV2Props } from "./types";

export const MenuSeparatorV2 = ({ className, ...props }: MenuSeparatorV2Props) => (
  <Separator {...props} className={clsx("c__menu-v2-separator", className)} />
);
