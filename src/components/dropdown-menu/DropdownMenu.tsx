import { Menu, MenuItem, Popover, Separator } from "react-aria-components";
import { DropdownMenuOption } from "./types";
import { Fragment, PropsWithChildren, ReactNode, useId, useRef } from "react";

export type DropdownMenuProps = {
  options: DropdownMenuOption[];
  onOpenChange?: (isOpen: boolean) => void;
  selectedValues?: string[];
  onSelectValue?: (value: string) => void;
  isOpen?: boolean;
  topMessage?: string | ReactNode;
  shouldCloseOnInteractOutside?: (element: Element) => boolean;
};

export const DropdownMenu = ({
  options,
  isOpen = false,
  onOpenChange,
  children,
  selectedValues = [],
  onSelectValue,
  topMessage,
  shouldCloseOnInteractOutside,
}: PropsWithChildren<DropdownMenuProps>) => {
  const id = useId();
  const triggerRef = useRef(null);
  const onOpenChangeHandler = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
  };

  return (
    <>
      <div
        className="c__dropdown-menu-trigger"
        ref={triggerRef}
        id={id}
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
        shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
        onOpenChange={onOpenChangeHandler}
      >
        <Menu className="c__dropdown-menu" aria-labelledby={id}>
          {topMessage && (
            <MenuItem className="c__dropdown-menu-item-top-message">
              {topMessage}
            </MenuItem>
          )}
          {options.map((option) => {
            if (option.isHidden) {
              return null;
            }
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
                  {option.icon}
                  <div className="c__dropdown-menu-item__label-container">
                    <div
                      className="c__dropdown-menu-item__label"
                      aria-label={option.label}
                    >
                      {option.label}
                    </div>
                    {option.subText && (
                      <div className="c__dropdown-menu-item__label-subtext">
                        {option.subText}
                      </div>
                    )}
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
