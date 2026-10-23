import { Keyboard, Text } from "react-aria-components";
import { ReactNode } from "react";
import { useCunningham } from ":/components/provider";
import { Checkmark2, ChevronRight } from ":/icons";

export type MenuItemBodyProps = {
  icon?: ReactNode;
  label: ReactNode;
  /** Secondary text below the label. */
  subText?: ReactNode;
  /** Keyboard shortcut displayed at the end of the row. */
  shortcut?: string;
  /** Renders the trailing check icon (selected/checked state). */
  isChecked?: boolean;
  /** Renders the trailing chevron; takes precedence over the check icon. */
  hasSubmenu?: boolean;
  /** Appends a visually hidden "(new window)" hint to the label. */
  opensInNewWindow?: boolean;
  /**
   * Wires the label and sub text to the React Aria text slots of the
   * enclosing `MenuItem` or `ListBoxItem`, which then gets named by the label
   * and described by the sub text. Leave it off outside such an item.
   */
  withSlots?: boolean;
};

/**
 * Presentational inner content shared by every menu row (DropdownMenu,
 * ContextMenu, Filter, SearchFilter). It emits only children, so it renders
 * inside a React Aria `MenuItem` or `ListBoxItem`, or a plain element, which
 * carries the `c__dropdown-menu-item` class that styles it. Icons are
 * decorative and hidden from assistive technologies; the checked state is
 * exposed by the item role, not by the check icon.
 */
export const MenuItemBody = ({
  icon,
  label,
  subText,
  shortcut,
  isChecked,
  hasSubmenu,
  opensInNewWindow,
  withSlots = false,
}: MenuItemBodyProps) => {
  const { t } = useCunningham();
  const labelContent = (
    <>
      {label}
      {opensInNewWindow && (
        <span className="c__offscreen">
          {t("components.menu.newWindowLabelSuffix")}
        </span>
      )}
    </>
  );

  return (
    <>
      {icon && (
        <span className="c__dropdown-menu-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="c__dropdown-menu-item__content">
        {withSlots ? (
          <Text slot="label" className="c__dropdown-menu-item__label">
            {labelContent}
          </Text>
        ) : (
          <span className="c__dropdown-menu-item__label">{labelContent}</span>
        )}
        {subText &&
          (withSlots ? (
            <Text
              slot="description"
              className="c__dropdown-menu-item__description"
            >
              {subText}
            </Text>
          ) : (
            <span className="c__dropdown-menu-item__description">
              {subText}
            </span>
          ))}
      </span>
      {shortcut &&
        (withSlots ? (
          <Keyboard className="c__dropdown-menu-item__shortcut">
            {shortcut}
          </Keyboard>
        ) : (
          <kbd className="c__dropdown-menu-item__shortcut">{shortcut}</kbd>
        ))}
      {hasSubmenu ? (
        <span className="c__dropdown-menu-item__chevron" aria-hidden="true">
          <ChevronRight />
        </span>
      ) : (
        isChecked && (
          <span className="c__dropdown-menu-item__check" aria-hidden="true">
            <Checkmark2 />
          </span>
        )
      )}
    </>
  );
};
