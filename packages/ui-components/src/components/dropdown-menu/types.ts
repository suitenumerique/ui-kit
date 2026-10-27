import { ReactNode } from "react";
import type {
  ButtonProps as AriaButtonProps,
  MenuItemProps,
  MenuProps,
  MenuSectionProps,
  PopoverProps,
  SeparatorProps,
  SubmenuTriggerProps,
} from "react-aria-components";
import { MenuItemAction, MenuItemSeparator } from "../menu/types";

export type DropdownMenuVariant = "default" | "tiny";

export type DropdownMenuSelectionMode = "single" | "multiple";

/**
 * A menu entry. It extends the `MenuItemAction` shared with ContextMenu, so the
 * same actions can feed both menus.
 */
export type DropdownMenuOption = Omit<MenuItemAction, "children"> & {
  /**
   * Makes the item selectable. It is checked when listed in `selectedValues`,
   * and picking it calls `onSelectValue` with this value.
   */
  value?: string;
  /** @deprecated Use a `{ type: "separator" }` entry instead. */
  showSeparator?: boolean;
  /** Renders the item as a link (`<a>`), opened by the browser. */
  href?: string;
  target?: string;
  rel?: string;
  /** Keyboard shortcut displayed at the end of the row. */
  shortcut?: string;
  /** Entries of a submenu opened from this item. */
  children?: DropdownMenuItem[];
};

export type DropdownMenuItem = DropdownMenuOption | MenuItemSeparator;

export type DropdownMenuPopoverOwnProps = {
  /** Item density. Submenus inherit it when it is not set. */
  variant?: DropdownMenuVariant;
  /**
   * Non interactive content displayed above the items. It is exposed as the
   * description of the menu, so screen readers announce it on opening.
   */
  topMessage?: ReactNode;
  /** Same as `topMessage`, displayed below the items. */
  bottomMessage?: ReactNode;
  placement?: PopoverProps["placement"];
  offset?: number;
  shouldCloseOnInteractOutside?: (element: Element) => boolean;
  /** Class added to the menu surface. */
  className?: string;
  /**
   * Anchor and open state, for a popover used outside `DropdownMenu.Root`
   * (e.g. a context menu opened at the pointer). Inside a trigger, they come
   * from it.
   */
  triggerRef?: PopoverProps["triggerRef"];
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Test id of the menu element. */
  "data-testid"?: string;
};

export type DropdownMenuPopoverProps<T extends object = object> = Omit<
  MenuProps<T>,
  "className" | "style"
> &
  DropdownMenuPopoverOwnProps;

/**
 * Props of `DropdownMenu.Trigger`, the props of a React Aria `Button`:
 * `className` and `style` also accept a function of the button state.
 */
export type DropdownMenuTriggerProps = AriaButtonProps;

export type DropdownMenuItemProps = Omit<
  MenuItemProps,
  "children" | "className" | "style"
> & {
  /** The label. Use `textValue` for typeahead when it is not plain text. */
  children: ReactNode;
  icon?: ReactNode;
  /** Secondary text, announced as the item description. */
  description?: ReactNode;
  shortcut?: string;
  variant?: "default" | "danger";
  /** Appends a "(new window)" hint to the accessible name. */
  opensInNewWindow?: boolean;
  className?: string;
};

export type DropdownMenuSectionProps<T extends object = object> = Omit<
  MenuSectionProps<T>,
  "className" | "style"
> & {
  /** Visible heading, also used as the accessible name of the group. */
  title?: ReactNode;
  className?: string;
};

export type DropdownMenuSeparatorProps = SeparatorProps;

export type DropdownMenuSubmenuProps = SubmenuTriggerProps;
