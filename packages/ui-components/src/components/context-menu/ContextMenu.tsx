import {
  cloneElement,
  isValidElement,
  MouseEvent,
  ReactElement,
  ReactNode,
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
  const { open } = useContextMenuContext();

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

    const items: MenuItem[] =
      typeof options === "function" ? options(context as T) : options;

    // Call onFocus immediately when menu opens on this trigger
    onFocus?.();

    open({
      position: { x: event.clientX, y: event.clientY },
      items,
      onBlur,
    });
  };

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
