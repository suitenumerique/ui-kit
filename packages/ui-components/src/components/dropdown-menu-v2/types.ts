import { ReactNode } from "react";
import type {
  MenuItemProps,
  MenuProps,
  MenuSectionProps,
  MenuTriggerProps,
  PopoverProps,
  SeparatorProps,
  SubmenuTriggerProps,
} from "react-aria-components";
import { MenuItemAction, MenuItemSeparator } from "../menu/types";

export type DropdownMenuV2Variant = "default" | "tiny";

export type DropdownMenuV2SelectionMode = "single" | "multiple";

/**
 * A menu entry. It keeps every field of the DropdownMenu (V1) option, so the
 * same `options` array can be handed to both components.
 */
export type DropdownMenuV2Option = Omit<MenuItemAction, "children"> & {
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
  children?: DropdownMenuV2Entry[];
};

export type DropdownMenuV2Entry = DropdownMenuV2Option | MenuItemSeparator;

export type DropdownMenuV2PopoverOwnProps = {
  /** Item density. Submenus inherit it when it is not set. */
  variant?: DropdownMenuV2Variant;
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
};

export type DropdownMenuV2PopoverProps<T extends object = object> = Omit<
  MenuProps<T>,
  "className" | "style"
> &
  DropdownMenuV2PopoverOwnProps;

export type DropdownMenuV2TriggerProps = Omit<MenuTriggerProps, "children"> & {
  /**
   * The trigger element, then the `DropdownMenuV2Popover`. The trigger can be
   * any single element that forwards its `ref` and props to a focusable DOM
   * element with an interactive role (`<button>`, `Button`, or an element with
   * `role="button"` and `tabIndex={0}`).
   */
  children: ReactNode;
};

export type DropdownMenuV2Props = Omit<DropdownMenuV2TriggerProps, "children"> &
  DropdownMenuV2PopoverOwnProps & {
    /** The trigger element. See `DropdownMenuV2Trigger` for its contract. */
    children: ReactNode;
    options: DropdownMenuV2Entry[];
    /** Values of the checked items. */
    selectedValues?: string[];
    /** Called with the `value` of the picked item. */
    onSelectValue?: (value: string) => void;
    /**
     * How the selectable items are exposed to assistive technologies:
     * radio items (`single`) or checkbox items (`multiple`).
     * @default "single"
     */
    selectionMode?: DropdownMenuV2SelectionMode;
  };

export type MenuItemV2Props = Omit<
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

export type MenuSectionV2Props<T extends object = object> = Omit<
  MenuSectionProps<T>,
  "className" | "style"
> & {
  /** Visible heading, also used as the accessible name of the group. */
  title?: ReactNode;
  className?: string;
};

export type MenuSeparatorV2Props = SeparatorProps;

export type SubmenuTriggerV2Props = SubmenuTriggerProps;
