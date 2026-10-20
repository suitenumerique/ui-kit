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
  DropdownMenuV2PopoverProps,
  DropdownMenuV2Variant,
} from "./types";
import { useScrollOverflow } from "./useScrollOverflow";

/** Lets submenus, rendered in their own popover, inherit the root density. */
const VariantContext = createContext<DropdownMenuV2Variant | undefined>(
  undefined,
);

/**
 * The surface of a DropdownMenuV2: a React Aria `Popover` holding a `Menu`.
 * Use it as the second child of `DropdownMenuV2Trigger`, or of
 * `SubmenuTriggerV2` for a submenu.
 */
export const DropdownMenuV2Popover = <T extends object>({
  variant,
  placement,
  offset,
  shouldCloseOnInteractOutside,
  ...props
}: DropdownMenuV2PopoverProps<T>) => {
  const isSubmenu =
    useSlottedContext(PopoverContext)?.trigger === "SubmenuTrigger";
  const inheritedVariant = useContext(VariantContext);
  const resolvedVariant = variant ?? inheritedVariant ?? "default";

  return (
    <Popover
      className="c__menu-v2-popover"
      placement={placement}
      offset={offset ?? (isSubmenu ? -4 : undefined)}
      shouldFlip
      containerPadding={16}
      shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
    >
      <VariantContext.Provider value={resolvedVariant}>
        <MenuSurface {...props} variant={resolvedVariant} />
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
  ...menuProps
}: Omit<
  DropdownMenuV2PopoverProps<T>,
  "placement" | "offset" | "shouldCloseOnInteractOutside"
>) => {
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
        "c__menu-v2",
        { "c__menu-v2--tiny": variant === "tiny" },
        className,
      )}
      // Tab leaves the menu (WAI-ARIA menu button pattern): close every open
      // level, focus then returns to the trigger. React Aria keeps focus
      // trapped in the popover otherwise.
      onKeyDownCapture={(event) => {
        if (event.key === "Tab" && rootMenuState) {
          event.preventDefault();
          rootMenuState.close();
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
          className="c__menu-v2__message c__menu-v2__message--top"
        >
          {topMessage}
        </div>
      )}
      <div ref={viewportRef} className="c__menu-v2__viewport">
        <Menu
          {...menuProps}
          ref={listRef}
          className="c__menu-v2__list"
          aria-describedby={describedBy}
        >
          {children}
        </Menu>
      </div>
      {bottomMessage && (
        <div
          id={bottomMessageId}
          className="c__menu-v2__message c__menu-v2__message--bottom"
        >
          {bottomMessage}
        </div>
      )}
    </div>
  );
};
