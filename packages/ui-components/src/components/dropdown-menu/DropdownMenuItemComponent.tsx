import clsx from "clsx";
import { MenuItem } from "react-aria-components";
import { MenuItemBody } from "../menu/MenuItemBody";
import { DropdownMenuItemProps } from "./types";

/**
 * A row of a DropdownMenu, exposed as `DropdownMenu.Item`. The label and the
 * description go through React Aria text slots, so the item is named by its
 * label and described by its description. The checked state is exposed by the
 * item role (`menuitemradio` or `menuitemcheckbox`) set by the selection mode
 * of its menu or section.
 */
export const DropdownMenuItemComponent = ({
  children,
  icon,
  description,
  shortcut,
  variant = "default",
  opensInNewWindow,
  className,
  textValue,
  ...props
}: DropdownMenuItemProps) => (
  <MenuItem
    {...props}
    textValue={
      textValue ?? (typeof children === "string" ? children : undefined)
    }
    className={clsx(
      "c__dropdown-menu-item",
      { "c__dropdown-menu-item--danger": variant === "danger" },
      className,
    )}
  >
    {({ isSelected, hasSubmenu }) => (
      <MenuItemBody
        withSlots
        icon={icon}
        label={children}
        subText={description}
        shortcut={shortcut}
        isChecked={isSelected}
        hasSubmenu={hasSubmenu}
        opensInNewWindow={opensInNewWindow}
      />
    )}
  </MenuItem>
);
