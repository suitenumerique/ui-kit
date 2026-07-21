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

export type ContextMenuState = {
  isOpen: boolean;
  position: { x: number; y: number };
  items: MenuItem[];
};

export type ContextMenuContextValue = {
  open: (config: {
    position: { x: number; y: number };
    items: MenuItem[];
    onBlur?: () => void;
  }) => void;
  close: () => void;
};
