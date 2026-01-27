import { ReactNode } from "react";
import { MenuItem, MenuItemAction, MenuItemSeparator } from "../menu/types";

// Re-export shared types for backwards compatibility
export type { MenuItem, MenuItemAction, MenuItemSeparator };

/**
 * @deprecated Use MenuItemAction instead
 */
export type ContextMenuItemAction = MenuItemAction;

/**
 * @deprecated Use MenuItemSeparator instead
 */
export type ContextMenuItemSeparator = MenuItemSeparator;

/**
 * @deprecated Use MenuItem instead
 */
export type ContextMenuItem = MenuItem;

export type ContextMenuProps<T = unknown> = {
  children: ReactNode;
  options: MenuItem[] | ((context: T) => MenuItem[]);
  context?: T;
  disabled?: boolean;
  asChild?: boolean;
};

export type ContextMenuState = {
  isOpen: boolean;
  position: { x: number; y: number };
  items: MenuItem[];
};

export type ContextMenuContextValue = {
  open: (config: { position: { x: number; y: number }; items: MenuItem[] }) => void;
  close: () => void;
};
