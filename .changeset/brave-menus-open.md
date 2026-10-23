---
"@gouvfr-lasuite/ui-components": major
---

**Breaking:** `DropdownMenu` is rebuilt on the React Aria menu button pattern. Its props, `options`, types and `useDropdownMenu` keep their names, but `children` is now the trigger element itself (no wrapping `div`): pass a single element forwarding its `ref` and props to a focusable element with an interactive role, such as `Button`. The menu opens by itself; `isOpen` / `onOpenChange` stay available to control it.

**Breaking:** items with a `value` or `isChecked` are exposed as `menuitemradio` (or `menuitemcheckbox` with the new `selectionMode="multiple"`) with `aria-checked`, in `DropdownMenu` and `ContextMenu`. Tests looking them up with the `menuitem` role need the new role.

**Breaking:** menu rows render `c__dropdown-menu-item__content` and `__description` instead of `__label-container` and `__label-subtext`, and menus follow the new look with `dropdown-menu` component tokens. `ContextMenu` uses the `DropdownMenu` rendering, and `Filter` and `SearchFilter` the new row look.

`DropdownMenu` accepts any trigger (`Button`, a native `<button>`, or an element with `role="button"`), announces checked items, item descriptions and top/bottom messages, closes on Tab, keeps its clicks and keys from reaching the trigger's ancestors, and adds `defaultOpen`, `placement`, `offset`, `trigger`, `selectionMode`, `className`, and `href`, `target`, `rel` and `shortcut` on options. Composable parts are available as `DropdownMenu.Trigger`, `DropdownMenu.Popover`, `DropdownMenu.Item`, `DropdownMenu.Section`, `DropdownMenu.Separator` and `DropdownMenu.Submenu`. `ContextMenu` supports submenus.

`Button` now shows its focus ring from React Aria's input modality (`data-focus-visible`) instead of the browser `:focus-visible` heuristic: the ring shows for keyboard users, including when focus comes back from a menu or a dialog, and no longer after a mouse interaction in Chrome. Elements styled with the `c__button` classes without the `Button` component keep the `:focus-visible` behaviour.

`Tooltip` forwards the props and ref it receives to its child, so it can wrap the trigger of a menu.
