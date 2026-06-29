import { ReactNode } from "react";

export type MenuItemBodyProps = {
  icon?: ReactNode;
  label: ReactNode;
  subText?: ReactNode;
  /** Renders the trailing check icon (selected/checked state). */
  isChecked?: boolean;
  /** Renders the trailing chevron; takes precedence over the check icon. */
  hasSubmenu?: boolean;
};

/**
 * Presentational inner content shared by every menu row (DropdownMenu,
 * ContextMenu, Filter). It is role-agnostic — it emits only children — so it
 * renders correctly inside either a react-aria `MenuItem` or `ListBoxItem`,
 * both of which already carry the `c__dropdown-menu-item` class that styles it.
 */
export const MenuItemBody = ({
  icon,
  label,
  subText,
  isChecked,
  hasSubmenu,
}: MenuItemBodyProps) => (
  <>
    {icon && <div className="c__dropdown-menu-item__icon">{icon}</div>}
    <div className="c__dropdown-menu-item__label-container">
      <div className="c__dropdown-menu-item__label">{label}</div>
      {subText && (
        <div className="c__dropdown-menu-item__label-subtext">{subText}</div>
      )}
    </div>
    {hasSubmenu ? (
      <span className="material-icons c__dropdown-menu-item__chevron">
        chevron_right
      </span>
    ) : isChecked ? (
      <span className="material-icons checked">check</span>
    ) : null}
  </>
);
