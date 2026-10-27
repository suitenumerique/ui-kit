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
import { useMenuTriggerState } from "react-stately";
import {
  DropdownMenuPopoverProps,
  DropdownMenuVariant,
} from "./types";
import { useScrollOverflow } from "./useScrollOverflow";
import { useSingleScroll } from "./useSingleScroll";

/** Lets submenus, rendered in their own popover, inherit the root density. */
const VariantContext = createContext<DropdownMenuVariant | undefined>(
  undefined,
);

/**
 * The surface of a DropdownMenu: a React Aria `Popover` holding a `Menu`.
 * Use it as the second child of `DropdownMenu.Root`, or of
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
  const popoverTrigger = useSlottedContext(PopoverContext)?.trigger;
  const isSubmenu = popoverTrigger === "SubmenuTrigger";
  const inheritedVariant = useContext(VariantContext);
  const resolvedVariant = variant ?? inheritedVariant ?? "default";
  // Outside a menu trigger (a menu opened at the pointer, for instance),
  // nothing would close the menu when an item is picked or Tab is pressed:
  // give it the root state a MenuTrigger provides, driven by `isOpen` and
  // `onOpenChange`.
  const triggerMenuState = useContext(RootMenuTriggerStateContext);
  const ownMenuState = useMenuTriggerState({
    isOpen: isOpen ?? false,
    onOpenChange,
  });

  return (
    <Popover
      className="c__dropdown-menu-popover"
      // The popover is a dialog: name it like the menu. Inside a trigger, it is
      // labelled by the trigger through the popover context instead.
      aria-label={props["aria-label"]}
      aria-labelledby={props["aria-labelledby"]}
      placement={placement}
      offset={offset ?? (isSubmenu ? -4 : undefined)}
      shouldFlip
      containerPadding={16}
      shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
      triggerRef={triggerRef}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <RootMenuTriggerStateContext.Provider
        value={triggerMenuState ?? ownMenuState}
      >
        <VariantContext.Provider value={resolvedVariant}>
          <MenuSurface
            {...props}
            // Outside a menu trigger, nothing focuses the menu when it opens:
            // the popover would focus itself and the keys would reach no
            // item. Focus it as MenuTrigger does for a pointer opening.
            autoFocus={props.autoFocus ?? (popoverTrigger ? undefined : true)}
            variant={resolvedVariant}
          />
        </VariantContext.Provider>
      </RootMenuTriggerStateContext.Provider>
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
  ...menuProps
}: Omit<
  DropdownMenuPopoverProps<T>,
  | "placement"
  | "offset"
  | "shouldCloseOnInteractOutside"
  | "triggerRef"
  | "isOpen"
  | "onOpenChange"
>) => {
  const topMessageId = useId();
  const bottomMessageId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  useScrollOverflow(listRef, viewportRef);
  const { isSingleScroll, rootRef, onFocus } = useSingleScroll();
  const rootMenuState = useContext(RootMenuTriggerStateContext);

  // The popover renders in a portal, but React bubbles its events up the
  // component tree: without this, arrow keys or clicks in the menu would reach
  // the trigger's ancestors (a clickable row, a list with keyboard
  // navigation). Escape goes on so the popover can close itself. Pointer and
  // mouse up events go on too: React Aria ends the trigger press on a document
  // listener, and a press released on an item would otherwise never end, so
  // the menu would open again on the next hover of the trigger.
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
      ref={rootRef}
      className={clsx(
        "c__dropdown-menu",
        {
          "c__dropdown-menu--tiny": variant === "tiny",
          "c__dropdown-menu--single-scroll": isSingleScroll,
        },
        className,
      )}
      onFocus={onFocus}
      // Tab leaves the menu (WAI-ARIA menu button pattern): close every open
      // level, focus then returns to the trigger. React Aria keeps focus
      // trapped in the popover otherwise.
      onKeyDownCapture={(event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          rootMenuState?.close();
        }
      }}
      onKeyDown={stopKeyPropagation}
      onKeyUp={stopKeyPropagation}
      onClick={stopPropagation}
      onPointerDown={stopPropagation}
      onMouseDown={stopPropagation}
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
