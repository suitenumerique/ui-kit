import { ReactNode } from "react";

/**
 * Base action item for menus (shared between ContextMenu and DropdownMenu)
 */
export type MenuItemAction = {
  id?: string;
  label: string;
  subText?: string;
  icon?: ReactNode;
  callback?: () => void | Promise<unknown>;
  isDisabled?: boolean;
  isHidden?: boolean;
  variant?: "default" | "danger";
  testId?: string;
};

/**
 * Separator item for menus
 */
export type MenuItemSeparator = {
  type: "separator";
};

/**
 * Union type for all menu items
 */
export type MenuItem = MenuItemAction | MenuItemSeparator;
