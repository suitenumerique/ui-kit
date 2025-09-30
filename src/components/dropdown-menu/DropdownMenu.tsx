import {
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  Separator,
  Button,
} from "react-aria-components";
import { DropdownMenuOption } from "./types";
import { Fragment, PropsWithChildren, useMemo } from "react";

export type DropdownMenuProps = {
  options: DropdownMenuOption[];
  onOpenChange?: (isOpen: boolean) => void;
  selectedValues?: string[];
  onSelectValue?: (value: string) => void;
  isOpen?: boolean;
  topMessage?: string;
  label?: string;
};

export const DropdownMenu = ({
  options,
  isOpen,
  onOpenChange,
  children,
  selectedValues = [],
  onSelectValue,
  topMessage,
  label = "Menu",
}: PropsWithChildren<DropdownMenuProps>) => {
  // get the first selected value
  const currentLabel = useMemo(() => {
    if (!selectedValues?.length) return undefined;
    return (
      options.find((o) => o.value && selectedValues.includes(o.value))?.label ??
      undefined
    );
  }, [options, selectedValues]);

  const isOptionChecked = (option: DropdownMenuOption): boolean => {
    return Boolean(
      option.isChecked ||
        (option.value && selectedValues.includes(option.value))
    );
  };

  const handleOptionAction = (option: DropdownMenuOption): void => {
    if (option.value) onSelectValue?.(option.value);
    option.callback?.();
  };

  return (
    <MenuTrigger onOpenChange={onOpenChange} isOpen={isOpen}>
      {/* Trigger accessible button */}
      <Button
        className="c__dropdown-menu-trigger"
        aria-label={currentLabel ? `${label} : ${currentLabel}` : label}
      >
        {children}
      </Button>

      <Popover placement="bottom start">
        <Menu
          className="c__dropdown-menu"
          aria-label={label}
          selectionMode="single"
          selectedKeys={selectedValues}
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
                    {option.label}
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
    </MenuTrigger>
  );
};
