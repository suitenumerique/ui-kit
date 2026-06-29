import {
  Header,
  Menu,
  MenuItem,
  Popover,
  Separator,
  SubmenuTrigger,
} from "react-aria-components";
import { MenuItemAction, MenuItemSeparator } from "../menu/types";
import { MenuItemBody } from "../menu/MenuItemBody";
import { DropdownMenuItem } from "./types";
import { Fragment, PropsWithChildren, ReactNode, useId, useRef } from "react";
import clsx from "clsx";
import { useCunningham } from "@gouvfr-lasuite/cunningham-react";

const isSeparator = (item: DropdownMenuItem): item is MenuItemSeparator => {
  return "type" in item && item.type === "separator";
};

const hasChildren = (item: MenuItemAction): boolean => {
  return Array.isArray(item.children) && item.children.length > 0;
};

export type DropdownMenuProps = {
  options: DropdownMenuItem[];
  onOpenChange?: (isOpen: boolean) => void;
  selectedValues?: string[];
  onSelectValue?: (value: string) => void;
  isOpen?: boolean;
  topMessage?: string | ReactNode;
  shouldCloseOnInteractOutside?: (element: Element) => boolean;
  variant?: "default" | "tiny";
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
  variant = "default",
}: PropsWithChildren<DropdownMenuProps>) => {
  const id = useId();
  const triggerRef = useRef(null);
  const { t } = useCunningham();
  const menuClassName = `c__dropdown-menu${
    variant === "tiny" ? " c__dropdown-menu--tiny" : ""
  }`;
  const onOpenChangeHandler = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
  };

  const getAriaLabel = (option: MenuItemAction): string => {
    if (option.opensInNewWindow) {
      return option.label + t("components.menu.newWindowLabelSuffix");
    }
    return option.label;
  };

  const renderMenuItems = (items: DropdownMenuItem[]) =>
    items.map((option, index) => {
      if (isSeparator(option)) {
        return <Separator key={`separator-${index}`} />;
      }

      if (option.isHidden) {
        return null;
      }

      const itemKey = option.id || option.label;

      if (hasChildren(option)) {
        return (
          <SubmenuTrigger key={itemKey}>
            <MenuItem
              className={clsx("c__dropdown-menu-item", {
                "c__dropdown-menu-item--danger": option.variant === "danger",
              })}
              aria-label={getAriaLabel(option)}
              isDisabled={option.isDisabled}
              data-testid={option.testId}
            >
              <MenuItemBody
                icon={option.icon}
                label={option.label}
                subText={option.subText}
                hasSubmenu
              />
            </MenuItem>
            <Popover offset={-4} shouldFlip containerPadding={16}>
              <Menu className={menuClassName}>
                {renderMenuItems(option.children!)}
              </Menu>
            </Popover>
          </SubmenuTrigger>
        );
      }

      return (
        <Fragment key={itemKey}>
          <MenuItem
            className={clsx("c__dropdown-menu-item", {
              "c__dropdown-menu-item--danger": option.variant === "danger",
            })}
            aria-label={getAriaLabel(option)}
            onAction={() => {
              if (option.value) {
                onSelectValue?.(option.value);
              }
              option.callback?.();
              if (!option.keepOpen) {
                onOpenChangeHandler(false);
              }
            }}
            isDisabled={option.isDisabled}
            data-testid={option.testId}
          >
            <MenuItemBody
              icon={option.icon}
              label={option.label}
              subText={option.subText}
              isChecked={
                option.isChecked ||
                (!!option.value && selectedValues.includes(option.value))
              }
            />
          </MenuItem>
          {/* @deprecated: use { type: "separator" } instead */}
          {option.showSeparator && <Separator />}
        </Fragment>
      );
    });

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
        shouldFlip
        containerPadding={16}
        shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
        onOpenChange={onOpenChangeHandler}
      >
        <Menu className={menuClassName} aria-labelledby={id} autoFocus="first">
          {topMessage && (
            <Header
              className="c__dropdown-menu-item-top-message"
              role="presentation"
            >
              {topMessage}
            </Header>
          )}
          {renderMenuItems(options)}
        </Menu>
      </Popover>
    </>
  );
};
