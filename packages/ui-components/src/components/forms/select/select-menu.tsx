import React, { PropsWithChildren } from "react";
import classNames from "classnames";
import { useOverlayPosition } from "react-aria";
import { SelectProps } from ":/components/forms/select/index";
import { SelectAuxProps } from ":/components/forms/select/mono-common";
import { SelectMultiAuxProps } from ":/components/forms/select/multi-common";

const DEFAULT_MENU_MAX_HEIGHT = 160;

export interface SelectDropdownProps extends PropsWithChildren {
  isOpen: boolean;
  selectRef: React.RefObject<HTMLDivElement | null>;
  menuOptionsStyle?: SelectProps["menuOptionsStyle"];
  maxHeight?: SelectProps["menuMaxHeight"];
  downshiftReturn:
    | SelectAuxProps["downshiftReturn"]
    | SelectMultiAuxProps["downshiftReturn"];
}

export const SelectMenu = ({
  isOpen,
  selectRef,
  downshiftReturn,
  menuOptionsStyle,
  maxHeight = DEFAULT_MENU_MAX_HEIGHT,
  children,
}: SelectDropdownProps) => {
  const menuRef = React.useRef<HTMLElement | null>(null);
  const overlayPosition = useOverlayPosition({
    targetRef: selectRef,
    overlayRef: menuRef,
    placement: "bottom",
    isOpen,
    maxHeight,
    shouldUpdatePosition: true,
  });
  const menuProps = downshiftReturn.getMenuProps({
    ref: menuRef,
  });
  return (
    <div
      className={classNames(
        "c__select__menu",
        menuOptionsStyle ? "c__select__menu--" + menuOptionsStyle : "",
        {
          "c__select__menu--opened": isOpen,
        },
      )}
      {...menuProps}
      style={{
        marginLeft: "-4px",
        width: selectRef.current
          ? selectRef.current.getBoundingClientRect().width - 4
          : 0,
        ...overlayPosition.overlayProps.style,
      }}
    >
      {isOpen && children}
    </div>
  );
};
