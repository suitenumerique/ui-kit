import { SubmenuTrigger } from "react-aria-components";
import { SubmenuTriggerV2Props } from "./types";

/**
 * Opens a submenu from an item. Its children are a `MenuItemV2` (the trigger)
 * then a `DropdownMenuV2Popover` (the submenu). Submenus open with the right
 * arrow key, Enter, Space or on hover, and close with the left arrow key.
 */
export const SubmenuTriggerV2 = (props: SubmenuTriggerV2Props) => (
  <SubmenuTrigger {...props} />
);
