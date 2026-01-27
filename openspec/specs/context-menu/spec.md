## ADDED Requirements

### Requirement: ContextMenuProvider wraps application

The `ContextMenuProvider` component SHALL be required at the root of the component tree (or section) where context menus are used. It SHALL manage the global state and render the single Popover instance.

#### Scenario: Provider required
- **WHEN** a `ContextMenu` component is rendered without a `ContextMenuProvider` ancestor
- **THEN** the component SHALL throw an error indicating the Provider is missing

#### Scenario: Single menu instance
- **WHEN** the Provider is mounted
- **THEN** it SHALL render at most one Popover/Menu in the DOM regardless of how many `ContextMenu` triggers exist

---

### Requirement: ContextMenu triggers on right-click

The `ContextMenu` component SHALL open its menu when the user performs a right-click (contextmenu event) on the wrapped area.

#### Scenario: Right-click opens menu
- **WHEN** user right-clicks on an element wrapped by `ContextMenu`
- **THEN** the native browser context menu SHALL be prevented
- **AND** the custom context menu SHALL appear at the cursor coordinates

#### Scenario: Disabled context menu
- **WHEN** user right-clicks on a `ContextMenu` with `disabled={true}`
- **THEN** no menu SHALL open
- **AND** the native browser context menu MAY appear (default browser behavior)

---

### Requirement: Menu positioning at cursor coordinates

The context menu SHALL be positioned at the exact coordinates where the right-click occurred, using a virtual element pattern.

#### Scenario: Menu appears at click position
- **WHEN** user right-clicks at coordinates (x: 200, y: 150)
- **THEN** the menu's top-left corner SHALL be positioned at or near (200, 150)

#### Scenario: Menu repositions near screen edges
- **WHEN** user right-clicks near the right edge of the viewport
- **THEN** the menu SHALL flip to appear on the left side of the cursor
- **AND** the menu SHALL remain fully visible within the viewport

#### Scenario: Menu repositions near bottom edge
- **WHEN** user right-clicks near the bottom edge of the viewport
- **THEN** the menu SHALL flip to appear above the cursor
- **AND** the menu SHALL remain fully visible within the viewport

---

### Requirement: Nested context menus with propagation control

When multiple `ContextMenu` components are nested, the innermost one SHALL handle the event.

#### Scenario: Inner menu takes precedence
- **WHEN** element B is nested inside element A
- **AND** both have `ContextMenu` wrappers with different menus
- **AND** user right-clicks on element B
- **THEN** only menu B SHALL open
- **AND** menu A SHALL NOT open

#### Scenario: Outer menu for outer area
- **WHEN** element B is nested inside element A
- **AND** both have `ContextMenu` wrappers
- **AND** user right-clicks on element A (outside of B)
- **THEN** menu A SHALL open

---

### Requirement: Menu items support static and dynamic content

The `options` prop SHALL accept either a static array of items or a function that receives context and returns items. The item type SHALL use the shared `MenuItem` type (union of `MenuItemAction` and `MenuItemSeparator`) for consistency with `DropdownMenu`.

#### Scenario: Static menu items
- **WHEN** `options` prop is an array of `MenuItem`
- **THEN** those items SHALL be displayed in the menu

#### Scenario: Dynamic menu items with context
- **WHEN** `options` prop is a function `(ctx) => MenuItem[]`
- **AND** `context` prop is provided with value `{ id: 42, name: "file.txt" }`
- **THEN** the function SHALL be called with that context
- **AND** the returned items SHALL be displayed

#### Scenario: Hidden items
- **WHEN** a menu item has `isHidden: true`
- **THEN** that item SHALL NOT be rendered in the menu

#### Scenario: Disabled items
- **WHEN** a menu item has `isDisabled: true`
- **THEN** that item SHALL be visually indicated as disabled
- **AND** clicking it SHALL NOT trigger `callback`

---

### Requirement: Menu item actions and variants

Each menu item SHALL support a `callback` function and optional `variant` for styling. This matches the `DropdownMenu` API for interoperability.

#### Scenario: Action triggered on click
- **WHEN** user clicks on a menu item
- **THEN** the item's `callback` function SHALL be invoked
- **AND** the menu SHALL close

#### Scenario: Danger variant styling
- **WHEN** a menu item has `variant: "danger"`
- **THEN** the item SHALL be styled to indicate a destructive action (e.g., red text)

#### Scenario: Separator rendering
- **WHEN** an item has `type: "separator"`
- **THEN** a visual separator line SHALL be rendered instead of a clickable item

---

### Requirement: Menu closes on standard interactions

The context menu SHALL close when expected dismissal interactions occur.

#### Scenario: Close on Escape key
- **WHEN** the menu is open
- **AND** user presses the Escape key
- **THEN** the menu SHALL close

#### Scenario: Close on click outside
- **WHEN** the menu is open
- **AND** user clicks outside the menu
- **THEN** the menu SHALL close

#### Scenario: Close on action selection
- **WHEN** user clicks on a menu item (not disabled)
- **THEN** the menu SHALL close after invoking `callback`

#### Scenario: New right-click closes previous menu
- **WHEN** menu A is open
- **AND** user right-clicks on a different `ContextMenu` trigger
- **THEN** menu A SHALL close
- **AND** the new menu SHALL open

---

### Requirement: Keyboard navigation within menu

The menu SHALL be navigable via keyboard for accessibility.

#### Scenario: Arrow key navigation
- **WHEN** the menu is open
- **AND** user presses Arrow Down
- **THEN** focus SHALL move to the next menu item

#### Scenario: Enter key selects item
- **WHEN** a menu item is focused
- **AND** user presses Enter
- **THEN** the item's `callback` SHALL be invoked
- **AND** the menu SHALL close

#### Scenario: Focus trap
- **WHEN** the menu is open
- **THEN** Tab key navigation SHALL be trapped within the menu

---

### Requirement: asChild pattern for flexible wrapping

The `ContextMenu` SHALL support an `asChild` prop to avoid adding wrapper elements.

#### Scenario: Default wrapper behavior
- **WHEN** `asChild` is not set or `false`
- **THEN** the `ContextMenu` SHALL wrap children in a `<div>` with `onContextMenu`

#### Scenario: asChild clones element
- **WHEN** `asChild={true}`
- **AND** children is a single React element
- **THEN** the `ContextMenu` SHALL clone that element and add `onContextMenu` to it
- **AND** no additional wrapper element SHALL be added

#### Scenario: asChild with multiple children error
- **WHEN** `asChild={true}`
- **AND** children contains multiple elements
- **THEN** a development warning or error SHALL be raised

---

### Requirement: Consistent styling with DropdownMenu

The context menu SHALL use the same CSS classes as `DropdownMenu` for visual consistency.

#### Scenario: Menu container class
- **WHEN** the menu is rendered
- **THEN** the menu container SHALL have class `c__dropdown-menu`

#### Scenario: Menu item class
- **WHEN** a menu item is rendered
- **THEN** it SHALL have class `c__dropdown-menu-item`

#### Scenario: Icon and label layout
- **WHEN** a menu item has an `icon` prop
- **THEN** the icon SHALL be displayed before the label with appropriate spacing

---

### Requirement: Shared MenuItem type with DropdownMenu

The `ContextMenu` and `DropdownMenu` components SHALL share a common `MenuItem` type to enable reuse of the same action definitions across both components.

#### Scenario: Same actions for DropdownMenu and ContextMenu
- **WHEN** a developer defines an array of `MenuItem` actions
- **THEN** the same array SHALL be usable with both `DropdownMenu` (via `options` prop) and `ContextMenu` (via `options` prop)
- **AND** both components SHALL render the items identically

#### Scenario: MenuItemAction properties
- **WHEN** a `MenuItemAction` is defined
- **THEN** it SHALL support the following properties: `id`, `label`, `subText`, `icon`, `callback`, `isDisabled`, `isHidden`, `variant`, `testId`

#### Scenario: DropdownMenuOption extends MenuItemAction
- **WHEN** a `DropdownMenuOption` is used
- **THEN** it SHALL extend `MenuItemAction` with additional properties: `isChecked`, `value`
