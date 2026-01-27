import { Menu, MenuItem, Popover, Separator } from "react-aria-components";
import { DropdownMenuItem } from "./types";
import { Fragment, PropsWithChildren, ReactNode, useId, useRef } from "react";
import { MenuItemSeparator } from "../menu/types";

const isSeparator = (item: DropdownMenuItem): item is MenuItemSeparator => {
  return "type" in item && item.type === "separator";
};

export type DropdownMenuProps = {
  options: DropdownMenuItem[];
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
          {options.map((option, index) => {
            // Handle separator items
            if (isSeparator(option)) {
              return <Separator key={`separator-${index}`} />;
            }

            if (option.isHidden) {
              return null;
            }

            const itemKey = option.id || option.label;

            return (
              <Fragment key={itemKey}>
                <MenuItem
                  className={`c__dropdown-menu-item${option.variant === "danger" ? " c__dropdown-menu-item--danger" : ""}`}
                  aria-label={option.label}
                  onAction={() => {
                    if (option.value) {
                      onSelectValue?.(option.value);
                    }
                    option.callback?.();
                    onOpenChangeHandler(false);
                  }}
                  isDisabled={option.isDisabled}
                  data-testid={option.testId}
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
                {/* @deprecated: use { type: "separator" } instead */}
                {option.showSeparator && <Separator />}
              </Fragment>
            );
          })}
        </Menu>
      </Popover>
    </>
  );
};
