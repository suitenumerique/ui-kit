import { useMemo } from "react";
import { buildMenuModel } from "./buildMenuModel";
import { DropdownMenuItemComponent } from "./DropdownMenuItemComponent";
import { DropdownMenuPopover } from "./DropdownMenuPopover";
import { DropdownMenuSection } from "./DropdownMenuSection";
import { DropdownMenuSeparator } from "./DropdownMenuSeparator";
import { DropdownMenuSubmenu } from "./DropdownMenuSubmenu";
import { DropdownMenuTrigger } from "./DropdownMenuTrigger";
import { renderMenuLevel } from "./renderMenu";
import { DropdownMenuProps } from "./types";

/**
 * An accessible menu opened from any trigger element, built on React Aria.
 *
 * Items with a `value` or an `isChecked` flag are exposed as radio items
 * (`selectionMode="single"`) or checkbox items (`"multiple"`); the others stay
 * plain menu items.
 *
 * For content the `options` array cannot describe, compose the parts instead:
 * `DropdownMenu.Trigger`, `DropdownMenu.Popover`, `DropdownMenu.Item`,
 * `DropdownMenu.Section`, `DropdownMenu.Separator` and `DropdownMenu.Submenu`.
 */
export const DropdownMenu = ({
  children,
  options,
  isOpen,
  defaultOpen,
  onOpenChange,
  trigger,
  selectedValues,
  onSelectValue,
  selectionMode = "single",
  variant = "default",
  topMessage,
  bottomMessage,
  placement,
  offset,
  shouldCloseOnInteractOutside,
  className,
}: DropdownMenuProps) => {
  const model = useMemo(
    () => buildMenuModel(options, selectedValues),
    [options, selectedValues],
  );

  return (
    <DropdownMenuTrigger
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      trigger={trigger}
    >
      {children}
      {renderMenuLevel(
        model,
        { selectionMode, onSelectValue },
        {
          variant,
          topMessage,
          bottomMessage,
          placement,
          offset,
          shouldCloseOnInteractOutside,
          className,
        },
      )}
    </DropdownMenuTrigger>
  );
};

DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Popover = DropdownMenuPopover;
DropdownMenu.Item = DropdownMenuItemComponent;
DropdownMenu.Section = DropdownMenuSection;
DropdownMenu.Separator = DropdownMenuSeparator;
DropdownMenu.Submenu = DropdownMenuSubmenu;
