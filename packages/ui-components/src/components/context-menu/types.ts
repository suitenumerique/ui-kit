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

export type ContextMenuOpenConfig = {
  position: { x: number; y: number };
  items: MenuItem[];
  onBlur?: () => void;
};

/**
 * Handle on one opening of the menu. Internal: it is kept by the hook that
 * opened the menu, which exposes `updateItems` on top of it.
 */
export type ContextMenuSession = {
  update: (items: MenuItem[]) => void;
};

/**
 * Raw context value. Consumers use `useContextMenuContext`, which returns
 * `ContextMenuControls` instead.
 */
export type ContextMenuContextValue = {
  open: (config: ContextMenuOpenConfig) => ContextMenuSession;
  close: () => void;
};

/**
 * What `useContextMenuContext` gives a trigger.
 */
export type ContextMenuControls = {
  open: (config: ContextMenuOpenConfig) => void;
  close: () => void;
  /**
   * Replaces the items of the menu this hook instance opened, so a menu left
   * open keeps following the state its items are built from. A no-op once the
   * menu closes or another trigger opens it: a caller can never overwrite the
   * items of a menu it does not own.
   */
  updateItems: (items: MenuItem[]) => void;
};
