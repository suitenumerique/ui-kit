import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { Menu, MenuItem, Popover, Separator } from "react-aria-components";
import {
  ContextMenuContextValue,
  ContextMenuItem,
  ContextMenuItemAction,
  ContextMenuState,
} from "./types";

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

export const useContextMenuContext = () => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error(
      "ContextMenu must be used within a ContextMenuProvider"
    );
  }
  return context;
};

const isActionItem = (item: ContextMenuItem): item is ContextMenuItemAction => {
  return !("type" in item);
};

const getItemKey = (item: ContextMenuItemAction, index: number): string => {
  return item.id || `${item.label}-${index}`;
};

export const ContextMenuProvider = ({ children }: PropsWithChildren) => {
  // Check for nested providers first (but after hook declarations for Rules of Hooks)
  const existingContext = useContext(ContextMenuContext);

  const [state, setState] = useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    items: [],
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(false);
  const isNested = existingContext !== null;

  // Keep ref in sync with state for use in event handlers
  useEffect(() => {
    isOpenRef.current = state.isOpen;
  }, [state.isOpen]);

  // Update the trigger element position when state changes
  useEffect(() => {
    if (isNested) return;
    if (triggerRef.current) {
      triggerRef.current.style.left = `${state.position.x}px`;
      triggerRef.current.style.top = `${state.position.y}px`;
    }
  }, [state.position, isNested]);

  // Close menu on any right-click (capture phase) so new context menus can open
  useEffect(() => {
    if (isNested) return;

    const handleGlobalContextMenu = (event: MouseEvent) => {
      if (isOpenRef.current) {
        // Prevent native browser context menu
        event.preventDefault();
        setState((prev) => ({ ...prev, isOpen: false }));
      }
    };

    // Use capture phase to close before the new ContextMenu handler fires
    document.addEventListener("contextmenu", handleGlobalContextMenu, true);
    return () => {
      document.removeEventListener("contextmenu", handleGlobalContextMenu, true);
    };
  }, [isNested]);

  const open = useCallback(
    (config: { position: { x: number; y: number }; items: ContextMenuItem[] }) => {
      setState({
        isOpen: true,
        position: config.position,
        items: config.items,
      });
    },
    []
  );

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const contextValue = useMemo<ContextMenuContextValue>(
    () => ({ open, close }),
    [open, close]
  );

  // Warn and skip rendering if nested inside another provider
  if (isNested) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "ContextMenuProvider: Multiple instances detected. " +
          "Only one ContextMenuProvider should exist in your app tree. " +
          "Nested providers will be ignored."
      );
    }
    return <>{children}</>;
  }

  return (
    <ContextMenuContext.Provider value={contextValue}>
      {children}
      {/* Invisible trigger element positioned at click coordinates */}
      <div
        ref={triggerRef}
        style={{
          position: "fixed",
          left: state.position.x,
          top: state.position.y,
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      />
      <Popover
        triggerRef={triggerRef}
        isOpen={state.isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            close();
          }
        }}
        placement="bottom start"
        shouldFlip
      >
        <Menu
          className="c__dropdown-menu"
          aria-label="Context menu"
          data-testid="context-menu"
          onAction={(key) => {
            const item = state.items.find(
              (i, idx) => isActionItem(i) && getItemKey(i, idx) === key
            );
            if (item && isActionItem(item) && !item.disabled) {
              item.onAction();
              close();
            }
          }}
        >
          {state.items.map((item, index) => {
            if (!isActionItem(item)) {
              return <Separator key={`separator-${index}`} />;
            }

            if (item.hidden) {
              return null;
            }

            const itemKey = getItemKey(item, index);

            return (
              <MenuItem
                key={itemKey}
                id={itemKey}
                className={`c__dropdown-menu-item${item.variant === "danger" ? " c__dropdown-menu-item--danger" : ""}`}
                aria-label={item.label}
                isDisabled={item.disabled}
                data-testid={`context-menu-item-${itemKey}`}
              >
                {item.icon}
                <div className="c__dropdown-menu-item__label-container">
                  <div className="c__dropdown-menu-item__label">
                    {item.label}
                  </div>
                  {item.subText && (
                    <div className="c__dropdown-menu-item__label-subtext">
                      {item.subText}
                    </div>
                  )}
                </div>
              </MenuItem>
            );
          })}
        </Menu>
      </Popover>
    </ContextMenuContext.Provider>
  );
};
