import { SubmenuTrigger } from "react-aria-components";
import { DropdownMenuSubmenuProps } from "./types";

/**
 * Opens a submenu from an item, exposed as `DropdownMenu.Submenu`. Its children
 * are a `DropdownMenu.Item` (the trigger) then a `DropdownMenu.Popover` (the
 * submenu). Submenus open with the right arrow key, Enter, Space or on hover,
 * and close with the left arrow key.
 */
export const DropdownMenuSubmenu = (props: DropdownMenuSubmenuProps) => (
  <SubmenuTrigger {...props} />
);
