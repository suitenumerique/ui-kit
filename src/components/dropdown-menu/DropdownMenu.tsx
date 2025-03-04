import { Menu, MenuItem, Popover, Separator } from "react-aria-components";
import { DropdownMenuOption } from "./types";
import { Fragment, PropsWithChildren, useRef } from "react";

export type DropdownMenuProps = {
  options: DropdownMenuOption[];
  onOpenChange?: (isOpen: boolean) => void;
  selectedValues?: string[];
  onSelectValue?: (value: string) => void;
  isOpen?: boolean;
};

export const DropdownMenu = ({
  options,
  isOpen = false,
  onOpenChange,
  children,
  selectedValues = [],
  onSelectValue,
}: PropsWithChildren<DropdownMenuProps>) => {
  const onOpenChangeHandler = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
  };

  const triggerRef = useRef(null);
  return (
    <>
      <div
        className="c__dropdown-menu-trigger"
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {children}
      </div>

      <Popover
        triggerRef={triggerRef}
        style={{
          marginTop: "0px",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChangeHandler}
      >
        <Menu className="c__dropdown-menu">
          {options.map((option) => {
            return (
              <Fragment key={option.label}>
                <MenuItem
                  className="c__dropdown-menu-item"
                  aria-label={option.label}
                  key={option.label}
                  onAction={() => {
                    if (option.value) {
                      onSelectValue?.(option.value);
                    }
                    option.callback?.();
                    onOpenChangeHandler(false);
                  }}
                  isDisabled={option.isDisabled}
                >
                  {option.icon && (
                    <span className="material-icons" aria-label={option.label}>
                      {option.icon}
                    </span>
                  )}
                  <div
                    className="c__dropdown-menu-item__label"
                    aria-label={option.label}
                  >
                    {option.label}
                  </div>
                  {(option.isChecked ||
                    (option.value &&
                      selectedValues.includes(option.value))) && (
                    <span className="material-icons checked">check</span>
                  )}
                </MenuItem>
                {option.showSeparator && <Separator />}
              </Fragment>
            );
          })}
        </Menu>
      </Popover>
    </>
  );
};
