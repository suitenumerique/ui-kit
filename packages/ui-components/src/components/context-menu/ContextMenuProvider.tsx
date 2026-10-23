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
import { RootMenuTriggerStateContext } from "react-aria-components";
import { useMenuTriggerState } from "react-stately";
import {
  ContextMenuContextValue,
  ContextMenuControls,
  ContextMenuOpenConfig,
  ContextMenuSession,
  MenuItem,
  MenuItemAction,
  ContextMenuState,
} from "./types";
import { buildMenuModel } from "../dropdown-menu/buildMenuModel";
import { renderMenuLevel } from "../dropdown-menu/renderMenu";

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

export const useContextMenuContext = (): ContextMenuControls => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error(
      "ContextMenu must be used within a ContextMenuProvider"
    );
  }

  // One session per hook instance: set when this caller opens the menu, stale
  // as soon as the menu closes or another caller opens it. That is what lets
  // `updateItems` stay safe without the caller having to identify itself.
  const sessionRef = useRef<ContextMenuSession | null>(null);
  const { open, close } = context;

  return useMemo(
    () => ({
      open: (config: ContextMenuOpenConfig) => {
        sessionRef.current = open(config);
      },
      close,
      updateItems: (items: MenuItem[]) => {
        sessionRef.current?.update(items);
      },
    }),
    [open, close]
  );
};

const isActionItem = (item: MenuItem): item is MenuItemAction => {
  return !("type" in item);
};

const getItemKey = (item: MenuItemAction, index: number): string => {
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
  const onBlurRef = useRef<(() => void) | undefined>(undefined);
  const activeSessionRef = useRef<ContextMenuSession | null>(null);
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
        // Call onBlur before closing
        onBlurRef.current?.();
        onBlurRef.current = undefined;
        activeSessionRef.current = null;
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
    (config: ContextMenuOpenConfig) => {
      // The menu is rendered here, above the trigger, so the items given to
      // `open` cannot follow the trigger's later re-renders. The session lets
      // the trigger push fresh ones — needed for items whose rendering depends
      // on state the menu itself changes (an `isChecked` option toggled through
      // `keepOpen`, a label reflecting a selection...). Ownership is the
      // session identity, so a trigger re-rendering next to the open menu
      // updates nothing.
      const session: ContextMenuSession = {
        update: (items) => {
          if (activeSessionRef.current !== session) {
            return;
          }
          setState((prev) => (prev.isOpen ? { ...prev, items } : prev));
        },
      };

      // Call previous trigger's onBlur before opening for new trigger
      onBlurRef.current?.();
      onBlurRef.current = config.onBlur;
      activeSessionRef.current = session;

      setState({
        isOpen: true,
        position: config.position,
        items: config.items,
      });

      return session;
    },
    []
  );

  const close = useCallback(() => {
    onBlurRef.current?.();
    onBlurRef.current = undefined;
    activeSessionRef.current = null;
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const contextValue = useMemo<ContextMenuContextValue>(
    () => ({ open, close }),
    [open, close]
  );

  // Same rendering as DropdownMenu. Keys and test ids keep their previous
  // defaults (`label-index`, `context-menu-item-<key>`).
  const model = useMemo(
    () =>
      buildMenuModel(
        state.items.map((item, index) => {
          if (!isActionItem(item)) {
            return item;
          }
          const itemKey = getItemKey(item, index);
          return {
            ...item,
            id: itemKey,
            testId: item.testId || `context-menu-item-${itemKey}`,
          };
        })
      ),
    [state.items]
  );

  // A root menu state lets submenus open and Tab close the menu, as in a
  // DropdownMenu.
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      close();
    }
  };
  const menuState = useMenuTriggerState({
    isOpen: state.isOpen,
    onOpenChange: handleOpenChange,
  });

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
      <RootMenuTriggerStateContext.Provider value={menuState}>
        {renderMenuLevel(
          model,
          { selectionMode: "single" },
          {
            triggerRef,
            isOpen: state.isOpen,
            onOpenChange: handleOpenChange,
            placement: "bottom start",
            onClose: close,
            "aria-label": "Context menu",
            "data-testid": "context-menu",
          }
        )}
      </RootMenuTriggerStateContext.Provider>
    </ContextMenuContext.Provider>
  );
};
