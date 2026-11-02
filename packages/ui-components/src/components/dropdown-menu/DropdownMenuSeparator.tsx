import clsx from "clsx";
import { Separator } from "react-aria-components";
import { DropdownMenuSeparatorProps } from "./types";

/**
 * A visual separator between menu items. Hidden from assistive technologies:
 * Chrome counts an exposed separator in the item positions VoiceOver
 * announces ("4 of 6" then "6 of 6" for five items).
 */
export const DropdownMenuSeparator = ({
  className,
  ...props
}: DropdownMenuSeparatorProps) => (
  <Separator
    {...props}
    // React Aria filters `aria-hidden` out of the separator props.
    render={(domProps) => <div {...domProps} aria-hidden="true" />}
    className={clsx("c__dropdown-menu-separator", className)}
  />
);
