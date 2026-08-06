import { MenuItemAction, MenuItemSeparator } from "../menu/types";

/**
 * DropdownMenu option extending the shared MenuItemAction.
 * Adds the selection value used with `selectedValues` (`isChecked` is shared).
 */
export type DropdownMenuOption = MenuItemAction & {
  value?: string;
  /** @deprecated Use MenuItem with { type: "separator" } instead */
  showSeparator?: boolean;
};

/**
 * Union type for DropdownMenu items (supports separators)
 */
export type DropdownMenuItem = DropdownMenuOption | MenuItemSeparator;
