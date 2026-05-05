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
  useEffect,
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
      <div className="c__dropdown-menu-item__icon" aria-hidden="true">
        {option.icon}
      </div>
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

/**
 * Walk the React tree to find the first interactive element (button, link,
 * or anything with onClick/onPress) and inject ARIA trigger attributes on it.
 * This way consumers can wrap their trigger in layout divs without breaking
 * the screen reader announcement.
 */
const injectAriaAttrs = (
  node: ReactNode,
  attrs: Record<string, unknown>,
  state: { done: boolean },
): ReactNode => {
  if (state.done || !isValidElement(node)) return node;
  const element = node as ReactElement<Record<string, unknown>>;

  const isInteractive =
    element.type === "button" ||
    element.type === "a" ||
    "onClick" in element.props ||
    "onPress" in element.props;

  if (isInteractive) {
    state.done = true;
    return cloneElement(element, attrs);
  }

  if (element.props.children) {
    const newChildren = Children.map(
      element.props.children as ReactNode,
      (child) => injectAriaAttrs(child, attrs, state),
    );
    return cloneElement(element, {}, newChildren);
  }

  return node;
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
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const menuClassName = `c__dropdown-menu${variant === "tiny" ? " c__dropdown-menu--tiny" : ""}`;
  const onOpenChangeHandler = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
  };

  // React Aria's Popover forces role="dialog" on the overlay, but for a
  // dropdown menu that's wrong, screen readers announce "dialogue" instead
  // of just letting the menu speak for itself. We patch it out with a
  // MutationObserver so it gets removed even if React Aria re-applies it.

  useEffect(() => {
    const node = popoverRef.current;
    if (!node) return;

    const removeDialogRole = () => {
      if (node.getAttribute("role") === "dialog") {
        node.removeAttribute("role");
      }
    };

    removeDialogRole();
    const observer = new MutationObserver(removeDialogRole);
    observer.observe(node, {
      attributes: true,
      attributeFilter: ["role"],
    });

    return () => observer.disconnect();
  }, [isOpen]);

  // Inject aria-expanded / aria-haspopup / aria-controls on the actual
  // trigger button, not the wrapper div
  const childWithAria = injectAriaAttrs(
    children,
    {
      "aria-expanded": isOpen,
      "aria-haspopup": "menu" as const,
      "aria-controls": isOpen ? `${id}-menu` : undefined,
    },
    { done: false },
  );

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
              isDisabled={option.isDisabled}
              data-testid={option.testId}
            >
              <MenuItemContent option={option} />
              <span className="material-icons c__dropdown-menu-item__chevron" aria-hidden="true">
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

      return (
        <Fragment key={itemKey}>
          <MenuItem
            className={clsx("c__dropdown-menu-item", {
              "c__dropdown-menu-item--danger": option.variant === "danger",
            })}
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
            {(option.isChecked ||
              (option.value && selectedValues.includes(option.value))) && (
              <span className="material-icons checked">check</span>
            )}
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
        {childWithAria}
      </div>

      <Popover
        ref={popoverRef}
        triggerRef={triggerRef}
        style={{ marginTop: "0px" }}
        isOpen={isOpen}
        shouldFlip
        containerPadding={16}
        shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
        onOpenChange={onOpenChangeHandler}
      >
        <Menu
          id={`${id}-menu`}
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
