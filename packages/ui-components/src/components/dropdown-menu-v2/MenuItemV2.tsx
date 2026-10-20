import clsx from "clsx";
import { Keyboard, MenuItem, Text } from "react-aria-components";
import { useCunningham } from ":/components/provider";
import { Checkmark2, ChevronRight } from ":/icons";
import { MenuItemV2Props } from "./types";

/**
 * A row of a DropdownMenuV2. The label and the description go through React
 * Aria text slots, so the item is named by its label and described by its
 * description. Decorative icons are hidden from assistive technologies; the
 * checked state is exposed by the item role (`menuitemradio` or
 * `menuitemcheckbox`) set by the selection mode of its menu or section.
 */
export const MenuItemV2 = ({
  children,
  icon,
  description,
  shortcut,
  variant = "default",
  opensInNewWindow,
  className,
  textValue,
  ...props
}: MenuItemV2Props) => {
  const { t } = useCunningham();

  return (
    <MenuItem
      {...props}
      textValue={
        textValue ?? (typeof children === "string" ? children : undefined)
      }
      className={clsx(
        "c__menu-v2-item",
        { "c__menu-v2-item--danger": variant === "danger" },
        className,
      )}
    >
      {({ isSelected, hasSubmenu }) => (
        <>
          {icon && (
            <span className="c__menu-v2-item__icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="c__menu-v2-item__content">
            <Text slot="label" className="c__menu-v2-item__label">
              {children}
              {opensInNewWindow && (
                <span className="c__offscreen">
                  {t("components.menu.newWindowLabelSuffix")}
                </span>
              )}
            </Text>
            {description && (
              <Text slot="description" className="c__menu-v2-item__description">
                {description}
              </Text>
            )}
          </span>
          {shortcut && (
            <Keyboard className="c__menu-v2-item__shortcut">{shortcut}</Keyboard>
          )}
          {hasSubmenu ? (
            <span className="c__menu-v2-item__chevron" aria-hidden="true">
              <ChevronRight />
            </span>
          ) : (
            isSelected && (
              <span className="c__menu-v2-item__check" aria-hidden="true">
                <Checkmark2 />
              </span>
            )
          )}
        </>
      )}
    </MenuItem>
  );
};
