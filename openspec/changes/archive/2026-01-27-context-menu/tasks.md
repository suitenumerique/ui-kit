## 1. Setup

- [x] 1.1 Create directory structure `src/components/context-menu/`
- [x] 1.2 Create shared types file `src/components/menu/types.ts` with `MenuItemAction`, `MenuItemSeparator`, `MenuItem`
- [x] 1.3 Update `DropdownMenuOption` to extend `MenuItemAction` and add `variant: "danger"` support
- [x] 1.4 Update ContextMenu to use shared `MenuItem` type with props: `options`, `callback`, `isDisabled`, `isHidden`

## 2. Core Provider Implementation

- [x] 2.1 Create `ContextMenuContext` with `open()` and `close()` methods
- [x] 2.2 Implement `ContextMenuProvider` component with state management (isOpen, position, items)
- [x] 2.3 Implement virtual element creation for cursor positioning (`createVirtualRef`)
- [x] 2.4 Render Popover + Menu using React Aria components inside Provider
- [x] 2.5 Apply existing dropdown-menu CSS classes for styling consistency

## 3. ContextMenu Trigger Component

- [x] 3.1 Implement `ContextMenu` wrapper component with `onContextMenu` handler
- [x] 3.2 Add `stopPropagation` for nested context menu support
- [x] 3.3 Implement `asChild` pattern using `React.cloneElement` (Slot pattern)
- [x] 3.4 Support static `options` array and dynamic options function with context
- [x] 3.5 Handle `disabled` prop to skip menu opening

## 4. Menu Item Rendering

- [x] 4.1 Render menu items with label, icon, and `callback` handler
- [x] 4.2 Support `isHidden` prop to conditionally exclude items
- [x] 4.3 Support `isDisabled` prop with visual styling and prevented action
- [x] 4.4 Implement `variant: "danger"` styling (add CSS if needed)
- [x] 4.5 Render separator items with `type: "separator"`

## 5. Menu Behavior

- [x] 5.1 Close menu on Escape key (React Aria handles this)
- [x] 5.2 Close menu on click outside (React Aria handles this)
- [x] 5.3 Close menu after action selection
- [x] 5.4 Close previous menu when opening new one (Provider state management)

## 6. Exports and Integration

- [x] 6.1 Create `index.tsx` with public exports (Provider, ContextMenu, types)
- [x] 6.2 Add exports to main library index

## 7. Stories and Documentation

- [x] 7.1 Create basic Storybook story with static menu
- [x] 7.2 Create story with dynamic menu and context (file example)
- [x] 7.3 Create story demonstrating nested context menus
- [x] 7.4 Create story showing disabled items and danger variant
