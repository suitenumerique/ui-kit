import {
  cloneElement,
  isValidElement,
  MouseEvent,
  ReactElement,
  ReactNode,
  useEffect,
} from "react";
import { useContextMenuContext } from "./ContextMenuProvider";
import { MenuItem } from "./types";

export type ContextMenuProps<T = unknown> = {
  children: ReactNode;
  options: MenuItem[] | ((context: T) => MenuItem[]);
  context?: T;
  disabled?: boolean;
  asChild?: boolean;
  /** Called when the menu opens on this trigger */
  onFocus?: () => void;
  /** Called when the menu closes (if it was open on this trigger) */
  onBlur?: () => void;
};

type ChildProps = {
  onContextMenu?: (event: MouseEvent) => void;
  "data-testid"?: string;
};

export const ContextMenu = <T,>({
  children,
  options,
  context,
  disabled = false,
  asChild = false,
  onFocus,
  onBlur,
}: ContextMenuProps<T>) => {
  const { open, updateItems } = useContextMenuContext();

  const resolveItems = (): MenuItem[] =>
    typeof options === "function" ? options(context as T) : options;

  const handleContextMenu = (event: MouseEvent) => {
    if (disabled) {
      return;
    }

    // Ignore events from portals (e.g. modals) whose DOM is outside this wrapper
    if (!event.currentTarget.contains(event.target as Node)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    // Call onFocus immediately when menu opens on this trigger
    onFocus?.();

    open({
      position: { x: event.clientX, y: event.clientY },
      items: resolveItems(),
      onBlur,
    });
  };

  // The provider renders the menu above this trigger, so it cannot see the
  // trigger re-render. Push the freshly resolved items on every render, so an
  // open menu stays in sync with the state its own items drive (an `isChecked`
  // option toggled through `keepOpen`, for instance). Once the menu closes or
  // another trigger opens it, the call goes stale and does nothing.
  useEffect(() => {
    updateItems(resolveItems());
  });

  if (asChild) {
    if (!isValidElement(children)) {
      console.warn(
        "ContextMenu with asChild requires a single React element as child"
      );
      return <>{children}</>;
    }

    const childElement = children as ReactElement<ChildProps>;
    const existingHandler = childElement.props.onContextMenu;

    return cloneElement(childElement, {
      onContextMenu: (event: MouseEvent) => {
        existingHandler?.(event);
        handleContextMenu(event);
      },
    });
  }

  return (
    <div onContextMenu={handleContextMenu} data-testid="context-menu-trigger">
      {children}
    </div>
  );
};
