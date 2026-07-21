import { MenuItemAction, MenuItemSeparator } from "../menu/types";

/**
 * DropdownMenu option extending the shared MenuItemAction.
 * Adds selection-specific props: isChecked, value.
 */
export type DropdownMenuOption = MenuItemAction & {
  isChecked?: boolean;
  value?: string;
  /** @deprecated Use MenuItem with { type: "separator" } instead */
  showSeparator?: boolean;
};

/**
 * Union type for DropdownMenu items (supports separators)
 */
export type DropdownMenuItem = DropdownMenuOption | MenuItemSeparator;
