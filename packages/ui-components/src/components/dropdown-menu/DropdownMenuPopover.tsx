import clsx from "clsx";
import {
  createContext,
  KeyboardEvent,
  SyntheticEvent,
  useContext,
  useId,
  useRef,
} from "react";
import {
  Menu,
  Popover,
  PopoverContext,
  RootMenuTriggerStateContext,
  useSlottedContext,
} from "react-aria-components";
import {
  DropdownMenuPopoverProps,
  DropdownMenuVariant,
} from "./types";
import { useScrollOverflow } from "./useScrollOverflow";

/** Lets submenus, rendered in their own popover, inherit the root density. */
const VariantContext = createContext<DropdownMenuVariant | undefined>(
  undefined,
);

/**
 * The surface of a DropdownMenu: a React Aria `Popover` holding a `Menu`.
 * Use it as the second child of `DropdownMenu.Trigger`, or of
 * `DropdownMenu.Submenu` for a submenu. Outside a trigger, give it a
 * `triggerRef`, `isOpen` and `onOpenChange`.
 */
export const DropdownMenuPopover = <T extends object>({
  variant,
  placement,
  offset,
  shouldCloseOnInteractOutside,
  triggerRef,
  isOpen,
  onOpenChange,
  ...props
}: DropdownMenuPopoverProps<T>) => {
  const isSubmenu =
    useSlottedContext(PopoverContext)?.trigger === "SubmenuTrigger";
  const inheritedVariant = useContext(VariantContext);
  const resolvedVariant = variant ?? inheritedVariant ?? "default";

  return (
    <Popover
      className="c__dropdown-menu-popover"
      placement={placement}
      offset={offset ?? (isSubmenu ? -4 : undefined)}
      shouldFlip
      containerPadding={16}
      shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
      triggerRef={triggerRef}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <VariantContext.Provider value={resolvedVariant}>
        <MenuSurface
          {...props}
          variant={resolvedVariant}
          onCloseRequest={() => onOpenChange?.(false)}
        />
      </VariantContext.Provider>
    </Popover>
  );
};

/** Mounted only while the popover is open, so its refs are set on mount. */
const MenuSurface = <T extends object>({
  variant,
  topMessage,
  bottomMessage,
  className,
  children,
  onCloseRequest,
  ...menuProps
}: Omit<
  DropdownMenuPopoverProps<T>,
  | "placement"
  | "offset"
  | "shouldCloseOnInteractOutside"
  | "triggerRef"
  | "isOpen"
  | "onOpenChange"
> & {
  /** Closes a popover that is not driven by a menu trigger. */
  onCloseRequest: () => void;
}) => {
  const topMessageId = useId();
  const bottomMessageId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  useScrollOverflow(listRef, viewportRef);
  const rootMenuState = useContext(RootMenuTriggerStateContext);

  // The popover renders in a portal, but React bubbles its events up the
  // component tree: without this, arrow keys or clicks in the menu would reach
  // the trigger's ancestors (a clickable row, a list with keyboard
  // navigation). Escape goes on so the popover can close itself.
  const stopPropagation = (event: SyntheticEvent) => event.stopPropagation();
  const stopKeyPropagation = (event: KeyboardEvent) => {
    if (event.key !== "Escape") {
      event.stopPropagation();
    }
  };

  const describedBy =
    [
      topMessage ? topMessageId : undefined,
      bottomMessage ? bottomMessageId : undefined,
      menuProps["aria-describedby"],
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div
      className={clsx(
        "c__dropdown-menu",
        { "c__dropdown-menu--tiny": variant === "tiny" },
        className,
      )}
      // Tab leaves the menu (WAI-ARIA menu button pattern): close every open
      // level, focus then returns to the trigger. React Aria keeps focus
      // trapped in the popover otherwise.
      onKeyDownCapture={(event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          if (rootMenuState) {
            rootMenuState.close();
          } else {
            onCloseRequest();
          }
        }
      }}
      onKeyDown={stopKeyPropagation}
      onKeyUp={stopKeyPropagation}
      onClick={stopPropagation}
      onPointerDown={stopPropagation}
      onPointerUp={stopPropagation}
      onMouseDown={stopPropagation}
      onMouseUp={stopPropagation}
    >
      {topMessage && (
        <div
          id={topMessageId}
          className="c__dropdown-menu__message c__dropdown-menu__message--top"
        >
          {topMessage}
        </div>
      )}
      <div ref={viewportRef} className="c__dropdown-menu__viewport">
        <Menu
          {...menuProps}
          ref={listRef}
          className="c__dropdown-menu__list"
          aria-describedby={describedBy}
        >
          {children}
        </Menu>
      </div>
      {bottomMessage && (
        <div
          id={bottomMessageId}
          className="c__dropdown-menu__message c__dropdown-menu__message--bottom"
        >
          {bottomMessage}
        </div>
      )}
    </div>
  );
};
