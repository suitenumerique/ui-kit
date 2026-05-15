import {
  Header,
  Menu,
  MenuItem,
  Popover,
  Separator,
  SubmenuTrigger,
} from "react-aria-components";
import { DropdownMenuItem, DropdownMenuOption } from "./types";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useId,
  useRef,
} from "react";
import { MenuItemSeparator } from "../menu/types";
import clsx from "clsx";

const isSeparator = (item: DropdownMenuItem): item is MenuItemSeparator => {
  return "type" in item && item.type === "separator";
};

const hasChildren = (item: DropdownMenuOption): boolean => {
  return Array.isArray(item.children) && item.children.length > 0;
};

const MenuItemContent = ({ option }: { option: DropdownMenuOption }) => (
  <>
    {option.icon && (
      <div className="c__dropdown-menu-item__icon">{option.icon}</div>
    )}
    <div className="c__dropdown-menu-item__label-container">
      <div className="c__dropdown-menu-item__label">{option.label}</div>
      {option.subText && (
        <div className="c__dropdown-menu-item__label-subtext">
          {option.subText}
        </div>
      )}
    </div>
  </>
);

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
  const menuId = `${id}-menu`;
  const triggerRef = useRef(null);
  const menuClassName = `c__dropdown-menu${
    variant === "tiny" ? " c__dropdown-menu--tiny" : ""
  }`;
  const onOpenChangeHandler = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
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
              aria-label={option.label}
              isDisabled={option.isDisabled}
              data-testid={option.testId}
            >
              <MenuItemContent option={option} />
              <span className="material-icons c__dropdown-menu-item__chevron">
                chevron_right
              </span>
            </MenuItem>
            <Popover offset={-4} shouldFlip containerPadding={16}>
              <Menu className={menuClassName}>
                {renderMenuItems(option.children!)}
              </Menu>
            </Popover>
          </SubmenuTrigger>
        );
      }

      const isSelected = Boolean(
        option.isChecked ||
          (option.value && selectedValues.includes(option.value))
      );

      return (
        <Fragment key={itemKey}>
          <MenuItem
            className={clsx("c__dropdown-menu-item", {
              "c__dropdown-menu-item--danger": option.variant === "danger",
            })}
            aria-label={option.label}
            aria-current={isSelected || undefined}
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
            <MenuItemContent option={option} />
            {isSelected && (
              <span className="material-icons checked" aria-hidden="true">
                check
              </span>
            )}
          </MenuItem>
          {/* @deprecated: use { type: "separator" } instead */}
          {option.showSeparator && <Separator />}
        </Fragment>
      );
    });

  const trigger = Children.count(children) === 1 ? Children.only(children) : children;
  const triggerWithA11yState = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        "aria-expanded": isOpen,
        "aria-haspopup": "menu",
        "aria-controls": isOpen ? menuId : undefined,
      })
    : trigger;

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
        {triggerWithA11yState}
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
        <Menu
          id={menuId}
          className={menuClassName}
          aria-labelledby={id}
          autoFocus="first"
        >
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
