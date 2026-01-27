import {
  cloneElement,
  isValidElement,
  MouseEvent,
  ReactElement,
} from "react";
import { useContextMenuContext } from "./ContextMenuProvider";
import { ContextMenuItem, ContextMenuProps } from "./types";

type ChildProps = {
  onContextMenu?: (event: MouseEvent) => void;
  "data-testid"?: string;
};

export const ContextMenu = <T,>({
  children,
  menu,
  context,
  disabled = false,
  asChild = false,
}: ContextMenuProps<T>) => {
  const { open } = useContextMenuContext();

  const handleContextMenu = (event: MouseEvent) => {
    if (disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const items: ContextMenuItem[] =
      typeof menu === "function" ? menu(context as T) : menu;

    open({
      position: { x: event.clientX, y: event.clientY },
      items,
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
