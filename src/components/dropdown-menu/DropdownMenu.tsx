import { Menu, MenuItem, Popover, Separator } from "react-aria-components";
import { DropdownMenuOption } from "./types";
import { Fragment, PropsWithChildren, useId, useRef } from "react";

export type DropdownMenuProps = {
  options: DropdownMenuOption[];
  onOpenChange?: (isOpen: boolean) => void;
  selectedValues?: string[];
  onSelectValue?: (value: string) => void;
  isOpen?: boolean;
  topMessage?: string;
  label?: string;
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
  label = "Menu",
  shouldCloseOnInteractOutside,
}: PropsWithChildren<DropdownMenuProps>) => {
  const id = useId();
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const onOpenChangeHandler = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
  };

  const isOptionChecked = (option: DropdownMenuOption): boolean => {
    return Boolean(
      option.isChecked ||
        (option.value && selectedValues.includes(option.value))
    );
  };

  const handleOptionAction = (option: DropdownMenuOption): void => {
    if (option.value) onSelectValue?.(option.value);
    option.callback?.();
    onOpenChangeHandler(false);
  };

  return (
    <>
      {/* Trigger accessible div */}
      <div
        className="c__dropdown-menu-trigger"
        ref={triggerRef}
        role="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
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
        isOpen={isOpen}
        onOpenChange={onOpenChangeHandler}
        shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
        style={{ marginTop: "0px" }}
      >
        <Menu
          className="c__dropdown-menu"
          aria-labelledby={id}
          aria-label={label}
          selectionMode="single"
          selectedKeys={selectedValues}
          autoFocus
        >
          {topMessage && (
            <MenuItem className="c__dropdown-menu-item-top-message" isDisabled>
              {topMessage}
            </MenuItem>
          )}

          {options.map((option) => {
            if (option.isHidden) return null;

            return (
              <Fragment key={option.value ?? option.label}>
                <MenuItem
                  className="c__dropdown-menu-item"
                  id={option.value}
                  onAction={() => handleOptionAction(option)}
                  isDisabled={option.isDisabled}
                >
                  {option.icon}
                  <div className="c__dropdown-menu-item__label">
                    <span lang={option.value}>{option.label}</span>
                  </div>
                  {isOptionChecked(option) && (
                    <span className="material-icons checked" aria-hidden="true">
                      check
                    </span>
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
